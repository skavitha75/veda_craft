/**
 * Auth Routes - /api/v1/auth
 *
 * Authentication and user session management only.
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  startGoogleLogin,
  sendEmailOtp,
  verifyEmailOtp,
  validateSession,
  logout,
  getMe,
  getProfileStatus,
  refreshToken,
} from '../controllers/authController.js';

const router = Router();

// Public auth/session routes
router.post('/google', startGoogleLogin);
router.post('/otp/send', sendEmailOtp);
router.post('/otp/verify', verifyEmailOtp);
router.get('/session', validateSession);
router.post('/refresh', refreshToken);

// Protected auth/session routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.get('/profile-status', authenticate, getProfileStatus);

export default router;
