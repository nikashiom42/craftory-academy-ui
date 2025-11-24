<!-- 2f4a7740-dcd1-4dc6-8509-48ed04df988d 393c95cb-2c99-40f4-9560-5be21e29bef7 -->
# Bank of Georgia iPay Integration Plan

This plan outlines the steps to integrate the Bank of Georgia iPay payment gateway into the Craftory Academy platform using the development environment (`dev.ipay.ge`).

## 1. Database Updates

We need to store the iPay Order ID to link our enrollments with the bank's transactions.

- [ ] Create a new migration `supabase/migrations/20251124_add_ipay_fields.sql`
    - Add `ipay_order_id` (TEXT) to `course_enrollments` table.

## 2. Supabase Edge Function (`bog-payment`)

We will create a secure server-side function to handle sensitive API credentials and communicate with Bank of Georgia.

- [ ] Create `supabase/functions/bog-payment/index.ts`
    - **Environment Variables**:
        - `IPAY_CLIENT_ID`: Your Client ID
        - `IPAY_SECRET_KEY`: Your Secret Key
        - `IPAY_API_URL`: `https://dev.ipay.ge/opay/api/v1`
        - `IPAY_AUTH_URL`: `https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token`
    - **Functionality**:
        - **`init`**: Authenticates, creates an order at iPay, creates a "pending" enrollment record, and returns the Bank's redirect URL.
        - **`check`**: Verifies the order status with iPay and updates the enrollment status to "completed" if successful.

## 3. Frontend Integration

Update the UI to initiate real payments and handle the callback from the bank.

- [ ] Update `src/components/EnrollmentButton.tsx`
    - Replace the mock "test" payment logic.
    - Call `supabase.functions.invoke('bog-payment', { body: { action: 'init', ... } })`.
    - Redirect the browser to the returned URL.
- [ ] Create `src/pages/PaymentCallback.tsx`
    - Route: `/payment/callback`
    - Reads `order_id` from URL parameters.
    - Calls `supabase.functions.invoke('bog-payment', { body: { action: 'check', ... } })`.
    - Displays Success/Error message and redirects to Dashboard.
- [ ] Update `src/App.tsx`
    - Add the new route for the callback page.

## 4. Environment Setup

- [ ] User needs to set Supabase secrets (I will provide the command).