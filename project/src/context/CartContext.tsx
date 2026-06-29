import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import * as cartApi from '../services/cartApi';

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

const normalizeCartItem = (item: Partial<CartItem>): CartItem | null => {
  const id = Number(item.id);
  const price = Number(item.price);
  const quantity = Number(item.quantity ?? 1);

  if (!Number.isFinite(id) || id <= 0) return null;
  if (!Number.isFinite(price) || price < 0) return null;
  if (!Number.isInteger(quantity) || quantity < 1) return null;

  return {
    id,
    name: item.name || 'Product',
    price,
    image: item.image || '',
    quantity,
    rating: item.rating === undefined ? undefined : Number(item.rating),
  };
};

const normalizeCartItems = (cartItems: Partial<CartItem>[]): CartItem[] => {
  return cartItems
    .map(normalizeCartItem)
    .filter((item): item is CartItem => Boolean(item));
};

const parseStoredCart = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    const parsed = savedCart ? JSON.parse(savedCart) : [];
    return Array.isArray(parsed) ? normalizeCartItems(parsed) : [];
  } catch {
    return [];
  }
};

const mergeCartItems = (backendItems: CartItem[], fallbackItems: CartItem[]) => {
  const fallbackMap = new Map(fallbackItems.map((item) => [item.id, item]));

  return normalizeCartItems(
    backendItems.map((item) => {
      const fallback = fallbackMap.get(item.id);
      return {
        ...fallback,
        ...item,
        name: item.name || fallback?.name,
        price: Number.isFinite(Number(item.price)) && Number(item.price) > 0 ? item.price : fallback?.price,
        image: item.image || fallback?.image,
      };
    })
  );
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(parseStoredCart);
  
  const [isOpen, setIsOpen] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    let mounted = true;

    const loadCart = async () => {
      if (!user) {
        if (mounted) {
          setItems(parseStoredCart());
        }
        return;
      }

      try {
        const backendItems = await cartApi.getCart();
        if (mounted) {
          setItems((currentItems) => mergeCartItems(backendItems, currentItems));
        }
      } catch (error) {
        console.warn('Failed to load cart from backend', error);
      }
    };

    void loadCart();

    return () => {
      mounted = false;
    };
  }, [user]);

  const addToCart = (newItem: CartItem) => {
    if (!user) {
      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === newItem.id);
        return existingItem
          ? currentItems.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          : [...currentItems, newItem];
      });
      setIsOpen(true);
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id);
      return existingItem
        ? currentItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        : [...currentItems, newItem];
    });

    void (async () => {
      try {
        const updated = await cartApi.addToCart(newItem);
        setItems((currentItems) => mergeCartItems(updated, [...currentItems, newItem]));
      } catch (error) {
        console.warn('Failed to add cart item', error);
      }
    })();

    setIsOpen(true);
  };

  const removeFromCart = (id: number) => {
    const previousItems = items;
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));

    if (!user) return;

    void (async () => {
      try {
        const updated = await cartApi.removeFromCart(id);
        setItems((currentItems) => mergeCartItems(updated, currentItems));
      } catch (error) {
        setItems(previousItems);
        console.warn('Failed to remove cart item', error);
      }
    })();
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    const previousItems = items;
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    if (!user) return;

    void (async () => {
      try {
        const updated = await cartApi.updateQuantity(id, quantity);
        setItems((currentItems) => mergeCartItems(updated, currentItems));
      } catch (error) {
        setItems(previousItems);
        console.warn('Failed to update cart item', error);
      }
    })();
  };

  const toggleCart = (open?: boolean) => {
    setIsOpen((prev) => (open !== undefined ? open : !prev));
  };

  const clearCart = () => {
    const previousItems = items;
    setItems([]);

    if (!user) return;

    void (async () => {
      try {
        const updated = await cartApi.clearCart();
        setItems(normalizeCartItems(updated));
      } catch (error) {
        setItems(previousItems);
        console.warn('Failed to clear cart', error);
      }
    })();
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
