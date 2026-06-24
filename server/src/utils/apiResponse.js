/**
 * API Response Utilities
 *
 * Provides consistent success and error response shapes across all controllers.
 *
 * Usage:
 *   import { sendSuccess, sendError, AppError } from '../utils/apiResponse.js';
 *
 *   sendSuccess(res, { token }, 'Logged in successfully');
 *   sendError(res, 400, 'Invalid credentials');
 *   next(new AppError('Not found', 404));
 */

/**
 * Send a standardized success response.
 *
 * @param {import('express').Response} res
 * @param {any} data - Response payload
 * @param {string} [message='Success']
 * @param {number} [statusCode=200]
 * @param {object} [meta] - Optional pagination / extra metadata
 */
export const sendSuccess = (res, data, message = 'Success', statusCode = 200, meta = null) => {
  const payload = {
    success: true,
    status: statusCode,
    message,
    data,
  };

  if (meta) payload.meta = meta;

  return res.status(statusCode).json(payload);
};

/**
 * Send a standardized error response (without throwing).
 *
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} [errors] - Optional validation errors array
 */
export const sendError = (res, statusCode, message, errors = null) => {
  const payload = {
    success: false,
    status: statusCode,
    message,
  };

  if (errors) payload.errors = errors;

  return res.status(statusCode).json(payload);
};

/**
 * Custom application error class.
 * Pass instances to next() to trigger the centralized errorHandler middleware.
 *
 * @example
 *   throw new AppError('Product not found', 404);
 *   next(new AppError('Unauthorized', 401));
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} [statusCode=500]
   * @param {any} [errors]
   */
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}
