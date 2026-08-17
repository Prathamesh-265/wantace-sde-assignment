// Validates a submitted answers payload against the currently active
// config. Keeps this separate from the controller so the "what counts as
// a valid answer" logic isn't tangled up with HTTP concerns.

export function validateAnswers(config, answers) {
  const errors = [];
  const activeQuestions = config.questions.filter((q) => q.active);

  for (const question of activeQuestions) {
    const value = answers ? answers[question.key] : undefined;

    if (question.required && (value === undefined || value === null || value === '')) {
      errors.push(`${question.label} is required.`);
      continue;
    }

    if (value === undefined || value === null || value === '') continue;

    if (question.type === 'number') {
      const numeric = Number(value);
      if (Number.isNaN(numeric)) {
        errors.push(`${question.label} must be a number.`);
        continue;
      }
      if (question.min !== undefined && numeric < question.min) {
        errors.push(`${question.label} must be at least ${question.min}.`);
      }
      if (question.max !== undefined && numeric > question.max) {
        errors.push(`${question.label} must be at most ${question.max}.`);
      }
    }

    if (question.type === 'select') {
      const validValues = (question.options || []).map((opt) => opt.value);
      if (!validValues.includes(value)) {
        errors.push(`${question.label} has an invalid selection.`);
      }
    }
  }

  return errors;
}

export function validateContact({ name, phone, email }) {
  const errors = [];

  if (!name || !name.trim()) errors.push('Name is required.');
  if (!phone || !phone.trim()) errors.push('Phone is required.');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) errors.push('A valid email is required.');

  return errors;
}
