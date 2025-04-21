
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useProfileAvatar } from './useProfileAvatar';
import { useProfileValidation } from './useProfileValidation';
import { useProfileInterests } from './useProfileInterests';

export function useProfile() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Composite hooks
  const { avatarUrl, setAvatarUrl, avatarFile, onAvatarChange, uploadAvatar, uploadLoading } = useProfileAvatar();
  const { errors, validateProfile, setErrors } = useProfileValidation();
  const { interests, setInterests, categories, categoriesLoading, toggleInterest } = useProfileInterests();

  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          toast.toast({
            title: 'Not logged in',
            description: 'You must be logged in to edit your profile',
            variant: 'destructive',
          });
          navigate('/');
          return;
        }

        const userId = session.user.id;
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, username, email, bio, avatar_url, interests')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setDisplayName(data.display_name ?? '');
          setUsername(data.username ?? '');
          setEmail(session.user.email ?? '');
          setBio(data.bio ?? '');
          setAvatarUrl(data.avatar_url);

          // interests: ensure array of strings
          if (data.interests && Array.isArray(data.interests)) {
            setInterests((data.interests as any[]).map(String));
          } else {
            setInterests([]);
          }
        } else {
          setDisplayName('');
          setUsername('');
          setEmail(session.user.email ?? '');
          setBio('');
          setAvatarUrl(null);
          setInterests([]);
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        toast.toast({
          title: 'Error',
          description: err.message || 'Failed to load profile info',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, setAvatarUrl, setInterests, toast]);

  // Save profile to supabase
  const handleSave = async () => {
    // Clear previous errors
    setErrors({});
    
    // Validate profile data
    const isValid = validateProfile(displayName, username, bio);
    if (!isValid) {
      // Validation failed, the errors are already set in the errors state
      toast.toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    setSavingProfile(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.toast({
          title: 'Not logged in',
          description: 'You must be logged in to update your profile',
          variant: 'destructive',
        });
        setSavingProfile(false);
        navigate('/');
        return;
      }

      const userId = session.user.id;

      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        try {
          finalAvatarUrl = await uploadAvatar(avatarFile);
          setAvatarUrl(finalAvatarUrl); // Immediately show after upload
        } catch (error: any) {
          toast.toast({
            title: 'Avatar Upload Failed',
            description: error.message || 'Failed to upload avatar',
            variant: 'destructive',
          });
          // Continue with profile update even if avatar upload fails
        }
      }

      const updates = {
        id: userId,
        display_name: displayName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatar_url: finalAvatarUrl,
        interests,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) throw error;

      toast.toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return {
    // Profile data
    displayName, setDisplayName,
    username, setUsername,
    email,
    bio, setBio,
    
    // Avatar
    avatarUrl, onAvatarChange,
    
    // Loading states
    loading, initialLoading, savingProfile,
    
    // Interests
    categories, interests, toggleInterest, categoriesLoading,
    
    // Actions
    handleSave,
    
    // Validation
    errors,
  };
}
