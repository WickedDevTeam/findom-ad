
import { supabase } from "@/integrations/supabase/client";
import { Creator } from "@/types";

export interface NotionSyncConfig {
  enabled: boolean;
  notionApiKey: string;
  notionDatabaseId: string;
  lastSyncedAt: string | null;
  syncInterval: number; // in minutes
  autoSync: boolean;
}

export interface SyncStats {
  added: number;
  updated: number;
  deleted: number;
  failed: number;
  errors: string[];
}

export const defaultSyncConfig: NotionSyncConfig = {
  enabled: false,
  notionApiKey: "",
  notionDatabaseId: "",
  lastSyncedAt: null,
  syncInterval: 60, // default to hourly
  autoSync: false,
};

export async function getSyncConfig(): Promise<NotionSyncConfig> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "notion_sync_config")
      .single();

    if (error) {
      console.error("Error fetching Notion sync configuration:", error);
      return defaultSyncConfig;
    }

    return data?.value as NotionSyncConfig || defaultSyncConfig;
  } catch (error) {
    console.error("Error in getSyncConfig:", error);
    return defaultSyncConfig;
  }
}

export async function updateSyncConfig(config: NotionSyncConfig): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("site_config")
      .upsert(
        { 
          key: "notion_sync_config", 
          value: config,
          updated_at: new Date().toISOString()
        },
        { onConflict: "key" }
      );

    if (error) {
      console.error("Error updating Notion sync configuration:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateSyncConfig:", error);
    return false;
  }
}

// These functions would be implemented in the edge function
export async function initiateSync(): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("notion-sync", {
      body: { action: "sync" }
    });

    if (error) {
      return { success: false, message: `Sync failed: ${error.message}` };
    }

    return data || { success: true, message: "Sync initiated successfully" };
  } catch (error) {
    console.error("Error initiating sync:", error);
    return { success: false, message: "Failed to initiate sync due to an unexpected error" };
  }
}

export async function testNotionConnection(config: NotionSyncConfig): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.functions.invoke("notion-sync", {
      body: { 
        action: "test-connection",
        config: {
          notionApiKey: config.notionApiKey,
          notionDatabaseId: config.notionDatabaseId
        }
      }
    });

    if (error) {
      return { success: false, message: `Connection test failed: ${error.message}` };
    }

    return data || { success: true, message: "Connection to Notion successful" };
  } catch (error) {
    console.error("Error testing Notion connection:", error);
    return { success: false, message: "Failed to test connection due to an unexpected error" };
  }
}

export async function getSyncHistory(limit: number = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("sync_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching sync history:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getSyncHistory:", error);
    return [];
  }
}
