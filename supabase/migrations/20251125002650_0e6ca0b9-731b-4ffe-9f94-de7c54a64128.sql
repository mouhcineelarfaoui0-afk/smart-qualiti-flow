-- Create audits storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('audits', 'audits', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for audits bucket
CREATE POLICY "Authenticated users can view audit reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'audits' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Quality managers and auditors can upload audit reports"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audits' AND
  (has_role(auth.uid(), 'admin') OR 
   has_role(auth.uid(), 'responsable_qualite') OR 
   has_role(auth.uid(), 'auditeur'))
);

CREATE POLICY "Quality managers and auditors can update audit reports"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'audits' AND
  (has_role(auth.uid(), 'admin') OR 
   has_role(auth.uid(), 'responsable_qualite') OR 
   has_role(auth.uid(), 'auditeur'))
);

CREATE POLICY "Quality managers can delete audit reports"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'audits' AND
  (has_role(auth.uid(), 'admin') OR 
   has_role(auth.uid(), 'responsable_qualite'))
);