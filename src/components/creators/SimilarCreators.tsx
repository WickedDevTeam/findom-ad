
import React from 'react';
import { Creator } from '@/types';
import CreatorCard from './CreatorCard';

interface SimilarCreatorsProps {
  currentCreator: Creator;
  allCreators: Creator[];
}

const SimilarCreators = ({ currentCreator, allCreators }: SimilarCreatorsProps) => {
  // Filter out the current creator and find similar ones based on categories
  const similarCreators = allCreators
    .filter(creator => creator.id !== currentCreator.id)
    .filter(creator => 
      creator.categories.some(category => 
        currentCreator.categories.includes(category)
      )
    )
    .slice(0, 2); // Show at most 2 similar creators

  if (similarCreators.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">You May Also Like:</h2>
      <div className="grid grid-cols-1 gap-6">
        {similarCreators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
};

export default SimilarCreators;
