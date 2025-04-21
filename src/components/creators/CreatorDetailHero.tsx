
import React, { useState, useCallback, memo } from 'react';
import { Creator } from '@/types';
import AppBadge from '@/components/shared/AppBadge';
import { Twitter, Link as LinkIcon, DollarSign, Heart } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

// Real woman/instagram model profile placeholder
const getProfileModelPlaceholder = () =>
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=facearea&facepad=2';

interface CreatorDetailHeroProps {
  creator: Creator;
}

// Memoize social link component to prevent unnecessary re-renders
const SocialLink = memo(({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="p-2 rounded-full bg-white/10 hover:bg-findom-purple/20 transition-colors"
  >
    {icon}
  </a>
));

SocialLink.displayName = 'SocialLink';

// Optimize Crown component by memoizing it
const Crown = memo(({
  className
}: {
  className?: string;
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M4 22h16" />
  </svg>
));

Crown.displayName = 'Crown';

const CreatorDetailHero = ({ creator }: CreatorDetailHeroProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Memoize the image error handler
  const handleImageError = useCallback(() => setImageError(true), []);
  
  // Use the provided profile image, or the stylish real-woman placeholder (not dicebear)
  const imageSrc =
    !creator.profileImage || imageError
      ? getProfileModelPlaceholder()
      : creator.profileImage;
      
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-findom-purple shadow-lg">
            <img
              src={`${imageSrc}${imageSrc.includes('?') ? '&' : '?'}w=128&h=128&fit=crop&auto=format&q=90`}
              alt={creator.name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          <div className="absolute -right-2 bottom-2">
            {/* FavoriteButton, now 10% smaller */}
            <FavoriteButton creatorId={creator.id} className="scale-90" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-extrabold text-white mb-1">{creator.name}</h1>
            {creator.isFeatured && (
              <AppBadge variant="featured" className="shadow-sm">
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
              <SocialLink 
                href={creator.socialLinks.twitter}
                icon={<Twitter className="w-5 h-5" />}
                label="Twitter"
              />
            )}
            {creator.socialLinks.throne && (
              <SocialLink 
                href={creator.socialLinks.throne}
                icon={<Crown className="w-5 h-5" />}
                label="Throne"
              />
            )}
            {creator.socialLinks.cashapp && (
              <SocialLink 
                href={creator.socialLinks.cashapp}
                icon={<DollarSign className="w-5 h-5" />}
                label="CashApp"
              />
            )}
            {creator.socialLinks.onlyfans && (
              <SocialLink 
                href={creator.socialLinks.onlyfans}
                icon={<Heart className="w-5 h-5" />}
                label="OnlyFans"
              />
            )}
            {creator.socialLinks.other && (
              <SocialLink 
                href={creator.socialLinks.other}
                icon={<LinkIcon className="w-5 h-5" />}
                label="Other link"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bio section */}
      <div className="space-y-2">
        <p className="text-white/80 text-base sm:text-lg">{creator.bio}</p>
      </div>
    </div>
  );
};

export default memo(CreatorDetailHero);
