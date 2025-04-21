
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
}

// Fallback categories to prevent infinite loading loops
const FALLBACK_CATEGORIES: Category[] = [
  { id: 'findom', name: 'Financial Domination', slug: 'findom', emoji: '💰' },
  { id: 'catfish', name: 'Catfish', slug: 'catfish', emoji: '🐱' },
  { id: 'ai', name: 'AI Bots', slug: 'ai-bots', emoji: '🤖' },
  { id: 'celebrities', name: 'Celebrities', slug: 'celebrities', emoji: '🌟' },
  { id: 'blackmail', name: 'Blackmail', slug: 'blackmail', emoji: '📝' },
  { id: 'paypigs', name: 'Pay Pigs', slug: 'pay-pigs', emoji: '🐷' }
];

export function useProfileInterests() {
  const toast = useToast();
  const [interests, setInterests] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch interest categories with useCallback to prevent recreation on each render
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setError(false);
      
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, emoji')
        .order('name');
        
      if (error) throw error;
      
      // If data exists and is not empty, use it
      if (data && data.length > 0) {
        setCategories(data);
      } else {
        // Use fallback categories if no data is returned
        console.log("No categories found, using fallback data");
        setCategories(FALLBACK_CATEGORIES);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(true);
      
      // Use fallback categories to prevent UI from breaking
      setCategories(FALLBACK_CATEGORIES);
      
      // Show toast only on first error
      if (retryCount === 0) {
        toast.toast({
          title: 'Error',
          description: 'Failed to load categories, using default categories instead',
          variant: 'destructive',
        });
      }
    } finally {
      setCategoriesLoading(false);
    }
  }, [toast, retryCount]);

  // Allow manual retry
  const retryFetchCategories = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  // Use memoized fetchCategories function in useEffect with retry count dependency
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, retryCount]);

  // Toggle interest with useCallback
  const toggleInterest = useCallback((categoryId: string) => {
    setInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  return {
    interests,
    setInterests,
    categories,
    categoriesLoading,
    toggleInterest,
    error,
    retryFetchCategories
  };
}
