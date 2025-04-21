
import React, { useState } from 'react';

interface CreatorGalleryProps {
  images: string[];
}

const CreatorGallery = ({ images }: CreatorGalleryProps) => {
  // If there are no images, render nothing
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {images.map((image, index) => (
        <ImageTile
          key={index}
          image={image}
          index={index}
        />
      ))}
    </div>
  );
};

interface ImageTileProps {
  image: string;
  index: number;
}

const ImageTile = ({ image, index }: ImageTileProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If the src is broken or empty, do not render the image.
  if (!image || imageError) {
    return null;
  }

  return (
    <div className="aspect-square rounded-lg overflow-hidden bg-black/30 border border-white/10 relative">
      <img 
        src={image}
        alt={`Gallery image ${index + 1}`} 
        className={`w-full h-full object-cover hover:scale-105 transition-transform duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default CreatorGallery;
