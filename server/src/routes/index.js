/**
 * Centralized API Router — /api/v1
 *
 * All feature routers are registered here.
 * Add new routers below as features are built.
 */

import { Router } from 'express';
import healthRouter from './health.js';
import authRouter from './auth.js';

const router = Router();

// ─── Core Routes ─────────────────────────────────────────────────────────────
router.use('/health', healthRouter);
router.use('/auth', authRouter);

// ─── Future Feature Routes (add here when ready) ─────────────────────────────
// router.use('/products',  productsRouter);
// router.use('/categories', categoriesRouter);
// router.use('/cart',      cartRouter);
// router.use('/wishlist',  wishlistRouter);
// router.use('/orders',    ordersRouter);
// router.use('/payments',  paymentsRouter);
// router.use('/users',     usersRouter);

export default router;
