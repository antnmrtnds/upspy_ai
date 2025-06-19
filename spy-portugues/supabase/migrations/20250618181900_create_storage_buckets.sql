-- Create storage buckets for SpyPortuguês application
-- This migration sets up storage buckets for different types of media assets

-- Create bucket for ad creatives (images, videos from competitor ads)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ad-creatives',
  'ad-creatives',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
);

-- Create bucket for screenshots (website screenshots, app screenshots)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'screenshots',
  'screenshots',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Create bucket for competitor logos and branding assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'logos',
  'logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
);

-- Create bucket for user-generated content (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-content',
  'user-content',
  false,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- Create RLS policies for storage buckets
-- Policy for ad-creatives bucket
CREATE POLICY "Users can view ad creatives" ON storage.objects
FOR SELECT USING (bucket_id = 'ad-creatives');

CREATE POLICY "Authenticated users can upload ad creatives" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'ad-creatives' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own ad creatives" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'ad-creatives' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own ad creatives" ON storage.objects
FOR DELETE USING (
  bucket_id = 'ad-creatives' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for screenshots bucket
CREATE POLICY "Users can view screenshots" ON storage.objects
FOR SELECT USING (bucket_id = 'screenshots');

CREATE POLICY "Authenticated users can upload screenshots" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'screenshots' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own screenshots" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own screenshots" ON storage.objects
FOR DELETE USING (
  bucket_id = 'screenshots' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for logos bucket
CREATE POLICY "Users can view logos" ON storage.objects
FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'logos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'logos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for user-content bucket (private)
CREATE POLICY "Users can view their own user content" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own user content" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-content' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own user content" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own user content" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-content' 
  AND auth.uid()::text = (storage.foldername(name))[1]
); 