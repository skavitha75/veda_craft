import { sendError, sendSuccess } from '../utils/apiResponse.js';
import * as wishlistService from '../services/wishlistService.js';

export const getWishlist = (req, res) => {
  try {
    const wishlist = wishlistService.getWishlist(req.user.id);
    return sendSuccess(res, wishlist, 'Wishlist retrieved successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to fetch wishlist');
  }
};

export const toggleWishlistItem = (req, res) => {
  try {
    const wishlist = wishlistService.toggleItem(req.user.id, req.body);
    return sendSuccess(res, wishlist, 'Wishlist updated');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to update wishlist');
  }
};

export const removeWishlistItem = (req, res) => {
  try {
    const wishlist = wishlistService.removeItem(req.user.id, Number(req.params.id));
    return sendSuccess(res, wishlist, 'Item removed from wishlist');
  } catch (error) {
    return sendError(res, 500, error.message || 'Failed to remove wishlist item');
  }
};
