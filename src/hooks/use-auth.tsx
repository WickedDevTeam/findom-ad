
import { useContext, useCallback, useState } from 'react';
import { AuthContext } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const [authError, setAuthError] = useState<string | null>(null);

  const requireAuth = useCallback(() => {
    if (authContext.loading) {
      // Still checking authentication status, return true to avoid redirects during loading
      return true;
    }

    if (!authContext.user) {
      console.log('User not authenticated, redirecting to signin');
      toast.toast({
        title: 'Authentication required',
        description: 'Please sign in to view this page',
        variant: 'destructive',
      });
      navigate('/signin');
      return false;
    }
    
    return true;
  }, [authContext.loading, authContext.user, navigate, toast]);

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

      return { success: true };
    } catch (error: any) {
      const message = error.message || 'An error occurred during sign in';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const signUp = async (email: string, password: string, userData: Record<string, any> = {}) => {
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: userData
        }
      });

      if (error) {
        setAuthError(error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      const message = error.message || 'An error occurred during sign up';
      setAuthError(message);
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
      return true;
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      return false;
    }
  };

  return {
    ...authContext,
    requireAuth,
    isAuthenticated: !!authContext.user,
    signIn,
    signUp,
    signOut,
    authError,
  };
}
