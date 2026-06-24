/**
 * Auth Routes — /api/v1/auth
 *
 * All authentication endpoints delegated to Supabase Auth.
 * The server acts as a thin proxy and session manager so that
 * sensitive keys never reach the browser.
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh', refreshToken);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
