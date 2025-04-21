
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Maximum number of items to process in a single sync
const MAX_ITEMS_PER_SYNC = 100;

// Max retries for API calls
const MAX_RETRIES = 3;

// Helper function to add CORS headers to a response
function corsResponse(body: any, status = 200) {
  return new Response(
    JSON.stringify(body),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status
    }
  );
}

// Helper function to retry API calls with exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = MAX_RETRIES): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      // Skip waiting on the last attempt
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return corsResponse({ 
        success: false, 
        message: 'Server configuration error: Missing environment variables' 
      }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    let action, config;
    try {
      const body = await req.json();
      action = body.action;
      config = body.config;
    } catch (error) {
      return corsResponse({ 
        success: false, 
        message: `Invalid request body: ${error.message}` 
      }, 400);
    }

    // Test the Notion connection
    if (action === 'test-connection') {
      return await testNotionConnection(config);
    }

    // Sync with Notion (bidirectional)
    if (action === 'sync') {
      return await syncWithNotion(supabase);
    }

    // If no valid action provided
    return corsResponse({ 
      success: false, 
      message: 'Invalid action provided. Valid actions are: test-connection, sync' 
    }, 400);
  } catch (error) {
    console.error('Error processing request:', error);
    return corsResponse({ 
      success: false, 
      message: `Error processing request: ${error.message}` 
    }, 500);
  }
});

// Test Notion Connection
async function testNotionConnection(config: { notionApiKey: string; notionDatabaseId: string }) {
  try {
    const { notionApiKey, notionDatabaseId } = config;
    
    if (!notionApiKey || !notionDatabaseId) {
      return corsResponse({ 
        success: false, 
        message: 'API key and database ID are required' 
      }, 400);
    }

    // Test the Notion API by querying database
    const response = await retryWithBackoff(async () => {
      const res = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Notion API error: ${errorData.message || 'Unknown error'}`);
      }
      
      return await res.json();
    });

    return corsResponse({ 
      success: true, 
      message: 'Successfully connected to Notion database',
      databaseTitle: response.title?.[0]?.plain_text || 'Untitled Database'
    });
  } catch (error) {
    console.error('Error testing Notion connection:', error);
    return corsResponse({ 
      success: false, 
      message: `Connection test failed: ${error.message}` 
    });
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
      .maybeSingle();

    if (configError) {
      console.error('Error fetching sync config:', configError);
      return corsResponse({ 
        success: false, 
        message: 'Failed to fetch sync configuration' 
      });
    }

    if (!configData || !configData.value) {
      return corsResponse({ 
        success: false, 
        message: 'Notion sync configuration not found' 
      });
    }

    const config = configData.value;
    const { notionApiKey, notionDatabaseId, enabled } = config;

    if (!enabled) {
      return corsResponse({ 
        success: false, 
        message: 'Notion sync is disabled' 
      });
    }

    if (!notionApiKey || !notionDatabaseId) {
      return corsResponse({ 
        success: false, 
        message: 'API key and database ID are required' 
      });
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

    try {
      // Step 1: Get all creators from Supabase
      const { data: creators, error: creatorsError } = await supabase
        .from('creators')
        .select('*');

      if (creatorsError) {
        throw new Error(`Failed to fetch creators from database: ${creatorsError.message}`);
      }

      // Step 2: Query Notion database
      const notionPages = await getAllNotionPages(notionApiKey, notionDatabaseId);

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
        stats.errors.push(`Failed to update sync configuration: ${updateConfigError.message}`);
      }

      return await updateSyncHistory(supabase, syncId, true, 'completed', stats, 
        `Sync completed successfully. Added: ${stats.added}, Updated: ${stats.updated}, Failed: ${stats.failed}`);
    } catch (error) {
      return await updateSyncHistory(supabase, syncId, false, 'failed', stats, 
        `Sync failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error during sync:', error);
    return corsResponse({ 
      success: false, 
      message: `Sync failed: ${error.message}` 
    });
  }
}

// Helper function to get all pages from a Notion database with pagination
async function getAllNotionPages(notionApiKey: string, databaseId: string) {
  let results = [];
  let hasMore = true;
  let startCursor = undefined;
  
  while (hasMore) {
    const response = await retryWithBackoff(async () => {
      const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: MAX_ITEMS_PER_SYNC,
          start_cursor: startCursor
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Notion API error: ${errorData.message || 'Unknown error'}`);
      }
      
      return await res.json();
    });
    
    results = results.concat(response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor;
    
    // Safety check - don't process more than 500 pages to avoid overloading
    if (results.length > 500) {
      console.warn(`Limiting Notion sync to first 500 records`);
      break;
    }
  }
  
  return results;
}

// Helper function to extract creator data from Notion page
function extractCreatorDataFromNotion(page: any) {
  // This is a simplified implementation
  // You'll need to adapt this to match your actual Notion database structure
  const properties = page.properties;
  
  if (!properties) {
    throw new Error('Page has no properties');
  }
  
  // Use defensive programming to prevent runtime errors
  const getId = () => {
    if (properties.ID?.rich_text?.length > 0) {
      return properties.ID.rich_text[0].plain_text;
    }
    return page.id;
  };
  
  const getName = () => {
    if (properties.Name?.title?.length > 0) {
      return properties.Name.title[0].plain_text;
    }
    return 'Unnamed';
  };
  
  const getUsername = () => {
    if (properties.Username?.rich_text?.length > 0) {
      return properties.Username.rich_text[0].plain_text;
    }
    const name = getName();
    return name.toLowerCase().replace(/\s+/g, '-');
  };
  
  const getBio = () => {
    if (properties.Bio?.rich_text?.length > 0) {
      return properties.Bio.rich_text[0].plain_text;
    }
    return '';
  };
  
  const id = getId();
  const name = getName();
  const username = getUsername();
  const bio = getBio();
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
  return await retryWithBackoff(async () => {
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
            title: [{ text: { content: creator.name || 'Unnamed' } }]
          },
          ID: {
            rich_text: [{ text: { content: creator.id || '' } }]
          },
          Username: {
            rich_text: [{ text: { content: creator.username || '' } }]
          },
          Bio: {
            rich_text: creator.bio ? [{ text: { content: creator.bio.substring(0, 2000) } }] : []
          },
          'Profile Image': {
            url: creator.profile_image || ''
          },
          'Is Verified': {
            checkbox: !!creator.is_verified
          },
          'Is Featured': {
            checkbox: !!creator.is_featured
          },
          'Is New': {
            checkbox: !!creator.is_new
          },
          Type: {
            select: { name: creator.type || 'standard' }
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
  });
}

// Helper function to update sync history with error
async function updateSyncHistory(
  supabase: any, 
  syncId: string, 
  success: boolean, 
  status: 'completed' | 'failed', 
  stats: any, 
  message: string
) {
  try {
    const { error } = await supabase
      .from('sync_history')
      .update({
        completed_at: new Date().toISOString(),
        status,
        success,
        message,
        stats
      })
      .eq('id', syncId);
    
    if (error) {
      console.error('Error updating sync history:', error);
    }
    
    return corsResponse({ 
      success, 
      message,
      stats
    });
  } catch (error) {
    console.error('Error updating sync history:', error);
    return corsResponse({ 
      success: false, 
      message: `Failed to update sync history: ${error.message}`, 
      stats 
    });
  }
}
