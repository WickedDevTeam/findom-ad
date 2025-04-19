
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CreatorGrid from '@/components/creators/CreatorGrid';
import NewsletterSection from '@/components/home/NewsletterSection';
import { creators, getFeaturedCreators, getNewCreators } from '@/data/creators';

const HomePage = () => {
  const featuredCreators = getFeaturedCreators();
  const newCreators = getNewCreators();
  
  return (
    <div className="space-y-16">
      <HeroSection />
      
      <div className="space-y-16">
        {featuredCreators.length > 0 && (
          <CreatorGrid creators={featuredCreators} title="Featured Creators" />
        )}
        
        {newCreators.length > 0 && (
          <CreatorGrid creators={newCreators} title="New Arrivals" />
        )}
        
        <CreatorGrid creators={creators} title="All Creators:" />
      </div>
      
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
