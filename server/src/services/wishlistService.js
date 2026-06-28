const wishlistStore = new Map();

const ensureWishlist = (userId) => {
  if (!wishlistStore.has(userId)) {
    wishlistStore.set(userId, []);
  }
  return wishlistStore.get(userId);
};

export const getWishlist = (userId) => {
  return ensureWishlist(userId);
};

export const toggleItem = (userId, product) => {
  const wishlist = ensureWishlist(userId);
  const existing = wishlist.find((entry) => entry.id === product.id);

  if (existing) {
    const next = wishlist.filter((entry) => entry.id !== product.id);
    wishlistStore.set(userId, next);
    return next;
  }

  wishlist.push(product);
  return wishlist;
};

export const removeItem = (userId, productId) => {
  const wishlist = ensureWishlist(userId);
  const nextWishlist = wishlist.filter((entry) => entry.id !== productId);
  wishlistStore.set(userId, nextWishlist);
  return nextWishlist;
};
