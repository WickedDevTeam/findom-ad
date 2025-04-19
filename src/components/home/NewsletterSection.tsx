
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate subscription
    toast.success('Subscribed successfully!', {
      description: 'You will receive updates about new tools and promotions.'
    });
    
    setEmail('');
  };
  
  return (
    <div className="py-12 md:py-16">
      <div className="relative rounded-xl overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1500673922987-e212871fec22"
          alt="Community" 
          className="w-full h-64 object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 backdrop-blur-sm p-8 flex flex-col justify-end">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Join our community!</h2>
            <p className="text-white/80 mb-6">Sign up to get updates on the latest tools every week!</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8 text-white/50 text-sm">
        <p>Most tools mentioned are fictitious and are for representation purpose only.</p>
      </div>
    </div>
  );
};

export default NewsletterSection;
