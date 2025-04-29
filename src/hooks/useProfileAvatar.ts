
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useProfileAvatar() {
  const toast = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Avatar change handler - memoized to prevent recreation on re-renders
  const onAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Validate image type
      if (!file.type.startsWith('image/')) {
        setUploadError('Invalid file type');
        toast.toast({
          title: 'Invalid file',
          description: 'Please upload an image file',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File too large');
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
      setUploadError(null);
      setUploadLoading(true);
      
      // First check if the avatars bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw new Error(`Error accessing storage: ${bucketsError.message}`);
      }
      
      // Check if the avatars bucket exists
      const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars');
      if (!avatarsBucket) {
        // Create the bucket if it doesn't exist
        const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
          public: true
        });
        
        if (createBucketError) {
          throw new Error(`Error creating avatars bucket: ${createBucketError.message}`);
        }
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Try to upload the file
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        throw new Error(`Error uploading avatar: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      return publicUrlData.publicUrl;
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
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
    uploadError,
    resetUploadError: () => setUploadError(null)
  };
}
