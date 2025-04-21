
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
}

export function useProfile() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch user profile
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
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.toast({
        title: 'Error',
        description: 'Failed to load profile info',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // Fetch interest categories
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, emoji')
        .order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      toast.toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  // Upload avatar
  const uploadAvatar = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  // Avatar change handler
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validate image types
      if (!file.type.startsWith('image/')) {
        toast.toast({
          title: 'Invalid file',
          description: 'Please upload an image file',
          variant: 'destructive',
        });
        return;
      }
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    } else {
      // If clearing the avatar
      setAvatarFile(null);
      setAvatarUrl(null);
    }
  };

  // Save profile to supabase
  const handleSave = async () => {
    setLoading(true);
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
        setLoading(false);
        navigate('/');
        return;
      }

      const userId = session.user.id;

      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        finalAvatarUrl = await uploadAvatar(avatarFile);
        setAvatarUrl(finalAvatarUrl); // Immediately show after upload
      }

      const updates = {
        id: userId,
        display_name: displayName.trim(),
        username,
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
      setLoading(false);
    }
  };

  // Toggle interest
  const toggleInterest = (categoryId: string) => {
    setInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return {
    displayName, setDisplayName,
    username, setUsername,
    email,
    bio, setBio,
    avatarUrl, avatarFile, onAvatarChange,
    loading, initialLoading,
    handleSave,
    categories, interests,
    toggleInterest,
  };
}
