
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
    let action, config, listing, listingId, updates, options;
    try {
      const body = await req.json();
      action = body.action;
      config = body.config;
      listing = body.listing;
      listingId = body.listingId;
      updates = body.updates;
      options = body.options || {};
    } catch (error) {
      return corsResponse({ 
        success: false, 
        message: `Invalid request body: ${error.message}` 
      }, 400);
    }

    // Get Notion configuration from Supabase
    let notionConfig;
    if (!config && (action !== 'test-connection')) {
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'notion_sync_config')
        .single();
        
      if (configError) {
        return corsResponse({ 
          success: false, 
          message: `Failed to fetch Notion configuration: ${configError.message}` 
        }, 500);
      }
      
      notionConfig = configData?.value;
      
      if (!notionConfig?.notionApiKey || !notionConfig?.notionDatabaseId) {
        return corsResponse({ 
          success: false, 
          message: 'Notion API key or database ID not configured' 
        }, 400);
      }
    } else if (action === 'test-connection') {
      notionConfig = config;
    }

    // Test the Notion connection
    if (action === 'test-connection') {
      return await testNotionConnection(config);
    }

    // Submit new listing to Notion
    if (action === 'submit-listing') {
      return await submitListingToNotion(supabase, notionConfig, listing);
    }

    // Update listing in Notion
    if (action === 'update-listing') {
      return await updateListingInNotion(supabase, notionConfig, listingId, updates);
    }

    // Fetch listings from Notion
    if (action === 'fetch-listings') {
      return await fetchListingsFromNotion(supabase, notionConfig, options);
    }

    // Sync with Notion (bidirectional)
    if (action === 'sync') {
      return await syncWithNotion(supabase, notionConfig);
    }

    // If no valid action provided
    return corsResponse({ 
      success: false, 
      message: 'Invalid action provided. Valid actions are: test-connection, sync, submit-listing, update-listing, fetch-listings' 
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
      databaseTitle: response.title?.[0]?.plain_text || 'Untitled Database',
      databaseProperties: response.properties || {}
    });
  } catch (error) {
    console.error('Error testing Notion connection:', error);
    return corsResponse({ 
      success: false, 
      message: `Connection test failed: ${error.message}` 
    });
  }
}

