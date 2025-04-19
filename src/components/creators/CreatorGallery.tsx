
import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface CreatorGalleryProps {
  images: string[];
}

const CreatorGallery = ({ images }: CreatorGalleryProps) => {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
  ];

  const getRandomFallbackImage = () => {
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <ImageTile key={index} image={image} fallbackImage={getRandomFallbackImage()} index={index} />
      ))}
    </div>
  );
};

interface ImageTileProps {
  image: string;
  fallbackImage: string;
  index: number;
}

const ImageTile = ({ image, fallbackImage, index }: ImageTileProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="aspect-square rounded-lg overflow-hidden bg-black/30 border border-white/10">
      <img 
        src={imageError ? fallbackImage : image} 
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
