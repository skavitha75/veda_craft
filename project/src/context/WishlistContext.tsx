import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Product } from '../types/product';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const syncWishlistToBackend = async (method: 'POST' | 'DELETE', product?: Product) => {
    if (!user) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/v1/wishlist', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: product ? JSON.stringify(product) : undefined,
      });
      if (!response.ok) {
        console.warn('Failed to sync wishlist to backend');
      }
    } catch (error) {
      console.warn('Wishlist backend sync failed', error);
    }
  };

  const addToWishlist = (product: Product) => {
    setItems((currentItems) => {
      if (!currentItems.find((item) => item.id === product.id)) {
        const nextItems = [...currentItems, product];
        void syncWishlistToBackend('POST', product);
        return nextItems;
      }
      return currentItems;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    if (user) {
      void syncWishlistToBackend('DELETE');
    }
  };

  const isInWishlist = (productId: number) => {
    return items.some((item) => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
