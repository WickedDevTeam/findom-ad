
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, config } = await req.json();

    // Test the Notion connection
    if (action === 'test-connection') {
      return await testNotionConnection(config);
    }

    // Sync with Notion (bidirectional)
    if (action === 'sync') {
      return await syncWithNotion(supabase);
    }

    // If no valid action provided
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid action provided' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ success: false, message: `Error processing request: ${error.message}` }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

// Test Notion Connection
async function testNotionConnection(config: { notionApiKey: string; notionDatabaseId: string }) {
  try {
    const { notionApiKey, notionDatabaseId } = config;
    
    if (!notionApiKey || !notionDatabaseId) {
      return new Response(
        JSON.stringify({ success: false, message: 'API key and database ID are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Test the Notion API by querying database
    const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Notion API error:', data);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Failed to connect to Notion: ${data.message || 'Unknown error'}` 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully connected to Notion database',
        databaseTitle: data.title?.[0]?.plain_text || 'Untitled Database'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error testing Notion connection:', error);
    return new Response(
      JSON.stringify({ success: false, message: `Connection test failed: ${error.message}` }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

// Perform bidirectional sync between Supabase and Notion
async function syncWithNotion(supabase: any) {
  try {
    // Get sync configuration
    const { data: configData, error: configError } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'notion_sync_config')
      .single();

    if (configError) {
      console.error('Error fetching sync config:', configError);
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to fetch sync configuration' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const config = configData.value;
    const { notionApiKey, notionDatabaseId, enabled } = config;

    if (!enabled) {
      return new Response(
        JSON.stringify({ success: false, message: 'Notion sync is disabled' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    if (!notionApiKey || !notionDatabaseId) {
      return new Response(
        JSON.stringify({ success: false, message: 'API key and database ID are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Record the sync attempt
    const syncId = crypto.randomUUID();
    const syncStartTime = new Date().toISOString();
    const stats = { added: 0, updated: 0, deleted: 0, failed: 0, errors: [] };

    // Create sync history entry
    const { error: createError } = await supabase
      .from('sync_history')
      .insert({
        id: syncId,
        sync_type: 'notion',
        started_at: syncStartTime,
        status: 'in_progress',
        stats
      });

    if (createError) {
      console.error('Error creating sync history entry:', createError);
    }

    // Step 1: Get all creators from Supabase
    const { data: creators, error: creatorsError } = await supabase
      .from('creators')
      .select('*');

    if (creatorsError) {
      await updateSyncHistoryWithError(supabase, syncId, 'Failed to fetch creators from database');
      return errorResponse('Failed to fetch creators from database');
    }

    // Step 2: Query Notion database
    const notionResponse = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100, // Adjust as needed
      }),
    });

    if (!notionResponse.ok) {
      const errorData = await notionResponse.json();
      await updateSyncHistoryWithError(
        supabase, 
        syncId, 
        `Failed to fetch pages from Notion: ${errorData.message || 'Unknown error'}`
      );
      return errorResponse(`Failed to fetch pages from Notion: ${errorData.message || 'Unknown error'}`);
    }

    const notionData = await notionResponse.json();
    const notionPages = notionData.results || [];

    // Step 3: Build maps for easier comparison
    const creatorsMap = new Map(creators.map(creator => [creator.id, creator]));
    const notionPagesMap = new Map();

    // Process Notion pages and extract creator data
    for (const page of notionPages) {
      try {
        const creatorData = extractCreatorDataFromNotion(page);
        if (creatorData.id) {
          notionPagesMap.set(creatorData.id, { page, creatorData });
        }
      } catch (error) {
        stats.errors.push(`Error processing Notion page ${page.id}: ${error.message}`);
        stats.failed++;
      }
    }

    // Step 4: Update Supabase from Notion (Notion -> Supabase)
    for (const [id, { creatorData }] of notionPagesMap.entries()) {
      try {
        if (creatorsMap.has(id)) {
          // Update existing creator
          const { error } = await supabase
            .from('creators')
            .update(creatorData)
            .eq('id', id);
          
          if (error) {
            stats.errors.push(`Failed to update creator ${id}: ${error.message}`);
            stats.failed++;
          } else {
            stats.updated++;
          }
        } else {
          // Create new creator
          const { error } = await supabase
            .from('creators')
            .insert(creatorData);
          
          if (error) {
            stats.errors.push(`Failed to create creator ${id}: ${error.message}`);
            stats.failed++;
          } else {
            stats.added++;
          }
        }
      } catch (error) {
        stats.errors.push(`Error processing creator ${id}: ${error.message}`);
        stats.failed++;
      }
    }

    // Step 5: Update Notion from Supabase (Supabase -> Notion)
    for (const [id, creator] of creatorsMap.entries()) {
      try {
        if (!notionPagesMap.has(id)) {
          // Create new page in Notion
          await createNotionPage(notionApiKey, notionDatabaseId, creator);
          stats.added++;
        }
      } catch (error) {
        stats.errors.push(`Error creating Notion page for creator ${id}: ${error.message}`);
        stats.failed++;
      }
    }

    // Step 6: Update sync configuration with last synced time
    const { error: updateConfigError } = await supabase
      .from('site_config')
      .update({
        value: {
          ...config,
          lastSyncedAt: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('key', 'notion_sync_config');

    if (updateConfigError) {
      console.error('Error updating sync config:', updateConfigError);
    }

    // Step 7: Update sync history with results
    const { error: updateHistoryError } = await supabase
      .from('sync_history')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed',
        success: true,
        stats,
        message: `Sync completed successfully. Added: ${stats.added}, Updated: ${stats.updated}, Failed: ${stats.failed}`
      })
      .eq('id', syncId);

    if (updateHistoryError) {
      console.error('Error updating sync history:', updateHistoryError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Sync completed successfully',
        stats
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error during sync:', error);
    return new Response(
      JSON.stringify({ success: false, message: `Sync failed: ${error.message}` }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

// Helper function to extract creator data from Notion page
function extractCreatorDataFromNotion(page: any) {
  // This is a simplified implementation
  // You'll need to adapt this to match your actual Notion database structure
  const properties = page.properties;
  
  const id = properties.ID?.rich_text?.[0]?.plain_text || page.id;
  const name = properties.Name?.title?.[0]?.plain_text || 'Unnamed';
  const username = properties.Username?.rich_text?.[0]?.plain_text || name.toLowerCase().replace(/\s+/g, '-');
  const bio = properties.Bio?.rich_text?.[0]?.plain_text || '';
  const profileImage = properties['Profile Image']?.url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop';
  const isVerified = properties['Is Verified']?.checkbox || false;
  const isFeatured = properties['Is Featured']?.checkbox || false;
  const isNew = properties['Is New']?.checkbox || false;
  const type = properties.Type?.select?.name || 'standard';
  
  // Extract social links
  const socialLinks = {};
  const twitterHandle = properties.Twitter?.rich_text?.[0]?.plain_text;
  const throneUrl = properties.Throne?.rich_text?.[0]?.plain_text;
  const cashappHandle = properties.Cashapp?.rich_text?.[0]?.plain_text;
  const onlyfansUrl = properties.OnlyFans?.rich_text?.[0]?.plain_text;
  
  if (twitterHandle) socialLinks.twitter = twitterHandle;
  if (throneUrl) socialLinks.throne = throneUrl;
  if (cashappHandle) socialLinks.cashapp = cashappHandle;
  if (onlyfansUrl) socialLinks.onlyfans = onlyfansUrl;
  
  return {
    id,
    name,
    username,
    bio,
    profile_image: profileImage,
    is_verified: isVerified,
    is_featured: isFeatured,
    is_new: isNew,
    type,
    social_links: socialLinks,
    updated_at: new Date().toISOString()
  };
}

// Helper function to create a new page in Notion
async function createNotionPage(notionApiKey: string, databaseId: string, creator: any) {
  // This is a simplified implementation
  // You'll need to adapt this to match your actual Notion database structure
  
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${notionApiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: creator.name } }]
        },
        ID: {
          rich_text: [{ text: { content: creator.id } }]
        },
        Username: {
          rich_text: [{ text: { content: creator.username } }]
        },
        Bio: {
          rich_text: [{ text: { content: creator.bio.substring(0, 2000) } }]
        },
        'Profile Image': {
          url: creator.profile_image
        },
        'Is Verified': {
          checkbox: creator.is_verified
        },
        'Is Featured': {
          checkbox: creator.is_featured
        },
        'Is New': {
          checkbox: creator.is_new
        },
        Type: {
          select: { name: creator.type }
        },
        // ... Add other properties as needed
      }
    })
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(`Failed to create Notion page: ${data.message || 'Unknown error'}`);
  }
  
  return await response.json();
}

// Helper function to update sync history with error
async function updateSyncHistoryWithError(supabase: any, syncId: string, errorMessage: string) {
  const { error } = await supabase
    .from('sync_history')
    .update({
      completed_at: new Date().toISOString(),
      status: 'failed',
      success: false,
      message: errorMessage,
      stats: { added: 0, updated: 0, deleted: 0, failed: 1, errors: [errorMessage] }
    })
    .eq('id', syncId);
  
  if (error) {
    console.error('Error updating sync history with error:', error);
  }
}

// Helper function to return error response
function errorResponse(message: string) {
  return new Response(
    JSON.stringify({ success: false, message }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    }
  );
}
