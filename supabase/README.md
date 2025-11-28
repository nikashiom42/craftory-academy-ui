# Supabase Seed Data

## Running the Seed Script

To populate your database with demo course data, you need to run the `seed.sql` file.

### Option 1: Using Lovable Cloud Backend
1. Click on the "Backend" button in Lovable
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/seed.sql`
4. Paste and execute the SQL

### Option 2: Using Supabase CLI (if connected to external Supabase)
```bash
supabase db reset --db-url "your-database-url"
```

### Option 3: Direct Database Connection
If you have direct database access:
```bash
psql "your-database-url" < supabase/seed.sql
```

## What the Seed Script Does

The seed script creates **3 demo courses**:

1. **ავეჯის კონსტრუირების კურსი** (Furniture Constructor Course)
   - Published: ✅ Yes
   - Duration: 2 months
   - Includes full syllabus with 5 modules

2. **ინტერიერის დიზაინის კურსი** (Interior Design Course)
   - Published: ✅ Yes
   - Duration: 3 months
   - Includes syllabus with 3 modules

3. **ხის კვეთის ხელოსნობის კურსი** (Wood Carving Course)
   - Published: ❌ No (Draft)
   - Duration: 2.5 months
   - Includes syllabus with 3 modules

## Modifying the Seed Data

To clear existing courses before seeding (useful for resetting):
```sql
TRUNCATE courses CASCADE;
```

Then run the seed script.

## Note

- The seed data uses placeholder images from Unsplash
- All Georgian text is authentic and production-ready
- Meet links and Drive links are placeholders - update them in the admin panel after seeding

## iPay Edge Functions

Three Edge Functions collaborate to talk to Bank of Georgia:

| Function | Purpose |
| --- | --- |
| `ipay-auth` | Internal health check that fetches OAuth tokens (requires `IPAY_AUTH_INTERNAL_KEY`) |
| `ipay-create-order` | Creates checkout orders, persists `payment_orders`, and returns the redirect URL |
| `ipay-callback` | Processes PSP callbacks and updates `course_enrollments` |

Before deploying, export the required secrets in the Supabase dashboard or CLI:

```
supabase secrets set \
  SUPABASE_URL=... \
  SUPABASE_SERVICE_ROLE_KEY=... \
  IPAY_CLIENT_ID=... \
  IPAY_CLIENT_SECRET=... \
  IPAY_TOKEN_URL=https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token \
  IPAY_REDIRECT_URL=https://your-site.com/payment/return \
  IPAY_REDIRECT_FAIL_URL=https://your-site.com/payment/fail \
  IPAY_CALLBACK_URL=https://<project>.functions.supabase.co/ipay-callback \
  IPAY_CALLBACK_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----"
```

Then deploy:

```
supabase functions deploy ipay-auth
supabase functions deploy ipay-create-order
supabase functions deploy ipay-callback
```
