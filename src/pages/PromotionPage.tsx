
import React from 'react';
import { promotionPackages } from '@/data/promotions';
import PromotionCard from '@/components/promotion/PromotionCard';

const PromotionPage = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Advertise with us</h1>
        <p className="text-xl text-white/70">
          Get more visibility for your tools with Findom.ad
        </p>
      </div>
      
      <div className="space-y-6">
        <p className="text-white/80">
          Below are our current offerings to advertise and get ahead of your
          competition with Findom.ad:
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promotionPackages.map((promo, index) => (
            <PromotionCard 
              key={promo.id} 
              promo={promo} 
              variant={index === 0 ? 'featured' : 'default'} 
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-6 pt-8">
        <h2 className="text-2xl font-bold text-white">Ready to Advertise?</h2>
        <p className="text-white/80">
          Increase your visibility and drive more traffic to your product with Findom.ad's
          advertising options. If you're interested in a Featured Listing or becoming a
          Primary Sponsor, contact us to get started or to request more information.
        </p>
      </div>
      
      <div className="text-center mt-8 text-white/50 text-sm">
        <p>Most tools mentioned are fictitious and are for representation purpose only.</p>
        <p>Any similarity to existing tools is coincidence. Images via Unsplash and icons are via Logofa.at</p>
      </div>
    </div>
  );
};

export default PromotionPage;
