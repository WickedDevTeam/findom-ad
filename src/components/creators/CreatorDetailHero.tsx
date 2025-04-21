
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Twitter, Link as LinkIcon, DollarSign, Heart, 
  CircleCheck, ExternalLink 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CreatorDetailHeroProps {
  creator: Creator;
}

const CreatorDetailHero = ({ creator }: CreatorDetailHeroProps) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";
  
  // Extract first letter of name for avatar fallback
  const nameInitial = creator.name.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Featured badge at the top */}
      {creator.isFeatured && (
        <div className="flex justify-center md:justify-start">
          <Badge className="bg-findom-purple text-white px-3 py-1 text-sm font-medium">
            Featured
          </Badge>
        </div>
      )}
      
      <div className="flex flex-col items-center">
        {/* Avatar */}
        <div className="relative mb-4">
          <Avatar className="w-32 h-32 border-4 border-findom-purple shadow-lg">
            <AvatarImage 
              src={imageError ? fallbackImage : creator.profileImage} 
              alt={creator.name}
              onError={() => setImageError(true)}
              className="object-cover"
            />
            <AvatarFallback className="bg-findom-purple/20 text-findom-purple text-4xl font-bold">
              {nameInitial}
            </AvatarFallback>
          </Avatar>
          {creator.isVerified && (
            <div className="absolute bottom-0 right-0 bg-findom-purple text-white rounded-full p-1">
              <CircleCheck className="w-6 h-6" />
            </div>
          )}
        </div>
        
        {/* Name and username */}
        <h1 className="text-4xl font-bold text-white mb-1 text-center">{creator.name}</h1>
        <p className="text-lg text-white/70 mb-4 text-center">@{creator.username}</p>
        
        {/* Bio/Tagline */}
        <p className="text-white/90 text-center max-w-2xl mb-6 px-4">
          {creator.bio}
        </p>
        
        {/* Social links */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {creator.socialLinks.twitter && (
            <a 
              href={creator.socialLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-black/40 hover:bg-findom-purple/70 transition-colors p-3 rounded-full"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6 text-white" />
            </a>
          )}
          {creator.socialLinks.throne && (
            <a 
              href={creator.socialLinks.throne} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-black/40 hover:bg-findom-purple/70 transition-colors p-3 rounded-full"
              aria-label="Throne"
            >
              <Crown className="w-6 h-6 text-white" />
            </a>
          )}
          {creator.socialLinks.cashapp && (
            <a 
              href={creator.socialLinks.cashapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-black/40 hover:bg-findom-purple/70 transition-colors p-3 rounded-full"
              aria-label="CashApp"
            >
              <DollarSign className="w-6 h-6 text-white" />
            </a>
          )}
          {creator.socialLinks.onlyfans && (
            <a 
              href={creator.socialLinks.onlyfans} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-black/40 hover:bg-findom-purple/70 transition-colors p-3 rounded-full"
              aria-label="OnlyFans"
            >
              <Heart className="w-6 h-6 text-white" />
            </a>
          )}
          {creator.socialLinks.other && (
            <a 
              href={creator.socialLinks.other} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-black/40 hover:bg-findom-purple/70 transition-colors p-3 rounded-full"
              aria-label="Other link"
            >
              <ExternalLink className="w-6 h-6 text-white" />
            </a>
          )}
        </div>
      </div>
      
      {/* Categories and Type */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-white/70 mb-2 font-medium">Categories:</p>
            <div className="flex flex-wrap gap-2">
              {creator.categories.map((category) => (
                <Link key={category} to={`/${category.toLowerCase()}`}>
                  <Badge className="bg-black/60 hover:bg-findom-purple/20 text-white border-white/10 transition-colors">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/70 mb-2 font-medium">Type:</p>
            <Badge className="bg-black/60 text-white border-white/10">
              {creator.type}
            </Badge>
          </div>
        </div>
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
