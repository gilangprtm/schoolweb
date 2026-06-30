# Audit & Optimasi Deployment SchoolWeb (2GB RAM VPS)

Audit menyeluruh terhadap konfigurasi deployment, migration, startup, dan optimasi untuk VPS 2GB RAM.

---

## 🔍 Hasil Audit — Temuan Masalah

### 🔴 Kritis (Harus Diperbaiki)

#### 1. Seed berjalan SETIAP kali container restart
File [start.sh](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/Dockerfile#L56-L59) menjalankan `seed.ts` setiap container start. Meski ada pengecekan `if existing`, ini tetap:
- Membuat koneksi DB baru yang tidak perlu
- Menjalankan ~50+ queries SELECT untuk cek data yang sudah ada
- Memperlambat startup 5-10 detik setiap restart
- **Risiko**: Jika seed data diubah manual lewat dashboard, seed script bisa menimpa perubahan

#### 2. Migration script hardcode 1 file saja
[migrate-direct.ts](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/scripts/migrate-direct.ts#L26) hardcode nama file `0000_hesitant_jack_power.sql`. Saat ada migration baru (alter table, add column), migration tersebut **tidak akan pernah dijalankan**.

#### 3. Error di-suppress (`2>/dev/null`)
```sh
npx tsx scripts/migrate-direct.ts 2>/dev/null; npx tsx scripts/seed.ts 2>/dev/null
```
Semua error disembunyikan. Kalau migrasi gagal, container tetap jalan tanpa ada tanda masalah → data corrupt/tidak lengkap.

#### 4. `npm install -g drizzle-kit tsx` di runner image
- Menginstall **drizzle-kit** (172MB+) dan **tsx** di production image. Ini sangat boros.
- `npm install -g` tanpa `--ignore-scripts` bisa execute arbitrary scripts.
- Memperbesar image size yang harusnya minimal.

#### 5. GitHub Actions workflow tidak konsisten
[build-deploy.yml](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/.github/workflows/build-deploy.yml#L62-L63) hardcode `DATABASE_URL=postgres://postgres:***@localhost:5432/schoolweb` — build akan gagal karena DB tidak ada di CI runner. Juga melakukan `npm run build` DUA kali (line 33 dan line 56 via Dockerfile).

#### 6. `seed.ts` import `dotenv/config` — tapi `dotenv` bukan dependency
[seed.ts line 8](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/scripts/seed.ts#L8) `import "dotenv/config"` — tapi `dotenv` tidak ada di `package.json`. Ini kebetulan jalan karena container pakai ENV, tapi akan crash kalau run lokal tanpa `dotenv` terinstall.

---

### 🟡 Sedang (Sebaiknya Diperbaiki)

#### 7. Docker-compose tidak include app service
[docker-compose.yml](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/docker-compose.yml) hanya punya Postgres, tidak ada service untuk app. Ini bikin local dev dan deployment tidak konsisten.

#### 8. DB connection pool tidak dikonfigurasi
[db/index.ts](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/src/lib/db/index.ts#L12) — `postgres(databaseUrl, { prepare: false })` tanpa `max` connection limit. Default postgres.js = 10 connections. Di VPS 2GB, ini harus dibatasi.

#### 9. File duplikat: `migrate-raw.js` dan `migrate-direct.ts`
Dua file yang fungsinya sama. `migrate-raw.js` bahkan hardcode path `/app/src/...`.

#### 10. Runner stage pakai ARG → ENV yang sebenarnya tidak perlu
Di runner stage, Coolify akan inject ENV langsung ke container saat runtime. Tidak perlu ARG di runner stage — ini malah bake value ke image layer.

---

### 🟢 Sudah Baik
- ✅ Multi-stage build (builder/runner)
- ✅ `output: "standalone"` di Next.js config
- ✅ Non-root user (`nextjs`)
- ✅ `.dockerignore` sudah lengkap
- ✅ Schema Drizzle terstruktur rapi
- ✅ Seed script idempotent (cek existing sebelum insert)

---

## 📐 Proposed Changes

### Optimasi untuk VPS 2GB RAM

> [!IMPORTANT]
> VPS 2GB TIDAK cukup untuk build Next.js di dalam Docker. `next build` butuh 1-1.5GB RAM sendiri, ditambah Docker overhead dan OS. **Solusi: build di GitHub Actions (gratis, 7GB RAM), push image ke registry, Coolify hanya pull & run.**

---

### 1. Dockerfile — Optimasi Production Runner

#### [MODIFY] [Dockerfile](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/Dockerfile)

Perubahan:
- **Hapus builder stage** — build dilakukan di GitHub Actions, bukan di VPS
- **Hapus `npm install -g drizzle-kit tsx`** — migrasi pakai raw SQL via `node` (tanpa tsx)
- **Hapus seed dari startup** — seed hanya dijalankan sekali manual
- **Optimasi migration** — baca semua file `.sql` di folder migrations, bukan hardcode 1 file
- **Hapus ARG di runner** — Coolify inject ENV langsung
- **Tambah `max` connection pool** limit
- **Perbaiki error handling** — jangan suppress stderr

---

### 2. Migration Script — Auto-detect semua file SQL

#### [MODIFY] [migrate-direct.ts](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/scripts/migrate-direct.ts) → `migrate.js`

Konversi ke plain JS (tidak perlu tsx) dan auto-detect semua file migration:
- Baca folder `migrations/`, sort by filename  
- Track migration yang sudah dijalankan di tabel `_migrations`
- Skip yang sudah pernah jalan
- Log output yang jelas (tidak di-suppress)

---

### 3. GitHub Actions — Build + Push Pre-built Image

#### [MODIFY] [build-deploy.yml](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/.github/workflows/build-deploy.yml)

Perubahan:
- Hapus double build (npm run build sudah tidak perlu kalau pakai Dockerfile multi-stage di CI)
- Tambah secrets untuk `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` sebagai build-args
- Atau: tetap pakai Dockerfile multi-stage tapi **build di CI**, bukan di VPS

---

### 4. Database Connection — Limit Pool Size

#### [MODIFY] [index.ts](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/src/lib/db/index.ts)

Tambah `max: 5` untuk membatasi connection pool di VPS 2GB.

---

### 5. Cleanup File Duplikat

#### [DELETE] [migrate-raw.js](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/scripts/migrate-raw.js)
#### [DELETE] [seed.sql](file:///c:/Users/USER/Documents/GP/Project-AI/schoolweb/scripts/seed.sql)

File duplikat yang sudah tidak dipakai.

---

## Arsitektur Deployment yang Direkomendasikan

```mermaid
flowchart LR
    A["git push"] --> B["GitHub Actions<br/>(7GB RAM)"]
    B --> C["npm ci + next build"]
    C --> D["Docker build<br/>(runner only)"]
    D --> E["Push ke GHCR"]
    E --> F["Coolify Pull Image"]
    F --> G["Run Container<br/>(VPS 2GB)"]
    G --> H["migrate → server.js"]
```

> [!TIP]
> Dengan arsitektur ini, VPS 2GB hanya menjalankan container yang sudah jadi (~150MB). **Tidak ada npm ci atau next build di VPS**. RAM tersisa sepenuhnya untuk app + Postgres.

---

## Open Questions

> [!IMPORTANT]
> 1. **Apakah kamu sudah setup GitHub Container Registry (GHCR)?** Coolify akan pull image dari sana. Kalau belum, kita perlu setup `PAT_TOKEN` di GitHub Secrets.
> 2. **Apakah seed data harus jalan otomatis setiap deploy?** Rekomendasi saya: seed hanya jalan manual pertama kali (`docker exec ... node scripts/seed.js`). Setelah itu semua data dikelola lewat dashboard.
> 3. **Apakah Postgres juga di VPS yang sama?** Dari URL terlihat pakai Supabase/external DB. Kalau Postgres juga di VPS 2GB, itu akan sangat berat — pertimbangkan Supabase free tier atau Neon.

---

## Verification Plan

### Automated
```bash
# Test build di local
docker build -t schoolweb-test .
docker run --rm -e DATABASE_URL=... -e BETTER_AUTH_SECRET=... -e BETTER_AUTH_URL=... schoolweb-test

# Test migration
docker exec <container> node scripts/migrate.js
```

### Manual
- Deploy ke Coolify via GHCR pull
- Verifikasi app accessible di `https://smpn17denpasar.edjavu.cloud`
- Cek migration log di container logs
- Cek RAM usage via `docker stats` — target: < 300MB untuk app container
