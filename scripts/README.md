# Deployment Scripts

Scripts to run migrations and deploy Edge Functions without Supabase CLI.

## Prerequisites

1. Copy your Vercel environment variables to `.env.local`:
```bash
cp .env.local.example .env.local
# Then paste your Vercel env vars
```

Required variables:
- `POSTGRES_URL_NON_POOLING` or `POSTGRES_URL` (for migrations)
- `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` (for function deployment)
- `SUPABASE_SERVICE_ROLE_KEY` (for function deployment)

## Run Migration

### Option 1: Using psql (Recommended)
```bash
chmod +x scripts/run-migration-psql.sh
npm run migrate:psql
```

### Option 2: Using Node.js
```bash
npm install pg
npm run migrate
```

## Deploy Edge Functions

### Option 1: Via Supabase Dashboard (Easiest)
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions**
4. Click **Deploy Function** for each:
   - `ipay-auth`
   - `ipay-create-order`
   - `ipay-callback`
5. Copy-paste the code from `supabase/functions/{function-name}/index.ts`

### Option 2: Using Supabase CLI (if installed)
```bash
chmod +x scripts/deploy-functions-cli.sh
./scripts/deploy-functions-cli.sh
```

### Option 3: Using Management API (Experimental)
```bash
npm run deploy:functions
```

## Manual Function Deployment Steps

If scripts don't work, deploy manually:

1. **ipay-auth**:
   - Copy `supabase/functions/ipay-auth/index.ts` and `supabase/functions/_shared/ipay.ts`
   - Merge shared code into the function
   - Deploy via Dashboard

2. **ipay-create-order**:
   - Copy `supabase/functions/ipay-create-order/index.ts` and shared files
   - Merge shared code
   - Deploy via Dashboard

3. **ipay-callback**:
   - Copy `supabase/functions/ipay-callback/index.ts` and shared files
   - Merge shared code
   - Deploy via Dashboard

## Environment Variables for Edge Functions

Set these in Supabase Dashboard > Project Settings > Edge Functions:

```
IPAY_API_BASE=https://ipay.ge/opay/api/v1
IPAY_CLIENT_ID=your_client_id
IPAY_CLIENT_SECRET=your_client_secret
IPAY_USERNAME=your_username
IPAY_PASSWORD=your_password
IPAY_REDIRECT_URL=https://your-site.com/student/dashboard
IPAY_CALLBACK_URL=https://your-project.supabase.co/functions/v1/ipay-callback
IPAY_CURRENCY_CODE=GEL
IPAY_SCOPE=payments
```

## Troubleshooting

- **Migration errors**: Some errors are OK (e.g., "already exists"). Check the output.
- **Function deployment**: Use Supabase Dashboard if CLI/API methods fail.
- **Shared code**: Edge Functions need `_shared` code merged inline since they can't import from other files.

