
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
  // fallback for others
  Other: '🔗'
};

// Dummy Stats: Replace with real stats if available
const getDummyStats = (creator: Creator) => ({
  visitors: Math.floor(Math.random() * 9000) + 1000,
  revenue: `$${(Math.random() * 5000).toFixed(0)}`,
  followers: Math.floor(Math.random() * 4000) + 100,
  listings: Math.floor(Math.random() * 3) + 1
});

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

  // Use first category for emoji, or fallback
  const mainCategory = creator.categories[0] || "Other";
  const emoji = CATEGORY_EMOJIS[mainCategory] || CATEGORY_EMOJIS["Other"];
  const stats = getDummyStats(creator);

  return (
    <Link to={`/creator/${creator.username}`} className="block group relative">
      <div className="flex rounded-xl bg-black/60 border border-white/10 overflow-hidden shadow-lg transition hover:scale-105 hover:shadow-2xl min-h-[104px]">
        {/* Emoji/Icon and Image */}
        <div className="flex flex-col items-center justify-center min-w-[96px] bg-black/80 border-r border-white/10 p-4 relative">
          <span className="text-4xl md:text-5xl drop-shadow-lg mb-2">{emoji}</span>
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-findom-purple ring-2 ring-findom-purple/30">
            {imageError ? (
              <img 
                src={fallbackImage}
                alt={creator.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={creator.profileImage}
                alt={creator.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        </div>
        {/* Info */}
        <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
          {/* Top: Name & badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-lg md:text-xl font-bold text-white truncate">{creator.name}</h3>
            {creator.isFeatured && (
              <Badge className="bg-findom-purple text-white border-0">Featured</Badge>
            )}
            {creator.isNew && (
              <Badge className="bg-green-500 text-white border-0">New</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/70 mb-2 text-sm">
            @{creator.username}
            <Badge variant="outline" className="text-xs bg-black/50">
              {creator.type}
            </Badge>
          </div>
          {/* Categories */}
          <div className="flex gap-1 flex-wrap mb-3">
            {creator.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline" className="text-[11px] bg-white/10 text-white/80 border-white/20 font-medium rounded">
                {(CATEGORY_EMOJIS[category] || '') + ' '}{category}
              </Badge>
            ))}
            {creator.categories.length > 2 && (
              <Badge variant="outline" className="text-[11px] bg-white/10 border-white/20 text-white/80">+{creator.categories.length - 2} more</Badge>
            )}
          </div>
          {/* Bio shortened */}
          <div className="text-xs text-white/60 line-clamp-2 mb-3">{creator.bio}</div>
          {/* Stats bar */}
          <div className="flex gap-4 items-center mt-auto">
            <span className="flex items-center gap-1 text-white/80 text-xs font-medium">
              <svg width="12" height="12" fill="none" className="inline mr-1"><circle cx="6" cy="6" r="6" fill="#9b87f5" /></svg>
              {stats.followers} followers
            </span>
            <span className="flex items-center gap-1 text-white/60 text-xs">
              <svg width="12" height="12" fill="none" className="inline mr-1"><rect width="12" height="12" rx="2" fill="#F97316" /></svg>
              {stats.listings} listings
            </span>
            <span className="flex items-center gap-1 text-green-400 text-xs">
              <svg width="12" height="12"><circle cx="6" cy="6" r="6" fill="#22c55e"/></svg>
              {stats.visitors} visitors
            </span>
            <span className="flex items-center gap-1 text-yellow-400 text-xs">
              <svg width="12" height="12"><rect width="12" height="6" y="3" fill="#FFD600" rx="2"/></svg>
              {stats.revenue}
            </span>
          </div>
        </div>
        {/* External link icon */}
        <span className="absolute top-4 right-4 opacity-50 group-hover:opacity-90 transition">
          <svg width="20" height="20" fill="none"><path d="M9 4h7m0 0v7m0-7L5 16" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      </div>
    </Link>
  );
};

export default CreatorCard;
