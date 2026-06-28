import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  rating?: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  buyNowItem: CartItem | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  toggleCart: (isOpen?: boolean) => void;
  clearCart: () => void;
  setBuyNowItem: (item: CartItem | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const syncCartToBackend = async (method: 'POST' | 'PUT' | 'DELETE', payload?: CartItem | { quantity?: number }) => {
    if (!user) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/v1/cart${method === 'DELETE' && payload ? '' : ''}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) {
        console.warn('Failed to sync cart to backend');
      }
    } catch (error) {
      console.warn('Cart backend sync failed', error);
    }
  };

  const addToCart = (newItem: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      const nextItems = existingItem
        ? currentItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        : [...currentItems, newItem];
      void syncCartToBackend('POST', newItem);
      return nextItems;
    });
    setIsOpen(true);
  };

  const removeFromCart = (id: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    void syncCartToBackend('DELETE', { quantity: 0 });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
    void syncCartToBackend('PUT', { quantity });
  };

  const toggleCart = (open?: boolean) => {
    setIsOpen((prev) => (open !== undefined ? open : !prev));
  };

  const clearCart = () => {
    setItems([]);
    void syncCartToBackend('DELETE');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        buyNowItem,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        clearCart,
        setBuyNowItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