// Submit new listing to Notion
async function submitListingToNotion(supabase: any, config: any, listing: any) {
  try {
    if (!listing) {
      return corsResponse({
        success: false,
        message: 'No listing data provided'
      }, 400);
    }

    // Create a new page in Notion database
    const notionPage = await createListingPage(config.notionApiKey, config.notionDatabaseId, {
      ...listing,
      status: 'Draft', // All new submissions are drafts by default
    });

    // Record the submission in sync history
    const syncId = crypto.randomUUID();
    await supabase
      .from('sync_history')
      .insert({
        id: syncId,
        sync_type: 'notion-submission',
        status: 'completed',
        success: true,
        message: `New listing "${listing.name}" submitted successfully`,
        stats: {
          added: 1,
          updated: 0,
          deleted: 0,
          failed: 0,
          errors: []
        },
        completed_at: new Date().toISOString()
      });

    return corsResponse({
      success: true,
      message: 'Listing submitted to Notion successfully',
      listingId: notionPage.id
    });
  } catch (error) {
    console.error('Error submitting listing to Notion:', error);
    
    try {
      // Record the failed submission attempt
      await supabase
        .from('sync_history')
        .insert({
          id: crypto.randomUUID(),
          sync_type: 'notion-submission',
          status: 'failed',
          success: false,
          message: `Failed to submit listing: ${error.message}`,
          stats: {
            added: 0,
            updated: 0,
            deleted: 0,
            failed: 1,
            errors: [error.message]
          },
          completed_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Error recording submission failure:', logError);
    }
    
    return corsResponse({
      success: false,
      message: `Failed to submit listing: ${error.message}`
    }, 500);
  }
}

// Update existing listing in Notion
async function updateListingInNotion(supabase: any, config: any, listingId: string, updates: any) {
  try {
    if (!listingId) {
      return corsResponse({
        success: false,
        message: 'No listing ID provided'
      }, 400);
    }

    if (!updates || Object.keys(updates).length === 0) {
      return corsResponse({
        success: false,
        message: 'No updates provided'
      }, 400);
    }

    // Update the page in Notion
    await updateNotionPage(config.notionApiKey, listingId, updates);

    // If status changed to Approved, check for user notification
    if (updates.status === 'Approved' && updates.user_id) {
      try {
        // Create a notification for the user
        await supabase
          .from('notifications')
          .insert({
            user_id: updates.user_id,
            title: 'Listing Approved',
            message: `Your listing "${updates.name || 'Untitled'}" has been approved by an admin.`,
            type: 'success',
            link: `/creators/${updates.username}`
          });
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Continue execution even if notification fails
      }
    }

    // Record the update in sync history
    await supabase
      .from('sync_history')
      .insert({
        id: crypto.randomUUID(),
        sync_type: 'notion-update',
        status: 'completed',
        success: true,
        message: `Listing "${updates.name || listingId}" updated successfully`,
        stats: {
          added: 0,
          updated: 1,
          deleted: 0,
          failed: 0,
          errors: []
        },
        completed_at: new Date().toISOString()
      });

    return corsResponse({
      success: true,
      message: 'Listing updated in Notion successfully'
    });
  } catch (error) {
    console.error('Error updating listing in Notion:', error);
    
    try {
      // Record the failed update attempt
      await supabase
        .from('sync_history')
        .insert({
          id: crypto.randomUUID(),
          sync_type: 'notion-update',
          status: 'failed',
          success: false,
          message: `Failed to update listing: ${error.message}`,
          stats: {
            added: 0,
            updated: 0,
            deleted: 0,
            failed: 1,
            errors: [error.message]
          },
          completed_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Error recording update failure:', logError);
    }
    
    return corsResponse({
      success: false,
      message: `Failed to update listing: ${error.message}`
    }, 500);
  }
}

// Fetch listings from Notion with filtering and pagination
async function fetchListingsFromNotion(supabase: any, config: any, options: any) {
  try {
    const { status, limit = 50, cursor } = options;
    
    // Build the query body
    const queryBody: any = {
      page_size: Math.min(limit, 100),
      sorts: [
        {
          property: 'Name',
          direction: 'ascending'
        }
      ]
    };
    
    if (cursor) {
      queryBody.start_cursor = cursor;
    }
    
    // Add filter for status if specified
    if (status) {
      queryBody.filter = {
        property: config.listingStatusField || 'Status',
        select: {
          equals: status
        }
      };
    }

    // Query the Notion database
    const response = await retryWithBackoff(async () => {
      const res = await fetch(`https://api.notion.com/v1/databases/${config.notionDatabaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.notionApiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryBody)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Notion API error: ${errorData.message || 'Unknown error'}`);
      }
      
      return await res.json();
    });
    
    // Transform Notion pages to listing objects
    const listings = response.results.map((page: any) => {
      return extractCreatorDataFromNotion(page);
    });
    
    return corsResponse({
      success: true,
      message: 'Listings fetched successfully',
      listings,
      nextCursor: response.next_cursor || null,
      total: response.has_more ? listings.length + 1 : listings.length, // Estimate total if has_more is true
      hasMore: response.has_more
    });
  } catch (error) {
    console.error('Error fetching listings from Notion:', error);
    return corsResponse({
      success: false,
      message: `Failed to fetch listings: ${error.message}`
    }, 500);
  }
}

// Perform bidirectional sync between Supabase and Notion
async function syncWithNotion(supabase: any, config: any) {
  try {
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
      // If using Notion as main CMS, we only need to fetch from Notion and update Supabase
      if (config.notionAsMainCms) {
        // Fetch all approved listings from Notion
        const approvedListings = await getAllNotionPagesWithStatus(config.notionApiKey, config.notionDatabaseId, 'Approved', config.listingStatusField);
        
        // Update or create listings in Supabase
        for (const page of approvedListings) {
          try {
            const listingData = extractCreatorDataFromNotion(page);
            
            // Check if this listing already exists in Supabase
            const { data: existingListing } = await supabase
              .from('creators')
              .select('id')
              .eq('id', listingData.id)
              .maybeSingle();
              
            if (existingListing) {
              // Update existing listing
              const { error } = await supabase
                .from('creators')
                .update(listingData)
                .eq('id', listingData.id);
                
              if (error) {
                stats.errors.push(`Failed to update creator ${listingData.id}: ${error.message}`);
                stats.failed++;
              } else {
                stats.updated++;
              }
            } else {
              // Create new listing
              const { error } = await supabase
                .from('creators')
                .insert(listingData);
                
              if (error) {
                stats.errors.push(`Failed to create creator ${listingData.id}: ${error.message}`);
                stats.failed++;
              } else {
                stats.added++;
              }
            }
          } catch (error) {
            stats.errors.push(`Error processing Notion page: ${error.message}`);
            stats.failed++;
          }
        }
        
        // Find and remove creators in Supabase that are no longer in Notion (if they were deleted in Notion)
        const { data: allCreators } = await supabase
          .from('creators')
          .select('id');
          
        if (allCreators) {
          const notionIds = new Set(approvedListings.map(page => page.id));
          const creatorsToRemove = allCreators.filter(creator => !notionIds.has(creator.id));
          
          for (const creator of creatorsToRemove) {
            const { error } = await supabase
              .from('creators')
              .delete()
              .eq('id', creator.id);
              
            if (error) {
              stats.errors.push(`Failed to delete creator ${creator.id}: ${error.message}`);
              stats.failed++;
            } else {
              stats.deleted++;
            }
          }
        }
      } else {
        // Original bidirectional sync logic
        // Step 1: Get all creators from Supabase
        const { data: creators, error: creatorsError } = await supabase
          .from('creators')
          .select('*');

        if (creatorsError) {
          throw new Error(`Failed to fetch creators from database: ${creatorsError.message}`);
        }

        // Step 2: Query Notion database
        const notionPages = await getAllNotionPages(config.notionApiKey, config.notionDatabaseId);

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
              await createNotionPage(config.notionApiKey, config.notionDatabaseId, creator);
              stats.added++;
            }
          } catch (error) {
            stats.errors.push(`Error creating Notion page for creator ${id}: ${error.message}`);
            stats.failed++;
          }
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
        `Sync completed successfully. Added: ${stats.added}, Updated: ${stats.updated}, Deleted: ${stats.deleted}, Failed: ${stats.failed}`);
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

// Helper function to get pages with specific status
async function getAllNotionPagesWithStatus(notionApiKey: string, databaseId: string, status: string, statusField: string = 'Status') {
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
          start_cursor: startCursor,
          filter: {
            property: statusField,
            select: {
              equals: status
            }
          }
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
  
  // Extract the ID from the page or from a property
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
    // Generate a username from the name
    const name = getName();
    return name.toLowerCase().replace(/\s+/g, '-');
  };
  
  const getBio = () => {
    if (properties.Bio?.rich_text?.length > 0) {
      return properties.Bio.rich_text[0].plain_text;
    }
    return '';
  };
  
  const getStatus = () => {
    return properties.Status?.select?.name || 'Draft';
  };
  
  // Build the creator object
  const id = getId();
  const name = getName();
  const username = getUsername();
  const bio = getBio();
  const status = getStatus();
  const profileImage = properties['Profile Image']?.url || properties['Profile Image']?.files?.[0]?.file?.url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop';
  const coverImage = properties['Cover Image']?.url || properties['Cover Image']?.files?.[0]?.file?.url || '';
  const isVerified = properties['Is Verified']?.checkbox || false;
  const isFeatured = properties['Is Featured']?.checkbox || false;
  const isNew = properties['Is New']?.checkbox || false;
  const type = properties.Type?.select?.name || 'standard';
  
  // Extract social links
  const socialLinks: { [key: string]: string } = {};
  ['Twitter', 'Throne', 'Cashapp', 'OnlyFans'].forEach(platform => {
    const value = properties[platform]?.rich_text?.[0]?.plain_text ||
                  properties[platform]?.url ||
                  '';
    if (value) {
      socialLinks[platform.toLowerCase()] = value;
    }
  });
  
  // Build final object mapped to our DB schema
  return {
    id,
    name,
    username,
    bio,
    status,
    profile_image: profileImage,
    cover_image: coverImage,
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
    // Convert to Notion properties format
    const properties = {
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
      Status: {
        select: { name: creator.status || 'Draft' }
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
      }
    };
    
    // Add social links
    const socialLinks = creator.social_links || {};
    if (socialLinks.twitter) {
      properties['Twitter'] = { rich_text: [{ text: { content: socialLinks.twitter } }] };
    }
    if (socialLinks.throne) {
      properties['Throne'] = { rich_text: [{ text: { content: socialLinks.throne } }] };
    }
    if (socialLinks.cashapp) {
      properties['Cashapp'] = { rich_text: [{ text: { content: socialLinks.cashapp } }] };
    }
    if (socialLinks.onlyfans) {
      properties['OnlyFans'] = { rich_text: [{ text: { content: socialLinks.onlyfans } }] };
    }
    
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties
      })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(`Failed to create Notion page: ${data.message || 'Unknown error'}`);
    }
    
    return await response.json();
  });
}

