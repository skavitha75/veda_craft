/**
 * Auth Controller
 *
 * Handles Supabase Auth login/session flows and server-side profile sync.
 */

import { supabase, supabaseAdmin } from '../config/supabase.js';
import { ensureUserProfile, getProfileCompletionStatus } from '../services/profileService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const getRedirectTo = (req) => {
  const requestedRedirect = req.body?.redirect_to || req.query?.redirect_to;
  const defaultOrigin = process.env.ALLOWED_ORIGINS?.split(',')[0]?.trim();

  return requestedRedirect || process.env.AUTH_REDIRECT_URL || defaultOrigin;
};

const formatSession = (session) => {
  if (!session) return null;

  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    token_type: session.token_type,
    expires_in: session.expires_in,
    expires_at: session.expires_at,
  };
};

const buildAuthPayload = async (user, session = null) => {
  const profile = await ensureUserProfile(user);

  return {
    user,
    profile,
    profile_status: getProfileCompletionStatus(profile),
    session: formatSession(session),
  };
};

/**
 * POST /api/v1/auth/google
 * Creates a Supabase Google OAuth authorization URL.
 */
export const startGoogleLogin = async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectTo(req),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) return sendError(res, 400, error.message);

    return sendSuccess(res, { url: data.url, provider: 'google' }, 'Google login URL created.');
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/v1/auth/otp/send
 * Sends a Supabase email OTP/magic link.
 */
export const sendEmailOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, 'Email is required.');
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: getRedirectTo(req),
      },
    });

    if (error) return sendError(res, 400, error.message);

    return sendSuccess(res, null, 'OTP sent. Please check your email.');
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/v1/auth/otp/verify
 * Verifies an email OTP and returns a Supabase session.
 */
export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, token, type = 'email' } = req.body;

    if (!email || !token) {
      return sendError(res, 400, 'Email and token are required.');
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });

    if (error) return sendError(res, 401, error.message);

    const payload = await buildAuthPayload(data.user, data.session);

    return sendSuccess(res, payload, 'OTP verified. Login successful.');
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/v1/auth/session
 * Validates a Bearer access token and returns user/session state.
 */
export const validateSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Authentication required. Please provide a valid Bearer token.');
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return sendError(res, 401, 'Invalid or expired token. Please sign in again.');
    }

    const payload = await buildAuthPayload(data.user);

    return sendSuccess(res, payload, 'Session is valid.');
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

    const payload = await buildAuthPayload(data.user, data.session);

    return sendSuccess(res, payload, 'Token refreshed successfully.');
  } catch (err) {
    return next(err);
  }
};

/**
 * POST /api/v1/auth/logout
 * Revokes the current Supabase Auth session where possible.
 */
export const logout = async (req, res, next) => {
  try {
    if (supabaseAdmin && req.accessToken) {
      const { error } = await supabaseAdmin.auth.admin.signOut(req.accessToken);

      if (error) return sendError(res, 500, 'Logout failed. Please try again.');
    }

    return sendSuccess(res, null, 'Logged out successfully.');
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/v1/auth/me
 * Returns the currently authenticated user's auth record and profile.
 */
export const getMe = async (req, res, next) => {
  try {
    return sendSuccess(
      res,
      {
        user: req.user,
        profile: req.profile,
        profile_status: getProfileCompletionStatus(req.profile),
      },
      'Authenticated user retrieved.'
    );
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/v1/auth/profile-status
 * Returns whether the authenticated user has completed required profile fields.
 */
export const getProfileStatus = async (req, res, next) => {
  try {
    return sendSuccess(
      res,
      getProfileCompletionStatus(req.profile),
      'Profile completion status retrieved.'
    );
  } catch (err) {
    return next(err);
  }
};
