import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getActiveConfig } from '../controllers/configController.js';
import { submitEstimate } from '../controllers/estimateController.js';
import { login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// A homeowner has no reason to hit this dozens of times a minute; keeps
// the estimate endpoint from being hammered or used to brute-force
// pricing data.
const estimateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Please try again later.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts. Please try again later.' },
});

router.get('/config', getActiveConfig);
router.post('/estimate', estimateLimiter, submitEstimate);

router.post('/auth/login', loginLimiter, login);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAuth, me);

export default router;
