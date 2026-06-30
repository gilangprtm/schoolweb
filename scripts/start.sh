#!/bin/sh
set -e

echo "══════════════════════════════════════════"
echo "  🏫 SchoolWeb — Starting Production"
echo "══════════════════════════════════════════"

echo ""
echo "⏳ Running database migrations..."
node scripts/migrate.mjs

echo ""
echo "🚀 Starting Next.js server on port ${PORT:-3000}..."
exec node server.js
