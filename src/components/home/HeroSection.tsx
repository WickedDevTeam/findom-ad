
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="py-12 flex flex-col md:flex-row gap-12">
      <div className="flex-1 space-y-6 my-0 py-[7px]">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Chat With Top Rated<br />
            Findom Creators
          </h1>
          <p className="text-lg text-white/70">
            Build your own directory with this Framer template
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link to="/create-listing" className="flex items-center">
              Create Listing <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link to="/notifications" className="flex items-center">
              Get Notified <Mail className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="promo-card p-6 bg-black/30 border border-white/10 rounded-xl">
          <div className="mb-4">
            <Badge className="bg-findom-green text-white font-semibold px-4 py-1">
              Free $100 Ad Credit
            </Badge>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Need a New Finsub Right NOW?</h2>
          
          <p className="text-white/70 mb-6">
            Promote your services on Findom.ad this week and get a free $100 in credits while building your stable of loyal ATMs and Betas (We'll even let you take them home...)
          </p>
          
          <Button variant="outline" className="bg-white/10 hover:bg-white/20" asChild>
            <Link to="/learn-more" className="flex items-center">
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
