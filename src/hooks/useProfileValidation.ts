
import { useState, useCallback } from 'react';

export function useProfileValidation() {
  const [errors, setErrors] = useState<{
    displayName?: string;
    username?: string;
    bio?: string;
  }>({});

  // Memoize validation function to prevent recreation on each render
  const validateProfile = useCallback(
    (displayName: string, username: string, bio: string): boolean => {
      const newErrors: {
        displayName?: string;
        username?: string;
        bio?: string;
      } = {};

      // Validate display name
      if (!displayName.trim()) {
        newErrors.displayName = 'Display name is required';
      } else if (displayName.trim().length < 2) {
        newErrors.displayName = 'Display name must be at least 2 characters';
      } else if (displayName.trim().length > 50) {
        newErrors.displayName = 'Display name must be less than 50 characters';
      }

      // Validate username
      if (!username.trim()) {
        newErrors.username = 'Username is required';
      } else if (username.trim().length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (username.trim().length > 30) {
        newErrors.username = 'Username must be less than 30 characters';
      } else if (!/^[a-z0-9_]+$/.test(username)) {
        newErrors.username = 'Username can only contain lowercase letters, numbers, and underscores';
      }

      // Validate bio (optional but with max length)
      if (bio.length > 500) {
        newErrors.bio = 'Bio must be less than 500 characters';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    []
  );

  return {
    errors,
    validateProfile,
    setErrors,
  };
}
