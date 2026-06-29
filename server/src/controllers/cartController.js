import { sendError, sendSuccess } from '../utils/apiResponse.js';
import * as cartService from '../services/cartService.js';

const getStatusCode = (error) => error.statusCode || 500;

export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id, req.accessToken);
    return sendSuccess(res, cart, 'Cart retrieved successfully');
  } catch (error) {
    return sendError(res, getStatusCode(error), error.message || 'Failed to fetch cart');
  }
};

export const addToCart = async (req, res) => {
  try {
    const cart = await cartService.addItem(req.user.id, req.body, req.accessToken);
    return sendSuccess(res, cart, 'Item added to cart');
  } catch (error) {
    return sendError(res, getStatusCode(error), error.message || 'Failed to add item to cart');
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const cart = await cartService.updateItemQuantity(
      req.user.id,
      req.params.id,
      req.body.quantity,
      req.accessToken
    );
    return sendSuccess(res, cart, 'Cart updated');
  } catch (error) {
    return sendError(res, getStatusCode(error), error.message || 'Failed to update cart');
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await cartService.removeItem(req.user.id, req.params.id, req.accessToken);
    return sendSuccess(res, cart, 'Item removed from cart');
  } catch (error) {
    return sendError(res, getStatusCode(error), error.message || 'Failed to remove cart item');
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.user.id, req.accessToken);
    return sendSuccess(res, cart, 'Cart cleared');
  } catch (error) {
    return sendError(res, getStatusCode(error), error.message || 'Failed to clear cart');
  }
};
