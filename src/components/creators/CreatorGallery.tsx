
import React, { useMemo } from 'react';
import { AnimatedGroup } from '@/components/ui/animated-group';

// Real woman/instagram model style gallery placeholders
const getRealModelPlaceholder = (idx: number) => {
  const placeholders = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1000&fit=facearea&facepad=2',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1000&fit=facearea&facepad=2',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1000&fit=facearea&facepad=2',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=1000&fit=facearea&facepad=2',
    'https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?w=1000&fit=facearea&facepad=2'
  ];
  return placeholders[idx % placeholders.length];
};

interface CreatorGalleryProps {
  images: string[];
}

/**
 * Gallery as animated grid using AnimatedGroup
 */
const CreatorGallery = React.memo(({ images }: CreatorGalleryProps) => {
  // Memoize the image processing to prevent recalculation on re-renders
  const allImages = useMemo(() => {
    const imageCount = images && images.length ? images.length : 0;
    return imageCount > 0
      ? images.map((img, idx) => img && img.length > 8 ? img : getRealModelPlaceholder(idx))
      : Array.from({ length: 5 }, (_, i) => getRealModelPlaceholder(i));
  }, [images]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AnimatedGroup
        className="grid grid-cols-2 gap-4 md:grid-cols-3 rounded-xl"
        preset="scale"
      >
        {allImages.map((img, idx) => (
          <img
            key={idx}
            src={`${img}${img.includes('?') ? '&' : '?'}w=400&h=400&fit=crop&auto=format&q=80`}
            alt={`Gallery ${idx + 1}`}
            loading="lazy"
            width={400}
            height={400}
            className="w-full aspect-square object-cover rounded-2xl border-2 border-white/10 shadow"
          />
        ))}
      </AnimatedGroup>
    </div>
  );
});

CreatorGallery.displayName = 'CreatorGallery';

export default CreatorGallery;
