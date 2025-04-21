
import React from "react";
import { Heart, HeartOff } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  creatorId: string;
  className?: string;
}

const getCurrentUserId = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
};

const useIsFavorite = (creatorId: string) => {
  return useQuery({
    queryKey: ["favorite", creatorId],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      if (!userId) return false;
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("creator_id", creatorId)
        .maybeSingle();
      return !!data;
    },
  });
};

const useToggleFavorite = (creatorId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFav: boolean) => {
      const userId = await getCurrentUserId();
      if (!userId) throw new Error("Not logged in.");
      if (!isFav) {
        // Add favorite
        const { error } = await supabase.from("favorites").insert({
          user_id: userId,
          creator_id: creatorId,
        });
        if (error) throw error;
      } else {
        // Remove favorite
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("creator_id", creatorId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite", creatorId] });
      queryClient.invalidateQueries({ queryKey: ["myFavorites"] });
    },
  });
};

// Updated to match mockup screenshot style
export const FavoriteButton = ({
  creatorId,
  className = "",
}: FavoriteButtonProps) => {
  const { data: isFavorite, isLoading } = useIsFavorite(creatorId);
  const { mutate, isPending } = useToggleFavorite(creatorId);

  return (
    <button
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      disabled={isPending}
      className={cn(
        "transition focus:outline-none rounded-full group",
        className,
        isPending && "opacity-60 pointer-events-none"
      )}
      onClick={(e) => {
        e.preventDefault();
        mutate(!!isFavorite);
      }}
      style={{ minWidth: 0 }}
    >
      <span className={cn(
        "flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium select-none bg-black/80 backdrop-blur-sm transition-all",
        isFavorite
          ? "border-[#18d28f]/80 text-[#18d28f]"
          : "border-[#18d28f]/80 text-[#18d28f]"
      )}>
        {isFavorite ? (
          <svg className="w-4 h-4 fill-[#18d28f] text-[#18d28f]" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        ) : (
          <svg className="w-4 h-4 stroke-[#18d28f]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19.76 5.67C18.95 4.09 17.14 3 15 3c-1.5 0-2.91.66-3.85 1.97C9.91 3.66 8.5 3 7 3 4.86 3 3.05 4.09 2.24 5.67c-.46.83-.7 1.76-.69 2.71.02 2.33 1.47 4.55 4.11 7.12a31.969 31.969 0 0 0 5.19 4.21c.27.17.61.17.89 0a31.969 31.969 0 0 0 5.19-4.21c2.64-2.57 4.09-4.79 4.11-7.12.01-.95-.23-1.88-.69-2.71z"/></svg>
        )}
        <span className="truncate">
          {isFavorite ? "Favorited" : "Favorite"}
        </span>
      </span>
    </button>
  );
};

export default FavoriteButton;
