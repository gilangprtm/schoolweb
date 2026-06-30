# ── Builder stage ──
FROM node:22-alpine AS builder

WORKDIR /app

# DB_URL bisa di-override via --build-arg (untuk GitHub Actions build)
ARG DATABASE_URL=postgres://postgres:***@tepji0kn9cd339vpuypd95nd:5432/schoolweb

# Install deps (layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build — pake memory lebih kecil biar ga makan resource VPS
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=768"
ENV DATABASE_URL=$DATABASE_URL
RUN npm run build

# ── Runner stage ──
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV DATABASE_URL=postgres://postgres:iF2zBLddqOpQHDT1OYbjx67QYaRvE9bd9hYw46OVK6fKsH395HPRLNKvLuigtu6s@tepji0kn9cd339vpuypd95nd:5432/schoolweb

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone output (minimal runtime — hanya file yg diperlukan)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy schema & config untuk migration
COPY --from=builder /app/src/lib/db ./src/lib/db
COPY --from=builder /app/drizzle.config.ts ./

# Copy seed scripts
COPY --from=builder /app/scripts ./scripts

# Install drizzle-kit & tsx untuk auto-migration & seed di startup
RUN npm install -g drizzle-kit tsx

# Buat startup script: migration dulu, seed, baru server
RUN echo '#!/bin/sh' > /app/start.sh \
  && echo 'echo "⏳ [SIRA] Menjalankan migrasi database..."' >> /app/start.sh \
  && echo 'export DATABASE_URL="${DATABASE_URL:-}"' >> /app/start.sh \
  && echo 'echo "  📌 DATABASE_URL ada: $(echo $DATABASE_URL | cut -c1-30)..."' >> /app/start.sh \
  && echo 'echo "  📌 CWD: $(pwd)"' >> /app/start.sh \
  && echo 'echo "  📌 Migrate script: $(ls -la scripts/migrate-direct.ts 2>&1)"' >> /app/start.sh \
  && echo 'npx tsx scripts/migrate-direct.ts 2>&1' >> /app/start.sh \
  && echo 'MIGRATION_EXIT=$?' >> /app/start.sh \
  && echo 'echo "⏳ [SIRA] Hasil migrasi: exit=$MIGRATION_EXIT"' >> /app/start.sh \
  && echo 'echo "⏳ [SIRA] Menjalankan seed data..."' >> /app/start.sh \
  && echo 'npx tsx scripts/seed.ts 2>&1' >> /app/start.sh \
  && echo 'SEED_EXIT=$?' >> /app/start.sh \
  && echo "echo '✅ [SIRA] Setup selesai (migration: $MIGRATION_EXIT, seed: $SEED_EXIT). Memulai server...'" >> /app/start.sh \
  && echo 'exec node server.js' >> /app/start.sh \
  && chmod +x /app/start.sh

USER nextjs

EXPOSE 3000

CMD ["/app/start.sh"]
