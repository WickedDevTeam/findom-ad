
-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('avatars', 'avatars', true, false)
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create creator_galleries bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('creator_images', 'creator_images', true, false)
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for creator_galleries bucket
CREATE POLICY "Creator images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'creator_images');

CREATE POLICY "Authenticated users can upload creator images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'creator_images' AND 
  auth.role() = 'authenticated'
);

-- Create listings bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('listings', 'listings', true, false)
ON CONFLICT (id) DO NOTHING;

-- Set up access policies for listings bucket
CREATE POLICY "Listing images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'listings');

CREATE POLICY "Authenticated users can upload listing images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'listings' AND 
  auth.role() = 'authenticated'
);
