
import React, { useState } from 'react';
import { Creator } from '@/types';
import AppBadge from '@/components/shared/AppBadge';
import { Twitter, Link as LinkIcon, DollarSign, Heart } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface CreatorDetailHeroProps {
  creator: Creator;
}

const getDicebearSrc = (name: string) =>
  `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=facearea&facepad=2`;

const CreatorDetailHero = ({ creator }: CreatorDetailHeroProps) => {
  const [imageError, setImageError] = useState(false);
  // Use the provided profile image, or the unsplash woman placeholder, or fallback on dicebear for legacy
  const imageSrc =
    !creator.profileImage || imageError
      ? getDicebearSrc(creator.name)
      : creator.profileImage;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-findom-purple shadow-lg">
            <img
              src={imageSrc}
              alt={creator.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="absolute -right-3 bottom-1">
            <FavoriteButton creatorId={creator.id} className="scale-[0.90]" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-extrabold text-white mb-1">{creator.name}</h1>
            {creator.isFeatured && (
              <AppBadge variant="featured" className="shadow-xl mt-0.5 mb-0.5">
                Featured
              </AppBadge>
            )}
          </div>
          <p className="text-lg text-white/80 mb-3">@{creator.username}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
            {creator.categories.map(category => (
              <AppBadge key={category} variant="category" categoryName={category} className="text-sm font-semibold">
                {category}
              </AppBadge>
            ))}
            <AppBadge variant="type" className="text-sm font-semibold">
              {creator.type}
            </AppBadge>
          </div>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {creator.socialLinks.twitter && (
              <a
                href={creator.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {creator.socialLinks.throne && (
              <a
                href={creator.socialLinks.throne}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors"
              >
                <Crown className="w-5 h-5" />
              </a>
            )}
            {creator.socialLinks.cashapp && (
              <a
                href={creator.socialLinks.cashapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors"
              >
                <DollarSign className="w-5 h-5" />
              </a>
            )}
            {creator.socialLinks.onlyfans && (
              <a
                href={creator.socialLinks.onlyfans}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </a>
            )}
            {creator.socialLinks.other && (
              <a
                href={creator.socialLinks.other}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Crown = ({
  className
}: {
  className?: string;
}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M4 22h16" />
  </svg>;

export default CreatorDetailHero;
