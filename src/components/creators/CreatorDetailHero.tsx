
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Twitter, Link as LinkIcon, DollarSign, Heart } from 'lucide-react';

interface CreatorDetailHeroProps {
  creator: Creator;
}

const CreatorDetailHero = ({ creator }: CreatorDetailHeroProps) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-findom-purple">
            <img 
              src={imageError ? fallbackImage : creator.profileImage} 
              alt={creator.name} 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          {creator.isFeatured && (
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-findom-purple text-white border-0">Featured</Badge>
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-white mb-2">{creator.name}</h1>
          <p className="text-lg text-white/70 mb-4">{creator.username}</p>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
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
      
      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-white/70 mb-1">Categories:</p>
            <div className="flex flex-wrap gap-2">
              {creator.categories.map((category) => (
                <Link key={category} to={`/${category.toLowerCase()}`}>
                  <Badge variant="outline" className="hover:bg-findom-purple/20 transition-colors">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white/70 mb-1">Type:</p>
            <Badge variant="outline" className="bg-black/50">
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
