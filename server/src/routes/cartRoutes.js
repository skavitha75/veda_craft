import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, cartController.getCart);
router.post('/', authenticate, cartController.addToCart);
router.put('/:id', authenticate, cartController.updateCartItem);
router.delete('/:id', authenticate, cartController.removeCartItem);
router.delete('/clear', authenticate, cartController.clearCart);

export default router;
