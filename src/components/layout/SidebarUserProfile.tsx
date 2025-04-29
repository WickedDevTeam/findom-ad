
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SidebarUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setError(null);
        
        // Fetch profile from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, display_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error
            setError(error.message);
          }
          return;
        }
        
        if (data) {
          setAvatarUrl(data.avatar_url);
          setDisplayName(data.display_name);
        }
      } catch (error: any) {
        setError(error.message || 'Failed to fetch profile');
        console.error('Error in profile fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);
  
  if (!user) return null;
  
  const userName = displayName || user.user_metadata?.name || user.user_metadata?.full_name || 'User';

  return (
    <div className="flex items-center gap-3 px-2 py-3 min-w-0">
      <Avatar className="h-10 w-10 border border-white/10">
        {loading ? (
          <AvatarFallback className="animate-pulse bg-findom-purple/40">
            <User className="h-5 w-5 opacity-70" />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src={avatarUrl || user.user_metadata?.avatar_url} alt={userName} />
            <AvatarFallback>
              <User className="h-6 w-6" />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {userName}
        </p>
        <p className="text-xs text-white/60 truncate">
          {user.email}
        </p>
        {error && (
          <p className="text-xs text-red-400 truncate hidden md:block">
            Error loading profile
          </p>
        )}
      </div>
    </div>
  );
};

export default SidebarUserProfile;
