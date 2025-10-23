# TBC Bank Hosted Checkout Integration Guide

## Overview

This guide explains the TBC Bank E-Commerce hosted checkout integration for Craftory Academy. The integration replaces the demo payment form with a secure, PCI-compliant hosted payment page.

## Architecture

### Flow Diagram

```
User clicks "Enroll Now"
    ↓
EnrollmentButton calls Edge Function /initiate
    ↓
Edge Function creates pending enrollment in DB
    ↓
Edge Function calls TBC API to create payment session
    ↓
User redirects to TBC hosted checkout page
    ↓
User completes payment on TBC page
    ↓
TBC sends callback to Edge Function /callback
    ↓
Edge Function updates enrollment status to "paid"
    ↓
User returns to /payment/return page
    ↓
PaymentReturn page confirms status and redirects to dashboard
```

## Components

### 1. Database Schema

**Migration:** `supabase/migrations/20251023170000_add_tbc_payment_columns.sql`

Added columns to `course_enrollments`:
- `tbc_payment_id` (text) - TBC payment ID for tracking
- `tbc_order_id` (text) - Optional order ID
- `paid_at` (timestamptz) - Payment confirmation timestamp

Added enum values to `enrollment_status`:
- `paid` - Payment confirmed
- `failed` - Payment failed or cancelled
- `pending` - Payment initiated but not confirmed

### 2. Edge Function

**Location:** `supabase/functions/tbc-payment/index.ts`

Three routes:

#### POST /initiate
- Authenticates user via Bearer token
- Creates pending enrollment record
- Calls TBC API to create payment session
- Returns redirect URL for hosted checkout

#### POST /callback
- Receives TBC server-to-server notifications
- Verifies payment status with TBC API
- Updates enrollment status (paid/failed/pending)
- Idempotent (safe to call multiple times)

#### GET /confirm
- Called from return page to verify status
- Checks local DB first
- If still pending, queries TBC API
- Updates status if changed

### 3. Client Components

#### EnrollmentButton.tsx
- Simplified from form dialog to single button
- Calls Edge Function /initiate endpoint
- Redirects user to TBC hosted page
- No longer handles payment directly

#### PaymentReturn.tsx
- New page at `/payment/return`
- Displays payment status (checking/paid/failed/pending)
- Auto-redirects to dashboard on success
- Provides retry options on failure

#### App.tsx
- Added `/payment/return` route
- Excluded payment route from header/footer

### 4. Updated Pages

#### StudentDashboard.tsx
- Now filters enrollments by `payment_status = 'paid'`
- Only shows courses with confirmed payments

#### CourseDetail.tsx
- Checks for paid enrollments only
- Shows "Enroll Now" if not paid

## Configuration

### Environment Variables

**Client (.env):**
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Edge Function Secrets:**
```bash
supabase secrets set TBC_BASE_URL=https://api.tbcbank.ge
supabase secrets set TBC_CLIENT_ID=your_client_id
supabase secrets set TBC_CLIENT_SECRET=your_client_secret
supabase secrets set TBC_API_KEY=your_api_key
supabase secrets set SUPABASE_URL=your_supabase_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### TBC Bank Setup

1. **Register as Merchant:**
   - Contact TBC Bank to register as e-commerce merchant
   - Receive merchant credentials

2. **Get Test Credentials:**
   - Access TBC Developer Portal: https://developers.tbcbank.ge
   - Create developer account
   - Get test API credentials

3. **Configure Callback URL:**
   - In TBC merchant settings, set callback URL:
   - `https://your-project.supabase.co/functions/v1/tbc-payment/callback`

4. **Configure Return URL:**
   - Set allowed return URLs in TBC settings
   - Include your domain: `https://yourdomain.com/payment/return`

## Deployment Steps

### 1. Apply Database Migration

```bash
# Connect to your Supabase project
supabase link --project-ref your-project-ref

# Apply migration
supabase db push
```

Or manually run the SQL in Supabase Dashboard → SQL Editor.

### 2. Set Edge Function Secrets

```bash
# Set all required secrets
supabase secrets set TBC_BASE_URL=https://api.tbcbank.ge
supabase secrets set TBC_CLIENT_ID=your_test_client_id
supabase secrets set TBC_CLIENT_SECRET=your_test_client_secret
supabase secrets set TBC_API_KEY=your_test_api_key
supabase secrets set SUPABASE_URL=$(supabase status | grep "API URL" | awk '{print $3}')
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Deploy Edge Function

```bash
# Deploy the function
supabase functions deploy tbc-payment

