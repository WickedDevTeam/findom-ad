
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/components/auth/AuthProvider';

export function useAuth() {
  const { user, session, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

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
