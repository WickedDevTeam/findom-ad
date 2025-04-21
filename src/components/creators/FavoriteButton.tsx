
import React, { useState } from "react";
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

  // Animation state
  const [animating, setAnimating] = useState(false);

  // When favoriting, trigger heart animation
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isFavorite) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600); // duration should match animation
    }
    mutate(!!isFavorite);
  };

  // Main button classes
  const buttonBg = isFavorite
    ? "bg-gradient-to-br from-pink-500 via-pink-600 to-red-500"
    : "bg-black/70 border-2 border-pink-400/60 hover:bg-pink-600/10";
  const heartColor = isFavorite ? "fill-white text-white" : "fill-transparent text-pink-500 group-hover:fill-pink-100";
  const heartPulse = animating
    ? "animate-favorite-heart"
    : "";

  // Custom ring burst
  const ringBurst = animating ? (
    <span
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="block w-[76px] h-[76px] rounded-full bg-pink-300/20 border-2 border-pink-400/40 animate-favorite-burst"></span>
    </span>
  ) : null;

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      disabled={isPending}
      className={cn(
        "group transition focus:outline-none relative", // so animation overlays work
        className,
        isPending && "opacity-60 pointer-events-none"
      )}
      style={{ minWidth: 0, minHeight: 0 }} // prevent strange stretching
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all",
          buttonBg,
          animating ? "scale-110" : "hover:scale-105",
          "border-pink-500/80"
        )}
        style={{
          boxShadow:
            isFavorite || animating
              ? "0 4px 24px 0 rgba(249, 24, 128, 0.21)"
              : "0 2px 8px 0 rgba(0,0,0,0.08)",
        }}
      >
        {ringBurst}
        <Heart
          className={cn(
            "w-7 h-7 transition-all duration-300 drop-shadow-md", // 50% larger than 5=20px
            heartColor,
            heartPulse
          )}
          strokeWidth={2.5}
        />
      </div>
      {/* Heart-filled burst/particle animation */}
      <style>
        {`
        @keyframes favorite-heart {
          0% { transform: scale(1); }
          30% { transform: scale(1.32) rotate(-6deg); }
          45% { transform: scale(0.97) rotate(7deg); }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-favorite-heart {
          animation: favorite-heart 0.6s cubic-bezier(.42,0,.48,.96);
        }
        @keyframes favorite-burst {
          0% { transform: scale(0.6); opacity: 0.45; }
          50% { transform: scale(1.05); opacity: 0.15; }
          90% { opacity: 0.07;}
          100% { transform: scale(1.25); opacity: 0; }
        }
        .animate-favorite-burst {
          animation: favorite-burst 0.6s cubic-bezier(.2,0,.35,1);
        }
        `}
      </style>
    </button>
  );
};

export default FavoriteButton;

