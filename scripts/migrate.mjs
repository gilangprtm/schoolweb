#!/usr/bin/env node

/**
 * Database Migration Script (Plain JS — no tsx needed)
 *
 * Features:
 * - Auto-detects all .sql files in migrations folder
 * - Tracks applied migrations in `_migrations` table
 * - Skips already-applied migrations
 * - Handles "already exists" errors gracefully
 * - Clear logging (no suppressed errors)
 */

import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "..", "src", "lib", "db", "migrations");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  console.log("⏳ [MIGRATE] Connecting to database...");
  const sql = postgres(databaseUrl, { prepare: false, max: 1 });

  try {
    // Ensure _migrations tracking table exists
    await sql`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Read all .sql files, sorted by name (0000_, 0001_, etc.)
    const files = readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("⏭️  [MIGRATE] No migration files found");
      await sql.end();
      return;
    }

    // Get already-applied migrations
    const applied = await sql`SELECT name FROM _migrations ORDER BY name`;
    const appliedSet = new Set(applied.map((r) => r.name));

    let appliedCount = 0;

    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  ⏭️  ${file} — already applied`);
        continue;
      }

      console.log(`  ⏳ Applying: ${file}`);
      const content = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");

      const statements = content
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      for (let i = 0; i < statements.length; i++) {
        try {
          await sql.unsafe(statements[i]);
        } catch (err) {
          // Safe to skip: relation/constraint/index already exists
          if (
            err.code === "42P07" || // duplicate_table
            err.code === "42710" || // duplicate_object
            err.code === "42P16"    // invalid_table_definition (e.g. column exists)
          ) {
            continue;
          }
          console.error(
            `  ❌ Failed at ${file} statement ${i + 1}/${statements.length}:`
          );
          console.error(`     ${err.message}`);
          await sql.end();
          process.exit(1);
        }
      }

      // Record migration as applied
      await sql`INSERT INTO _migrations (name) VALUES (${file})`;
      console.log(`  ✅ ${file} — applied (${statements.length} statements)`);
      appliedCount++;
    }

    console.log(
      appliedCount > 0
        ? `✅ [MIGRATE] ${appliedCount} migration(s) applied successfully`
        : "✅ [MIGRATE] Database is up to date"
    );

    await sql.end();
  } catch (err) {
    console.error("❌ [MIGRATE] Fatal error:", err.message);
    await sql.end().catch(() => {});
    process.exit(1);
  }
}

main();
