import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const connectionString = process.env.DATABASE_URL || "file:./dev.db";
const dbFile = connectionString.replace("file:", "");

const sqlite = new Database(dbFile);
const adapter = new PrismaBetterSqlite3(sqlite);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
