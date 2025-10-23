#!/bin/bash

# TBC Bank Payment Integration - Secrets Setup Script
# Run this script to set up all required secrets for the tbc-payment Edge Function

echo "🔐 Setting up TBC Payment Integration secrets..."
echo ""
echo "⚠️  Make sure you have:"
echo "   1. Supabase CLI installed (npm install -g supabase)"
echo "   2. Logged in (supabase login)"
echo "   3. Linked to your project (supabase link)"
echo ""

# Prompt for TBC credentials
read -p "Enter TBC_BASE_URL (default: https://api.tbcbank.ge): " TBC_BASE_URL
TBC_BASE_URL=${TBC_BASE_URL:-https://api.tbcbank.ge}

read -p "Enter TBC_CLIENT_ID: " TBC_CLIENT_ID
read -p "Enter TBC_CLIENT_SECRET: " TBC_CLIENT_SECRET
read -p "Enter TBC_API_KEY: " TBC_API_KEY

# Get Supabase project details
echo ""
echo "📡 Fetching Supabase project details..."
SUPABASE_URL=$(supabase status 2>/dev/null | grep "API URL" | awk '{print $3}')

if [ -z "$SUPABASE_URL" ]; then
  read -p "Enter SUPABASE_URL (your project URL): " SUPABASE_URL
fi

read -p "Enter SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY

# Set secrets
echo ""
echo "🚀 Setting secrets..."

supabase secrets set TBC_BASE_URL="$TBC_BASE_URL"
supabase secrets set TBC_CLIENT_ID="$TBC_CLIENT_ID"
supabase secrets set TBC_CLIENT_SECRET="$TBC_CLIENT_SECRET"
supabase secrets set TBC_API_KEY="$TBC_API_KEY"
supabase secrets set SUPABASE_URL="$SUPABASE_URL"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

echo ""
echo "✅ Secrets configured successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy the function: supabase functions deploy tbc-payment"
echo "2. Configure callback URL in TBC merchant settings:"
echo "   ${SUPABASE_URL}/functions/v1/tbc-payment/callback"
echo ""

