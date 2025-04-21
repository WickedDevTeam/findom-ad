import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Creator } from '@/types';
import AppBadge from '@/components/shared/AppBadge';
import { Tag } from 'lucide-react';

// Young influencer/model placeholder rotation
const getProfilePlaceholder = (idx: number) => {
  const imgs = [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=facearea&facepad=3', // young woman
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=facearea&facepad=3', // young woman
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=facearea&facepad=3', // young woman
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=400&fit=facearea&facepad=3', // young woman
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=facearea&facepad=3', // young woman
  ];
  return imgs[idx % imgs.length];
};

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const [imageError, setImageError] = useState(false);

  const imageSrc =
    !creator.profileImage || imageError
      ? getProfilePlaceholder(Number(creator.id.replace(/\D/g, "")) || 0)
      : creator.profileImage;

  const mainCategory = creator.categories[0] || "Other";

  return (
    <Link
      to={`/creator/${creator.username}`}
      className="block group rounded-xl border bg-gradient-to-br from-black/60 to-black/70 shadow-md border-white/10 hover:border-findom-purple/80 transition hover:shadow-findom-purple/30 overflow-hidden focus-visible:outline-none"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-findom-gray/20">
        <img
          src={imageSrc}
          alt={creator.name}
          className="w-full h-full object-cover transition duration-200 group-hover:scale-105 bg-findom-dark"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-5 pb-4 flex flex-col gap-1.5 bg-black/50">
        <div className="flex items-baseline gap-2">
          <h3 className="text-base font-bold text-white truncate">{creator.name}</h3>
          <span className="text-xs text-white/50 truncate">@{creator.username}</span>
        </div>
        {creator.bio && (
          <div className="text-sm text-white/70 line-clamp-2">{creator.bio}</div>
        )}
        <div className="flex gap-2 mt-2 flex-wrap">
          <AppBadge
            variant="type"
            className="text-xs py-0.5 px-2"
            icon={<Tag size={12} className="mr-1 opacity-70" />}
          >
            {creator.type}
          </AppBadge>
          {mainCategory && (
            <AppBadge
              variant="category"
              className="text-xs py-0.5 px-2"
              icon={<Tag size={12} className="mr-1 opacity-70" />}
            >
              {mainCategory}
            </AppBadge>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CreatorCard;
