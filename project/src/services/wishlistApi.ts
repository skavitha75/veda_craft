import { supabase } from '../lib/supabase';
import { Product, ApiProduct, mapApiProductToProduct } from '../types/product';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (payload && (payload.message || payload.error)) || 'Wishlist API error';
    throw new Error(msg);
  }
  return payload as T;
};

export const getWishlist = async (): Promise<Product[]> => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const payload = await handleResponse<{ success: boolean; data: ApiProduct[] }>(res);
  const items = Array.isArray(payload.data) ? payload.data : [];
  return items.map(mapApiProductToProduct);
};

export const addToWishlist = async (product: Product): Promise<Product[]> => {
  console.log('[TRACE] wishlistApi.addToWishlist sending product.id =', product.id);
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ id: product.id }),
  });

  const payload = await handleResponse<{ success: boolean; data: ApiProduct[] }>(res);
  const items = Array.isArray(payload.data) ? payload.data : [];
  return items.map(mapApiProductToProduct);
};

export const removeFromWishlist = async (productId: number): Promise<Product[]> => {
  console.log('[TRACE] wishlistApi.removeFromWishlist sending productId =', productId);
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/wishlist/${encodeURIComponent(String(productId))}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const payload = await handleResponse<{ success: boolean; data: ApiProduct[] }>(res);
  const items = Array.isArray(payload.data) ? payload.data : [];
  return items.map(mapApiProductToProduct);
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
