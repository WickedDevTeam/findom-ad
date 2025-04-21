
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Creator } from "@/types";
import CreatorGrid from "@/components/creators/CreatorGrid";

const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};

const fetchMyFavorites = async (): Promise<Creator[]> => {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  // Step 1: Get all favorited creator_ids for user
  const { data: favs } = await supabase
    .from("favorites")
    .select("creator_id")
    .eq("user_id", userId);
  if (!favs || favs.length === 0) return [];
  const ids = favs.map((row) => row.creator_id);

  // Step 2: Load creator data
  const { data: creators } = await supabase
    .from("creators")
    .select("*")
    .in("id", ids);

  if (!creators) return [];

  // Map database creators to frontend Creator type
  return creators.map((c) => {
    // Safely extract social links
    let socialLinks = {
      twitter: undefined,
      throne: undefined,
      cashapp: undefined,
      onlyfans: undefined,
      other: undefined
    };
    
    // Only try to access properties if social_links is an object and not an array
    if (c.social_links && typeof c.social_links === 'object' && !Array.isArray(c.social_links)) {
      const links = c.social_links as Record<string, string>;
      socialLinks = {
        twitter: links.twitter,
        throne: links.throne,
        cashapp: links.cashapp,
        onlyfans: links.onlyfans,
        other: links.other
      };
    }

    return {
      id: c.id,
      name: c.name,
      username: c.username,
      profileImage: c.profile_image,
      coverImage: c.cover_image || undefined,
      bio: c.bio,
      socialLinks: socialLinks,
      isVerified: c.is_verified,
      isFeatured: c.is_featured,
      isNew: c.is_new,
      type: c.type,
      categories: [], // We'll populate these if needed in the future
      gallery: [], // We'll populate these if needed in the future
      createdAt: c.created_at
    };
  });
};

const MyFavoritesPage = () => {
  const { data: creators = [], isLoading } = useQuery({
    queryKey: ["myFavorites"],
    queryFn: fetchMyFavorites,
  });

  return (
    <div className="space-y-8 max-w-screen-lg mx-auto p-4">
      <h1 className="text-4xl font-bold mb-3">My Favorites</h1>
      <p className="text-white/80 mb-6">
        Easily access your saved favorite listings. Unfavorite a creator to remove it from this list.
      </p>
      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin mb-6"></div>
        </div>
      ) : creators.length > 0 ? (
        <CreatorGrid creators={creators} />
      ) : (
        <div className="py-12 text-center text-white/70">
          <p className="text-lg">You haven't favorited any creators yet! ❤️</p>
        </div>
      )}
    </div>
  );
};

export default MyFavoritesPage;
