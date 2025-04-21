
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useProfileAvatar() {
  const toast = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Avatar change handler - memoized to prevent recreation on re-renders
  const onAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validate image type
      if (!file.type.startsWith('image/')) {
        toast.toast({
          title: 'Invalid file',
          description: 'Please upload an image file',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
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
  }, [toast]);

  // Upload avatar to storage - memoized with useCallback
  const uploadAvatar = useCallback(async (userId: string, file: File) => {
    try {
      setUploadLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log('Uploading avatar:', { fileName, filePath, size: file.size });

      // First check if the bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error fetching buckets:', bucketsError);
        throw bucketsError;
      }
      
      console.log('Available buckets:', buckets);
      
      // Try to upload directly (the bucket should exist based on our SQL migration)
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, data:', data);

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      console.log('Public URL:', publicUrlData.publicUrl);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    } finally {
      setUploadLoading(false);
    }
  }, []);

  return {
    avatarUrl,
    setAvatarUrl,
    avatarFile,
    onAvatarChange,
    uploadAvatar,
    uploadLoading,
  };
}
