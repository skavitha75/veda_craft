import { createScopedClient } from '../config/supabase.js';
import { AppError } from '../utils/apiResponse.js';

const CART_PRODUCT_COLUMNS = `
  id,
  name,
  price,
  discount_price,
  rating,
  image_url
`;

const normalizeProductId = (value) => {
  const productId = Number(value);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError('Product id is required', 400);
  }

  return productId;
};

const normalizeQuantity = (value, fallback = 1) => {
  const quantity = Number(value ?? fallback);

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new AppError('Quantity must be a positive integer', 400);
  }

  return quantity;
};

const getItemSnapshot = (item) => {
  const price = Number(item?.price);
  const rating = Number(item?.rating);

  return {
    product_name: item?.name || null,
    product_price: Number.isFinite(price) ? price : null,
    product_image: item?.image || null,
    product_rating: Number.isFinite(rating) ? rating : null,
  };
};

const getOrCreateCart = async (userId, token) => {
  const supabase = createScopedClient(token);

  const { data: existing, error: lookupError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (lookupError) throw new AppError(lookupError.message, 500);
  if (existing?.id) return existing.id;

  const { data: created, error: createError } = await supabase
    .from('carts')
    .insert({ user_id: userId })
    .select('id')
    .single();

  if (createError) throw new AppError(createError.message, 500);
  return created.id;
};

const mapCartRow = (row) => {
  const product = row.product || {};
  const price = product.discount_price ?? product.price ?? row.product_price ?? 0;

  return {
    id: product.id ?? row.product_id,
    name: product.name || row.product_name || 'Product',
    price: Number(price),
    image: product.image_url || row.product_image || '',
    quantity: row.quantity,
    rating: product.rating === null || product.rating === undefined
      ? row.product_rating === null || row.product_rating === undefined
        ? undefined
        : Number(row.product_rating)
      : Number(product.rating),
  };
};

export const getCart = async (userId, token) => {
  const supabase = createScopedClient(token);

  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (cartError) throw new AppError(cartError.message, 500);
  if (!cart?.id) return [];

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      product_id,
      product_name,
      product_price,
      product_image,
      product_rating,
      quantity,
      created_at,
      product:products (${CART_PRODUCT_COLUMNS})
    `)
    .eq('cart_id', cart.id)
    .order('created_at', { ascending: true });

  if (error) throw new AppError(error.message, 500);

  return (data || []).map(mapCartRow).filter((item) => item.id);
};

export const addItem = async (userId, item, token) => {
  const productId = normalizeProductId(item?.id ?? item?.product_id);
  const quantity = normalizeQuantity(item?.quantity, 1);
  const snapshot = getItemSnapshot(item);
  const supabase = createScopedClient(token);
  const cartId = await getOrCreateCart(userId, token);

  const { data: existing, error: lookupError } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .maybeSingle();

  if (lookupError) throw new AppError(lookupError.message, 500);

  if (existing) {
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity, ...snapshot })
      .eq('id', existing.id);

    if (updateError) throw new AppError(updateError.message, 500);
    return getCart(userId, token);
  }

  const { error: insertError } = await supabase
    .from('cart_items')
    .insert({ cart_id: cartId, product_id: productId, quantity, ...snapshot });

  if (insertError) throw new AppError(insertError.message, 500);

  return getCart(userId, token);
};

export const updateItemQuantity = async (userId, productIdValue, quantityValue, token) => {
  const productId = normalizeProductId(productIdValue);
  const quantity = normalizeQuantity(quantityValue);
  const supabase = createScopedClient(token);
  const cartId = await getOrCreateCart(userId, token);

  const { data: existing, error: lookupError } = await supabase
    .from('cart_items')
    .select('id')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .maybeSingle();

  if (lookupError) throw new AppError(lookupError.message, 500);
  if (!existing) throw new AppError('Cart item not found', 404);

  const { error: updateError } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', existing.id);

  if (updateError) throw new AppError(updateError.message, 500);

  return getCart(userId, token);
};

export const removeItem = async (userId, productIdValue, token) => {
  const productId = normalizeProductId(productIdValue);
  const supabase = createScopedClient(token);
  const cartId = await getOrCreateCart(userId, token);

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId)
    .eq('product_id', productId);

  if (error) throw new AppError(error.message, 500);

  return getCart(userId, token);
};

export const clearCart = async (userId, token) => {
  const supabase = createScopedClient(token);
  const cartId = await getOrCreateCart(userId, token);

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (error) throw new AppError(error.message, 500);

  return [];
};
