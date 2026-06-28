const cartStore = new Map();

const ensureCart = (userId) => {
  if (!cartStore.has(userId)) {
    cartStore.set(userId, []);
  }
  return cartStore.get(userId);
};

export const getCart = (userId) => {
  return ensureCart(userId);
};

export const addItem = (userId, item) => {
  const cart = ensureCart(userId);
  const existingItem = cart.find((entry) => entry.id === item.id);

  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
    return cart;
  }

  cart.push({ ...item, quantity: item.quantity || 1 });
  return cart;
};

export const updateItemQuantity = (userId, itemId, quantity) => {
  const cart = ensureCart(userId);
  const found = cart.find((entry) => entry.id === itemId);

  if (!found) return cart;

  if (quantity <= 0) {
    return cart.filter((entry) => entry.id !== itemId);
  }

  found.quantity = quantity;
  return cart;
};

export const removeItem = (userId, itemId) => {
  const cart = ensureCart(userId);
  const nextCart = cart.filter((entry) => entry.id !== itemId);
  cartStore.set(userId, nextCart);
  return nextCart;
};

export const clearCart = (userId) => {
  cartStore.set(userId, []);
  return [];
};
