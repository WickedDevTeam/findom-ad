
import React, { useMemo } from 'react';
import { Creator } from '@/types';
import CreatorCard from './CreatorCard';

interface SimilarCreatorsProps {
  currentCreator: Creator;
  allCreators: Creator[];
}

const SimilarCreators = React.memo(({
  currentCreator,
  allCreators
}: SimilarCreatorsProps) => {
  // Memoize similar creators calculation to avoid recalculating on each render
  const similarCreators = useMemo(() => {
    return allCreators
      .filter(creator => creator.id !== currentCreator.id)
      .filter(creator => creator.categories.some(category => 
        currentCreator.categories.includes(category)))
      .slice(0, 3); // Show at most 3 similar creators
  }, [currentCreator.id, currentCreator.categories, allCreators]);

  if (similarCreators.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-white">You May Also Like:</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
        {similarCreators.map(creator => <CreatorCard key={creator.id} creator={creator} />)}
      </div>
    </div>
  );
});

SimilarCreators.displayName = 'SimilarCreators';

export default SimilarCreators;
