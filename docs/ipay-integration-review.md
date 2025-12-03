# Bank of Georgia iPay Integration - Backend Review

## Overview
This document reviews the backend implementation of the Bank of Georgia iPay payment gateway integration, including Edge Functions, shared utilities, and database schema.

## Architecture Summary

### Components
1. **`supabase/functions/_shared/ipay.ts`** - OAuth token management and order creation utilities
2. **`supabase/functions/ipay-auth/index.ts`** - Health check endpoint for OAuth tokens
3. **`supabase/functions/ipay-create-order/index.ts`** - Creates payment orders and iPay checkout sessions
4. **`supabase/functions/ipay-callback/index.ts`** - Processes iPay webhook callbacks
5. **`supabase/migrations/20251124110000_add_ipay_support.sql`** - Database schema for payment tracking

---

## ✅ Strengths

### 1. **Good Separation of Concerns**
- Shared utilities properly abstracted in `_shared/ipay.ts`
- Each Edge Function has a single, clear responsibility
- Database schema is well-structured with proper relationships

### 2. **OAuth Token Caching**
- Implements token caching with 5-second buffer before expiry
- Prevents unnecessary API calls to iPay
- Handles token refresh automatically

### 3. **Payment Order Tracking**
- Creates `payment_orders` record before calling iPay API (good practice)
- Tracks full payment lifecycle: pending → redirected → success/failed
- Stores all iPay response fields for debugging

### 4. **Status Mapping**
- Comprehensive status mapping from iPay statuses to internal statuses
- Handles multiple iPay status variations (COMPLETED, APPROVED, CAPTURED, etc.)

### 5. **Security Features**
- Payment hash verification in callback handler
- User authentication required for order creation
- RLS policies on payment_orders table

---

## ⚠️ Critical Issues

### 1. **Callback Endpoint Security** 🔴 HIGH PRIORITY

**Issue:** The callback endpoint (`ipay-callback`) has no authentication mechanism. Anyone who knows the URL can send fake callbacks.

**Location:** `supabase/functions/ipay-callback/index.ts`

**Current Code:**
```typescript
Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  // No authentication check!
```

**Recommendations:**
- Implement IP whitelist validation (if iPay provides static IPs)
- Add signature verification using iPay's webhook secret
- Require a shared secret header that matches environment variable
- Log all callback attempts with source IP for monitoring

**Example Fix:**
```typescript
const IPAY_CALLBACK_SECRET = Deno.env.get("IPAY_CALLBACK_SECRET");

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Verify callback secret
  const providedSecret = request.headers.get("x-ipay-callback-secret");
  if (IPAY_CALLBACK_SECRET && providedSecret !== IPAY_CALLBACK_SECRET) {
    console.error("Unauthorized callback attempt", {
      ip: request.headers.get("x-forwarded-for"),
      userAgent: request.headers.get("user-agent"),
    });
    return new Response("Unauthorized", { status: 401 });
  }
```

### 2. **Payment Hash Verification** 🟡 MEDIUM PRIORITY

**Issue:** The callback checks if payment_hash matches, but doesn't verify the hash is valid according to iPay's algorithm.

**Location:** `supabase/functions/ipay-callback/index.ts:58-65`

**Current Code:**
```typescript
if (
  paymentOrder.ipay_payment_hash &&
  body.payment_hash &&
  paymentOrder.ipay_payment_hash !== body.payment_hash
) {
  console.error("Payment hash mismatch", paymentOrder.id);
  return new Response("Hash mismatch", { status: 409 });
}
```

**Recommendations:**
- If iPay provides a hash algorithm (e.g., HMAC-SHA256), implement verification
- Document the expected hash format
- Consider if hash should be recalculated from callback payload

### 3. **Transaction Consistency** 🟡 MEDIUM PRIORITY

**Issue:** Callback handler updates `payment_orders` and `course_enrollments` separately. If one succeeds and the other fails, data becomes inconsistent.

**Location:** `supabase/functions/ipay-callback/index.ts:69-109`

**Current Code:**
```typescript
await serviceClient.from("payment_orders").update(...).eq("id", paymentOrder.id);

if (normalizedStatus === "success") {
  await serviceClient.from("course_enrollments").upsert(...);
}
```

**Recommendations:**
- Wrap both updates in a database transaction (Postgres function or RPC)
- Or use Supabase's transaction support if available
- Add rollback logic if enrollment update fails

