
import React from 'react';
import { useParams } from 'react-router-dom';
import { getCreatorsByCategory } from '@/data/creators';
import CreatorGrid from '@/components/creators/CreatorGrid';
import { Badge } from '@/components/ui/badge';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';
  const creators = category ? getCreatorsByCategory(categoryName) : [];
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col space-y-4">
        <Badge className="w-fit bg-findom-purple text-white">{categoryName}</Badge>
        <h1 className="text-4xl font-bold">{categoryName} Creators</h1>
        <p className="text-white/70">
          Browse our collection of {creators.length} {categoryName.toLowerCase()} creators.
        </p>
      </div>
      
      <CreatorGrid 
        creators={creators} 
        title={creators.length > 0 ? `${categoryName} Creators` : 'No creators found'} 
      />
    </div>
  );
};

export default CategoryPage;
