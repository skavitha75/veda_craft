-- ============================================================
-- VedaCraft Product Image Columns
-- Run this before scripts/migrateProductImages.js
-- ============================================================

ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_path TEXT;

CREATE INDEX IF NOT EXISTS idx_products_image_path
  ON public.products (image_path);

SELECT
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'products'
  AND column_name IN ('image_url', 'image_path')
ORDER BY column_name;
