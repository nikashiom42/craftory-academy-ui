# Data Migration Guide: Old Supabase DB → New Supabase DB

## Step 1: Apply Schema to New Database

1. Go to your **NEW Vercel Supabase Dashboard**: https://ihbpildzrhnizrikmv.supabase.co
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Open the file: `supabase/MIGRATION_TO_NEW_DB.sql`
5. **Copy all contents** and paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for success message - this creates all tables, functions, policies, etc.

---

## Step 2: Export Data from OLD Database

### Option A: Using Supabase Dashboard (Recommended for small datasets)

1. Go to your **OLD Lovable Supabase Dashboard**: https://guftugxbadrjwutxpxsk.supabase.co
2. Navigate to **Table Editor**
3. For each table with data, export it:
   - Click on the table name
   - Click the **Export** button (or download icon)
   - Save as CSV

**Tables to export:**
- `courses`
- `course_registrations`
- `course_enrollments`
- `partners` (already in migration, but export if you modified it)
- `profiles` (if you have users)
- `user_roles` (if you have users)

---

### Option B: Using SQL (Recommended for larger datasets)

1. Go to your **OLD Supabase Dashboard** SQL Editor
2. Run these queries **one by one** and copy the results:

#### Export Courses
```sql
SELECT * FROM public.courses;
```
Copy results → Save as `courses_export.json`

#### Export Course Registrations
```sql
SELECT * FROM public.course_registrations;
```
Copy results → Save as `registrations_export.json`

#### Export Course Enrollments
```sql
SELECT * FROM public.course_enrollments;
```
Copy results → Save as `enrollments_export.json`

#### Export User Roles
```sql
SELECT * FROM public.user_roles;
```
Copy results → Save as `user_roles_export.json`

#### Export Profiles
```sql
SELECT * FROM public.profiles;
```
Copy results → Save as `profiles_export.json`

---

## Step 3: Import Data to NEW Database

### Important: Import in this ORDER (due to foreign key constraints)

1. **First**: User-related data (if you have users)
2. **Second**: Courses
3. **Third**: Everything else

### Import using SQL Editor in NEW Database:

#### 1. Import Courses (if you have any)
```sql
-- Example - adjust based on your actual data
INSERT INTO public.courses (
  id, slug, title, subtitle, description, image_url, 
  duration, participant_number, start_date, end_date,
  google_meet_link, google_drive_link, syllabus,
  hero_claims, target_audience, skills, trainer, cohort,
  why_section, info_session_cta, price, published,
  created_at, updated_at, created_by
) VALUES
  -- Copy your course data here
  -- Example format:
  -- ('uuid-here', 'course-slug', 'Course Title', ...),
  -- ('uuid-here', 'another-slug', 'Another Course', ...);
```

#### 2. Import Course Registrations (if you have any)
```sql
INSERT INTO public.course_registrations (
  id, first_name, last_name, phone, email,
  personal_id, city, course_id, status, notes,
  created_at, updated_at
) VALUES
  -- Copy your registration data here
```

#### 3. Import Course Enrollments (if you have any)
```sql
INSERT INTO public.course_enrollments (
  id, user_id, course_id, enrolled_at,
  payment_status, price_paid, created_at, updated_at
) VALUES
  -- Copy your enrollment data here
```

---

## Step 4: Migrate Auth Users (If you have users)

**⚠️ IMPORTANT**: You cannot directly migrate `auth.users` via SQL.

### Option A: Users Re-register (Simplest)
- Users sign up again in your app with new DB
- Old data is lost, fresh start

### Option B: Manual User Migration (Complex)
1. Export users from OLD Supabase Dashboard → Authentication → Users
2. In NEW Supabase: Authentication → Users → Add User (manually)
3. Create corresponding `profiles` and `user_roles` entries

### Option C: Contact Supabase Support
- For large user bases, contact Supabase support for proper auth migration
- They have tools to migrate auth data between projects

---

## Step 5: Migrate Storage Files (Images)

If you have uploaded images in Storage:

1. **OLD Supabase** → Storage → `course-images` bucket
2. Download all files
3. **NEW Supabase** → Storage → `course-images` bucket
4. Upload all files (same names to maintain URLs)

Repeat for `partner-logos` bucket if modified.

---

## Step 6: Verify Migration

Run these checks in your NEW database SQL Editor:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Count records in each table
SELECT 'courses' as table_name, COUNT(*) FROM public.courses
UNION ALL
SELECT 'course_registrations', COUNT(*) FROM public.course_registrations
UNION ALL
SELECT 'course_enrollments', COUNT(*) FROM public.course_enrollments
UNION ALL
SELECT 'partners', COUNT(*) FROM public.partners
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM public.user_roles;

-- Check storage buckets
SELECT id, name, public FROM storage.buckets;
```

---

## Step 7: Test Your Application

1. Start your local dev server: `npm run dev` or `bun run dev`
2. Try to:
   - View published courses ✅
   - Submit a registration form ✅
   - Login (if you migrated users) ✅
   - Admin functions (if you're an admin) ✅

---

## Quick Start (If NO data to migrate)

If your OLD database is empty or you want a fresh start:

1. ✅ Run `MIGRATION_TO_NEW_DB.sql` in NEW database
2. ✅ Create first admin user by signing up in your app
3. ✅ Done! The schema is ready, start fresh

---

## Troubleshooting

### Error: "role does not exist"
- Make sure you ran the complete `MIGRATION_TO_NEW_DB.sql` file
- Check that all ENUMs were created (`app_role`, `enrollment_status`)

### Error: "relation does not exist"
- Import data in the correct order (users → courses → registrations)
- Check table names match exactly

### Error: "foreign key violation"
- Make sure referenced records exist first
- Example: Course must exist before course_registration

### Storage bucket not found
- Make sure storage policies ran successfully
- Check Supabase Dashboard → Storage → Buckets exist

---

## Need Help?

If you run into issues:
1. Check the Supabase Dashboard → Logs for errors
2. Verify all tables exist: Dashboard → Table Editor
3. Check RLS policies are active
4. Ensure storage buckets are created

---

## After Migration Checklist

- [ ] Schema applied successfully
- [ ] Data imported (or starting fresh)
- [ ] Storage buckets created
- [ ] Test user signup/login
- [ ] Test public course viewing
- [ ] Test registration form
- [ ] Test admin functions
- [ ] Update .env file with new credentials ✅ (Already done!)
- [ ] Deploy to production with new env vars

