
import React, { memo } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

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
  loading: boolean;
}

const ProfileInterestsSelector: React.FC<ProfileInterestsSelectorProps> = memo(({
  categories,
  interests,
  toggleInterest,
  loading
}) => (
  <div>
    <Label className="block font-semibold text-white mb-1">Select Your Interests</Label>
    
    {loading ? (
      <div className="flex items-center justify-center h-16 bg-white/5 rounded-md">
        <Loader className="w-5 h-5 text-white/50 animate-spin mr-2" />
        <span className="text-white/70 text-sm">Loading categories...</span>
      </div>
    ) : categories.length === 0 ? (
      <div className="flex items-center justify-center h-16 bg-white/5 rounded-md">
        <span className="text-white/70 text-sm">No categories available</span>
      </div>
    ) : (
      <>
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((cat) => {
            const selected = interests.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleInterest(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-semibold border cursor-pointer select-none transition-all',
                  selected
                    ? 'bg-findom-purple text-white border-findom-purple shadow-sm'
                    : 'bg-transparent text-white/80 border-white/30 hover:bg-white/10'
                )}
                aria-pressed={selected}
                disabled={loading}
              >
                {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
                {cat.name}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-white/70">
          Selected: {interests.length} of {categories.length}
        </p>
      </>
    )}
  </div>
));

ProfileInterestsSelector.displayName = 'ProfileInterestsSelector';

export default ProfileInterestsSelector;