**Example Fix:**
```typescript
// Use Supabase RPC function that wraps both updates in a transaction
await serviceClient.rpc("process_payment_callback", {
  p_payment_order_id: paymentOrder.id,
  p_status: normalizedStatus,
  p_order_id: body.order_id,
  p_payment_id: body.payment_id,
  p_payment_hash: body.payment_hash,
  p_status_description: body.status_description ?? body.status,
});
```

### 4. **Idempotency Handling** 🟡 MEDIUM PRIORITY

**Issue:** If iPay sends duplicate callbacks (network retries), the handler processes them multiple times. While `upsert` prevents duplicate enrollments, it could cause unnecessary database writes and log noise.

**Location:** `supabase/functions/ipay-callback/index.ts`

**Recommendations:**
- Check if payment_order status is already in final state (success/failed/cancelled)
- Return early if already processed
- Log duplicate callback attempts

**Example Fix:**
```typescript
// Check if already processed
if (paymentOrder.status === "success" && normalizedStatus === "success") {
  console.log("Callback already processed", paymentOrder.id);
  return Response.json({ received: true, already_processed: true });
}
```

### 5. **Error Handling & Logging** 🟡 MEDIUM PRIORITY

**Issues:**
- Generic error messages don't help debugging
- No structured logging for monitoring/alerting
- Missing error context (user_id, course_id, shop_order_id)

**Locations:** All Edge Functions

**Recommendations:**
- Include context in all error logs (shop_order_id, user_id, course_id)
- Use structured logging format (JSON)
- Add error codes for different failure scenarios
- Log to external service (e.g., Sentry, Logtail) for production

**Example:**
```typescript
console.error("Failed to create iPay order", {
  error: errorBody,
  shop_order_id: shopOrderId,
  user_id: user.id,
  course_id: course.id,
  amount,
});
```

### 6. **OAuth Token Error Recovery** 🟢 LOW PRIORITY

**Issue:** If OAuth token request fails, there's no retry logic or fallback.

**Location:** `supabase/functions/_shared/ipay.ts:29-60`

**Recommendations:**
- Implement exponential backoff retry for token requests
- Cache last successful token even if expired (for debugging)
- Add metrics/alerting for token failures

---

## 🔍 Code Quality Issues

### 1. **Type Safety**

**Issue:** Some types use `as` assertions without validation.

**Location:** `supabase/functions/ipay-callback/index.ts:41`

```typescript
const body = (await request.json()) as CallbackPayload;
```

**Recommendation:** Validate payload structure before casting:
```typescript
function validateCallbackPayload(body: unknown): CallbackPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid callback payload");
  }
  const b = body as Record<string, unknown>;
  if (typeof b.shop_order_id !== "string") {
    throw new Error("Missing shop_order_id");
  }
  return body as CallbackPayload;
}
```

### 2. **Magic Numbers**

**Issue:** Hardcoded buffer time (30 seconds) in token expiry calculation.

**Location:** `supabase/functions/_shared/ipay.ts:74`

```typescript
expiresAt: now + (freshToken.expiresIn - 30) * 1000,
```

**Recommendation:** Extract to constant:
```typescript
const TOKEN_EXPIRY_BUFFER_SECONDS = 30;
expiresAt: now + (freshToken.expiresIn - TOKEN_EXPIRY_BUFFER_SECONDS) * 1000,
```

### 3. **Missing Input Validation**

**Issue:** `ipay-create-order` doesn't validate locale format or currency code.

**Location:** `supabase/functions/ipay-create-order/index.ts`

**Recommendation:** Add validation:
```typescript
const validLocales = ["ka", "en", "ru"];
if (locale && !validLocales.includes(locale)) {
  return new Response("Invalid locale", { status: 400 });
}
```

### 4. **Race Condition in Token Cache**

**Issue:** Multiple concurrent requests could trigger multiple token refreshes.

**Location:** `supabase/functions/_shared/ipay.ts:65-78`

**Recommendation:** Add a lock/mutex mechanism or use a more robust caching solution.

---

## 📋 Missing Features

### 1. **Payment Status Polling**
- No mechanism to poll iPay for payment status if callback fails
- Consider adding a scheduled function to reconcile pending payments

### 2. **Refund Support**
- No refund endpoint implemented
- May be needed for customer support scenarios

