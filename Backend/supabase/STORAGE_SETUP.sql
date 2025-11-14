-- =====================================================
-- SUPABASE STORAGE SETUP FOR ROOM IMAGES
-- =====================================================
-- This script creates the storage bucket and policies for room images

-- =====================================================
-- CREATE STORAGE BUCKET
-- =====================================================

-- Create the room-images bucket
-- Note: Run this in Supabase Dashboard > Storage > Create Bucket
-- Bucket name: room-images
-- Public bucket: YES (so images are publicly accessible)
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- Or create via SQL:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-images',
  'room-images',
  true,  -- Public bucket
  5242880,  -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Policy 1: Allow anyone to view/download images (public read)
CREATE POLICY "Public can view room images"
ON storage.objects FOR SELECT
USING (bucket_id = 'room-images');

-- Policy 2: Allow authenticated admins to upload images
CREATE POLICY "Admins can upload room images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'room-images'
  AND (
    -- Allow if user is admin
    (SELECT is_active FROM admin_users WHERE id = auth.uid() LIMIT 1) = true
    -- OR allow any authenticated user (you can restrict this)
    OR auth.uid() IS NOT NULL
  )
);

-- Policy 3: Allow authenticated admins to update images
CREATE POLICY "Admins can update room images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'room-images'
  AND (
    (SELECT is_active FROM admin_users WHERE id = auth.uid() LIMIT 1) = true
    OR auth.uid() IS NOT NULL
  )
);

-- Policy 4: Allow authenticated admins to delete images
CREATE POLICY "Admins can delete room images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'room-images'
  AND (
    (SELECT is_active FROM admin_users WHERE id = auth.uid() LIMIT 1) = true
    OR auth.uid() IS NOT NULL
  )
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'room-images';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%room images%';

-- =====================================================
-- NOTES
-- =====================================================

-- Bucket Configuration:
-- - Name: room-images
-- - Public: Yes (images accessible via public URL)
-- - Max file size: 5MB
-- - Allowed types: JPEG, PNG, WebP, GIF
-- - Path structure: room-images/TIMESTAMP-RANDOM.ext

-- Security:
-- - Anyone can view images (public read)
-- - Only authenticated users can upload (can be restricted to admins only)
-- - Only authenticated users can update/delete
-- - File size limited to 5MB
-- - Only image files allowed

-- Usage in Frontend:
-- Upload: supabase.storage.from('room-images').upload(path, file)
-- Get URL: supabase.storage.from('room-images').getPublicUrl(path)
-- Delete: supabase.storage.from('room-images').remove([path])

-- Example URLs:
-- https://fnqzljjcdzrnfdwjezsp.supabase.co/storage/v1/object/public/room-images/room-images/1699876543210-abc123.jpg
