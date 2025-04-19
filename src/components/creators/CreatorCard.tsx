
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ImageOff } from 'lucide-react';

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

  return (
    <Link to={`/creator/${creator.username}`} className="block">
      <div className="listing-card group bg-black/30 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-findom-purple/20 hover:border-findom-purple/30">
        <div className="relative aspect-square overflow-hidden">
          {imageError ? (
            <div className="w-full h-full bg-black/50 flex items-center justify-center">
              <img 
                src={fallbackImage}
                alt={creator.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <img 
              src={creator.profileImage} 
              alt={creator.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            {creator.isFeatured && (
              <Badge className="bg-findom-purple text-white border-0">Featured</Badge>
            )}
            {creator.isNew && (
              <Badge className="bg-green-500 text-white border-0">New</Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white">{creator.name}</h3>
          <p className="text-sm text-white/70 mb-2">{creator.username}</p>
          <div className="flex flex-wrap gap-1">
            {creator.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline" className="text-xs bg-black/50">
                {category}
              </Badge>
            ))}
            {creator.categories.length > 2 && (
              <Badge variant="outline" className="text-xs bg-black/50">
                +{creator.categories.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
