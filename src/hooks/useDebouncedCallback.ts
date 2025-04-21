
import { useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for creating a debounced callback function
 * @param callback The function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Store the callback in a ref to avoid recreation
  const callbackRef = useRef(callback);
  
  // Update callbackRef when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Clean up timeout if component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}
