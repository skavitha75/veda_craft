import { Router } from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, wishlistController.getWishlist);
router.post('/', authenticate, wishlistController.toggleWishlistItem);
router.delete('/:id', authenticate, wishlistController.removeWishlistItem);

export default router;
