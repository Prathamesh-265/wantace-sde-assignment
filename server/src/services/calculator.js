// The pricing engine. This is the one piece of code that must never run
// in the browser — it's the entire reason the estimate is calculated
// server-side instead of client-side.
//
// Formula (documented in full in DECISIONS.md):
//   base material cost = roof_area * rate_per_sqft * (1 + waste_factor)
//   tear-off cost       = roof_area * tear_off_per_sqft
//   subtotal            = (base material + tear-off) * pitch_multiplier * stories_multiplier
//   mid estimate        = subtotal + permit_flat_fee
//   low / high           = mid * (1 - spread), mid * (1 + spread)

function findOption(question, selectedValue) {
  if (!question || !Array.isArray(question.options)) return null;
  return question.options.find((opt) => opt.value === selectedValue) || null;
}

export function calculateEstimate(config, answers) {
  const { questions, modifiers } = config;

  const questionByKey = Object.fromEntries(questions.map((q) => [q.key, q]));

  const roofArea = Number(answers.roof_area);

  const materialOpt = findOption(questionByKey.material, answers.material);
  const pitchOpt = findOption(questionByKey.pitch, answers.pitch);
  const layersOpt = findOption(questionByKey.layers, answers.layers);
  const storiesOpt = findOption(questionByKey.stories, answers.stories);

  const ratePerSqft = Number(materialOpt?.rate_per_sqft ?? 0);
  const pitchMultiplier = Number(pitchOpt?.multiplier ?? 1);
  const tearOffPerSqft = Number(layersOpt?.tear_off_per_sqft ?? 0);
  const storiesMultiplier = Number(storiesOpt?.multiplier ?? 1);

  const wasteFactor = Number(modifiers.waste_factor ?? 0.10);
  const permitFlatFee = Number(modifiers.permit_flat_fee ?? 350);
  const spreadPct = Number(modifiers.range_spread_pct ?? 12) / 100;

  const baseMaterialCost = roofArea * ratePerSqft * (1 + wasteFactor);
  const tearOffCost = roofArea * tearOffPerSqft;
  const subtotal = (baseMaterialCost + tearOffCost) * pitchMultiplier * storiesMultiplier;
  const midEstimate = subtotal + permitFlatFee;

  const estimateLow = Math.round(midEstimate * (1 - spreadPct));
  const estimateHigh = Math.round(midEstimate * (1 + spreadPct));

  return { estimateLow, estimateHigh };
}
