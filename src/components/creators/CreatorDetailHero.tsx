
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/types';
import AppBadge from '@/components/shared/AppBadge';
import { Twitter, Link as LinkIcon, DollarSign, Heart } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { Badge } from '@/components/ui/badge';

interface CreatorDetailHeroProps {
  creator: Creator;
}

const getDicebearSrc = (name: string) =>
  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    name.trim().substring(0, 20)
  )}&backgroundColor=transparent`;

const CreatorDetailHero = ({ creator }: CreatorDetailHeroProps) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc =
    !creator.profileImage || imageError
      ? getDicebearSrc(creator.name)
      : creator.profileImage;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-findom-purple shadow-lg bg-findom-dark flex items-center justify-center text-center">
            <img 
              src={imageSrc}
              alt={creator.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              style={{ background: 'transparent' }}
            />
          </div>
          <div className="absolute left-0 -bottom-8 w-full flex justify-center">
            <FavoriteButton creatorId={creator.id} className="mt-3 z-20" />
          </div>
          {creator.isFeatured && (
            <div className="absolute -top-2 -right-2">
              <AppBadge variant="featured" className="shadow-xl">
                Featured
              </AppBadge>
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white mb-1">{creator.name}</h1>
          <p className="text-lg text-white/80 mb-3">@{creator.username}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
            {creator.categories.map((category) => (
              <Badge
                key={category}
                variant="category"
                categoryName={category}
                className="text-sm font-semibold"
              >
                {category}
              </Badge>
            ))}
            <Badge variant="outline" className="text-sm font-semibold border-findom-green text-findom-green">
              {creator.type}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {creator.socialLinks.twitter && (
              <a href={creator.socialLinks.twitter} target="_blank" rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {creator.socialLinks.throne && (
              <a href={creator.socialLinks.throne} target="_blank" rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors">
                <Crown className="w-5 h-5" />
              </a>
            )}
            {creator.socialLinks.cashapp && (
              <a href={creator.socialLinks.cashapp} target="_blank" rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors">
                <DollarSign className="w-5 h-5" />
              </a>
            )}
            {creator.socialLinks.onlyfans && (
              <a href={creator.socialLinks.onlyfans} target="_blank" rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors">
                <Heart className="w-5 h-5" />
              </a>
            )}
            {creator.socialLinks.other && (
              <a href={creator.socialLinks.other} target="_blank" rel="noopener noreferrer" 
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors">
                <LinkIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
          <div>
            <p className="text-white/70 mb-1 font-medium">Categories</p>
            <div className="flex flex-wrap gap-2">
              {creator.categories.map((category) => (
                <Badge
                  key={category}
                  variant="category"
                  categoryName={category}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/70 mb-1 font-medium">Type</p>
            <Badge variant="outline" className="capitalize border-findom-green text-findom-green">
              {creator.type}
            </Badge>
          </div>
        </div>
        {creator.bio && (
          <div className="mt-4">
            <p className="text-white/70 mb-1 font-medium">Short Bio</p>
            <div className="text-white/80 text-lg">{creator.bio}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add this import to fix the error
const Crown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M4 22h16" />
  </svg>
);

export default CreatorDetailHero;
