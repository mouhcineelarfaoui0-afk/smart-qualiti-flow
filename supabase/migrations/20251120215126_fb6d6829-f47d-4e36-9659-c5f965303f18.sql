-- Create storage bucket for non-conformity attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('non-conformities', 'non-conformities', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for non-conformities bucket
CREATE POLICY "Authenticated users can view non-conformity files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'non-conformities');

CREATE POLICY "Authenticated users can upload non-conformity files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'non-conformities');

CREATE POLICY "Users can update their uploaded files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'non-conformities');

CREATE POLICY "Users can delete their uploaded files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'non-conformities');