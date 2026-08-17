// POST /api/estimate
// Public. Takes contact details + answers, re-validates everything against
// the CURRENT active config (never trusts anything the client computed),
// calculates the range server-side, and stores the lead.

import { prisma } from "../config/db.js";
import { calculateEstimate } from "../services/calculator.js";
import { validateAnswers, validateContact } from "../utils/validate.js";

export async function submitEstimate(req, res, next) {
  try {
    const { name, phone, email, answers } = req.body;

    const config = await prisma.config.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!config) {
      return res.status(404).json({ error: "No active configuration found." });
    }

    const contactErrors = validateContact({ name, phone, email });
    const answerErrors = validateAnswers(config, answers);
    const allErrors = [...contactErrors, ...answerErrors];

    if (allErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation failed.", details: allErrors });
    }

    const { estimateLow, estimateHigh } = calculateEstimate(config, answers);

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        answers,
        estimateLow,
        estimateHigh,
        configVersion: config.configVersion,
      },
    });

    res.status(201).json({
      lead_id: lead.id,
      estimate_low: estimateLow,
      estimate_high: estimateHigh,
      currency: config.business?.currency || "USD",
    });
  } catch (err) {
    next(err);
  }
}
