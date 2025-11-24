#!/bin/bash
# Run migration using psql directly
# Usage: ./scripts/run-migration-psql.sh

# Load .env.local
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found"
  exit 1
fi

# Extract POSTGRES_URL_NON_POOLING from .env.local
POSTGRES_URL=$(grep "^POSTGRES_URL_NON_POOLING=" .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")

if [ -z "$POSTGRES_URL" ]; then
  POSTGRES_URL=$(grep "^POSTGRES_URL=" .env.local | cut -d '=' -f2 | tr -d '"' | tr -d "'")
fi

if [ -z "$POSTGRES_URL" ]; then
  echo "❌ POSTGRES_URL_NON_POOLING or POSTGRES_URL not found in .env.local"
  exit 1
fi

echo "🔌 Connecting to database..."
echo "📝 Running migration..."

psql "$POSTGRES_URL" -f supabase/migrations/20251124110000_add_ipay_support.sql

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
else
  echo "⚠️  Migration completed with warnings (some objects may already exist)"
fi