### 3. **Payment History API**
- No endpoint for users to view their payment history
- Frontend loads payment orders but no dedicated API

### 4. **Admin Dashboard Integration**
- Payment orders table exists but no admin UI mentioned
- Consider adding admin endpoints for payment management

### 5. **Webhook Retry Handling**
- No acknowledgment mechanism for iPay callbacks
- Should return proper HTTP status codes so iPay knows if callback succeeded

---

## 🗄️ Database Schema Review

### Strengths
- Proper foreign key relationships
- RLS policies implemented
- Unique constraint on `shop_order_id`
- Timestamps with update trigger

### Potential Issues

1. **Missing Indexes**
   - `payment_orders.shop_order_id` should have an index (has UNIQUE, so index exists)
   - `payment_orders.user_id` and `payment_orders.course_id` should have indexes for query performance
   - `course_enrollments` composite index on `(user_id, course_id)` exists via unique constraint

2. **No Soft Delete**
   - Payment orders are never deleted, which is good for audit trail
   - Consider adding `deleted_at` if soft deletes are needed

3. **Metadata Field**
   - `metadata` jsonb field is good for extensibility
   - Consider adding JSON schema validation or documentation

---

## 🔐 Security Checklist

- [x] User authentication required for order creation
- [x] Payment hash verification in callback
- [x] RLS policies on payment_orders
- [ ] Callback endpoint authentication (CRITICAL)
- [ ] IP whitelisting for callbacks (if available)
- [ ] Rate limiting on order creation endpoint
- [ ] Input sanitization/validation
- [ ] Error messages don't leak sensitive info

---

## 📊 Monitoring & Observability

### Missing Metrics
- Payment success rate
- Average payment processing time
- Callback processing latency
- OAuth token refresh frequency
- Failed payment reasons breakdown

### Recommended Additions
- Structured logging with correlation IDs
- Error tracking (Sentry, etc.)
- Payment funnel analytics
- Alert on callback failures
- Dashboard for payment health

---

## 🧪 Testing Recommendations

### Unit Tests Needed
- OAuth token caching logic
- Status mapping function
- Payment hash verification
- Shop order ID generation

### Integration Tests Needed
- End-to-end payment flow
- Callback processing with various statuses
- Duplicate callback handling
- Error scenarios (network failures, invalid responses)

### Manual Testing Checklist
- [ ] Create order with valid course
- [ ] Create order with invalid course
- [ ] Create order without authentication
- [ ] Process success callback
- [ ] Process failed callback
- [ ] Process duplicate callback
- [ ] Verify enrollment creation on success
- [ ] Verify hash mismatch rejection

---

## 🚀 Performance Considerations

### Current Implementation
- Token caching reduces API calls ✅
- No database connection pooling concerns (Supabase handles) ✅
- Sequential database updates in callback ⚠️

### Optimization Opportunities
- Batch database updates in callback
- Add database indexes for common queries
- Consider caching course data in order creation
- Implement request queuing for high traffic

---

## 📝 Documentation Gaps

1. **Environment Variables**
   - Document all required env vars
   - Provide example values
   - Document optional vs required

2. **API Contracts**
   - Document callback payload structure
   - Document expected response formats
   - Document error codes

3. **Deployment Guide**
   - How to set up Edge Functions
   - How to configure iPay credentials
   - How to test integration

---

## ✅ Action Items Summary

### Critical (Fix Immediately)
1. **Add authentication to callback endpoint** - Security vulnerability
2. **Implement transaction wrapping** - Data consistency risk

### High Priority (Fix Soon)
3. **Add idempotency checks** - Prevent duplicate processing
4. **Improve error logging** - Better debugging
5. **Add input validation** - Prevent invalid requests

### Medium Priority (Nice to Have)
6. **Add payment status polling** - Resilience
7. **Implement refund support** - Customer support
8. **Add monitoring/metrics** - Observability
9. **Create admin endpoints** - Management

### Low Priority (Future)
10. **Add unit tests** - Code quality
11. **Optimize database queries** - Performance
12. **Add rate limiting** - Security hardening

---

## 📚 References

- [Bank of Georgia iPay API Documentation](https://ipay.ge) (if available)
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Payment Gateway Security Best Practices

---

**Review Date:** 2025-01-27  
**Reviewed By:** AI Code Review  
**Status:** Ready for fixes




