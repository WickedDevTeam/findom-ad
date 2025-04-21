
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
