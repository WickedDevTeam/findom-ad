
export interface PendingSubmission {
  id: string;
  name: string;
  username: string;
  category: string;
  type: string;
  submittedAt: string;
}

export interface StatsData {
  name: string;
  listings: number;
  visitors: number;
  revenue: number;
}
