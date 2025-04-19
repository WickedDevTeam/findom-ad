
import React from 'react';
import { Bell, Mail, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationsPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">Notifications</h1>
        <p className="text-white/70 text-lg">
          Stay updated with the latest from your favorite creators
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <Bell className="h-6 w-6 text-findom-purple" />
            <div>
              <h2 className="text-xl font-semibold text-white">Email Notifications</h2>
              <p className="text-white/70">Get updates about new creators and features</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            <Button variant="outline" className="justify-start">
              <Mail className="mr-2 h-4 w-4" />
              <span>Subscribe to newsletter</span>
            </Button>
            
            <Button variant="outline" className="justify-start">
              <Heart className="mr-2 h-4 w-4" />
              <span>Get featured creators updates</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center text-white/50 text-sm">
        <p>You can unsubscribe from notifications at any time.</p>
      </div>
    </div>
  );
};

export default NotificationsPage;
