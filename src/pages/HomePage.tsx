
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import CreatorGrid from '@/components/creators/CreatorGrid';
import NewsletterSection from '@/components/home/NewsletterSection';
import FeaturedCreators from '@/components/creators/FeaturedCreators';
import CreatorSearch from '@/components/creators/CreatorSearch';
import { creators, getFeaturedCreators, getNewCreators } from '@/data/creators';
import { useState } from 'react';

const HomePage = () => {
  const featuredCreators = getFeaturedCreators();
  const newCreators = getNewCreators();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || creator.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-12">
      <HeroSection />
      
      {featuredCreators.length > 0 && (
        <FeaturedCreators creators={featuredCreators} />
      )}
      
      <div className="space-y-8">
        <CreatorSearch 
          onSearch={setSearchQuery}
          onFilterChange={setActiveFilter}
          selectedFilter={activeFilter}
        />
        
        {newCreators.length > 0 && (
          <CreatorGrid creators={newCreators} title="New Arrivals" />
        )}
        
        <CreatorGrid 
          creators={filteredCreators} 
          title={searchQuery || activeFilter !== 'All' ? 'Search Results:' : 'All Creators:'} 
        />
      </div>
      
      <NewsletterSection />
    </div>
  );
};

export default HomePage;