# Verify deployment
supabase functions list
```

### 4. Deploy Frontend

```bash
# Build the app
npm run build

# Deploy to your hosting (Vercel, Netlify, etc.)
# Ensure VITE_SUPABASE_URL is set in build environment
```

### 5. Configure TBC Settings

- Log into TBC merchant portal
- Set callback URL to your deployed function
- Add your domain to allowed return URLs
- Test with test credentials first

## Testing

### Test Flow

1. **Create test user account**
2. **Browse to a course** (e.g., `/courses/furniture-constructor`)
3. **Click "Enroll Now"**
4. **Verify redirect** to TBC test payment page
5. **Complete test payment** using TBC test card
6. **Verify callback** updates enrollment status
7. **Verify return** to payment return page
8. **Check dashboard** shows enrolled course

### Test Cards (TBC Test Environment)

Check TBC documentation for test card numbers. Typically:
- Success: Use specific test card number provided by TBC
- Failure: Use different test card for failed scenarios

### Monitoring

**Check Edge Function Logs:**
```bash
supabase functions logs tbc-payment --tail
```

**Check Database:**
```sql
SELECT 
  ce.id,
  ce.tbc_payment_id,
  ce.payment_status,
  ce.paid_at,
  c.title as course_title,
  p.email as user_email
FROM course_enrollments ce
JOIN courses c ON ce.course_id = c.id
JOIN profiles p ON ce.user_id = p.id
ORDER BY ce.created_at DESC
LIMIT 10;
```

## Security Considerations

1. **Never expose TBC credentials** in client code
2. **All payment operations** go through Edge Function
3. **Service role key** only used server-side
4. **User authentication** required for initiate endpoint
5. **Callback verification** checks payment status with TBC
6. **Idempotent callbacks** prevent duplicate updates

## Troubleshooting

### Issue: Redirect URL not returned

**Cause:** TBC API error or invalid credentials

**Solution:**
- Check Edge Function logs
- Verify TBC credentials
- Ensure TBC account is active

### Issue: Callback not received

**Cause:** TBC cannot reach callback URL

**Solution:**
- Verify callback URL is publicly accessible
- Check TBC merchant settings
- Ensure function is deployed
- Check firewall/network settings

### Issue: Payment status not updating

**Cause:** Callback failed or database update error

**Solution:**
- Check Edge Function logs
- Verify database permissions
- Check RLS policies on course_enrollments
- Manually check payment status via TBC API

### Issue: User sees "pending" status indefinitely

**Cause:** Payment not completed or callback delayed

**Solution:**
- User can click "Refresh Status" on return page
- Check TBC transaction status in merchant portal
- Manually update enrollment if payment confirmed

## Production Checklist

- [ ] TBC production credentials obtained
- [ ] Production callback URL configured in TBC
- [ ] Edge Function secrets updated with production values
- [ ] Database migration applied to production
- [ ] Frontend deployed with production Supabase URL
- [ ] Test end-to-end flow with real card
- [ ] Monitor logs for first few transactions
- [ ] Set up error alerting (email/Slack)
- [ ] Document support process for payment issues
- [ ] Train support team on payment flow

## API Reference

### TBC Bank API Endpoints

**Get Access Token:**
```
POST https://api.tbcbank.ge/tpay/access-token
Headers: apikey: YOUR_API_KEY
Body: { client_id, client_secret }
```

**Create Payment:**
```
POST https://api.tbcbank.ge/tpay/payments
Headers: 
  apikey: YOUR_API_KEY
  Authorization: Bearer ACCESS_TOKEN
Body: {
  amount: { total: 500, currency: "GEL" },
  returnurl: "https://yourdomain.com/payment/return",
  callbackUrl: "https://your-function-url/callback",
  description: "Course: Furniture Constructor",
  methods: [1]
}
```

**Get Payment Details:**
```
GET https://api.tbcbank.ge/tpay/payments/{payId}
Headers:
  apikey: YOUR_API_KEY
  Authorization: Bearer ACCESS_TOKEN
```

### Payment Status Values

- `Success` / `Succeeded` → Set to "paid"
- `Failed` → Set to "failed"
- `Cancelled` → Set to "failed"
- `Pending` → Keep as "pending"

## Support

For TBC Bank API issues:
- Documentation: https://developers.tbcbank.ge
- Support: Contact TBC merchant support

For Supabase issues:
- Documentation: https://supabase.com/docs
- Support: https://supabase.com/support

## Future Enhancements

- Add webhook signature verification
- Implement payment retry logic
- Add payment history page for users
- Support multiple payment methods
- Add refund functionality
- Implement installment payments
- Add payment analytics dashboard

