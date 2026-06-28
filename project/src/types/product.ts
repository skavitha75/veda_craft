export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  category: string;
  brand?: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  images: string[];
  image: string;
  rating: number;
  totalReviews: number;
  specifications: Record<string, unknown>;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  section?: 'bestsellers' | 'newarrivals' | 'trending';
  mainCategory?: string;
}

export interface ApiProduct {
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
}

export interface LocalProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  section?: 'bestsellers' | 'newarrivals' | 'trending';
}

export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const images = Array.isArray(apiProduct.images) ? apiProduct.images : [];
  const firstImage = apiProduct.image || images[0] || '';
  const specs = apiProduct.specifications || {};

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description: apiProduct.description,
    category: apiProduct.category,
    brand: apiProduct.brand,
    price: apiProduct.price,
    discountPrice: apiProduct.discount_price,
    stock: apiProduct.stock,
    images,
    image: firstImage,
    rating: apiProduct.rating,
    totalReviews: apiProduct.total_reviews,
    specifications: specs,
    isFeatured: apiProduct.is_featured,
    createdAt: apiProduct.created_at,
    updatedAt: apiProduct.updated_at,
    section: apiProduct.section || (specs.section as Product['section']) || undefined,
    mainCategory: (specs.mainCategory as string) || apiProduct.category,
  };
};

export const mapLocalProductToProduct = (localProduct: LocalProduct): Product => {
  return {
    id: localProduct.id,
    name: localProduct.name,
    slug: localProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: '',
    category: localProduct.category,
    brand: '',
    price: localProduct.price,
    discountPrice: null,
    stock: 0,
    images: [localProduct.image],
    image: localProduct.image,
    rating: localProduct.rating,
    totalReviews: 0,
    specifications: {},
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    section: localProduct.section,
    mainCategory: localProduct.category,
  };
};
