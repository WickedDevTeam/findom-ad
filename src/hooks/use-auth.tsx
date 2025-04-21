
import { useContext, useCallback } from 'react';
import { AuthContext } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

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

  return {
    ...authContext,
    requireAuth,
  };
}
