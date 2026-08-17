// Loads the client's seed configuration into the database.
// Run with: npm run seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Straight from the brief. Note pitch "medium" multiplier came in as a
// string ("1.12") in the original export — normalized to a number here
// so the calculator never has to worry about it. See DECISIONS.md.
const seedConfig = {
  configVersion: 3,
  business: {
    name: 'Northline Roofing & Exteriors',
    region: 'Columbus, OH',
    currency: 'USD',
  },
  questions: [
    {
      key: 'roof_area',
      label: 'Roughly how big is your roof?',
      type: 'number',
      unit: 'sq ft',
      required: true,
      min: 300,
      max: 12000,
      active: true,
      order: 1,
    },
    {
      key: 'material',
      label: 'What material do you want?',
      type: 'select',
      required: true,
      active: true,
      order: 2,
      options: [
        { value: 'asphalt_3tab', label: 'Asphalt shingle - 3-tab', rate_per_sqft: 4.25 },
        { value: 'asphalt_arch', label: 'Asphalt shingle - architectural', rate_per_sqft: 5.90 },
        { value: 'metal_standing', label: 'Standing seam metal', rate_per_sqft: 12.40 },
        { value: 'cedar_shake', label: 'Cedar shake', rate_per_sqft: 11.10 },
      ],
    },
    {
      key: 'pitch',
      label: 'How steep is the roof?',
      type: 'select',
      required: true,
      active: true,
      order: 3,
      options: [
        { value: 'low', label: 'Low - you could walk on it', multiplier: 1.0 },
        { value: 'medium', label: 'Medium', multiplier: 1.12 },
        { value: 'steep', label: 'Steep - not walkable', multiplier: 1.30 },
      ],
    },
    {
      key: 'layers',
      label: 'How many layers of old roofing are on there now?',
      type: 'select',
      required: true,
      active: true,
      order: 4,
      options: [
        { value: '0', label: 'None - new build', tear_off_per_sqft: 0 },
        { value: '1', label: 'One layer', tear_off_per_sqft: 1.15 },
        { value: '2', label: 'Two or more layers', tear_off_per_sqft: 2.05 },
      ],
    },
    {
      key: 'stories',
      label: 'How many stories is the house?',
      type: 'select',
      required: true,
      active: true,
      order: 5,
      options: [
        { value: '1', label: 'Single storey', multiplier: 1.0 },
        { value: '2', label: 'Two storeys', multiplier: 1.08 },
        { value: '3', label: 'Three or more', multiplier: 1.18 },
      ],
    },
  ],
  modifiers: {
    waste_factor: 0.10,
    permit_flat_fee: 350,
    range_spread_pct: 12,
  },
};

async function main() {
  // Deactivate any existing configs, then insert this one as the active row.
  await prisma.config.updateMany({ data: { isActive: false } });

  const created = await prisma.config.create({
    data: {
      configVersion: seedConfig.configVersion,
      business: seedConfig.business,
      questions: seedConfig.questions,
      modifiers: seedConfig.modifiers,
      isActive: true,
    },
  });

  console.log(`Seeded config v${created.configVersion} (id: ${created.id})`);

  // The two "clean" historical leads from the brief that match the current
  // question set. The slate/chimney one from v1 is deliberately skipped —
  // see DECISIONS.md for why we didn't try to shoehorn legacy answer shapes
  // into today's schema.
  const existingLeads = await prisma.lead.count();
  if (existingLeads === 0) {
    await prisma.lead.createMany({
      data: [
        {
          name: 'Ana Ruiz',
          phone: '+1-614-555-0148',
          email: 'aruiz@example.com',
          answers: { roof_area: 2100, material: 'asphalt_arch', pitch: 'medium', layers: '1', stories: '2' },
          estimateLow: 21480,
          estimateHigh: 27260,
          configVersion: 3,
          capturedAt: new Date('2026-06-02T14:20:11Z'),
        },
        {
          name: 'Priya Nair',
          phone: '+1-614-555-0177',
          email: 'pnair@example.com',
          answers: { roof_area: 900, material: 'metal_standing', pitch: 'low', layers: '0', stories: '1' },
          estimateLow: 12240,
          estimateHigh: 15530,
          configVersion: 3,
          capturedAt: new Date('2026-07-11T18:47:03Z'),
        },
      ],
    });
    console.log('Seeded 2 historical leads');
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
