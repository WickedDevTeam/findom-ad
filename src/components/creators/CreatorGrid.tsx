
import React from 'react';
import CreatorCard from './CreatorCard';
import { Creator } from '@/types';

interface CreatorGridProps {
  creators: Creator[];
  title?: string;
}

const CreatorGrid = ({ creators, title }: CreatorGridProps) => {
  if (creators.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
};

export default CreatorGrid;
