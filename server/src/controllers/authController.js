// POST /api/auth/login and /api/auth/logout
// Single hardcoded owner account, matching the brief ("basic auth is
// fine — this is not a security exercise"). Credentials come from env
// vars, never committed. Password is compared against a bcrypt hash so
// it isn't sitting in plaintext even in .env.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'owner_token';
const isProd = process.env.NODE_ENV === 'production';

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const validUsername = process.env.ADMIN_USERNAME;
    const validPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const usernameMatches = username === validUsername;
    const passwordMatches = validPasswordHash
      ? await bcrypt.compare(password, validPasswordHash)
      : false;

    if (!usernameMatches || !passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.json({ username });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME);
  res.json({ success: true });
}

export function me(req, res) {
  res.json({ username: req.owner.username });
}
