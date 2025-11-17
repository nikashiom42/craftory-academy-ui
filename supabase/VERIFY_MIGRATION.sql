-- ============================================
-- VERIFICATION QUERIES
-- Run these in your NEW Supabase SQL Editor to check the migration
-- ============================================

-- 1. Check if tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================

-- 2. Count records in each table
SELECT 'courses' as table_name, COUNT(*) as count FROM public.courses
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

-- ============================================

-- 3. Check if courses data exists (without RLS restrictions)
SELECT 
  id, 
  slug, 
  title, 
  published,
  created_at
FROM public.courses;

-- ============================================

-- 4. Check if partners data exists
SELECT 
  id,
  name,
  display_order,
  active
FROM public.partners
ORDER BY display_order;

-- ============================================

-- 5. Check if registrations exist
SELECT 
  id,
  first_name,
  last_name,
  email,
  status,
  created_at
FROM public.course_registrations
ORDER BY created_at DESC;

-- ============================================

-- 6. Check storage buckets
SELECT 
  id, 
  name, 
  public,
  created_at
FROM storage.buckets;

-- ============================================

-- 7. Check for any errors in the last migration
-- (This checks if ENUMs were created)
SELECT 
  typname as enum_name,
  enumlabel as enum_value
FROM pg_type 
JOIN pg_enum ON pg_type.oid = pg_enum.enumtypid
WHERE typname IN ('app_role', 'enrollment_status')
ORDER BY typname, enumlabel;

-- ============================================
-- Run each query above ONE BY ONE
-- Copy the results and let me know what you see
-- ============================================

