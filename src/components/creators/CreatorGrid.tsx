
import React from 'react';
import CreatorCard from './CreatorCard';
import { Creator } from '@/types';

interface CreatorGridProps {
  creators: Creator[];
  title?: string;
}

const CreatorGrid = ({
  creators,
  title
}: CreatorGridProps) => {
  if (creators.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {title && <h2 className="text-xl font-bold text-white mb-2">{title}</h2>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        {creators.map(creator => <CreatorCard key={creator.id} creator={creator} />)}
      </div>
    </div>
  );
};

export default CreatorGrid;
