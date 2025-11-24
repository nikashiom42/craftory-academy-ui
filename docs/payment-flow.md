Craftory Academy Payment Flow Notes
===================================

Current Enrollment Flow
-----------------------

- `src/components/EnrollmentButton.tsx` displays a modal that collects fake card data and directly inserts a row into `course_enrollments`.
- No payment gateway is called; the button simply writes `{ payment_status: "test" }` via the Supabase client, then redirects the user to `/student/dashboard`.
- Local state variables `cardNumber`, `expiry`, and `cvv` are only used for UI; they are never sent to a server.

Database Touchpoints
--------------------

- Table `course_enrollments` (`supabase/migrations/20251023165037_ce50eb4e-06aa-4049-8085-bff0797be869.sql`) stores `user_id`, `course_id`, `price_paid`, and `payment_status` enum (`pending`, `completed`, `test`).
- No column persists external payment IDs, payment hashes, or callback metadata, so reconciling with a PSP is currently impossible.

Gaps Before iPay
----------------

1. No secure backend exists to obtain Bank of Georgia iPay OAuth tokens.
2. There is no `payment_orders` table to track PSP order IDs, payment hashes, redirects, or status history.
3. Frontend uses a fake form instead of redirecting to iPay’s hosted checkout page.
4. No callback handler updates enrollments after the PSP confirms or rejects a payment.
5. Users never see pending/failed states, and admins cannot diagnose issues.

