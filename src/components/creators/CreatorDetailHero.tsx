
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Creator } from "@/types";
import PillLabel from "@/components/ui/PillLabel";
import { Check, Info, AlertTriangle } from "lucide-react";

interface CreatorDetailHeroProps {
  creator: Creator;
}

const BG_BOX = "bg-black/50 border border-white/15 rounded-2xl p-6 md:p-10 shadow-lg backdrop-blur-xl";
const STAT_LABELS = [
  { key: "isFeatured", label: "VIP", variant: "vip" },
  { key: "isNew", label: "New", variant: "info" },
  { key: "isVerified", label: "Verified", variant: "success" }
];
// For categories navigation quick links
const makeCategoryHref = (category: string) => `/${category.toLowerCase()}`;

const CreatorDetailHero = ({ creator }: CreatorDetailHeroProps) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";
  const nameInitial = creator.name.charAt(0).toUpperCase();

  // Stat chips: featured/new/verified and main type
  const stats = [
    ...STAT_LABELS.filter((s) => (creator as any)[s.key]),
    { label: creator.type, variant: "primary" }
  ];

  return (
    <section className="w-full pt-4">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Avatar */}
        <div className="flex flex-shrink-0 flex-col items-center gap-2">
          <div className="relative">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-findom-purple/70 shadow-2xl bg-findom-dark/60">
              <img
                src={imageError ? fallbackImage : creator.profileImage}
                alt={creator.name}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="absolute -bottom-3 right-2 flex gap-2">
              {creator.isVerified && (
                <PillLabel variant="success" small bold>
                  Verified
                </PillLabel>
              )}
            </div>
          </div>
          {/* Name and handle */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-5 text-center md:text-left">{creator.name}</h1>
          <div className="text-findom-purple/80 text-base font-mono text-center md:text-left">@{creator.username}</div>
        </div>

        {/* Details Glass Box */}
        <div className={`flex-1 flex flex-col gap-4 mt-2 ${BG_BOX}`}>
          {/* Row of category badges/stats */}
          <div className="flex flex-wrap gap-2">
            {creator.categories.map((cat, idx) => (
              <Link key={cat} to={makeCategoryHref(cat)}>
                <PillLabel variant="category" small>
                  {cat}
                </PillLabel>
              </Link>
            ))}
            {creator.isFeatured && (
              <PillLabel variant="vip" small bold>
                VIP
              </PillLabel>
            )}
            {creator.isNew && (
              <PillLabel variant="info" small bold>
                New
              </PillLabel>
            )}
          </div>
          {/* Bio */}
          {creator.bio && (
            <div className="text-base md:text-lg text-white/80 leading-relaxed mt-2">{creator.bio}</div>
          )}
          {/* Key stats */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {stats.map((stat, i) => (
              <PillLabel key={i} variant={stat.variant as any} small>
                {stat.label}
              </PillLabel>
            ))}
          </div>
          {/* Social links */}
          <div className="flex flex-wrap gap-3 mt-6">
            {creator.socialLinks.twitter && (
              <a href={creator.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                className="hover:bg-findom-purple/20 transition-colors rounded-full px-3 py-2 text-findom-purple/90 bg-white/5 backdrop-blur"
                aria-label="Twitter"
              >
                Twitter
              </a>
            )}
            {creator.socialLinks.throne && (
              <a href={creator.socialLinks.throne} target="_blank" rel="noopener noreferrer"
                className="hover:bg-findom-purple/20 transition-colors rounded-full px-3 py-2 text-findom-purple/90 bg-white/5 backdrop-blur"
                aria-label="Throne"
              >
                Throne
              </a>
            )}
            {creator.socialLinks.cashapp && (
              <a href={creator.socialLinks.cashapp} target="_blank" rel="noopener noreferrer"
                className="hover:bg-findom-purple/20 transition-colors rounded-full px-3 py-2 text-findom-purple/90 bg-white/5 backdrop-blur"
                aria-label="CashApp"
              >
                CashApp
              </a>
            )}
            {creator.socialLinks.onlyfans && (
              <a href={creator.socialLinks.onlyfans} target="_blank" rel="noopener noreferrer"
                className="hover:bg-findom-purple/20 transition-colors rounded-full px-3 py-2 text-findom-purple/90 bg-white/5 backdrop-blur"
                aria-label="OnlyFans"
              >
                OnlyFans
              </a>
            )}
            {creator.socialLinks.other && (
              <a href={creator.socialLinks.other} target="_blank" rel="noopener noreferrer"
                className="hover:bg-findom-purple/20 transition-colors rounded-full px-3 py-2 text-findom-purple/90 bg-white/5 backdrop-blur"
                aria-label="Other"
              >
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreatorDetailHero;
