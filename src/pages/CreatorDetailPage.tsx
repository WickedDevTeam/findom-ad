
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getCreatorByUsername, creators } from '@/data/creators';
import CreatorDetailHero from '@/components/creators/CreatorDetailHero';
import CreatorGallery from '@/components/creators/CreatorGallery';
import SimilarCreators from '@/components/creators/SimilarCreators';
import { Separator } from '@/components/ui/separator';

const CreatorDetailPage = () => {
  const { username } = useParams<{ username: string }>();
  const creator = username ? getCreatorByUsername(username) : undefined;
  
  if (!creator) {
    return <Navigate to="/not-found" />;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero section */}
      <CreatorDetailHero creator={creator} />
      
      <Separator className="my-12 bg-white/10" />
      
      {/* Gallery section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">Gallery</span>
          <span className="text-sm text-white/60 font-normal">
            ({creator.gallery.length} {creator.gallery.length === 1 ? 'image' : 'images'})
          </span>
        </h2>
        <CreatorGallery images={creator.gallery} />
      </section>
      
      {/* Bio section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-4">About</h2>
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-white/80 text-lg leading-relaxed">{creator.bio}</p>
        </div>
      </section>
      
      {/* Similar creators section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Similar Creators</h2>
        <SimilarCreators currentCreator={creator} allCreators={creators} />
      </section>
    </div>
  );
};

export default CreatorDetailPage;
