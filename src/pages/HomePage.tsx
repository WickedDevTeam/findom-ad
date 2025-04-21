
import React, { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import CreatorGrid from '@/components/creators/CreatorGrid';
import NewsletterSection from '@/components/home/NewsletterSection';
import FeaturedCreators from '@/components/creators/FeaturedCreators';
import CreatorSearch from '@/components/creators/CreatorSearch';
import { creators, getFeaturedCreators, getNewCreators } from '@/data/creators';
import { motion } from 'framer-motion';

const HomePage = () => {
  const featuredCreators = getFeaturedCreators();
  const newCreators = getNewCreators();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    // If search param provided (e.g., from navbar search), set it
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
    return () => clearTimeout(timer);
  }, []);
  
  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                         creator.categories.some(category => 
                           category.toLowerCase() === activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin mb-4"></div>
        <p className="text-white/70">Loading amazing creators...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      
      {featuredCreators.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <FeaturedCreators creators={featuredCreators} />
        </motion.div>
      )}
      
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <CreatorSearch 
            onSearch={setSearchQuery}
            onFilterChange={setActiveFilter}
            selectedFilter={activeFilter}
          />
        </motion.div>
        
        {newCreators.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <CreatorGrid creators={newCreators} title="New Arrivals" />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <CreatorGrid 
            creators={filteredCreators} 
            title={searchQuery || activeFilter !== 'All' ? 'Search Results:' : 'All Creators:'} 
          />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <NewsletterSection />
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
