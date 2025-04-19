
import React from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/types';
import { Badge } from '@/components/ui/badge';

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  return (
    <Link to={`/creator/${creator.username}`} className="block">
      <div className="listing-card group">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={creator.profileImage} 
            alt={creator.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {creator.isFeatured && (
              <Badge className="badge-featured">Featured</Badge>
            )}
            {creator.isNew && (
              <Badge className="badge-new">New</Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white">{creator.name}</h3>
          <p className="text-sm text-white/70">{creator.username}</p>
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
