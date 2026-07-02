# 🏫 SchoolWeb — SMP Negeri 17 Denpasar

Website profil sekolah resmi. Dibangun dengan Next.js 16 App Router.

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Better Auth (email/password) |
| Testing | Vitest (unit) + Playwright (E2E) |
| CI/CD | GitHub Actions → Coolify |
| Monitoring | Sentry (ready-to-enable) |

## Quick Start

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 2. Install
npm ci

# 3. Database
npm run db:setup    # push schema + seed

# 4. Dev server
npm run dev         # http://localhost:3000
```

## Testing

```bash
npm run test:unit        # 30 unit tests (utils + validations)
npm run test:integration # API integration tests (needs server)
npm run test             # E2E tests (Playwright)
npm run test:all         # Full suite
```

## Project Structure

```
schoolweb/
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── (public)/  # Public pages
│   │   ├── admin/     # Admin dashboard
│   │   └── api/       # API routes + health
│   └── lib/
│       ├── db/        # Drizzle schema + migrations
│       ├── actions/   # Server Actions (CRUD)
│       ├── auth.ts    # Better Auth config
│       ├── validations.ts # Zod schemas
│       └── security.ts    # Rate limiter + headers
├── e2e/               # Playwright tests (POM)
├── tests/
│   ├── unit/          # Vitest unit tests
│   └── integration/   # API integration tests
├── scripts/           # DB seed + migrations
└── docker-compose.yml # Local dev with PostgreSQL
```

## Deployment

- **Production**: https://smpn17denpasar.my.id
- **CI/CD**: GitHub Actions → Docker → Coolify
- **Pipeline**: lint → test:unit → build → test:e2e → deploy

## Admin Access

- URL: `/admin`
- Default: admin@sekolah.sch.id / admin123
- Roles: superadmin, admin

## Features

- ✅ Public: Home, Berita, Profil, Fasilitas, Prestasi, Galeri, Kontak
- ✅ Admin: CRUD dashboard (berita, staff, prestasi, fasilitas, gallery)
- ✅ Auth: Role-based access (Better Auth)
- ✅ SEO: Sitemap.xml + robots.txt
- ✅ Security: CSP, CORS, rate limiting, security headers
- ✅ Testing: 35 tests (30 unit + 5 integration)
- ✅ Monitoring: Sentry + health endpoint

---

*Maintained by Sira AI Engineer*
