import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { Product } from '../types/product';
import { useAuth } from './AuthContext';
import * as wishlistApi from '../services/wishlistApi';

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
  const [items, setItems] = useState<Product[]>([]);

  // Load wishlist from backend when user logs in or on app init
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!user) {
        if (mounted) setItems([]);
        return;
      }

      try {
        const backendItems = await wishlistApi.getWishlist();
        if (mounted) {
          // dedupe by id
          const map = new Map<number, Product>();
          backendItems.forEach((p) => map.set(p.id, p));
          setItems(Array.from(map.values()));
        }
      } catch (err) {
        console.warn('Failed to load wishlist', err);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [user]);

  const addToWishlist = (product: Product) => {
    console.log('[TRACE] WishlistContext addToWishlist product.id =', product.id);
    // optimistic add
    setItems((currentItems) => {
      if (currentItems.some((i) => i.id === product.id)) return currentItems;
      return [...currentItems, product];
    });

    void (async () => {
      try {
        const updated = await wishlistApi.addToWishlist(product);
        // update to authoritative backend response (dedupe)
        const map = new Map<number, Product>();
        updated.forEach((p) => map.set(p.id, p));
        setItems(Array.from(map.values()));
      } catch (err) {
        // rollback optimistic add
        setItems((currentItems) => currentItems.filter((i) => i.id !== product.id));
        console.warn('Failed to add wishlist item', err);
      }
    })();
  };

  const removeFromWishlist = (productId: number) => {
    console.log('[TRACE] WishlistContext removeFromWishlist productId =', productId);
    // optimistic remove
    const prev = items;
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));

    void (async () => {
      try {
        const updated = await wishlistApi.removeFromWishlist(productId);
        const map = new Map<number, Product>();
        updated.forEach((p) => map.set(p.id, p));
        setItems(Array.from(map.values()));
      } catch (err) {
        // rollback
        setItems(prev);
        console.warn('Failed to remove wishlist item', err);
      }
    })();
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
