# ── Builder stage ──
FROM node:22-alpine AS builder

WORKDIR /app

# Install deps (layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Build Next.js (standalone output for minimal runtime image)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Runner stage ──
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone output (minimal runtime — hanya file yg diperlukan)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy schema & config untuk migration
COPY --from=builder /app/src/lib/db ./src/lib/db
COPY --from=builder /app/drizzle.config.ts ./

# Install drizzle-kit untuk auto-migration di startup
RUN npm install -g drizzle-kit

# Buat startup script: migration dulu, baru server
RUN echo '#!/bin/sh' > /app/start.sh \
  && echo 'echo "⏳ Menjalankan migrasi database..."' >> /app/start.sh \
  && echo 'npx drizzle-kit push 2>&1' >> /app/start.sh \
  && echo 'echo "✅ Migrasi selesai. Memulai server..."' >> /app/start.sh \
  && echo 'exec node server.js' >> /app/start.sh \
  && chmod +x /app/start.sh

USER nextjs

EXPOSE 3000

CMD ["/app/start.sh"]
