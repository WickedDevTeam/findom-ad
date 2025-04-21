
import React, { useRef } from "react";
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

// Animation on favorite: pop and pulse
export const FavoriteButton = ({
  creatorId,
  className = "",
}: FavoriteButtonProps) => {
  const { data: isFavorite, isLoading } = useIsFavorite(creatorId);
  const { mutate, isPending } = useToggleFavorite(creatorId);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Animation trigger: scale, pop and optional pulse
  function animateFavorite() {
    if (!buttonRef.current) return;
    buttonRef.current.classList.remove("animate-favorite-pop");
    void buttonRef.current.offsetWidth; // retrigger
    buttonRef.current.classList.add("animate-favorite-pop");
    setTimeout(() => {
      buttonRef.current && buttonRef.current.classList.remove("animate-favorite-pop");
    }, 400);
  }

  return (
    <button
      ref={buttonRef}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      disabled={isPending}
      className={cn(
        "transition focus:outline-none group",
        className,
        isPending && "opacity-60 pointer-events-none"
      )}
      onClick={e => {
        e.preventDefault();
        mutate(!!isFavorite, {
          onSuccess: () => {
            // Only animate when favoriting
            if (!isFavorite) animateFavorite();
          }
        });
      }}
      type="button"
    >
      <span
        className={cn(
          // 50% larger (w-15 h-15 = 60px, vs prev w-10 h-10 = 40px)
          "flex items-center justify-center w-15 h-15 rounded-full shadow-xl transition-all duration-300 relative",
          isFavorite
            ? "bg-gradient-to-tr from-[#FF3864] to-[#D946EF] text-white"
            : "bg-black/70 backdrop-blur-sm border-2 border-[#FF3864]/60 text-[#FF3864] hover:bg-[#FF3864]/10",
          "animate-in", // for fade-in on mount (optional)
        )}
        style={{
          // slight elevation and distinct look
          boxShadow: isFavorite
            ? "0 2px 16px 4px rgba(249, 38, 114, 0.2)"
            : "0 2px 12px 2px rgba(217, 70, 239, 0.12)"
        }}
      >
        <Heart
          className={cn(
            "w-8 h-8 transition-all drop-shadow",
            isFavorite
              ? "fill-white/90 text-white/90 group-hover:scale-110"
              : "fill-transparent text-[#FF3864]",
            "duration-300"
          )}
        />
        {/* Animated heart burst when favorited */}
        <span
          className={cn(
            "absolute pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "opacity-0 group-[.animate-favorite-pop]:opacity-100",
            "z-10"
          )}
          style={{
            width: 55,
            height: 55,
            animation: "favorite-burst 0.4s cubic-bezier(.17,.67,.83,.67)",
            pointerEvents: "none",
          }}
        >
          {/* burst of red-pink hearts or glow */}
          <svg width="55" height="55" viewBox="0 0 55 55" fill="none">
            <circle
              cx="27.5"
              cy="27.5"
              r="24"
              fill="url(#burst)"
              opacity={isFavorite ? 0.22 : 0.17}
            />
            <defs>
              <radialGradient id="burst" cx="0.5" cy="0.5" r="0.5" fx="0.47" fy="0.54" gradientTransform="matrix(1 0 0 1 0 0)">
                <stop stopColor="#FF3864" stopOpacity="0.6"/>
                <stop offset="1" stopColor="#D946EF" stopOpacity="0"/>
              </radialGradient>
            </defs>
          </svg>
        </span>
      </span>
    </button>
  );
};

export default FavoriteButton;

// Animations: add to global styles
if (typeof window !== "undefined") {
  // Only run in browser
  const styleId = "favorite-button-anims";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @keyframes favorite-pop {
        0% { transform: scale(1); }
        30% { transform: scale(1.2); }
        60% { transform: scale(0.93);}
        100% { transform: scale(1);}
      }
      .animate-favorite-pop {
        animation: favorite-pop 0.40s cubic-bezier(.69,1.6,.38,.83);
      }
      @keyframes favorite-burst {
        0% { opacity: 0; transform: scale(0.3);}
        24% { opacity: 0.8; transform: scale(1.11);}
        70% { opacity: 0.22; transform: scale(1);}
        100% { opacity: 0; transform: scale(0.7);}
      }
    `;
    document.head.appendChild(style);
  }
}
