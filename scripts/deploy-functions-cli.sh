#!/bin/bash
# Alternative: Deploy functions using Supabase CLI with env vars
# Usage: ./scripts/deploy-functions-cli.sh

# Load .env.local
export $(grep -v '^#' .env.local | xargs)

# Set Supabase CLI env vars
export SUPABASE_URL="${SUPABASE_URL:-$NEXT_PUBLIC_SUPABASE_URL}"
export SUPABASE_ACCESS_TOKEN="${SUPABASE_SERVICE_ROLE_KEY}"

# Extract project ref
PROJECT_REF=$(echo $SUPABASE_URL | sed -n 's|https://\([^.]*\)\.supabase\.co|\1|p')

if [ -z "$PROJECT_REF" ]; then
  echo "❌ Could not extract project ref from SUPABASE_URL"
  exit 1
fi

echo "🚀 Deploying functions to project: $PROJECT_REF"

# Deploy each function
for func in ipay-auth ipay-create-order ipay-callback; do
  echo "📦 Deploying $func..."
  supabase functions deploy "$func" --project-ref "$PROJECT_REF" || {
    echo "❌ Failed to deploy $func"
    exit 1
  }
done

echo "✅ All functions deployed!"

