
import React from "react";
import { Heart, HeartOff } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import AppBadge from "@/components/shared/AppBadge";

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

export const FavoriteButton = ({
  creatorId,
  className = "",
}: FavoriteButtonProps) => {
  const { data: isFavorite, isLoading } = useIsFavorite(creatorId);
  const { mutate, isPending } = useToggleFavorite(creatorId);

  return (
    <AppBadge
      variant={isFavorite ? "danger" : "info"}
      className={cn(
        "cursor-pointer select-none shadow transition hover:scale-105 px-2 py-1 flex items-center gap-1",
        className,
        isPending && "opacity-60 pointer-events-none"
      )}
      onClick={(e) => {
        e.preventDefault();
        mutate(!!isFavorite);
      }}
    >
      {isFavorite ? (
        <Heart className="text-rose-400" fill="#f43f5e" />
      ) : (
        <Heart className="text-white/70" />
      )}
      <span className="ml-0.5 truncate">
        {isFavorite ? "Favorited" : "Favorite"}
      </span>
    </AppBadge>
  );
};

export default FavoriteButton;
