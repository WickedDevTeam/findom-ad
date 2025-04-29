
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
    // If loading, do not redirect yet
    if (authContext.loading) {
      return true;
    }

    // If there's an auth context error, display it
    if (authContext.error) {
      toast.toast({
        title: 'Authentication Error',
        description: authContext.error,
        variant: 'destructive',
      });
      return false;
    }

    // If user is not logged in, redirect to signin
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
  }, [authContext.loading, authContext.user, authContext.error, navigate, toast]);

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    try {
      // Show loading indicator via toast
      const loadingToast = toast.toast({
        title: 'Signing in...',
        description: 'Please wait',
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast.id);

      if (error) {
        setAuthError(error.message);
        toast.toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }

      toast.toast({
        title: 'Signed in successfully',
        description: 'Welcome back!',
      });

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
      // Show loading indicator via toast
      const loadingToast = toast.toast({
        title: 'Creating account...',
        description: 'Please wait',
      });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { 
          data: userData
        }
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast.id);

      if (error) {
        setAuthError(error.message);
        toast.toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }

      toast.toast({
        title: 'Account created successfully',
        description: 'Welcome to Findom Directory!',
      });

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
      
      toast.toast({
        title: 'Signed out successfully',
        description: 'You have been logged out',
      });
      
      navigate('/');
      return true;
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      
      toast.toast({
        title: 'Sign out failed',
        description: error.message || 'Failed to sign out',
        variant: 'destructive',
      });
      
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
