/**
 * Authentication Middleware
 *
 * Verifies the Supabase JWT passed as a Bearer token in the
 * Authorization header, then attaches the decoded user to req.user.
 *
 * Usage:
 *   import { authenticate } from '../middleware/auth.js';
 *   router.get('/protected', authenticate, handler);
 *
 * Optional auth (user may or may not be logged in):
 *   import { optionalAuth } from '../middleware/auth.js';
 *   router.get('/public-or-private', optionalAuth, handler);
 */

import { supabase } from '../config/supabase.js';
import { ensureUserProfile } from '../services/profileService.js';

/**
 * Strict authentication — rejects the request if no valid token is provided.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Authentication required. Please provide a valid Bearer token.',
      });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Invalid or expired token. Please sign in again.',
      });
    }

    // Attach the authenticated user to the request object
    req.user = data.user;
    req.accessToken = token;
    req.profile = await ensureUserProfile(data.user);

    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Optional authentication — sets req.user if a valid token is present,
 * but does NOT reject the request if no token is provided.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const { data } = await supabase.auth.getUser(token);

    req.user = data?.user ?? null;
    req.accessToken = req.user ? token : null;
    req.profile = req.user ? await ensureUserProfile(req.user) : null;

    return next();
  } catch {
    req.user = null;
    return next();
  }
};

/**
 * Role-based access control guard.
 * Requires `authenticate` middleware to run first.
 *
 * @param {...string} roles - Allowed roles (stored in user_metadata.role)
 *
 * Usage:
 *   router.delete('/admin-only', authenticate, requireRole('admin'), handler);
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.user_metadata?.role || 'customer';

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Forbidden. You do not have permission to access this resource.',
      });
    }

    return next();
  };
};
