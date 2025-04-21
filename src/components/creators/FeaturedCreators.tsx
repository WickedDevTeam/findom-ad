import React from 'react';
import { Creator } from '@/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
interface FeaturedCreatorsProps {
  creators: Creator[];
}
const getDicebearSrc = (name: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim().substring(0, 20))}&backgroundColor=transparent`;
const FeaturedCreators = ({
  creators
}: FeaturedCreatorsProps) => {
  if (creators.length === 0) return null;
  return <div className="relative overflow-hidden rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Badge variant="outline" className="mb-2 bg-findom-purple/20 text-white border-findom-purple">
            Featured
          </Badge>
          <h2 className="text-2xl font-bold text-white">Top Creators</h2>
        </div>
        <Link to="/creators" className="flex items-center text-sm text-white/70 hover:text-white transition-colors">
          View all <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-5 gap-8">
        {creators.slice(0, 3).map(creator => {
        const [imageError, setImageError] = React.useState(false);
        const imageSrc = !creator.profileImage || imageError ? getDicebearSrc(creator.name) : creator.profileImage;
        return <Link key={creator.id} to={`/creator/${creator.username}`} className="group relative aspect-square overflow-hidden rounded-lg">
              <img src={imageSrc} alt={creator.name} onError={() => setImageError(true)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-findom-dark" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{creator.name}</h3>
                <p className="text-sm text-white/70">{creator.username}</p>
              </div>
            </Link>;
      })}
      </div>
    </div>;
};
export default FeaturedCreators;