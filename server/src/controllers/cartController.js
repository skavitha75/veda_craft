import { sendError, sendSuccess } from '../utils/apiResponse.js';
import * as cartService from '../services/cartService.js';

export const getCart = (req, res) => {
  try {
    const cart = cartService.getCart(req.user.id);
    return sendSuccess(res, cart, 'Cart retrieved successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch cart');
  }
};

export const addToCart = (req, res) => {
  try {
    const cart = cartService.addItem(req.user.id, req.body);
    return sendSuccess(res, cart, 'Item added to cart');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to add item to cart');
  }
};

export const updateCartItem = (req, res) => {
  try {
    const cart = cartService.updateItemQuantity(req.user.id, Number(req.params.id), Number(req.body.quantity));
    return sendSuccess(res, cart, 'Cart updated');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to update cart');
  }
};

export const removeCartItem = (req, res) => {
  try {
    const cart = cartService.removeItem(req.user.id, Number(req.params.id));
    return sendSuccess(res, cart, 'Item removed from cart');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to remove cart item');
  }
};

export const clearCart = (req, res) => {
  try {
    const cart = cartService.clearCart(req.user.id);
    return sendSuccess(res, cart, 'Cart cleared');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to clear cart');
  }
};
