// Guards the owner panel routes. Reads a JWT out of an httpOnly cookie
// (set at login) rather than an Authorization header, so the frontend
// never has to touch or store the token directly.

import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.cookies?.owner_token;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.owner = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }
}
