/**
 * Skrip migrasi database langsung (tanpa drizzle-kit).
 * Baca file SQL & execute via postgres.js
 * Jauh lebih reliable daripada npx drizzle-kit push
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL tidak di-set');
    process.exit(1);
  }

  console.log(`⏳ [SIRA-MIGRATE] Connecting to database...`);
  const sql = postgres(databaseUrl, { prepare: false });

  try {
    // Baca file migration
    const migrationsDir = join(__dirname, '..', 'src', 'lib', 'db', 'migrations');
    const sqlPath = join(migrationsDir, '0000_hesitant_jack_power.sql');
    
    console.log(`⏳ [SIRA-MIGRATE] Reading migration: ${sqlPath}`);
    const migrationSql = readFileSync(sqlPath, 'utf-8');

    // Split by statement-breakpoint
    const statements = migrationSql
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`⏳ [SIRA-MIGRATE] Menjalankan ${statements.length} statements...`);

    for (let i = 0; i < statements.length; i++) {
      try {
        await sql.unsafe(statements[i]);
        console.log(`  ✅ [${i + 1}/${statements.length}] OK`);
      } catch (err) {
        const error = err as { code?: string };
        // Skip error kalo tabel udah ada
        if (error.code === '42P07') { // relation already exists
          console.log(`  ⏭️ [${i + 1}/${statements.length}] Sudah ada, skip`);
        } else {
          throw err;
        }
      }
    }

    console.log('✅ [SIRA-MIGRATE] Migrasi selesai!');
    await sql.end();
    process.exit(0);
  } catch (err) {
    const error = err as { message?: string; code?: string; query?: string };
    console.error(`❌ [SIRA-MIGRATE] Gagal:`, error.message);
    if (error.code) console.error(`  Code: ${error.code}`);
    if (error.query) console.error(`  Query: ${error.query.substring(0, 100)}`);
    await sql.end().catch(() => {});
    process.exit(1);
  }
}

main();
