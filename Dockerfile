# ── Builder stage ──
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install --no-audit --no-fund

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

# Build-time args — injected via Coolify
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}

RUN npm run build

# ── Runner stage ──
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy all build output in one layer to reduce memory
COPY --from=builder --chown=nextjs:nodejs \
  /app/public ./public

COPY --from=builder --chown=nextjs:nodejs \
  /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs \
  /app/.next/static ./.next/static

# Migration + scripts
COPY --from=builder --chown=nextjs:nodejs \
  /app/src/lib/db/migrations ./src/lib/db/migrations

COPY --from=builder --chown=nextjs:nodejs \
  /app/scripts/migrate.mjs ./scripts/migrate.mjs

COPY --from=builder --chown=nextjs:nodejs \
  /app/scripts/start.sh ./start.sh

RUN chmod +x ./start.sh

# DB drivers (standalone fix)
COPY --from=builder --chown=nextjs:nodejs \
  /app/node_modules/postgres ./node_modules/postgres

COPY --from=builder --chown=nextjs:nodejs \
  /app/node_modules/drizzle-orm ./node_modules/drizzle-orm

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=5 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["./start.sh"]
