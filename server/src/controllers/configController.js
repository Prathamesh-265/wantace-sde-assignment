// GET /api/config
// Public. Returns the active question set + business info that the
// estimator wizard needs. Nothing here reveals which fields are secret
// (there's no separate "secret" field — rates live in the question
// options because the owner panel needs to edit them too), but this is
// the same document the frontend renders from, by design: no separate
// hardcoded copy can drift out of sync with what Dale sees in the panel.

import { prisma } from '../config/db.js';

export async function getActiveConfig(req, res, next) {
  try {
    const config = await prisma.config.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!config) {
      return res.status(404).json({ error: 'No active configuration found.' });
    }

    const activeQuestions = config.questions
      .filter((q) => q.active)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    res.json({
      config_version: config.configVersion,
      business: config.business,
      questions: activeQuestions,
    });
  } catch (err) {
    next(err);
  }
}
