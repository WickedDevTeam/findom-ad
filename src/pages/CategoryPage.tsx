
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCreatorsByCategory } from '@/data/creators';
import CreatorGrid from '@/components/creators/CreatorGrid';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Creator } from '@/types';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [categoryName, setCategoryName] = useState('');
  
  useEffect(() => {
    setLoading(true);
    
    if (category) {
      // Convert URL format to proper category name
      let formattedCategory = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      // Special handling for specific categories
      if (category === 'findoms') formattedCategory = 'Findoms';
      if (category === 'ai-bots') formattedCategory = 'AI Bots';
      if (category === 'pay-pigs') formattedCategory = 'Pay Pigs';
      
      setCategoryName(formattedCategory);
      const filteredCreators = getCreatorsByCategory(formattedCategory);
      setCreators(filteredCreators);
      setLoading(false);
    }
  }, [category]);
  
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!category || creators.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-findom-orange mb-4" />
        <h1 className="text-2xl font-bold">No Creators Found</h1>
        <p className="text-white/70 mt-2">
          {!category 
            ? "The category you're looking for doesn't exist."
            : `There are currently no creators in the ${categoryName} category.`
          }
        </p>
      </div>
    );
  }
  
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
        title={`${categoryName} Creators`} 
      />
    </div>
  );
};

export default CategoryPage;
