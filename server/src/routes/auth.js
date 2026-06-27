/**
 * Auth Routes — /api/v1/auth
 * Placeholder — extend with login/register/logout as needed.
 */

import { Router } from 'express';

const router = Router();

// GET /api/v1/auth/status — simple health check for auth route
router.get('/status', (_req, res) => {
  res.json({ success: true, message: 'Auth route is active' });
});

export default router;
