
import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

const SidebarUserProfile = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 px-2 py-3 min-w-0">
      <Avatar className="h-10 w-10 border border-white/10">
        <AvatarImage src={user.user_metadata?.avatar_url} />
        <AvatarFallback>
          <User className="h-6 w-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {user.user_metadata?.name || 'User'}
        </p>
        <p className="text-xs text-white/60 truncate">
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
