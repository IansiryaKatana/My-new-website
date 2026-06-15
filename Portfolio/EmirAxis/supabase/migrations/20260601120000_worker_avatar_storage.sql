-- Allow operations staff to upload worker profile photos under branding/worker-avatars/
CREATE POLICY "branding_worker_avatars_insert_staff"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'branding'
  AND (storage.foldername(name))[1] = 'worker-avatars'
  AND (
    has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'manager')
    OR has_role(auth.uid(), 'recruiter')
  )
);

CREATE POLICY "branding_worker_avatars_update_staff"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'branding'
  AND (storage.foldername(name))[1] = 'worker-avatars'
  AND (
    has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'manager')
    OR has_role(auth.uid(), 'recruiter')
  )
);

CREATE POLICY "branding_worker_avatars_delete_staff"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'branding'
  AND (storage.foldername(name))[1] = 'worker-avatars'
  AND (
    has_role(auth.uid(), 'admin')
    OR has_role(auth.uid(), 'manager')
    OR has_role(auth.uid(), 'recruiter')
  )
);
