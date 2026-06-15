
-- tenant-docs: tenant uploads under their own uid prefix
CREATE POLICY "tenants upload own docs" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'tenant-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "tenants read own docs" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'tenant-docs' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_staff(auth.uid())));
CREATE POLICY "tenants delete own docs" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'tenant-docs' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "staff manage tenant-docs" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'tenant-docs' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'tenant-docs' AND public.is_staff(auth.uid()));

-- property-images: any authed user reads, staff writes
CREATE POLICY "authed read property images" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'property-images');
CREATE POLICY "staff manage property images" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'property-images' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'property-images' AND public.is_staff(auth.uid()));
