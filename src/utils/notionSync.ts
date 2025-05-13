
// This file contains the Notion sync utility functions that AdminPage.tsx needs

import { supabase } from '@/integrations/supabase/client';

// Define the NotionSyncConfig interface for the configuration
export interface NotionSyncConfig {
  enabled: boolean;
  notionApiKey: string;
  notionDatabaseId: string;
  notionAsMainCms: boolean;
  lastSyncedAt?: string;
  listingStatusField?: string;
  listingTypeField?: string;
  databaseUrl?: string;
  autoSync?: boolean;
  syncInterval?: number;
}

export interface NotionConfig {
  enabled: boolean;
  notionApiKey: string;
  notionDatabaseId: string;
  notionAsMainCms: boolean;
  lastSyncedAt?: string;
  listingStatusField?: string;
  listingTypeField?: string;
  databaseUrl?: string;
  autoSync?: boolean;
  syncInterval?: number;
}

// Function to get Notion sync configuration
export const getSyncConfig = async (): Promise<NotionSyncConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'notion_sync_config')
      .single();
      
    if (error) {
      console.error('Error fetching Notion config:', error);
      return null;
    }
    
    // Cast data.value to NotionSyncConfig with proper type safety
    return data?.value ? (data.value as unknown as NotionSyncConfig) : null;
  } catch (error) {
    console.error('Error in getSyncConfig:', error);
    return null;
  }
};

// Function to update sync configuration
export const updateSyncConfig = async (config: NotionSyncConfig): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('site_config')
      .upsert({
        key: 'notion_sync_config',
        value: config
      }, {
        onConflict: 'key'
      });
      
    if (error) {
      console.error('Error updating Notion config:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateSyncConfig:', error);
    return false;
  }
};

// Function to test the Notion connection
export const testNotionConnection = async (
  config: NotionSyncConfig
): Promise<{ success: boolean; message: string; databaseTitle?: string }> => {
  try {
    // Call the edge function to test the connection
    const { data, error } = await supabase.functions.invoke('notion-sync', {
      body: {
        action: 'test-connection',
        config: {
          apiKey: config.notionApiKey,
          databaseId: config.notionDatabaseId
        }
      }
    });
    
    if (error) {
      console.error('Error testing Notion connection:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to connect to Notion API' 
      };
    }
    
    return data || { 
      success: true, 
      message: 'Connection successful',
      databaseTitle: 'Notion Database' // Default title if not returned by the function
    };
  } catch (error: any) {
    console.error('Error in testNotionConnection:', error);
    return { 
      success: false, 
      message: error.message || 'An unexpected error occurred' 
    };
  }
};

// Function to update a listing in Notion
export const updateListingInNotion = async (
  listingId: string, 
  updates: any
): Promise<{ success: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('notion-sync', {
      body: {
        action: 'update-listing',
        listingId,
        updates
      }
    });
    
    if (error) {
      console.error('Error updating listing in Notion:', error);
      return { success: false, message: error.message || 'Failed to update listing' };
    }
    
    return data || { success: true, message: 'Listing updated successfully' };
  } catch (error: any) {
    console.error('Error in updateListingInNotion:', error);
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
};

// Function to fetch listings from Notion
export const fetchListingsFromNotion = async (
  options?: { status?: string; limit?: number; cursor?: string }
): Promise<{ success: boolean; message: string; listings?: any[]; total?: number }> => {
  try {
    const { data, error } = await supabase.functions.invoke('notion-sync', {
      body: {
        action: 'fetch-listings',
        options: options || {}
      }
    });
    
    if (error) {
      console.error('Error fetching listings from Notion:', error);
      return { success: false, message: error.message || 'Failed to fetch listings' };
    }
    
    return data || { success: true, message: 'Listings fetched successfully', listings: [] };
  } catch (error: any) {
    console.error('Error in fetchListingsFromNotion:', error);
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
};

// Function to submit a new listing to Notion
export const submitListingToNotion = async (
  listing: any
): Promise<{ success: boolean; message: string; listingId?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('notion-sync', {
      body: {
        action: 'submit-listing',
        listing
      }
    });
    
    if (error) {
      console.error('Error submitting listing to Notion:', error);
      return { success: false, message: error.message || 'Failed to submit listing' };
    }
    
    return data || { success: true, message: 'Listing submitted successfully' };
  } catch (error: any) {
    console.error('Error in submitListingToNotion:', error);
    return { success: false, message: error.message || 'An unexpected error occurred' };
  }
};
