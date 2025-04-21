
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
  slug: string;
  emoji?: string | null;
}

const ProfilePage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Local state to hold profile data
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

    // Fetch profile info from profiles table
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
        setEmail(session.user.email ?? ''); // Use auth email as source of truth
        setBio(data.bio ?? '');
        setAvatarUrl(data.avatar_url);
        
        // Fix for the first TypeScript error: handle the Json[] type correctly
        if (data.interests && Array.isArray(data.interests)) {
          // Convert any non-string values to strings to ensure string[] type
          const interestsArray = data.interests.map(item => String(item));
          setInterests(interestsArray);
        } else {
          setInterests([]);
        }
      } else {
        // No profile found, initialize empty state
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
      // Preview the new avatar immediately
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

      // If avatar file changed, upload it
      if (avatarFile) {
        finalAvatarUrl = await uploadAvatar(avatarFile);
      }

      // Upsert the profile info
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

      // Fix for the second TypeScript error: use the correct type for invalidateQueries
      // Use an object with a queryKey property instead of a string array
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
        {/* Avatar upload section */}
        <div>
          <Label htmlFor="avatar-upload" className="mb-2 block font-semibold text-white">
            Profile Avatar
          </Label>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt="Avatar" />
              ) : (
                <AvatarFallback>?</AvatarFallback>
              )}
            </Avatar>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={onAvatarChange}
              className="text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Display Name */}
          <div>
            <Label htmlFor="display-name" className="block font-semibold text-white mb-1">
              Display Name
            </Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              disabled={loading}
            />
          </div>

          {/* Username (non-editable) */}
          <div>
            <Label htmlFor="username" className="block font-semibold text-white mb-1">
              Username
            </Label>
            <Input id="username" value={username} disabled placeholder="Your username" />
          </div>
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio" className="block font-semibold text-white mb-1">
            Bio
          </Label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
            disabled={loading}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>

        {/* Interests - selectable badges */}
        <div>
          <Label className="block font-semibold text-white mb-1">Select Your Interests</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = interests.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleInterest(cat.id)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm font-semibold border cursor-pointer select-none transition-all',
                    selected
                      ? 'bg-findom-purple text-white border-findom-purple'
                      : 'bg-transparent text-white/80 border-white/30 hover:bg-white/10'
                  )}
                  aria-pressed={selected}
                >
                  {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

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

