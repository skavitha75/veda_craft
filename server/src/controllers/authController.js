/**
 * Auth Controller
 *
 * Handles all authentication logic by communicating with Supabase Auth.
 * All sensitive operations are performed server-side using the anon client
 * with the user's credentials.
 */

import { supabase } from '../config/supabase.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * POST /api/v1/auth/register
 * Creates a new Supabase user account.
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: full_name || '' },
      },
    });

    if (error) return sendError(res, 400, error.message);

    return sendSuccess(
      res,
      { user: data.user },
      'Registration successful. Please check your email to confirm your account.',
      201
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/v1/auth/login
 * Signs in an existing user and returns session tokens.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return sendError(res, 401, error.message);

    return sendSuccess(
      res,
      {
        user: data.user,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      },
      'Login successful.'
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/v1/auth/logout
 * Signs out the current user (requires auth token).
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    const { error } = await supabase.auth.admin
      ? await supabase.auth.signOut()
      : { error: null };

    if (error) return sendError(res, 500, 'Logout failed. Please try again.');

    return sendSuccess(res, null, 'Logged out successfully.');
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/v1/auth/me
 * Returns the currently authenticated user's profile (requires auth token).
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by the `authenticate` middleware
    return sendSuccess(res, { user: req.user }, 'User profile retrieved.');
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Exchanges a refresh token for a new access token.
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return sendError(res, 400, 'refresh_token is required.');
    }

    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) return sendError(res, 401, error.message);

    return sendSuccess(
      res,
      {
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      },
      'Token refreshed successfully.'
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/v1/auth/forgot-password
 * Sends a password reset email via Supabase Auth.
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, 'Email is required.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.ALLOWED_ORIGINS?.split(',')[0]}/reset-password`,
    });

    if (error) return sendError(res, 400, error.message);

    // Always return success to avoid email enumeration
    return sendSuccess(res, null, 'If an account with that email exists, a reset link has been sent.');
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/v1/auth/reset-password
 * Updates the user's password using a valid reset token.
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { access_token, new_password } = req.body;

    if (!access_token || !new_password) {
      return sendError(res, 400, 'access_token and new_password are required.');
    }

    // Set the session using the token from the email link
    const { error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: access_token,
    });

    if (sessionError) return sendError(res, 401, 'Invalid or expired reset token.');

    const { error } = await supabase.auth.updateUser({ password: new_password });

    if (error) return sendError(res, 400, error.message);

    return sendSuccess(res, null, 'Password has been reset successfully. Please log in.');
  } catch (err) {
    return next(err);
  }
};
