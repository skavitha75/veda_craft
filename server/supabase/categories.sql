-- ============================================================
-- VedaCraft Categories Table
-- Run this in Supabase Dashboard -> SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE FUNCTION public.set_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS categories_set_updated_at ON public.categories;
CREATE TRIGGER categories_set_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_categories_updated_at();

CREATE INDEX IF NOT EXISTS idx_categories_slug
  ON public.categories (slug);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are publicly readable." ON public.categories;
CREATE POLICY "Categories are publicly readable."
ON public.categories FOR SELECT
USING (true);

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;

INSERT INTO public.categories (name, slug, image_url)
VALUES
  ('Eco', 'eco', '/assets/categories/eco.jpeg'),
  ('Wellness', 'wellness', '/assets/categories/wellness.jpeg'),
  ('Food', 'food', '/assets/categories/food.jpeg'),
  ('Craft', 'craft', '/assets/categories/craft.jpeg'),
  ('Fashion', 'fashion', '/assets/categories/fashion.jpeg'),
  ('Decor Items', 'decor', '/assets/categories/decor-items.jpeg')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    image_url = EXCLUDED.image_url,
    updated_at = timezone('utc'::text, now());

-- Verify: should return 6
SELECT COUNT(*) AS total_categories FROM public.categories;
