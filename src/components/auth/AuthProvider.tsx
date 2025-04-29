
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        try {
          if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
          } else if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
          }
          setLoading(false);
          setError(null);
        } catch (err: any) {
          setError(err.message || 'Authentication state change error');
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession }, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
        toast({
          title: 'Authentication Error',
          description: 'There was a problem checking your login status',
          variant: 'destructive',
        });
      }
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const value = {
    session,
    user,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
