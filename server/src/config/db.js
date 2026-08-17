// Single shared Prisma client. Importing this everywhere instead of
// `new PrismaClient()` per-file avoids exhausting connections in dev
// (nodemon restarts) and keeps things simple.

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
