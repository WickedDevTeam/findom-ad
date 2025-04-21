
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getCreatorByUsername, creators } from '@/data/creators';
import CreatorDetailHero from '@/components/creators/CreatorDetailHero';
import CreatorGallery from '@/components/creators/CreatorGallery';
import SimilarCreators from '@/components/creators/SimilarCreators';

const CreatorDetailPage = () => {
  const { username } = useParams<{ username: string }>();
  const creator = username ? getCreatorByUsername(username) : undefined;
  
  if (!creator) {
    return <Navigate to="/not-found" />;
  }
  
  return (
    <div className="space-y-6 sm:space-y-8">
      <CreatorDetailHero creator={creator} />
      
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Bio</h2>
        <p className="text-white/80 text-base sm:text-lg">{creator.bio}</p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Gallery</h2>
        <CreatorGallery images={creator.gallery} />
      </div>
      
      <SimilarCreators currentCreator={creator} allCreators={creators} />
    </div>
  );
};

export default CreatorDetailPage;
