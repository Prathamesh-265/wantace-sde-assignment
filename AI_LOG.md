# AI_LOG.md

## Tools used

Claude (Sonnet), used through an AI coding assistant, for the majority of scaffolding: folder structure, Prisma schema, the pricing calculator, and the React components.

## Where AI output needed correction

- The AI's first draft of `PUT /api/admin/config` updated the config row in place, which risked a homeowner reading a half-changed config mid-estimate while Dale was saving — exactly what he said couldn't happen. Fixed it to insert a new versioned row and flip `active` instead.
- The owner panel's lead table broke on the legacy seed lead (`ld_0917`), which has old fields (`chimney_count`, `gutter_replace`) that don't exist in the current config. Fixed it to render whatever's actually stored on the lead, not matched against today's questions.

## Parts of the codebase I wrote or substantially reworked myself

- Input validation on `POST /api/estimate` — rejects out-of-range or missing answers instead of silently computing a bad estimate.
- Auth middleware on all `/api/admin/*` routes — verifies the JWT cookie, returns 401 if missing or invalid.
- `GET /api/config` filtering — public endpoint returns only active questions; owner panel fetch returns all.
- Dynamic form renderer's number/select handling, including range validation messages.
- Seed script normalizes the string multiplier (`"1.12"`) to a number before storing, so the calculator never has to guard against mixed types.
