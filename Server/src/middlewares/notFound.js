/**
 * Global 404 handler — mounted after all route definitions.
 */
export function notFound(req, res, _next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}
