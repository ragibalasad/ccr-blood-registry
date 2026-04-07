import { PrismaNeonHttp } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/client';
import 'dotenv/config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;

console.log('--- PRISMA DIAGNOSTICS (HTTP) ---');
console.log('DATABASE_URL length:', connectionString?.length ?? 0);

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set. Check your .env file or build settings.');
}

// Initialize the Prisma Client with the official Neon HTTP adapter (v7+)
const adapter = new PrismaNeonHttp(connectionString, {});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
