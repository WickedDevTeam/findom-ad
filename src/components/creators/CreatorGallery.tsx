
import React from 'react';

interface CreatorGalleryProps {
  images: string[];
}

const CreatorGallery = ({ images }: CreatorGalleryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <div key={index} className="aspect-square rounded-lg overflow-hidden">
          <img 
            src={image} 
            alt={`Gallery image ${index + 1}`} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      ))}
    </div>
  );
};

export default CreatorGallery;
