
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Creator } from "@/types";
import PillLabel from "@/components/ui/PillLabel";
import { Info } from "lucide-react";

const CARD_SHADOW = "shadow-[0_4px_16px_-4px_rgba(50,45,100,0.09)]";
const BG_BASE = "bg-black/50 backdrop-blur-xl border border-white/10";

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const [imageError, setImageError] = useState(false);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  ];
  const fallbackImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

  // Pick a first category to show as pill label
  const category = creator.categories[0] || "";
  const isVIP = creator.isFeatured || creator.isNew || creator.isVerified;

  // 1 main stat (type), 1 subtle stat if exists
  const stats = [
    { label: creator.type, variant: "primary" as const },
    creator.categories[1]
      ? { label: creator.categories[1], variant: "category" as const }
      : undefined
  ].filter(Boolean) as { label: string; variant: any }[];

  return (
    <Link
      to={`/creator/${creator.username}`}
      className={`block group rounded-xl overflow-hidden focus-visible:outline-none relative transition ${BG_BASE} ${CARD_SHADOW} 
      hover:shadow-[0_6px_32px_-4px_rgba(110,89,165,0.17)] hover:border-findom-purple/50`}
    >
      {/* IMAGE */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-findom-gray/20 relative">
        <img
          src={imageError ? fallbackImage : creator.profileImage}
          alt={creator.name}
          className="w-full h-full object-cover transition group-hover:scale-105 duration-200"
          onError={() => setImageError(true)}
        />
        {isVIP && (
          <span className="absolute top-3 right-3 z-10">
            <PillLabel variant={creator.isFeatured ? "vip" : creator.isNew ? "info" : "success"} small bold>
              {creator.isFeatured ? "VIP" : creator.isNew ? "New" : creator.isVerified ? "Verified" : ""}
            </PillLabel>
          </span>
        )}
      </div>

      {/* CARD CONTENT */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex gap-2 items-baseline">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">{creator.name}</h3>
          <span className="text-xs text-findom-purple/70">@{creator.username}</span>
        </div>
        {creator.bio && (
          <div className="text-xs text-white/70 leading-relaxed line-clamp-2">{creator.bio}</div>
        )}
        <div className="flex gap-2 mt-2">
          {stats.map((stat, idx) => (
            <PillLabel key={idx} variant={stat.variant} small>
              {stat.label}
            </PillLabel>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
