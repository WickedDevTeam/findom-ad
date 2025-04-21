export interface Creator {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  coverImage?: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    throne?: string;
    cashapp?: string;
    onlyfans?: string;
    other?: string;
  };
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
  twitter?: string;
  throne?: string;
  cashapp?: string;
  onlyfans?: string;
  other?: string;
}
