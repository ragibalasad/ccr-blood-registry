import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Robust connection string extraction
const connectionString = (process.env.DATABASE_URL || "file:./dev.db").toString();
const dbFile = connectionString.includes("file:") ? connectionString.replace("file:", "") : connectionString;

// Initialize the SQLite database connection using absolute path for robustness
const adapter = new PrismaBetterSqlite3({ url: dbFile });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Singleton Prisma instance for Next.js 15
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
