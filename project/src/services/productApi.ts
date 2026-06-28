export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category: string;
  brand?: string;
  price: number;
  discount_price?: number | null;
  stock: number;
  images: string[];
  image: string;
  rating: number;
  total_reviews: number;
  specifications: Record<string, unknown>;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  section?: 'bestsellers' | 'newarrivals' | 'trending';
  mainCategory?: string;
}

export interface ProductListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ProductListMeta;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  featured?: boolean;
  sortBy?: 'created_at' | 'price' | 'rating' | 'name' | 'stock';
  sortOrder?: 'asc' | 'desc';
  [key: `spec_${string}`]: string | number | boolean | undefined;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const toQueryString = (query: ProductQuery = {}) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

const normalizeProduct = (product: Omit<Product, 'image'> & { image?: string }): Product => {
  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage = product.image || images[0] || '';
  const specs = product.specifications || {};

  return {
    ...product,
    images,
    image: firstImage,
    price: Number(product.discount_price ?? product.price),
    rating: Number(product.rating || 0),
    total_reviews: Number(product.total_reviews || 0),
    specifications: specs,
    section: (specs.section as Product['section']) || undefined,
    mainCategory: (specs.mainCategory as string) || product.category,
  };
};

const request = async <T>(path: string): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Failed to fetch products');
  }

  return payload;
};

export const getProducts = async (query?: ProductQuery) => {
  const payload = await request<Array<Omit<Product, 'image'> & { image?: string }>>(
    `/products${toQueryString(query)}`
  );

  return {
    products: payload.data.map(normalizeProduct),
    meta: payload.meta,
  };
};

/**
 * Fetch a single product by its numeric database ID.
 * Calls: GET /products/:id  (backend detects numeric and queries by id column)
 */
export const getProductById = async (id: number) => {
  const payload = await request<Omit<Product, 'image'> & { image?: string }>(`/products/${id}`);
  return normalizeProduct(payload.data);
};

/**
 * Fetch a single product by its URL slug.
 * Calls: GET /products/:slug  (backend detects non-numeric and queries by slug column)
 *
 * NOTE: The backend exposes a single route GET /products/:id which internally
 * resolves by numeric ID or slug (see server/src/services/productService.js:
 * getProductByIdOrSlug). A dedicated GET /products/slug/:slug endpoint would
 * be the ideal long-term solution to separate these concerns at the routing
 * level. Document this as a backend TODO.
 */
export const getProductBySlug = async (slug: string) => {
  const payload = await request<Omit<Product, 'image'> & { image?: string }>(`/products/${encodeURIComponent(slug)}`);
  return normalizeProduct(payload.data);
};

export const getProductsByCategory = async (category: string, query?: ProductQuery) => {
  const payload = await request<Array<Omit<Product, 'image'> & { image?: string }>>(
    `/products/category/${encodeURIComponent(category)}${toQueryString(query)}`
  );

  return {
    products: payload.data.map(normalizeProduct),
    meta: payload.meta,
  };
};

export const searchProducts = async (query: string, options?: ProductQuery) => {
  return getProducts({ ...options, search: query });
};
