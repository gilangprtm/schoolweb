# ── Builder stage ──
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV DATABASE_URL=postgres://postgres:***@localhost:5432/schoolweb
RUN npm run build

# ── Runner stage ──
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV DATABASE_URL=postgres://postgres:***@tepji0kn9cd339vpuypd95nd:5432/schoolweb

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/src/lib/db ./src/lib/db
COPY --from=builder /app/drizzle.config.ts ./
COPY --from=builder /app/scripts ./scripts

RUN npm install -g drizzle-kit tsx

RUN echo '#!/bin/sh' > /app/start.sh \
  && echo 'echo "⏳ [SIRA] Migrasi...seed...server"' >> /app/start.sh \
  && echo 'npx tsx scripts/migrate-direct.ts 2>/dev/null; npx tsx scripts/seed.ts 2>/dev/null; exec node server.js' >> /app/start.sh \
  && chmod +x /app/start.sh

USER nextjs
EXPOSE 3000
CMD ["/app/start.sh"]