// Helper function to update an existing Notion page
async function updateNotionPage(notionApiKey: string, pageId: string, updates: any) {
  return await retryWithBackoff(async () => {
    // Convert to Notion properties format
    const properties: any = {};
    
    if (updates.name) {
      properties.Name = {
        title: [{ text: { content: updates.name } }]
      };
    }
    
    if (updates.username) {
      properties.Username = {
        rich_text: [{ text: { content: updates.username } }]
      };
    }
    
    if (updates.bio) {
      properties.Bio = {
        rich_text: [{ text: { content: updates.bio.substring(0, 2000) } }]
      };
    }
    
    if (updates.status) {
      properties.Status = {
        select: { name: updates.status }
      };
    }
    
    if (updates.profile_image) {
      properties['Profile Image'] = {
        url: updates.profile_image
      };
    }
    
    if ('is_verified' in updates) {
      properties['Is Verified'] = {
        checkbox: !!updates.is_verified
      };
    }
    
    if ('is_featured' in updates) {
      properties['Is Featured'] = {
        checkbox: !!updates.is_featured
      };
    }
    
    if ('is_new' in updates) {
      properties['Is New'] = {
        checkbox: !!updates.is_new
      };
    }
    
    if (updates.type) {
      properties.Type = {
        select: { name: updates.type }
      };
    }
    
    // Add social links
    if (updates.social_links) {
      const socialLinks = updates.social_links;
      if (socialLinks.twitter) {
        properties['Twitter'] = { rich_text: [{ text: { content: socialLinks.twitter } }] };
      }
      if (socialLinks.throne) {
        properties['Throne'] = { rich_text: [{ text: { content: socialLinks.throne } }] };
      }
      if (socialLinks.cashapp) {
        properties['Cashapp'] = { rich_text: [{ text: { content: socialLinks.cashapp } }] };
      }
      if (socialLinks.onlyfans) {
        properties['OnlyFans'] = { rich_text: [{ text: { content: socialLinks.onlyfans } }] };
      }
    }
    
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties
      })
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(`Failed to update Notion page: ${data.message || 'Unknown error'}`);
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
