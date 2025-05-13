
export interface Creator {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  coverImage?: string;
  bio: string;
  socialLinks: SocialLinks;
  isVerified: boolean;
  isFeatured: boolean;
  isNew: boolean;
  type: string;
  categories: string[];
  gallery: string[];
  createdAt: string;
  profile_image?: string; // Added to match Notion database structure
}

export interface PromotionPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  limited?: boolean;
  remaining?: number;
}

export interface SocialLinks {
  twitter?: string | null;
  throne?: string | null;
  cashapp?: string | null;
  onlyfans?: string | null;
  other?: string | null;
}

// New interface for Notion database listings
export interface NotionListing {
  id: string;
  name: string;
  username: string;
  profile_image: string;
  type: string;
  bio: string;
  categories: string[];
  status: 'Draft' | 'Approved' | 'Rejected';
  social_links: SocialLinks;
  created_at: string;
  updated_at: string;
  submitted_by?: string;
  cover_image?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  is_new?: boolean;
}
