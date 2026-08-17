// Catches anything thrown or passed to next(err) so we always return
// consistent JSON instead of leaking stack traces to the client.

export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong on our end.' : err.message;

  res.status(status).json({ error: message });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found.' });
}
