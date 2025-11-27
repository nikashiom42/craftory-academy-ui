# Deploy Edge Function with CORS Fix

## Issue
CORS errors occur because the Edge Function hasn't been redeployed with the CORS handler.

## Quick Fix: Deploy via Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** → **ipay-create-order**
4. Click **Edit** or **Deploy**
5. Copy the entire contents of `supabase/functions/ipay-create-order/index.ts`
6. Also copy `supabase/functions/_shared/cors.ts` and merge it inline, OR ensure shared files are accessible
7. Click **Deploy**

## Alternative: Using Supabase CLI

```bash
# Make sure you're in the project root
cd /Users/nikashio/sites/GeoEcom/craftory-academy-ui

# Deploy the function
supabase functions deploy ipay-create-order
```

## Verify CORS is Working

After deployment, test the function:

```bash
# Test OPTIONS preflight request
curl -X OPTIONS https://ihbpildzrhnizrikmvja.supabase.co/functions/v1/ipay-create-order \
  -H "Origin: http://localhost:8080" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  -v
```

You should see these headers in the response:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: POST, GET, OPTIONS`
- `Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type, x-ipay-internal-key`

## Important Notes

- **Shared files**: The function imports from `_shared/cors.ts`. Make sure shared files are included when deploying
- **Environment variables**: Ensure these are set in Supabase Dashboard → Project Settings → Edge Functions:
  - `IPAY_REDIRECT_URL`
  - `IPAY_CALLBACK_URL`
  - `IPAY_CLIENT_ID`
  - `IPAY_CLIENT_SECRET`
  - `IPAY_USERNAME`
  - `IPAY_PASSWORD`
  - `IPAY_CURRENCY_CODE` (optional, defaults to "GEL")

## Troubleshooting

If CORS errors persist after deployment:

1. **Clear browser cache** - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
2. **Check function logs** - Supabase Dashboard → Edge Functions → Logs
3. **Verify OPTIONS handler** - The function should return 204 for OPTIONS requests
4. **Check shared imports** - Ensure `_shared/cors.ts` is accessible to the function

