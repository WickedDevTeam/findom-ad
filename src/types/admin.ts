
// Add any additional types needed for admin functionality here

export interface PendingSubmission {
  id: string;
  name: string;
  username: string;
  category: string;
  type: string;
  submittedAt: string;
  email?: string;
  profile_image?: string; // Add this field
  bio?: string;
  twitter?: string;
  cashapp?: string;
  onlyfans?: string;
  throne?: string;
}

export interface StatsData {
  name: string;
  listings: number;
  visitors: number;
  revenue: number;
}

export interface SyncHistoryItem {
  id: string;
  started_at: string;
  completed_at: string | null;
  success: boolean | null;
  status: string;
  message: string | null;
  sync_type: string;
  stats: {
    added: number;
    updated: number;
    deleted: number;
    failed: number;
    errors: string[];
  };
}

// Add this interface to match the admin page imports
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
