import { supabase } from '../lib/supabase';
import type { CartItem } from '../context/CartContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
};

const requestCart = async (
  path: string,
  options: RequestInit = {}
): Promise<CartItem[]> => {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/cart${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = payload?.message || payload?.error || 'Cart API error';
    throw new Error(message);
  }

  return Array.isArray(payload?.data) ? payload.data : [];
};

export const getCart = async (): Promise<CartItem[]> => {
  return requestCart('', { method: 'GET' });
};

export const addToCart = async (item: CartItem): Promise<CartItem[]> => {
  return requestCart('', {
    method: 'POST',
    body: JSON.stringify({
      id: item.id,
      quantity: item.quantity,
    }),
  });
};

export const updateQuantity = async (productId: number, quantity: number): Promise<CartItem[]> => {
  return requestCart(`/${encodeURIComponent(String(productId))}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  });
};

export const removeFromCart = async (productId: number): Promise<CartItem[]> => {
  return requestCart(`/${encodeURIComponent(String(productId))}`, { method: 'DELETE' });
};

export const clearCart = async (): Promise<CartItem[]> => {
  return requestCart('/clear', { method: 'DELETE' });
};
