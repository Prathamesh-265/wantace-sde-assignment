# DECISIONS.md

## Stack choice

React (Vite) + Tailwind on the frontend, Node/Express on the backend, PostgreSQL via Prisma for persistence. Postgres over MongoDB because the config shape (questions with typed fields, nested options) benefits from a schema Prisma can validate at the type level, and Neon's free tier gives a zero-setup hosted database for both dev and production. JWT in an httpOnly cookie for owner auth rather than a bare Basic Auth header — same security bar the brief allows, but avoids browsers repeatedly prompting a native auth dialog and lets the frontend show a proper login form.

## Cost formula, in plain language

For a given roof: take the square footage and multiply by the material's cost per square foot, then add 10% on top for waste. Add a separate tear-off charge based on how many layers of old roofing need removing. Multiply that whole subtotal by two adjustment factors — one for how steep the roof is, one for how many storeys the house has — since both make the job harder. Add a flat $350 permit fee. That total is the "mid" estimate. The customer sees a range 12% below and 12% above that number, rather than a single figure, since a homeowner's actual price depends on details a form can't capture.

## What was deliberately left out of scope

- Complex role permissions (owner vs. bookkeeper distinction) — Dale and Marcus share one login. The brief doesn't ask for separate permission levels, and building real RBAC for two users in a 24-hour build is effort better spent elsewhere.
- Multi-tenancy — this is a single-business tool. Config table isn't scoped by business ID.
- Config version history UI, CSV export, webhooks, adding entirely new questions from the panel — these are the brief's own listed stretch goals, intentionally skipped in favor of a fully working core over a partially working extended feature set.
- Automated tests — also a listed stretch goal; the calculation logic is small and deterministic enough that manual verification against the formula was prioritized given the time budget.

## Seed data oddities and how they were handled

- `pitch.medium.multiplier` arrived as the string `"1.12"` instead of a number. Normalized to a numeric `1.12` at seed time, and the calculator also coerces every rate/multiplier with `Number(...)` as a defensive second layer, since a future config edit through the owner panel could reintroduce a string.
- The historical lead for Bill Tanner (`config_version: 1`) uses an answer shape that doesn't exist in the current schema — `slate_natural` isn't a valid material option, and `chimney_count` / `gutter_replace` aren't current questions. Rather than force that record into today's structure (which would mean inventing data that was never actually collected under the current config), it was left out of the seed. The `Lead.answers` field is stored as JSON specifically so old, differently-shaped answer sets remain valid and readable if they existed in a real migration — this is a deliberate design choice for handling schema drift over time, just not exercised for this one synthetic record.

## Questions for Dale before a real production launch

- When a price changes, should past leads' estimate ranges stay frozen at what the customer originally saw, or does Dale want a way to see "what would this lead cost today"? (Currently they're frozen, tagged with `config_version`.)
- Does Marcus need his own login separate from Dale's, for accountability on who changed what?
- Is there a lead volume or notification expectation — should Dale get a text/email the moment a new lead comes in, or is checking the panel periodically enough?
- Are there regulatory/licensing disclosures Ohio requires on a cost-estimate tool that should appear on the public form?

## What I'd do next with another week

- Config version history so Dale can see what changed and roll back a bad edit.
- CSV export of leads.
- A "duplicate and edit" flow so the owner can add genuinely new questions instead of only editing existing ones.
- Automated tests around the calculation engine, especially edge cases like a roof area at exactly `min`/`max`.
- Basic analytics on the estimator (drop-off rate per step) so Dale can see if a question is causing homeowners to abandon the form.
