
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
  const [showConfetti, setShowConfetti] = useState(false);

  // When favoriting, trigger pop+hearts animation
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isFavorite) {
      setAnimating(true);
      setShowConfetti(true);
      setTimeout(() => setAnimating(false), 600);
      setTimeout(() => setShowConfetti(false), 750);
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

  // Custom ring burst (pop circle)
  const ringBurst = animating ? (
    <span
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      <span className="block w-[76px] h-[76px] rounded-full bg-pink-300/20 border-2 border-pink-400/40 animate-favorite-burst"></span>
    </span>
  ) : null;

  // Burst heart confetti (only visible on pop)
  const HeartConfetti = () => (
    <span className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <span className="relative w-[90px] h-[90px] block">
        {/* Main heart in center, extra hearts rotate and move out */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-heart-burst-heart0"
          width={17}
          height={17}
          style={{ zIndex: 10 }}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21s-1.45-1.32-5.31-5.16C2.15 13.15 2 9.17 2 8.5A5.5 5.5 0 0 1 12 4a5.5 5.5 0 0 1 10 4.5c0 .67-.15 4.65-4.69 7.34C13.45 19.68 12 21 12 21z"
            fill="#ea384c"
            opacity="0.75"
          />
        </svg>
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-heart-burst-heart1"
          width={15}
          height={15}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21s-1.45-1.32-5.31-5.16C2.15 13.15 2 9.17 2 8.5A5.5 5.5 0 0 1 12 4a5.5 5.5 0 0 1 10 4.5c0 .67-.15 4.65-4.69 7.34C13.45 19.68 12 21 12 21z"
            fill="#D946EF"
            opacity="0.82"
          />
        </svg>
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-heart-burst-heart2"
          width={11}
          height={11}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21s-1.45-1.32-5.31-5.16C2.15 13.15 2 9.17 2 8.5A5.5 5.5 0 0 1 12 4a5.5 5.5 0 0 1 10 4.5c0 .67-.15 4.65-4.69 7.34C13.45 19.68 12 21 12 21z"
            fill="#FF95B6"
            opacity="0.68"
          />
        </svg>
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-heart-burst-heart3"
          width={8}
          height={8}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21s-1.45-1.32-5.31-5.16C2.15 13.15 2 9.17 2 8.5A5.5 5.5 0 0 1 12 4a5.5 5.5 0 0 1 10 4.5c0 .67-.15 4.65-4.69 7.34C13.45 19.68 12 21 12 21z"
            fill="#FBBF24"
            opacity="0.78"
          />
        </svg>
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-heart-burst-heart4"
          width={12}
          height={12}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 21s-1.45-1.32-5.31-5.16C2.15 13.15 2 9.17 2 8.5A5.5 5.5 0 0 1 12 4a5.5 5.5 0 0 1 10 4.5c0 .67-.15 4.65-4.69 7.34C13.45 19.68 12 21 12 21z"
            fill="#EA4C89"
            opacity="0.88"
          />
        </svg>
      </span>
    </span>
  );

  return (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      disabled={isPending}
      className={cn(
        "group transition focus:outline-none relative",
        className,
        isPending && "opacity-60 pointer-events-none"
      )}
      style={{ minWidth: 0, minHeight: 0 }}
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
            "w-7 h-7 transition-all duration-300 drop-shadow-md",
            heartColor,
            heartPulse
          )}
          strokeWidth={2.5}
        />
        {showConfetti && <HeartConfetti />}
      </div>
      {/* Animations */}
      <style>
        {`
        @keyframes favorite-heart {
          0% { transform: scale(1); }
          30% { transform: scale(1.32) rotate(-7deg); }
          45% { transform: scale(0.98) rotate(7deg);}
          60% { transform: scale(1.09);}
          100% { transform: scale(1);}
        }
        .animate-favorite-heart {
          animation: favorite-heart 0.65s cubic-bezier(.42,0,.48,.96);
        }
        @keyframes favorite-burst {
          0% { transform: scale(0.62); opacity: 0.46; }
          44% { transform: scale(1.01); opacity: 0.18; }
          80% { opacity: 0.09;}
          100% { transform: scale(1.25); opacity: 0; }
        }
        .animate-favorite-burst {
          animation: favorite-burst 0.67s cubic-bezier(.2,0,.35,1);
        }
        /* Heart confetti burst keyframes */
        @keyframes heart-burst-heart0 {
          0% { transform: translate(-50%,-50%) scale(0.7) rotate(0deg); opacity: 0.11;}
          35% { transform: translate(-50%,-140%) scale(1.2) rotate(-22deg); opacity: 1;}
          100% { transform: translate(-50%,-140%) scale(0.8) rotate(-14deg); opacity: 0;}
        }
        @keyframes heart-burst-heart1 {
          0% { transform: translate(-50%,-50%) scale(0.7) rotate(0deg); opacity: 0.1;}
          35% { transform: translate(-110%,-60%) scale(1.05) rotate(7deg); opacity: 1;}
          100% { transform: translate(-110%,-60%) scale(0.75) rotate(26deg); opacity: 0;}
        }
        @keyframes heart-burst-heart2 {
          0% { transform: translate(-50%,-50%) scale(0.5) rotate(0deg); opacity: 0.05;}
          35% { transform: translate(45%,-80%) scale(1.12) rotate(-19deg); opacity: 0.87;}
          100% { transform: translate(45%,-80%) scale(0.7) rotate(13deg); opacity: 0;}
        }
        @keyframes heart-burst-heart3 {
          0% { transform: translate(-50%,-50%) scale(0.65) rotate(0deg); opacity: 0.05;}
          38% { transform: translate(95%,-24%) scale(0.97) rotate(13deg); opacity: 0.92;}
          100% { transform: translate(95%,-24%) scale(0.57) rotate(24deg); opacity: 0;}
        }
        @keyframes heart-burst-heart4 {
          0% { transform: translate(-50%,-50%) scale(0.66) rotate(0deg); opacity: 0.19;}
          37% { transform: translate(-80%,25%) scale(1.08) rotate(-18deg); opacity: 0.92;}
          100% { transform: translate(-80%,25%) scale(0.62) rotate(-22deg); opacity: 0;}
        }
        .animate-heart-burst-heart0 {
          animation: heart-burst-heart0 0.7s cubic-bezier(.42,0,.48,.96);
        }
        .animate-heart-burst-heart1 {
          animation: heart-burst-heart1 0.72s cubic-bezier(.42,0,.48,.96);
        }
        .animate-heart-burst-heart2 {
          animation: heart-burst-heart2 0.74s cubic-bezier(.42,0,.48,.96);
        }
        .animate-heart-burst-heart3 {
          animation: heart-burst-heart3 0.74s cubic-bezier(.42,0,.48,.96);
        }
        .animate-heart-burst-heart4 {
          animation: heart-burst-heart4 0.73s cubic-bezier(.42,0,.48,.96);
        }
        `}
      </style>
    </button>
  );
};

export default FavoriteButton;

