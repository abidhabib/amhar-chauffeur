/**
 * Prisma client singleton — uses PGlite (Postgres in WASM) as the local database
 * via the Prisma driver adapter.
 *
 * In production, replace PGlite with a real Postgres connection string
 * (Neon, Vercel Postgres, Supabase, Railway, etc.) and remove the adapter.
 * The schema and all queries remain identical.
 */
import { PrismaClient } from "@prisma/client";
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pglite: PGlite | undefined;
};

async function createPrismaClient(): Promise<PrismaClient> {
  // Reuse the PGlite instance across hot reloads
  let pglite = globalForPrisma.pglite;
  if (!pglite) {
    pglite = new PGlite({
      // Persist to a local file so data survives restarts
      dataDir: "/home/z/my-project/db/pglite",
    });
    globalForPrisma.pglite = pglite;
    await pglite.waitReady;
  }

  const adapter = new PrismaPGlite(pglite);
  return new PrismaClient({ adapter });
}

// For dev: reuse client across hot reloads
export const db: PrismaClient =
  globalForPrisma.prisma ?? (await createPrismaClient());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
