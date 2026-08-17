import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { getFullConfig, updateConfig, getLeads, exportLeadsCsv } from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth);

router.get('/config', getFullConfig);
router.put('/config', updateConfig);
router.get('/leads', getLeads);
router.get('/leads/export', exportLeadsCsv);

export default router;