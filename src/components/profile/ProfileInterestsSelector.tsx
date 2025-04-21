
import React from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
}

interface ProfileInterestsSelectorProps {
  categories: Category[];
  interests: string[];
  toggleInterest: (categoryId: string) => void;
}

const ProfileInterestsSelector: React.FC<ProfileInterestsSelectorProps> = ({
  categories,
  interests,
  toggleInterest
}) => (
  <div>
    <Label className="block font-semibold text-white mb-1">Select Your Interests</Label>
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const selected = interests.includes(cat.id);
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggleInterest(cat.id)}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-semibold border cursor-pointer select-none transition-all',
              selected
                ? 'bg-findom-purple text-white border-findom-purple'
                : 'bg-transparent text-white/80 border-white/30 hover:bg-white/10'
            )}
            aria-pressed={selected}
          >
            {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
            {cat.name}
          </button>
        );
      })}
    </div>
  </div>
);

export default ProfileInterestsSelector;
