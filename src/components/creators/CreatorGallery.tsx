
import React, { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

interface CreatorGalleryProps {
  images: string[];
}

const CreatorGallery = ({ images }: CreatorGalleryProps) => {
  // If there are no images, render nothing
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main gallery grid display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ImageTile
            key={index}
            image={image}
            index={index}
          />
        ))}
      </div>
      
      {/* Carousel for smaller screens or alternative view */}
      {images.length > 1 && (
        <div className="mt-8 md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/30">
                      <AspectRatio ratio={1/1}>
                        <CarouselImageItem image={image} index={index} />
                      </AspectRatio>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 z-10 bg-black/80 text-white hover:bg-black border-white/20" />
            <CarouselNext className="right-2 z-10 bg-black/80 text-white hover:bg-black border-white/20" />
          </Carousel>
        </div>
      )}
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
  const [isHovered, setIsHovered] = useState(false);

  // If the src is broken or empty, do not render the image
  if (!image || imageError) {
    return null;
  }

  return (
    <div 
      className="aspect-square rounded-xl overflow-hidden bg-black/30 border border-white/10 relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={image}
        alt={`Gallery image ${index + 1}`} 
        className={`w-full h-full object-cover transition-all duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${isHovered ? 'scale-105' : 'scale-100'}`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Optional hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium">
          Image {index + 1}
        </div>
      </div>
    </div>
  );
};

const CarouselImageItem = ({ image, index }: ImageTileProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!image || imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/50 text-white/50">
        Image unavailable
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <img 
        src={image}
        alt={`Gallery image ${index + 1}`} 
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-4 border-findom-purple/30 border-t-findom-purple rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Caption overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
        <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-medium">
          Image {index + 1}
        </div>
      </div>
    </div>
  );
};

export default CreatorGallery;
