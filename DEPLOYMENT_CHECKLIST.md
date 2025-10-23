# TBC Bank Integration - Deployment Checklist

## Pre-Deployment

### 1. TBC Bank Account Setup
- [ ] Registered as TBC Bank merchant
- [ ] Received test credentials (client_id, client_secret, api_key)
- [ ] Received production credentials
- [ ] Have access to TBC merchant portal
- [ ] Know test environment URL (if different from production)

### 2. Local Testing
- [ ] Database migration tested locally
- [ ] Edge Function runs locally with test credentials
- [ ] Frontend connects to local Edge Function
- [ ] Can complete test payment flow end-to-end
- [ ] Callback updates enrollment status correctly
- [ ] Return page displays correct status

## Database Setup

### 3. Apply Migration
```bash
# Connect to Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Apply migration
supabase db push
```

- [ ] Migration applied successfully
- [ ] New columns exist: `tbc_payment_id`, `tbc_order_id`, `paid_at`
- [ ] New enum values exist: `paid`, `failed`
- [ ] Index created on `tbc_payment_id`

### 4. Verify Database
```sql
-- Check table structure
\d course_enrollments

-- Check enum values
SELECT unnest(enum_range(NULL::enrollment_status));
```

- [ ] All columns present
- [ ] All enum values present
- [ ] RLS policies still active

## Edge Function Deployment

### 5. Set Secrets (Test Environment)
```bash
supabase secrets set TBC_BASE_URL=https://api.tbcbank.ge
supabase secrets set TBC_CLIENT_ID=test_client_id
supabase secrets set TBC_CLIENT_SECRET=test_client_secret
supabase secrets set TBC_API_KEY=test_api_key
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

- [ ] All secrets set
- [ ] Secrets verified: `supabase secrets list`
- [ ] Service role key is correct (not anon key)

### 6. Deploy Function
```bash
supabase functions deploy tbc-payment
```

- [ ] Function deployed successfully
- [ ] Function appears in: `supabase functions list`
- [ ] Function URL noted: `https://YOUR_PROJECT.supabase.co/functions/v1/tbc-payment`

### 7. Test Function Endpoints
```bash
# Test initiate (with valid user token)
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/tbc-payment/initiate \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId":"COURSE_UUID","amount":500,"returnUrl":"https://yourdomain.com/payment/return"}'

# Should return: {"success":true,"redirectUrl":"...","payId":"..."}
```

- [ ] Initiate endpoint returns redirect URL
- [ ] Redirect URL is valid TBC checkout page
- [ ] Payment ID returned

## TBC Bank Configuration

### 8. Configure Merchant Settings
In TBC merchant portal:

- [ ] Set callback URL: `https://YOUR_PROJECT.supabase.co/functions/v1/tbc-payment/callback`
- [ ] Add return URL to whitelist: `https://yourdomain.com/payment/return`
- [ ] Verify test mode is enabled
- [ ] Note test card numbers for testing

### 9. Test TBC Integration
- [ ] Can create payment session via API
- [ ] Redirect URL loads TBC checkout page
- [ ] Test card completes payment successfully
- [ ] Callback received by Edge Function
- [ ] Check Edge Function logs: `supabase functions logs tbc-payment`

## Frontend Deployment

### 10. Environment Variables
Ensure these are set in your hosting platform (Vercel/Netlify/etc):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

- [ ] Environment variables set in hosting platform
- [ ] Variables match Supabase project

### 11. Build and Deploy
```bash
npm run build
# Deploy to hosting platform
```

- [ ] Build completes without errors
- [ ] Deployed to staging/production URL
- [ ] Site loads correctly
- [ ] No console errors

## End-to-End Testing

### 12. Test Complete Flow (Test Environment)
1. **Create Test User**
   - [ ] Can register new account
   - [ ] Can login successfully

2. **Browse Courses**
   - [ ] Courses page loads
   - [ ] Can view course detail page
   - [ ] "Enroll Now" button visible

3. **Initiate Payment**
   - [ ] Click "Enroll Now"
   - [ ] Redirects to TBC checkout page
   - [ ] Course details shown correctly
   - [ ] Amount is correct

