-- ============================================================
-- VedaCraft Product Seed From Existing Frontend Data
-- Run categories.sql and products.sql before this file.
-- This imports the 61 products currently defined in project/src/data.
-- ============================================================

DO $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM public.categories
    WHERE slug IN ('eco', 'wellness', 'food', 'craft', 'fashion', 'decor')
  ) <> 6 THEN
    RAISE EXCEPTION 'Expected categories eco, wellness, food, craft, fashion, and decor before seeding products.';
  END IF;
END;
$$;

WITH frontend_products (
  category_slug,
  name,
  slug,
  description,
  price,
  discount_price,
  stock,
  rating,
  total_reviews,
  is_featured,
  is_active
) AS (
  VALUES
    -- Eco
    ('eco', 'Coconut Shell Bowl', 'coconut-shell-bowl', NULL::text, 299, NULL::numeric, 0, 4.5, 0, TRUE, TRUE),
    ('eco', 'Coconut Shell Lamp', 'coconut-shell-lamp', NULL::text, 599, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('eco', 'Neem Wood Comb', 'neem-wood-comb', NULL::text, 150, NULL::numeric, 0, 4.7, 0, TRUE, TRUE),
    ('eco', 'Cotton Shopping Bag', 'cotton-shopping-bag', NULL::text, 199, NULL::numeric, 0, 4.6, 0, FALSE, TRUE),
    ('eco', 'Organic Cotton Towels', 'organic-cotton-towels', NULL::text, 499, NULL::numeric, 0, 4.9, 0, FALSE, TRUE),
    ('eco', 'Jute Tote Bag', 'jute-tote-bag', NULL::text, 250, NULL::numeric, 0, 4.5, 0, TRUE, TRUE),
    ('eco', 'Natural Jute Mat', 'natural-jute-mat', NULL::text, 699, NULL::numeric, 0, 4.7, 0, FALSE, TRUE),
    ('eco', 'Bamboo Toothbrush', 'bamboo-toothbrush', NULL::text, 99, NULL::numeric, 0, 4.8, 0, TRUE, TRUE),
    ('eco', 'Eco-Friendly Totes', 'eco-friendly-totes', NULL::text, 350, NULL::numeric, 0, 4.6, 0, FALSE, TRUE),
    ('eco', 'Handcrafted Wooden Bowl', 'handcrafted-wooden-bowl', NULL::text, 450, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('eco', 'Wooden Cooking Spoon', 'wooden-cooking-spoon', NULL::text, 120, NULL::numeric, 0, 4.7, 0, TRUE, TRUE),

    -- Wellness
    ('wellness', 'Aromatherapy Candle', 'aromatherapy-candle', NULL::text, 399, NULL::numeric, 0, 4.8, 0, TRUE, TRUE),
    ('wellness', 'Essential Oil', 'essential-oil', NULL::text, 499, NULL::numeric, 0, 4.7, 0, TRUE, TRUE),
    ('wellness', 'Herbal Tea Pack', 'herbal-tea-pack', NULL::text, 299, NULL::numeric, 0, 4.5, 0, TRUE, TRUE),
    ('wellness', 'Herbal Supplements', 'herbal-supplements', NULL::text, 599, NULL::numeric, 0, 4.6, 0, TRUE, TRUE),
    ('wellness', 'Massage Roller', 'massage-roller', NULL::text, 349, NULL::numeric, 0, 4.4, 0, FALSE, TRUE),
    ('wellness', 'Meditation Cushion', 'meditation-cushion', NULL::text, 799, NULL::numeric, 0, 4.9, 0, FALSE, TRUE),
    ('wellness', 'Organic Face Serum', 'organic-face-serum', NULL::text, 699, NULL::numeric, 0, 4.7, 0, FALSE, TRUE),
    ('wellness', 'Vegan Soap', 'vegan-soap', NULL::text, 199, NULL::numeric, 0, 4.5, 0, FALSE, TRUE),
    ('wellness', 'Skincare Cream', 'skincare-cream', NULL::text, 549, NULL::numeric, 0, 4.6, 0, FALSE, TRUE),
    ('wellness', 'Yoga Mat', 'yoga-mat', NULL::text, 899, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),

    -- Food
    ('food', 'Organic Almonds', 'organic-almonds', NULL::text, 699, NULL::numeric, 0, 4.8, 0, TRUE, TRUE),
    ('food', 'Fresh Bananas', 'fresh-bananas', NULL::text, 99, NULL::numeric, 0, 4.6, 0, TRUE, TRUE),
    ('food', 'Farm Carrots', 'farm-carrots', NULL::text, 79, NULL::numeric, 0, 4.7, 0, TRUE, TRUE),
    ('food', 'Cold Pressed Coconut Oil', 'cold-pressed-coconut-oil', NULL::text, 349, NULL::numeric, 0, 4.9, 0, FALSE, TRUE),
    ('food', 'Premium Dates', 'premium-dates', NULL::text, 499, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('food', 'Raw Forest Honey', 'raw-forest-honey', NULL::text, 399, NULL::numeric, 0, 4.9, 0, FALSE, TRUE),
    ('food', 'Organic Mangoes', 'organic-mangoes', NULL::text, 249, NULL::numeric, 0, 4.7, 0, FALSE, TRUE),
    ('food', 'Black Pepper', 'black-pepper', NULL::text, 199, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('food', 'Fresh Tomatoes', 'fresh-tomatoes', NULL::text, 59, NULL::numeric, 0, 4.5, 0, FALSE, TRUE),
    ('food', 'Turmeric Powder', 'turmeric-powder', NULL::text, 149, NULL::numeric, 0, 4.7, 0, FALSE, TRUE),
    ('food', 'Organic Millet', 'organic-millet', NULL::text, 129, NULL::numeric, 0, 4.6, 0, FALSE, TRUE),
    ('food', 'Ragi Flour', 'ragi-flour', NULL::text, 89, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),

    -- Craft
    ('craft', 'Cotton Table Runner', 'cotton-table-runner', NULL::text, 399, NULL::numeric, 0, 4.7, 0, TRUE, TRUE),
    ('craft', 'Terracotta Flower Pot', 'terracotta-flower-pot', NULL::text, 249, NULL::numeric, 0, 4.6, 0, TRUE, TRUE),
    ('craft', 'Handmade Paper Bag', 'handmade-paper-bag', NULL::text, 149, NULL::numeric, 0, 4.5, 0, TRUE, TRUE),
    ('craft', 'Iron Candle Holder', 'iron-candle-holder', NULL::text, 499, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('craft', 'Metal Wall Hanging', 'metal-wall-hanging', NULL::text, 899, NULL::numeric, 0, 4.9, 0, FALSE, TRUE),
    ('craft', 'Handmade Paper Notebook', 'handmade-paper-notebook', NULL::text, 199, NULL::numeric, 0, 4.7, 0, FALSE, TRUE),
    ('craft', 'Wooden Storage Box', 'wooden-storage-box', NULL::text, 699, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('craft', 'Copper Water Bottle', 'copper-water-bottle', NULL::text, 799, NULL::numeric, 0, 4.9, 0, FALSE, TRUE),
    ('craft', 'Wooden Spice Box', 'wooden-spice-box', NULL::text, 549, NULL::numeric, 0, 4.6, 0, FALSE, TRUE),
    ('craft', 'Wooden Wall Shelf', 'wooden-wall-shelf', NULL::text, 999, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),

    -- Fashion
    ('fashion', 'Coconut Shell Necklace', 'coconut-shell-necklace', NULL::text, 349, NULL::numeric, 0, 4.6, 0, TRUE, TRUE),
    ('fashion', 'Organic Cotton Kurti', 'organic-cotton-kurti', NULL::text, 899, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('fashion', 'Handloom Cotton Saree', 'handloom-cotton-saree', NULL::text, 1599, NULL::numeric, 0, 4.9, 0, TRUE, TRUE),
    ('fashion', 'Eco-friendly Cotton T-Shirt', 'eco-friendly-cotton-t-shirt', NULL::text, 499, NULL::numeric, 0, 4.5, 0, FALSE, TRUE),
    ('fashion', 'Handcrafted Earrings', 'handcrafted-earrings', NULL::text, 249, NULL::numeric, 0, 4.7, 0, TRUE, TRUE),
    ('fashion', 'Sustainable Jute Handbag', 'sustainable-jute-handbag', NULL::text, 699, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('fashion', 'Pure Linen Pant', 'pure-linen-pant', NULL::text, 1199, NULL::numeric, 0, 4.6, 0, FALSE, TRUE),
    ('fashion', 'Classic Linen Shirt', 'classic-linen-shirt', NULL::text, 1299, NULL::numeric, 0, 4.7, 0, TRUE, TRUE),

    -- Decor Items
    ('decor', 'Wooden Wall Hanging Art', 'wooden-wall-hanging-art', NULL::text, 799, NULL::numeric, 0, 4.8, 0, TRUE, TRUE),
    ('decor', 'Handcrafted Bamboo Lamp', 'handcrafted-bamboo-lamp', NULL::text, 1299, NULL::numeric, 0, 4.9, 0, FALSE, TRUE),
    ('decor', 'Elegant Bamboo Vase', 'elegant-bamboo-vase', NULL::text, 549, NULL::numeric, 0, 4.6, 0, FALSE, TRUE),
    ('decor', 'Ceramic Centerpiece', 'ceramic-centerpiece', NULL::text, 899, NULL::numeric, 0, 4.7, 0, TRUE, TRUE),
    ('decor', 'Eco Coconut Shell Lamp', 'eco-coconut-shell-lamp', NULL::text, 649, NULL::numeric, 0, 4.8, 0, FALSE, TRUE),
    ('decor', 'Handwoven Cotton Rug', 'handwoven-cotton-rug', NULL::text, 1499, NULL::numeric, 0, 4.5, 0, FALSE, TRUE),
    ('decor', 'Natural Jute Carpet', 'natural-jute-carpet', NULL::text, 2199, NULL::numeric, 0, 4.9, 0, TRUE, TRUE),
    ('decor', 'Rustic Metal Wall Art', 'rustic-metal-wall-art', NULL::text, 1899, NULL::numeric, 0, 4.7, 0, FALSE, TRUE),
    ('decor', 'Minimalist Planter Pot', 'minimalist-planter-pot', NULL::text, 399, NULL::numeric, 0, 4.6, 0, FALSE, TRUE),
    ('decor', 'Wooden Candle Holder', 'wooden-candle-holder', NULL::text, 299, NULL::numeric, 0, 4.8, 0, TRUE, TRUE)
)
INSERT INTO public.products (
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
  is_active
)
SELECT
  categories.id,
  frontend_products.name,
  frontend_products.slug,
  frontend_products.description,
  frontend_products.price,
  frontend_products.discount_price,
  frontend_products.stock,
  frontend_products.rating,
  frontend_products.total_reviews,
  frontend_products.is_featured,
  frontend_products.is_active
FROM frontend_products
JOIN public.categories
  ON categories.slug = frontend_products.category_slug
ON CONFLICT (slug) DO UPDATE
SET category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    discount_price = EXCLUDED.discount_price,
    stock = EXCLUDED.stock,
    rating = EXCLUDED.rating,
    total_reviews = EXCLUDED.total_reviews,
    is_featured = EXCLUDED.is_featured,
    is_active = EXCLUDED.is_active,
    updated_at = timezone('utc'::text, now());

-- Verify: should return 61
SELECT COUNT(*) AS total_products FROM public.products;
