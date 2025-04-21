
import React, { useState } from 'react';

// All instagram model style placeholders (horizontal/gallery size)
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
 * Horizontal infinite carousel, snappy and with modern slideshow UI.
 */
const CreatorGallery = ({ images }: CreatorGalleryProps) => {
  // For gallery, always at least 5 actual (or placeholder) model images
  const imageCount = images && images.length ? images.length : 0;
  const allImages = imageCount > 0
    ? images.map((img, idx) => img && img.length > 8 ? img : getRealModelPlaceholder(idx))
    : Array.from({ length: 5 }, (_, i) => getRealModelPlaceholder(i));

  const [activeIdx, setActiveIdx] = useState(0);
  const total = allImages.length;

  // Infinite carousel navigation (horizontal only)
  const prevImage = () => setActiveIdx((prev) => (prev - 1 + total) % total);
  const nextImage = () => setActiveIdx((prev) => (prev + 1) % total);

  // Keyboard navigation (left/right)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line
  }, [total]);

  // Final, modern, snappy gallery UI
  return (
    <div className="relative max-w-2xl mx-auto select-none bg-black/30 rounded-xl p-2 shadow-lg">
      <div className="flex items-center justify-center gap-1">
        {/* Prev Arrow */}
        <button
          aria-label="Previous"
          onClick={prevImage}
          className="absolute left-2 z-10 h-10 w-10 rounded-full bg-black/70 text-white/90 border border-white/20 flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-95 transition disabled:opacity-30"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        {/* Carousel track */}
        <div className="w-full flex items-center justify-center overflow-hidden h-80 relative mx-12">
          {allImages.map((img, idx) => {
            // Only show nearby images, fade others
            const dist = Math.abs(activeIdx - idx);
            let show = false;
            let z = 1;
            if (idx === activeIdx) { show = true; z = 20; }
            else if ((idx === (activeIdx + 1) % total) || (idx === (activeIdx - 1 + total) % total)) { show = true; z = 10; }
            else { show = false; z = 0; }
            return (
              <img
                key={idx}
                src={img}
                loading="eager"
                alt="Gallery"
                className={`
                  absolute top-0 left-1/2 -translate-x-1/2 w-[88%] h-80 duration-300
                  rounded-2xl object-cover border-2 border-white/10 shadow-md transition-all
                  ${idx === activeIdx
                    ? "scale-100 opacity-100 z-20"
                    : show
                      ? "scale-90 opacity-70 z-10"
                      : "scale-75 opacity-0 pointer-events-none z-0"
                  }
                `}
                style={{
                  filter: idx === activeIdx ? "brightness(1)" : "brightness(0.72)",
                  transition: "all 0.333s cubic-bezier(.63,.21,.27,1.01)",
                }}
                onClick={() => setActiveIdx(idx)}
              />
            );
          })}
        </div>
        {/* Next Arrow */}
        <button
          aria-label="Next"
          onClick={nextImage}
          className="absolute right-2 z-10 h-10 w-10 rounded-full bg-black/70 text-white/90 border border-white/20 flex items-center justify-center hover:bg-black/90 hover:scale-110 active:scale-95 transition disabled:opacity-30"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      {/* Dots indicator */}
      <div className="flex gap-2 justify-center mt-6 mb-2">
        {allImages.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition border-[1.5px] ${idx === activeIdx ?
              "bg-pink-400 border-pink-300 shadow" :
              "bg-white/10 border-white/20 hover:bg-pink-400/40"}`
            }
            onClick={() => setActiveIdx(idx)}
            tabIndex={-1}
            aria-label={`Go to image ${idx + 1}`}
            style={{ transition: 'all 0.18s' }}
          />
        ))}
      </div>
    </div>
  );
};

export default CreatorGallery;
