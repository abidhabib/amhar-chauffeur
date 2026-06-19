/**
 * Setup script — initializes the PGlite Postgres database with the Prisma schema.
 *
 * Run with: bun run scripts/setup-db.ts
 *
 * This generates SQL from the Prisma schema and applies it to PGlite.
 * For production (Neon/Vercel/Supabase Postgres), use standard `prisma db push`.
 */
import { PGlite } from "@electric-sql/pglite";
import { execSync } from "child_process";

const DATA_DIR = "/home/z/my-project/db/pglite";

async function main() {
  console.log("→ Setting up PostgreSQL (PGlite) database…");
  console.log(`  Data directory: ${DATA_DIR}`);

  // Initialize PGlite
  const pglite = new PGlite({ dataDir: DATA_DIR });
  await pglite.waitReady;
  console.log("  ✓ PGlite started");

  // Generate SQL from Prisma schema
  console.log("  → Generating SQL from Prisma schema…");
  let sql: string;
  try {
    sql = execSync(
      "bunx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
      { cwd: "/home/z/my-project", encoding: "utf-8" },
    );
  } catch (e: any) {
    console.error("  ✗ Failed to generate SQL:", e.message);
    await pglite.close();
    process.exit(1);
  }

  // Execute the SQL statement by statement
  console.log("  → Creating tables…");
  const statements = sql
    .split(/;(?=\s*\n)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let applied = 0;
  for (const stmt of statements) {
    try {
      await pglite.query(stmt + ";");
      applied++;
    } catch (e: any) {
      if (!e.message.includes("already exists")) {
        console.error("  ✗ SQL error:", e.message);
        console.error("  Statement:", stmt.slice(0, 200));
      }
    }
  }
  console.log(`  ✓ Applied ${applied} SQL statements`);

  // Verify tables exist
  const tables = await pglite.query(`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
  `);
  console.log("  ✓ Tables in database:");
  for (const row of tables.rows) {
    console.log(`    - ${row.tablename}`);
  }

  await pglite.close();
  console.log("\n✓ Database setup complete. Run `bun run scripts/seed.ts` to seed data.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
