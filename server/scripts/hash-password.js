// Usage: node scripts/hash-password.js "your-password-here"
// Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in your .env file.

import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js "your-password-here"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(hash);
