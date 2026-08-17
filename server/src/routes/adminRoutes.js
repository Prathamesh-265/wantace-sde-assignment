import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getFullConfig, updateConfig, getLeads } from '../controllers/adminController.js';

const router = Router();

// Every route below requires a valid owner session.
router.use(requireAuth);

router.get('/config', getFullConfig);
router.put('/config', updateConfig);
router.get('/leads', getLeads);

export default router;
