-- Migrates products from public.products_legacy_backup_20260628150253 into public.products.
-- Preserves original IDs and avoids duplicate rows.
-- This assumes the current public.products schema matches the columns listed below.

BEGIN;

-- Verify current counts before migration.
-- SELECT COUNT(*) FROM public.products;
-- SELECT COUNT(*) FROM public.products_legacy_backup_20260628150253;

-- Add missing image columns before migrating legacy data.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Copy all rows from the legacy backup, preserving original IDs.
INSERT INTO public.products (
  id,
  category_id,
  name,
  slug,
  description,
  price,
  discount_price,
  stock,
  rating,
  total_reviews,
  is_featured,
  is_active,
  image_url,
  image_path,
  created_at,
  updated_at
)
OVERRIDING SYSTEM VALUE
SELECT
  id,
  category_id,
  name,
  slug,
  description,
  price,
  discount_price,
  stock,
  rating,
  total_reviews,
  is_featured,
  is_active,
  image_url,
  image_path,
  created_at,
  updated_at
FROM public.products_legacy_backup_20260628150253 legacy
WHERE NOT EXISTS (
  SELECT 1
  FROM public.products prod
  WHERE prod.id = legacy.id
);

-- Advance the identity sequence to avoid conflicts on future inserts.
SELECT setval(pg_get_serial_sequence('public.products', 'id'), GREATEST((SELECT MAX(id) FROM public.products), 1));

COMMIT;

-- Verify the migration.
-- SELECT COUNT(*) FROM public.products;
-- SELECT id, name FROM public.products LIMIT 10;
