// ─────────────────────────────────────────────────────────────────────────────
// middleware/errorHandler.js
// Global Express error-handling middleware.
// Must be registered LAST in server.js (after all routes).
// Any route/controller that calls next(error) lands here.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * errorHandler — formats and sends error responses consistently.
 *
 * Express identifies error middleware by its 4-argument signature: (err, req, res, next).
 * Never remove the `next` parameter even if unused — Express requires it.
 */
const errorHandler = (err, req, res, next) => {
  // Respect HTTP status set by upstream code, or default to 500
  const statusCode = err.statusCode || res.statusCode || 500;

  // Don't leak internal stack traces in production
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[Error] ${statusCode} — ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Stack trace only visible in development
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
