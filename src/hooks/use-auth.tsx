
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.toast({
        title: 'Logged out successfully',
        description: 'You have been logged out of your account',
      });
    } catch (error: any) {
      toast.toast({
        title: 'Error logging out',
        description: error.message || 'There was a problem logging out',
        variant: 'destructive',
      });
    }
  };

  const requireAuth = (callback?: () => void) => {
    if (!loading && !user) {
      toast.toast({
        title: 'Authentication required',
        description: 'You must be logged in to access this page',
        variant: 'destructive',
      });
      navigate('/');
      return false;
    }
    if (callback && user) {
      callback();
    }
    return true;
  };

  return {
    user,
    session,
    loading,
    signOut,
    requireAuth,
    isAuthenticated: !!user,
  };
}
