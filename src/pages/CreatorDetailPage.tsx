
import React, { useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getCreatorByUsername, creators } from '@/data/creators';
import CreatorDetailHero from '@/components/creators/CreatorDetailHero';
import CreatorGallery from '@/components/creators/CreatorGallery';
import SimilarCreators from '@/components/creators/SimilarCreators';

const CreatorDetailPage = () => {
  const { username } = useParams<{ username: string }>();
  
  // Memoize creator lookup to minimize expensive operations on re-renders
  const creator = React.useMemo(() => 
    username ? getCreatorByUsername(username) : undefined
  , [username]);
  
  // Scroll to top when the page loads - optimized with useCallback
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto' // Using 'auto' instead of 'smooth' for better performance
    });
  }, []);
  
  useEffect(() => {
    scrollToTop();
    
    // Add preloaded title for better SEO and UX
    if (creator) {
      document.title = `${creator.name} (@${creator.username}) | Findom.ad`;
    }
    
    // Cleanup function to reset title
    return () => {
      document.title = 'Findom.ad - Financial Domination Directory';
    };
  }, [creator, scrollToTop]);
  
  if (!creator) {
    return <Navigate to="/not-found" />;
  }
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <CreatorDetailHero creator={creator} />
      
      {creator.gallery && creator.gallery.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Gallery</h2>
          <CreatorGallery images={creator.gallery} />
        </div>
      )}
      
      <SimilarCreators currentCreator={creator} allCreators={creators} />
    </div>
  );
};

export default CreatorDetailPage;
