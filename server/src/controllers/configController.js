// GET /api/config

import { prisma } from "../config/db.js";

export async function getActiveConfig(req, res, next) {
  try {
    const config = await prisma.config.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!config) {
      return res.status(404).json({ error: "No active configuration found." });
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
