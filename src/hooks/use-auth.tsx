
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/components/auth/AuthProvider';

export function useAuth() {
  const { user, session, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [authError, setAuthError] = useState<string | null>(null);

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

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  const requireAuth = (callback?: () => void) => {
    if (!loading && !user) {
      toast.toast({
        title: 'Authentication required',
        description: 'You must be logged in to access this page',
        variant: 'destructive',
      });
      navigate('/signin');
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
    authError,
    signOut,
    signIn,
    signUp,
    requireAuth,
    isAuthenticated: !!user,
  };
}
