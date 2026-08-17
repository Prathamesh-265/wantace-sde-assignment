// Protected owner panel endpoints: editing config and viewing leads.

import { prisma } from "../config/db.js";

// GET /api/admin/config
// Same shape as the public one but includes inactive questions too, so
// the owner can re-enable something they'd switched off.
export async function getFullConfig(req, res, next) {
  try {
    const config = await prisma.config.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!config) {
      return res.status(404).json({ error: "No active configuration found." });
    }

    res.json({
      config_version: config.configVersion,
      business: config.business,
      questions: config.questions,
      modifiers: config.modifiers,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/config
// Accepts the full questions array + modifiers, bumps config_version,
// and writes a brand new row rather than mutating in place — that way
// a page mid-flow that already fetched the old config keeps working
// (Dale's "can't take the site down while I'm editing" requirement).
export async function updateConfig(req, res, next) {
  try {
    const { questions, modifiers, business } = req.body;

    if (!Array.isArray(questions) || typeof modifiers !== "object") {
      return res
        .status(400)
        .json({
          error: "questions (array) and modifiers (object) are required.",
        });
    }

    const current = await prisma.config.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    const nextVersion = (current?.configVersion || 0) + 1;

    await prisma.config.updateMany({ data: { isActive: false } });

    const updated = await prisma.config.create({
      data: {
        configVersion: nextVersion,
        business: business || current?.business,
        questions,
        modifiers,
        isActive: true,
      },
    });

    res.json({
      config_version: updated.configVersion,
      business: updated.business,
      questions: updated.questions,
      modifiers: updated.modifiers,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/leads/export
// Streams all leads back as a CSV file for download.
export async function exportLeadsCsv(req, res, next) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { capturedAt: "desc" },
    });

    const headers = [
      "Name",
      "Phone",
      "Email",
      "Submitted",
      "Estimate Low",
      "Estimate High",
      "Config Version",
      "Answers",
    ];

    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`;

    const rows = leads.map((lead) =>
      [
        lead.name,
        `="${lead.phone}"`,
        lead.email,
        lead.capturedAt.toISOString(),
        lead.estimateLow,
        lead.estimateHigh,
        lead.configVersion,
        JSON.stringify(lead.answers),
      ]
        .map(escapeCsv)
        .join(","),
    );

    const csv = [headers.map(escapeCsv).join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="leads-export.csv"',
    );
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/leads
export async function getLeads(req, res, next) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { capturedAt: "desc" },
    });

    res.json(
      leads.map((lead) => ({
        id: lead.id,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        answers: lead.answers,
        estimate_low: lead.estimateLow,
        estimate_high: lead.estimateHigh,
        config_version: lead.configVersion,
        captured_at: lead.capturedAt,
      })),
    );
  } catch (err) {
    next(err);
  }
}
