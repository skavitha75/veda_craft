import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/apiResponse.js';

const PRODUCT_COLUMNS = `
  id,
  name,
  slug,
  description,
  category,
  brand,
  price,
  discount_price,
  stock,
  images,
  rating,
  total_reviews,
  specifications,
  is_featured,
  created_at,
  updated_at
`;

const PRODUCT_IMAGES_BUCKET = process.env.PRODUCT_IMAGES_BUCKET || 'product-images';

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

const publicImageUrl = (imagePath) => {
  if (!imagePath || isAbsoluteUrl(imagePath)) return imagePath;

  const { data } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(imagePath);

  return data.publicUrl;
};

const mapProduct = (product) => {
  if (!product) return null;

  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean).map(publicImageUrl)
    : [];

  return {
    ...product,
    images,
  };
};

const applyFilters = (query, filters) => {
  let nextQuery = query.eq('is_active', true);

  if (filters.category) {
    nextQuery = nextQuery.ilike('category', filters.category);
  }

  if (filters.brand) {
    nextQuery = nextQuery.ilike('brand', filters.brand);
  }

  if (filters.search) {
    const term = filters.search.replaceAll('%', '').replaceAll(',', ' ').trim();
    if (term) {
      nextQuery = nextQuery.or(
        `name.ilike.%${term}%,slug.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%,brand.ilike.%${term}%`
      );
    }
  }

  if (filters.minPrice !== undefined) {
    nextQuery = nextQuery.gte('price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    nextQuery = nextQuery.lte('price', filters.maxPrice);
  }

  if (filters.minRating !== undefined) {
    nextQuery = nextQuery.gte('rating', filters.minRating);
  }

  if (filters.inStock === true) {
    nextQuery = nextQuery.gt('stock', 0);
  } else if (filters.inStock === false) {
    nextQuery = nextQuery.eq('stock', 0);
  }

  if (filters.featured !== undefined) {
    nextQuery = nextQuery.eq('is_featured', filters.featured);
  }

  if (filters.specifications && Object.keys(filters.specifications).length > 0) {
    nextQuery = nextQuery.contains('specifications', filters.specifications);
  }

  return nextQuery;
};

const paginationMeta = ({ page, limit, count }) => {
  const totalPages = Math.ceil((count || 0) / limit);
  return {
    page,
    limit,
    total: count || 0,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const getProducts = async (filters) => {
  const from = (filters.page - 1) * filters.limit;
  const to = from + filters.limit - 1;

  let query = supabase
    .from('products')
    .select(PRODUCT_COLUMNS, { count: 'exact' });

  query = applyFilters(query, filters)
    .order(filters.sortBy, { ascending: filters.sortOrder === 'asc' })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) throw new AppError(error.message, 500);

  return {
    products: (data || []).map(mapProduct),
    meta: paginationMeta({ page: filters.page, limit: filters.limit, count }),
  };
};

export const getProductByIdOrSlug = async (idOrSlug) => {
  const value = String(idOrSlug).trim();
  const isNumericId = /^\d+$/.test(value);

  let query = supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .limit(1);

  query = isNumericId ? query.eq('id', Number(value)) : query.eq('slug', value);

  const { data, error } = await query.maybeSingle();

  if (error) throw new AppError(error.message, 500);
  return mapProduct(data);
};

export const getProductsByCategory = async (category, filters) => {
  return getProducts({
    ...filters,
    category,
  });
};

export const searchProducts = async (search, filters) => {
  return getProducts({
    ...filters,
    search,
  });
};
