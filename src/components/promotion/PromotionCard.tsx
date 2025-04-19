
import React from 'react';
import { PromotionPackage } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PromotionCardProps {
  promo: PromotionPackage;
  variant?: 'default' | 'featured';
}

const PromotionCard = ({ promo, variant = 'default' }: PromotionCardProps) => {
  const isDefault = variant === 'default';
  
  return (
    <div className={`${isDefault ? 'bg-black/30' : 'bg-black/20 border-findom-orange/30'} backdrop-blur-sm border border-white/10 rounded-lg p-6 relative overflow-hidden`}>
      {promo.limited && (
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="text-xs">
            Limited to {promo.remaining} only
          </Badge>
        </div>
      )}
      
      <h3 className={`text-xl ${isDefault ? '' : 'text-findom-orange'} font-bold mb-4`}>
        {promo.title}
      </h3>
      
      <p className="text-white/70 mb-6">
        {promo.description}
      </p>
      
      <div className="flex items-end justify-between mt-auto">
        <div>
          <p className="text-2xl font-bold">${promo.price.toFixed(2)} USD</p>
          <p className="text-sm text-white/50">per {promo.duration}</p>
        </div>
        
        <Button 
          variant={isDefault ? "outline" : "default"} 
          className={isDefault ? "" : "bg-findom-orange hover:bg-findom-orange/90"}
        >
          Enquire <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromotionCard;
