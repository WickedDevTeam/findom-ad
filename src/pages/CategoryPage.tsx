
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
    // Simulate loading for smoother transitions
    setLoading(true);
    
    setTimeout(() => {
      if (category) {
        // Format category name properly (first letter uppercase, rest lowercase)
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        setCategoryName(formattedCategory);
        
        // Get creators for this category
        const filteredCreators = getCreatorsByCategory(formattedCategory);
        setCreators(filteredCreators);
      }
      setLoading(false);
    }, 300);
  }, [category]);
  
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-findom-orange mb-4" />
        <h1 className="text-2xl font-bold">Category Not Found</h1>
        <p className="text-white/70 mt-2">The category you're looking for doesn't exist.</p>
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
      
      {creators.length > 0 ? (
        <CreatorGrid 
          creators={creators} 
          title={`${categoryName} Creators`} 
        />
      ) : (
        <div className="bg-black/20 border border-white/10 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-findom-orange mb-4" />
          <h3 className="text-xl font-medium">No creators found</h3>
          <p className="text-white/70 mt-2">
            There are no creators in the {categoryName} category yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
