/**
 * Wraps an async route handler so you don't need try/catch in every controller.
 * Usage: router.get('/path', catchAsync(myController))
 */
export const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
