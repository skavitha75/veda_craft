import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/create-order', authenticate, paymentController.createRazorpayOrder);
router.post('/verify', authenticate, paymentController.verifyPaymentAndCreateOrder);

export default router;
