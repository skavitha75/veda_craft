-- ============================================================
-- VedaCraft Products Table
-- Run categories.sql before this file.
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================

DO $$
BEGIN
  IF to_regclass('public.products') IS NOT NULL THEN
    EXECUTE format(
      'ALTER TABLE public.products RENAME TO %I',
      'products_legacy_backup_' || to_char(timezone('utc'::text, now()), 'YYYYMMDDHH24MISS')
    );
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.products (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id     BIGINT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name            TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  description     TEXT,
  price           NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  discount_price  NUMERIC(10, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
  stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating          NUMERIC(3, 2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews   INTEGER NOT NULL DEFAULT 0 CHECK (total_reviews >= 0),
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE FUNCTION public.set_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_set_updated_at ON public.products;
CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_products_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_category_id
  ON public.products (category_id);

CREATE INDEX IF NOT EXISTS idx_products_active_created
  ON public.products (is_active, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_active_featured
  ON public.products (is_active, is_featured);

CREATE INDEX IF NOT EXISTS idx_products_active_rating
  ON public.products (is_active, rating DESC);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Active products are publicly readable." ON public.products;
CREATE POLICY "Active products are publicly readable."
ON public.products FOR SELECT
USING (is_active = TRUE);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
