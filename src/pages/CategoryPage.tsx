
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCreatorsByCategory } from '@/data/creators';
import CreatorGrid from '@/components/creators/CreatorGrid';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Creator } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Emoji mapping for categories
const categoryEmojis: Record<string, string> = {
  'findoms': '👑',
  'catfish': '🐟',
  'ai-bots': '🤖',
  'celebrities': '🌟',
  'twitter': '🐦',
  'blackmail': '💸',
  'pay-pigs': '🐷',
  'bots': '⚡️',
};

// Description mapping for categories
const categoryDescriptions: Record<string, string> = {
  'findoms': 'Financial dominators who control your wallet and spending.',
  'catfish': 'Creators who pose as someone else for your entertainment.',
  'ai-bots': 'AI-powered companions available 24/7 for your needs.',
  'celebrities': 'Creators who impersonate your favorite stars and icons.',
  'twitter': 'The best creators from Twitter (X) platform.',
  'blackmail': 'Engage in fantasy blackmail scenarios with these professionals.',
  'pay-pigs': 'For those who love to spoil and spend on their favorites.',
  'bots': 'Automated companions for various purposes.',
};

// Formatted display names for categories
const categoryDisplayNames: Record<string, string> = {
  'findoms': 'Findoms',
  'catfish': 'Catfish',
  'ai-bots': 'AI Bots',
  'celebrities': 'Celebrities',
  'twitter': 'Twitter',
  'blackmail': 'Blackmail', 
  'pay-pigs': 'Pay Pigs',
  'bots': 'Bots',
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [loading, setLoading] = useState(true);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  
  useEffect(() => {
    console.log('CategoryPage mounted with category param:', category);
    
    if (!category) {
      console.error('No category parameter found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setCategorySlug(category);
    
    // Get the display name from our mapping or generate it from the slug
    const displayName = categoryDisplayNames[category] || 
      category.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    console.log('Setting category name to:', displayName);
    setCategoryName(displayName);
    
    // Get creators for this category
    console.log(`Getting creators for category: ${displayName} (slug: ${category})`);
    const filteredCreators = getCreatorsByCategory(category);
    console.log(`Found ${filteredCreators.length} creators for ${category}`);
    setCreators(filteredCreators);
    setLoading(false);
  }, [category]);
  
  // Return loading state if still loading
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Make sure we have a valid category
  if (!category || !categorySlug) {
    console.error('Category is undefined or empty after processing');
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-findom-orange mb-4" />
        <h1 className="text-2xl font-bold">Category Not Found</h1>
        <p className="text-white/70 mt-2">
          The category you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  
  // Get emoji and description for the current category
  const emoji = categoryEmojis[categorySlug] || '✨';
  const description = categoryDescriptions[categorySlug] || `Browse all creators in the ${categoryName} category.`;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section - Always show this regardless of creator count */}
      <div className="bg-black/30 rounded-xl border border-white/10 p-6 md:p-8">
        <div className="flex flex-col space-y-4">
          <Badge className="w-fit bg-findom-purple text-white">
            {emoji} {categoryName}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold">{categoryName} Creators</h1>
          <p className="text-white/70 max-w-2xl">
            {description}
          </p>
          
          {/* Call to action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link to="/create-listing">Become a Creator</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/notifications">Get Notified</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Creator Grid or Empty State */}
      {creators.length > 0 ? (
        <CreatorGrid 
          creators={creators} 
          title={`${creators.length} ${categoryName} Creator${creators.length !== 1 ? 's' : ''}`} 
        />
      ) : (
        <div className="text-center py-12 bg-black/20 rounded-xl border border-white/10 p-6">
          <AlertCircle className="w-12 h-12 mx-auto text-findom-orange mb-4" />
          <h2 className="text-xl font-bold">No Creators Found</h2>
          <p className="text-white/70 mt-2 max-w-md mx-auto">
            There are currently no creators in the {categoryName} category.
            Check back soon or be the first to create a listing!
          </p>
          <Button className="mt-6" asChild>
            <Link to="/create-listing">Create Listing</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
