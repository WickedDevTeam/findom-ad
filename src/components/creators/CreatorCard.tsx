
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/types';
import AppBadge from '@/components/shared/AppBadge';
import FavoriteButton from './FavoriteButton';
import { Tag } from 'lucide-react';

const CATEGORY_EMOJIS: Record<string, string> = {
  Findoms: '👑',
  Catfish: '🐟',
  'AI Bots': '🤖',
  'Pay Pigs': '🐷',
  Celebrities: '🌟',
  Blackmail: '💸',
  Twitter: '🐦',
  Bots: '⚡️',
  Other: '🔗'
};

interface CreatorCardProps {
  creator: Creator;
}

const getDicebearSrc = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name.trim().substring(0, 20)
  )}&backgroundColor=transparent`;

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const [imageError, setImageError] = useState(false);

  const imageSrc =
    !creator.profileImage || imageError
      ? getDicebearSrc(creator.name)
      : creator.profileImage;

  const mainCategory = creator.categories[0] || "Other";

  return (
    <Link
      to={`/creator/${creator.username}`}
      className="block group rounded-xl border bg-gradient-to-br from-black/60 to-black/70 shadow-md border-white/10 hover:border-findom-purple/80 transition hover:shadow-findom-purple/30 overflow-hidden focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-findom-gray/20">
        <img
          src={imageSrc}
          alt={creator.name}
          className="w-full h-full object-cover transition duration-200 group-hover:scale-105 bg-findom-dark"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <FavoriteButton creatorId={creator.id} />
          {creator.isFeatured && (
            <AppBadge variant="featured" className="shadow-sm">
              Featured
            </AppBadge>
          )}
          {creator.isNew && (
            <AppBadge variant="success" className="shadow-sm">
              New
            </AppBadge>
          )}
        </div>
      </div>
      <div className="p-5 pb-4 flex flex-col gap-1.5 bg-black/50">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-bold text-white truncate">{creator.name}</h3>
          <span className="text-xs text-white/50 truncate">@{creator.username}</span>
        </div>
        {creator.bio && (
          <div className="text-sm text-white/70 line-clamp-2">{creator.bio}</div>
        )}
        <div className="flex gap-2 mt-2 flex-wrap">
          <AppBadge
            variant="type"
            className="text-xs py-0.5 px-2"
            icon={<Tag size={12} className="mr-1 opacity-70" />}
          >
            {creator.type}
          </AppBadge>
          {mainCategory && (
            <AppBadge
              variant="category"
              className="text-xs py-0.5 px-2"
              icon={<Tag size={12} className="mr-1 opacity-70" />}
            >
              {mainCategory}
            </AppBadge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
