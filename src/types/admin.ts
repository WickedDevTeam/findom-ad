
export interface PendingSubmission {
  id: string;
  name: string;
  username: string;
  category: string;
  type: string;
  submittedAt: string;
  email?: string;
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

export interface AdminUser {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'moderator' | 'user';
  createdAt: string;
  lastLogin?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject';
  resourceType: 'listing' | 'user' | 'category' | 'setting';
  resourceId: string;
  resourceName: string;
  details?: string;
  timestamp: string;
}
