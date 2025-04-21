
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
  syncInterval: 60,
  autoSync: false,
};

function parseConfig(val: any): NotionSyncConfig {
  // Defensive parsing
  if (!val) return defaultSyncConfig;
  try {
    if (typeof val === "string") val = JSON.parse(val);
    if (
      typeof val.enabled === "boolean" &&
      typeof val.notionApiKey === "string" &&
      typeof val.notionDatabaseId === "string" &&
      (typeof val.lastSyncedAt === "string" || val.lastSyncedAt === null) &&
      typeof val.syncInterval === "number" &&
      typeof val.autoSync === "boolean"
    ) {
      return val as NotionSyncConfig;
    }
    // Fallback: Shallow merge with default 
    return { ...defaultSyncConfig, ...val };
  } catch {
    return defaultSyncConfig;
  }
}

export async function getSyncConfig(): Promise<NotionSyncConfig> {
  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "notion_sync_config")
      .maybeSingle();

    if (error) {
      console.error("Error fetching Notion sync configuration:", error);
      return defaultSyncConfig;
    }
    // Defensive parsing - might be absent or missing fields
    return parseConfig(data?.value);
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
        [
          { 
            key: "notion_sync_config", 
            value: config,
            updated_at: new Date().toISOString()
          }
        ],
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
    // Use generic .from since sync_history is a tracked table now
    const { data, error } = await supabase
      .from("sync_history")
      .select("*")
      .order("started_at", { ascending: false })
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
