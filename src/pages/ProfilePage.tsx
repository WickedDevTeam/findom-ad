
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import ProfileAvatarUpload from '@/components/profile/ProfileAvatarUpload';
import ProfileDetailsForm from '@/components/profile/ProfileDetailsForm';
import ProfileInterestsSelector from '@/components/profile/ProfileInterestsSelector';
import { Loader } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
}

const ProfilePage = () => {
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

  // Fetch authenticated user
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

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setDisplayName(data.display_name ?? '');
        setUsername(data.username ?? '');
        setEmail(session.user.email ?? '');
        setBio(data.bio ?? '');
        setAvatarUrl(data.avatar_url);
        
        // Properly handle interests array - ensure it's an array of strings
        if (data.interests && Array.isArray(data.interests)) {
          // Convert all elements to strings
          setInterests(
            (data.interests as any[]).map(item => String(item))
          );
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

  // Fetch all categories for interests selection
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
  }, []);

  // Upload avatar image to storage and return public URL
  const uploadAvatar = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  // Handle avatar file input changes
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Simple validation for image files
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
    }
  };

  // Save profile updates
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
      
      if (error) {
        throw error;
      }
      
      toast.toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
      
      // Correctly invalidate the profile query
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

  // Toggle interest selection
  const toggleInterest = (categoryId: string) => {
    if (interests.includes(categoryId)) {
      setInterests(interests.filter((id) => id !== categoryId));
    } else {
      setInterests([...interests, categoryId]);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader className="w-8 h-8 animate-spin text-findom-purple" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-sidebar-dark rounded-md mt-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      <div className="space-y-6">
        <ProfileAvatarUpload avatarUrl={avatarUrl} onAvatarChange={onAvatarChange} />

        <ProfileDetailsForm
          displayName={displayName}
          setDisplayName={setDisplayName}
          username={username}
          setUsername={setUsername}
          email={email}
          bio={bio}
          setBio={setBio}
          loading={loading}
        />

        <ProfileInterestsSelector
          categories={categories}
          interests={interests}
          toggleInterest={toggleInterest}
        />

        <div>
          <Button onClick={handleSave} disabled={loading} size="lg" className="w-full md:w-auto">
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
