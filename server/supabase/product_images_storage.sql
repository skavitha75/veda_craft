-- ============================================================
-- VedaCraft Product Images Storage
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  TRUE,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Product images are publicly readable." ON storage.objects;
CREATE POLICY "Product images are publicly readable."
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Service role can manage product images." ON storage.objects;
CREATE POLICY "Service role can manage product images."
ON storage.objects FOR ALL
USING (bucket_id = 'product-images' AND auth.role() = 'service_role')
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'service_role'
  AND (
    name LIKE 'eco/%'
    OR name LIKE 'wellness/%'
    OR name LIKE 'food/%'
    OR name LIKE 'craft/%'
    OR name LIKE 'fashion/%'
    OR name LIKE 'decor/%'
  )
);

-- Use these folder prefixes for future uploads:
-- product-images/eco/
-- product-images/wellness/
-- product-images/food/
-- product-images/craft/
-- product-images/fashion/
-- product-images/decor/

SELECT id, name, public
FROM storage.buckets
WHERE id = 'product-images';
