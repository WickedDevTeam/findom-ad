
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});

const SigninPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, authError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // If user is already authenticated, redirect to home
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const { success, error } = await signIn(values.email, values.password);

      if (!success) {
        console.error('Login error:', error);
        toast.error('Login failed', {
          description: error || 'An unexpected error occurred',
        });
        setIsSubmitting(false);
        return;
      }

      toast.success('Welcome back!', {
        description: 'You have successfully signed in.',
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Login exception:', error);
      toast.error('Login failed', {
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md p-8 bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Sign in</h1>
          <p className="text-white/70">
            Welcome back to Findom.ad
          </p>
        </div>

        {authError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm text-white/60">
              Don't have an account? <Link to="/signup" className="text-findom-purple hover:underline">Create Account</Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SigninPage;
