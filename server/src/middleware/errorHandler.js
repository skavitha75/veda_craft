/**
 * Centralized Error Handling Middleware
 *
 * Catches all errors passed via next(err) and returns a
 * consistent JSON error response. Must be registered LAST
 * in the middleware chain (4-argument signature).
 */

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Log the full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    // Minimal logging in production
    console.error(`[Error] ${req.method} ${req.path} — ${err.message}`);
  }

  // Determine HTTP status code
  const statusCode = err.statusCode || err.status || 500;

  // Build the response payload
  const payload = {
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Attach validation errors if present (e.g., from express-validator)
  if (err.errors) {
    payload.errors = err.errors;
  }

  return res.status(statusCode).json(payload);
};
