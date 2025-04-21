
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/types';
import { Badge } from '@/components/ui/badge';

// Helper: Map category to emoji
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

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const [imageError, setImageError] = useState(false);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
  ];
  const fallbackImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

  // Category emoji
  const emoji = CATEGORY_EMOJIS[creator.categories[0]] || CATEGORY_EMOJIS["Other"];

  // Minimal card
  return (
    <Link
      to={`/creator/${creator.username}`}
      className="block group rounded-xl bg-black/70 border border-white/10 hover:border-findom-purple/60 shadow transition hover:shadow-findom-purple/20 relative overflow-hidden focus-visible:outline-none"
    >
      {/* Main photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-findom-gray/20">
        {imageError ? (
          <img
            src={fallbackImage}
            alt={creator.name}
            className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
          />
        ) : (
          <img
            src={creator.profileImage}
            alt={creator.name}
            className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        )}
        {/* Subtle emoji badge */}
        <span className="absolute top-2 left-2 bg-black/60 rounded-full px-2 py-1 text-lg shadow text-white/90">
          {emoji}
        </span>
        {/* Featured/New badges, if any */}
        {creator.isFeatured && (
          <Badge className="absolute top-2 right-2 bg-findom-purple text-white border-0">
            Featured
          </Badge>
        )}
        {creator.isNew && (
          <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0 ml-16">
            New
          </Badge>
        )}
      </div>
      {/* Card Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Name & Username */}
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-semibold text-white truncate">{creator.name}</h3>
          <span className="text-xs text-white/50 truncate">@{creator.username}</span>
        </div>
        {/* Short Bio */}
        {creator.bio && (
          <div className="text-xs text-white/60 line-clamp-2 max-h-10">{creator.bio}</div>
        )}
        {/* 1-2 subtle stats (e.g. type and 1st tag) */}
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="bg-black/40 text-white/60 border-white/10 text-[11px] px-2 capitalize">
            {creator.type}
          </Badge>
          {creator.categories[1] && (
            <Badge 
              variant="outline"
              className="bg-black/30 text-white/60 border-white/10 text-[11px] px-2 flex items-center gap-1"
            >
              {(CATEGORY_EMOJIS[creator.categories[1]] || '')} {creator.categories[1]}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
