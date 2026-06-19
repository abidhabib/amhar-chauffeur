/**
 * Prisma client singleton — uses standard PostgreSQL via the `pg` driver
 * and Prisma's driver adapter.
 *
 * DATABASE_URL must point to a real PostgreSQL connection string.
 * Recommended providers (all have free tiers):
 *   - Neon:        https://neon.tech
 *   - Supabase:    https://supabase.com/database
 *   - Railway:     https://railway.app
 *   - Vercel Postgres: https://vercel.com/storage/postgres
 *   - Or run Postgres locally via Docker
 *
 * For local dev without a remote DB, the simplest options are:
 *   1. Neon free tier (no install needed) — recommended
 *   2. Docker:  docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
 */
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is required. " +
      "Set it to a PostgreSQL connection string (e.g. postgresql://user:pass@host:5432/db). " +
      "Get a free one at https://neon.tech"
    );
  }

  // Reuse the connection pool across hot reloads in dev
  let pool = globalForPrisma.pgPool;
  if (!pool) {
    pool = new Pool({
      connectionString,
      // Neon and other serverless Postgres providers need SSL
      ssl: connectionString.includes("neon.tech") ||
           connectionString.includes("vercel-storage") ||
           connectionString.includes("supabase.co")
        ? { rejectUnauthorized: false }
        : false,
      max: 10, // connection pool size
    });
    if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const db: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
