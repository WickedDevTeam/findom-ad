
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

import ProfileAvatarUpload from '@/components/profile/ProfileAvatarUpload';
import ProfileDetailsForm from '@/components/profile/ProfileDetailsForm';
import ProfileInterestsSelector from '@/components/profile/ProfileInterestsSelector';

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
}

const ProfilePage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch authenticated user
  const fetchUserProfile = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      toast.toast({
        title: 'Not logged in',
        description: 'You must be logged in to edit your profile',
        variant: 'destructive',
      });
      return;
    }

    const userId = session.user.id;
    setLoading(true);
    try {
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
        // Ensure interests are string[], converting if necessary
        if (data.interests && Array.isArray(data.interests)) {
          setInterests(data.interests.map((item: any) => String(item)));
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
    }
    setLoading(false);
  };

  // Fetch all categories for interests selection
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('id, name, slug, emoji').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchCategories();
  }, []);

  // Upload avatar image to storage and return public URL
  const uploadAvatar = async (file: File) => {
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
  };

  // Handle avatar file input changes
  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  // Save profile updates
  const handleSave = async () => {
    setLoading(true);
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
      return;
    }
    const userId = session.user.id;

    try {
      let finalAvatarUrl = avatarUrl;
      if (avatarFile) {
        finalAvatarUrl = await uploadAvatar(avatarFile);
      }
      const updates = {
        id: userId,
        display_name: displayName,
        username,
        bio,
        avatar_url: finalAvatarUrl,
        interests: interests,
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
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  // Toggle interest selection
  const toggleInterest = (categoryId: string) => {
    if (interests.includes(categoryId)) {
      setInterests(interests.filter((id) => id !== categoryId));
    } else {
      setInterests([...interests, categoryId]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-sidebar-dark rounded-md mt-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      <div className="space-y-6">
        <ProfileAvatarUpload avatarUrl={avatarUrl} onAvatarChange={onAvatarChange} />

        <ProfileDetailsForm
          displayName={displayName}
          setDisplayName={setDisplayName}
          username={username}
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
