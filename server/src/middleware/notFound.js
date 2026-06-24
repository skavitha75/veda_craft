/**
 * 404 Not Found Middleware
 * Catches any request that didn't match a route and returns a 404.
 */

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    status: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
