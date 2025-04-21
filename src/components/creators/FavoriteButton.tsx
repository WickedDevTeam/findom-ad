
import React from "react";
import { Heart } from "lucide-react";
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
        "transition focus:outline-none",
        className,
        isPending && "opacity-60 pointer-events-none"
      )}
      onClick={(e) => {
        e.preventDefault();
        mutate(!!isFavorite);
      }}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all",
        isFavorite 
          ? "bg-[#D946EF] text-white" 
          : "bg-black/60 backdrop-blur-sm border border-[#D946EF]/30 text-[#D946EF] hover:bg-[#D946EF]/20"
      )}>
        <Heart className={cn(
          "w-5 h-5 transition-all",
          isFavorite ? "fill-white" : "fill-transparent"
        )} />
      </div>
    </button>
  );
};

export default FavoriteButton;
