# Supabase Edge Functions

## TBC Payment Integration

### Setup

1. **Install Supabase CLI** (if not already installed):
```bash
npm install -g supabase
```

2. **Login to Supabase**:
```bash
supabase login
```

3. **Link your project**:
```bash
supabase link --project-ref your-project-ref
```

4. **Set environment secrets**:
```bash
supabase secrets set TBC_BASE_URL=https://api.tbcbank.ge
supabase secrets set TBC_CLIENT_ID=your_tbc_client_id
supabase secrets set TBC_CLIENT_SECRET=your_tbc_client_secret
supabase secrets set TBC_API_KEY=your_tbc_api_key
supabase secrets set SUPABASE_URL=your_supabase_project_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

For testing, use TBC's test environment URL and credentials.

### Deploy

Deploy the tbc-payment function:
```bash
supabase functions deploy tbc-payment
```

### Test Locally

1. **Start local Supabase**:
```bash
supabase start
```

2. **Serve functions locally**:
```bash
supabase functions serve tbc-payment --env-file .env.local
```

Create `.env.local` with your test credentials:
```
TBC_BASE_URL=https://api.tbcbank.ge
TBC_CLIENT_ID=test_client_id
TBC_CLIENT_SECRET=test_client_secret
TBC_API_KEY=test_api_key
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
```

3. **Test the function**:
```bash
curl -i --location --request POST 'http://localhost:54321/functions/v1/tbc-payment/initiate' \
  --header 'Authorization: Bearer YOUR_USER_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"courseId":"course-uuid","amount":500,"returnUrl":"http://localhost:5173/payment/return"}'
```

### TBC Bank Configuration

1. **Register with TBC Bank** as a merchant
2. **Get test credentials** from TBC developer portal
3. **Configure callback URL** in TBC merchant settings:
   - Production: `https://your-project.supabase.co/functions/v1/tbc-payment/callback`
   - Test: Use your deployed function URL

### Endpoints

#### POST /tbc-payment/initiate
Creates a payment session and returns redirect URL.

**Request:**
```json
{
  "courseId": "uuid",
  "amount": 500,
  "returnUrl": "https://yourdomain.com/payment/return"
}
```

**Response:**
```json
{
  "success": true,
  "redirectUrl": "https://tbc-payment-page.com/...",
  "payId": "payment-id"
}
```

#### POST /tbc-payment/callback
Receives TBC server-to-server payment notifications.

**Request (from TBC):**
```json
{
  "payId": "payment-id",
  "status": "Success"
}
```

#### GET /tbc-payment/confirm?payId=xxx
Confirms payment status (called from return page).

**Response:**
```json
{
  "status": "paid",
  "paid_at": "2025-10-23T17:00:00Z"
}
```

### Troubleshooting

- **Callback not received**: Ensure your function URL is publicly accessible and configured in TBC settings
- **Authentication errors**: Verify TBC credentials are correct
- **Payment status not updating**: Check Supabase logs: `supabase functions logs tbc-payment`

