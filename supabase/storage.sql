-- Create a new bucket for business avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-avatars', 'business-avatars', true);

-- Set up RLS policies for the business-avatars bucket
-- Allow public read access
CREATE POLICY "Public read access for business-avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'business-avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Authenticated users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'business-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to update their own avatar
CREATE POLICY "Authenticated users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'business-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Authenticated users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'business-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