4. **Complete Payment**
   - [ ] Enter test card details
   - [ ] Payment processes successfully
   - [ ] Redirects back to site

5. **Verify Return**
   - [ ] Lands on `/payment/return` page
   - [ ] Shows "Payment Successful" message
   - [ ] Auto-redirects to dashboard

6. **Check Dashboard**
   - [ ] Course appears in "My Courses"
   - [ ] Can access course content
   - [ ] Enrollment date shown

7. **Verify Database**
   ```sql
   SELECT 
     tbc_payment_id,
     payment_status,
     paid_at,
     price_paid
   FROM course_enrollments
   ORDER BY created_at DESC
   LIMIT 1;
   ```
   - [ ] `payment_status` = 'paid'
   - [ ] `tbc_payment_id` populated
   - [ ] `paid_at` has timestamp
   - [ ] `price_paid` matches course price

### 13. Test Failure Scenarios
- [ ] Cancel payment on TBC page → returns with "failed" status
- [ ] Invalid card → shows error on TBC page
- [ ] Already enrolled → shows "Already Enrolled" message
- [ ] Not logged in → redirects to auth page

### 14. Monitor and Log
```bash
# Watch Edge Function logs
supabase functions logs tbc-payment --tail

# Check for errors
supabase functions logs tbc-payment | grep -i error
```

- [ ] No unexpected errors in logs
- [ ] Callbacks being received
- [ ] Status updates working

## Production Deployment

### 15. Switch to Production Credentials
```bash
supabase secrets set TBC_CLIENT_ID=prod_client_id
supabase secrets set TBC_CLIENT_SECRET=prod_client_secret
supabase secrets set TBC_API_KEY=prod_api_key
# Keep TBC_BASE_URL same if using production URL
```

- [ ] Production credentials obtained from TBC
- [ ] Secrets updated
- [ ] Function redeployed (if needed)

### 16. Update TBC Production Settings
- [ ] Callback URL configured for production
- [ ] Return URL whitelist updated
- [ ] Test mode disabled
- [ ] Production merchant account active

### 17. Final Production Test
- [ ] Test with real card (small amount)
- [ ] Verify real payment processes
- [ ] Check TBC merchant portal shows transaction
- [ ] Verify callback received
- [ ] Verify enrollment created

## Post-Deployment

### 18. Monitoring Setup
- [ ] Set up error alerting (email/Slack)
- [ ] Monitor Edge Function logs daily
- [ ] Check TBC merchant portal for transactions
- [ ] Set up uptime monitoring for callback URL

### 19. Documentation
- [ ] Team trained on payment flow
- [ ] Support docs updated
- [ ] Troubleshooting guide accessible
- [ ] Contact info for TBC support documented

### 20. Backup Plan
- [ ] Rollback procedure documented
- [ ] Old payment code backed up (if needed)
- [ ] Emergency contact for TBC Bank
- [ ] Manual enrollment process documented

## Success Criteria

- [x] Users can complete real payments
- [x] Enrollments created only on successful payment
- [x] Payment status tracked accurately
- [x] No security vulnerabilities
- [x] Error handling works correctly
- [x] User experience is smooth
- [x] All documentation complete

## Support Contacts

**TBC Bank:**
- Developer Portal: https://developers.tbcbank.ge
- Support Email: _______________
- Support Phone: _______________

**Supabase:**
- Documentation: https://supabase.com/docs
- Support: https://supabase.com/support

**Internal:**
- Tech Lead: _______________
- DevOps: _______________
- Product Owner: _______________

## Rollback Procedure

If critical issues occur:

1. **Disable Edge Function:**
   ```bash
   supabase functions delete tbc-payment
   ```

2. **Revert Frontend:**
   ```bash
   git revert HEAD
   git push
   # Redeploy
   ```

3. **Notify Users:**
   - Add banner about payment issues
   - Provide alternative enrollment method

4. **Manual Processing:**
   - Collect payment info via form
   - Process payments manually
   - Create enrollments via SQL

## Notes

- Keep test credentials active for ongoing testing
- Monitor first 10-20 transactions closely
- Have support team ready for launch day
- Document any issues encountered
- Update this checklist based on experience

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Verified By:** _______________  
**Production URL:** _______________

