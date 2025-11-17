-- ============================================
-- COMPLETE MIGRATION: SCHEMA + DATA
-- For New Vercel Supabase Database
-- ============================================
-- This file contains:
-- 1. Complete database schema
-- 2. All real data from your old database
-- 
-- Run this ONCE in your new Supabase SQL Editor
-- ============================================

-- ============================================
-- PART 1: SCHEMA MIGRATION
-- ============================================

-- 1. Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create profiles table for additional user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  
  -- Give first user admin role
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin');
  ELSE
    -- All other users get 'user' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
  END IF;
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Create enrollment status enum
CREATE TYPE public.enrollment_status AS ENUM ('pending', 'completed', 'test');

-- 7. Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  duration TEXT,
  participant_number INTEGER,
  start_date DATE,
  end_date DATE,
  google_meet_link TEXT,
  google_drive_link TEXT,
  syllabus JSONB,
  hero_claims JSONB,
  target_audience JSONB,
  skills JSONB,
  trainer JSONB,
  cohort JSONB,
  why_section JSONB,
  info_session_cta JSONB,
  price NUMERIC(10,2) DEFAULT 0.00,
  featured_on_home BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

COMMENT ON COLUMN public.courses.price IS 'Course price in GEL';

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Course policies
CREATE POLICY "Anyone can view published courses"
  ON public.courses FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses"
  ON public.courses FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- 8. Create course_registrations table for lead collection
CREATE TABLE public.course_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  personal_id TEXT NOT NULL,
  city TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_registrations ENABLE ROW LEVEL SECURITY;

-- Registration policies
CREATE POLICY "Anyone can submit registration"
  ON public.course_registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all registrations"
  ON public.course_registrations
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update registrations"
  ON public.course_registrations
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations"
  ON public.course_registrations
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for registrations
CREATE INDEX idx_course_registrations_created_at ON public.course_registrations(created_at DESC);
CREATE INDEX idx_course_registrations_status ON public.course_registrations(status);
CREATE INDEX idx_course_registrations_email ON public.course_registrations(email);

-- 9. Create course enrollments table
CREATE TABLE public.course_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT now(),
  payment_status enrollment_status NOT NULL DEFAULT 'test',
  price_paid numeric(10,2) NOT NULL,
  tbc_order_id TEXT,
  tbc_payment_id TEXT,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Enrollment policies
CREATE POLICY "Users can view their own enrollments"
ON public.course_enrollments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
ON public.course_enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments"
ON public.course_enrollments
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete enrollments"
ON public.course_enrollments
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update enrollments"
ON public.course_enrollments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- 10. Create partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on partners table
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Partner policies
CREATE POLICY "Anyone can view active partners"
ON public.partners
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can insert partners"
ON public.partners
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update partners"
ON public.partners
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete partners"
ON public.partners
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 11. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_registrations_updated_at
  BEFORE UPDATE ON public.course_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-images', 'course-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- 13. Storage policies for course images
CREATE POLICY "Anyone can view course images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-images');

CREATE POLICY "Admins can upload course images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update course images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-images' AND
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete course images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-images' AND
    public.has_role(auth.uid(), 'admin')
  );

-- 14. Storage policies for partner logos
CREATE POLICY "Anyone can view partner logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'partner-logos');

CREATE POLICY "Admins can upload partner logos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'partner-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update partner logos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'partner-logos' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete partner logos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'partner-logos' AND has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- PART 2: DATA MIGRATION (From database_dump.sql)
-- ============================================

-- NOTE: You'll need to manually migrate auth.users from old DB to new DB
-- This can only be done through Supabase Dashboard or by contacting support
-- For now, we're inserting profiles and user_roles that will link to users
-- once they're migrated or re-register

-- ============================================
-- TABLE: courses
-- ============================================

INSERT INTO courses (
  id, slug, title, subtitle, description, image_url, duration, 
  participant_number, start_date, end_date, published, hero_claims, 
  cohort, skills, syllabus, target_audience, trainer, 
  google_meet_link, google_drive_link, price, featured_on_home, 
  why_section, info_session_cta, created_at, updated_at, created_by
) VALUES (
  '334f696f-4a65-4980-a7cb-5d0a90919bc7',
  'furniture-constructor',
  'ავეჯის კონსტრუირების კურსი',
  'საქართველოს პირველი ავეჯის კონსტრუირების კურსი',
  '2 თვეში — 0-დან პროფესიონალამდე სტაჟირებით პარტნიორ კომპანიებში',
  'https://guftugxbadrjwutxpxsk.supabase.co/storage/v1/object/public/course-images/0.12476493502505392.webp',
  '2 თვე',
  20,
  '2025-01-15',
  '2025-03-15',
  true,
  '["ავეჯის კონსტრუირების პირველი კურსი საქართველოში", "2 თვეში - 0-დან პროფესიონალამდე", "სტაჟირება პარტნიორ კომპანიებში"]'::jsonb,
  '{"duration": "2 თვე", "format": "Online თეორია + Offline პრაქტიკა", "sessionsCount": "24 შეხვედრა", "startDate": "2025 წლის 15 იანვარი"}'::jsonb,
  '["ავეჯის კონსტრუქციის საფუძვლები და ტიპები", "AutoCAD-ში პროფესიონალური ნახაზების შექმნა", "მასალების გაანგარიშება და ხარჯთაღრიცხვა", "3D ვიზუალიზაცია და პრეზენტაცია"]'::jsonb,
  '[{"module": 1, "title": "შესავალი ავეჯის კონსტრუირებაში", "topics": ["რას ვისწავლით კურსზე", "ავეჯის ტიპები და კონსტრუქციები", "ინდუსტრიის მიმოხილვა საქართველოში", "კარიერული შესაძლებლობები"]}, {"module": 2, "title": "AutoCAD საფუძვლები", "topics": ["რა არის AutoCAD", "ინტერფეისის გაცნობა", "ძირითადი ბრძანებები და ხელსაწყოები", "ორგანზომილებიანი ნახაზების შექმნა"]}, {"module": 3, "title": "პროფესიონალური ნახაზები", "topics": ["ზუსტი ზომების მიცემა", "Layer-ების მართვა", "სამუშაო ნახაზების მომზადება წარმოებისთვის", "ფაილების ექსპორტი და საქაღალდეების მართვა"]}, {"module": 4, "title": "მასალები და ხარჯთაღრიცხვა", "topics": ["ავეჯის ძირითადი მასალები", "მასალების გაანგარიშების მეთოდები", "ხარჯთაღრიცხვის შექმნა Excel-ში", "ოპტიმიზაცია და ფასების გაანგარიშება"]}, {"module": 5, "title": "3D მოდელირება და ვიზუალიზაცია", "topics": ["3D ნახაზების შექმნა AutoCAD-ში", "ვიზუალიზაციის ძირითადი პრინციპები", "რენდერინგი და პრეზენტაცია", "დასრულებული პროექტის წარდგენა"]}]'::jsonb,
  '["გსურს დაეუფლო ახალ, მაღალანაზღაურებად პროფესიას", "უკვე გაქვს გარკვეული ცოდნა, თუმცა გსურს, რომ გაიღრმავო და ისწავლო დეტალურად როგორ გაზომო სწორად, გააკეთო ხარჯთაღრიცხვა და გააციფრულო ნახაზები", "გაქვს ავეჯის ბიზნესი და გსურს თანამშრომლებს გაატარო პროფესიული კურსი"]'::jsonb,
  '{"bio": "მე ვარ გიგა, ავეჯის ინდუსტრიაში 15 წელზე მეტია ვმუშაობ. დავაარსე Interna - ერთ-ერთი წამყვანი ავეჯის კომპანია საქართველოში. ამ კურსით მინდა გადავცე ჩემი ყველა ცოდნა და გამოცდილება მომავალ თაობას.", "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop", "name": "გიგა მესხი", "title": "კურსის ავტორი და ტრენერი", "credentials": "Interna-ს დამფუძნებელი"}'::jsonb,
  'https://meet.google.com/abc-defg-hij',
  'https://drive.google.com/drive/folders/example',
  1200.00,
  true,
  '[{"icon": "Target", "title": "მიზანმიმართული სწავლება", "description": "ყოველი მოდული აგებულია პრაქტიკული პროექტების გარშემო"}, {"icon": "Users", "title": "მცირე ჯგუფები", "description": "მაქსიმუმ 20 მონაწილე პერსონალიზებული მიდგომისთვის"}, {"icon": "Award", "title": "ინდუსტრიის ექსპერტები", "description": "სწავლება 15+ წლიანი გამოცდილების მქონე პროფესიონალებთან"}, {"icon": "Briefcase", "title": "სტაჟირების შესაძლებლობა", "description": "პარტნიორ კომპანიებში სამუშაოს დაწყების შანსი კურსის შემდეგ"}]'::jsonb,
  NULL,
  '2025-10-23 15:13:55.348178+00',
  '2025-10-23 15:13:55.348178+00',
  NULL
);

-- ============================================
-- TABLE: course_registrations
-- ============================================

INSERT INTO course_registrations (
  id, course_id, first_name, last_name, email, phone, personal_id, 
  city, status, notes, created_at, updated_at
) VALUES
(
  '1fd00e82-d609-4b76-8e59-42167065e6e0',
  NULL,
  'nika',
  'shio',
  'nikashio42@gmail.com',
  '599 89 15 60 ',
  '01001078587',
  'Tbilisi',
  'new',
  NULL,
  '2025-10-23 14:53:02.659286+00',
  '2025-10-23 14:53:02.659286+00'
),
(
  'dba05aa5-998e-42f9-83f6-ce1b6efffe48',
  NULL,
  'GIGA',
  'KHAREBASHVILI',
  'xarebashvili.giga@gmail.com',
  '558515615',
  '',
  '',
  'contacted',
  NULL,
  '2025-10-27 18:17:47.373403+00',
  '2025-10-31 13:27:34.205047+00'
),
(
  '0edefd62-9304-454e-929a-ea17301693f0',
  '334f696f-4a65-4980-a7cb-5d0a90919bc7',
  'nikoloz',
  'shiomghvdlishvili',
  'nikashio42@gmail.com',
  '599891560',
  '',
  '',
  'new',
  NULL,
  '2025-11-03 18:27:39.874868+00',
  '2025-11-03 18:27:39.874868+00'
);

-- ============================================
-- TABLE: partners
-- ============================================

INSERT INTO partners (
  id, name, logo_url, display_order, active, 
  created_at, updated_at
) VALUES
(
  '440161e6-9989-4fcc-ad4a-51806dac782e',
  'Partner 1',
  'https://guftugxbadrjwutxpxsk.supabase.co/storage/v1/object/public/partner-logos/wvz89o4a34.webp',
  1,
  true,
  '2025-11-03 18:29:13.245022+00',
  '2025-11-03 18:33:14.932246+00'
),
(
  'e5291009-75dd-42b0-ac38-0b4a3c0b002d',
  'Partner 2',
  'https://guftugxbadrjwutxpxsk.supabase.co/storage/v1/object/public/partner-logos/a3d7huhy2on.webp',
  2,
  true,
  '2025-11-03 18:29:13.245022+00',
  '2025-11-03 18:33:23.707599+00'
),
(
  'f028786f-9ef3-48df-836d-91a693732b44',
  'Partner 3',
  'https://guftugxbadrjwutxpxsk.supabase.co/storage/v1/object/public/partner-logos/mhtz701l0id.webp',
  3,
  true,
  '2025-11-03 18:29:13.245022+00',
  '2025-11-03 18:33:31.191827+00'
),
(
  'df8314f0-08eb-413c-b01a-5e7092338c77',
  'Partner 4',
  'https://guftugxbadrjwutxpxsk.supabase.co/storage/v1/object/public/partner-logos/8yh8k2aejmc.png',
  4,
  true,
  '2025-11-03 18:29:13.245022+00',
  '2025-11-03 18:33:44.076203+00'
),
(
  'db2eff9d-7666-45ea-b4f1-2eeae4d145e1',
  'Partner 5',
  'https://guftugxbadrjwutxpxsk.supabase.co/storage/v1/object/public/partner-logos/2gntxsh4j1y.webp',
  5,
  true,
  '2025-11-03 18:29:13.245022+00',
  '2025-11-03 18:33:52.719091+00'
),
(
  'bb1c3d68-0170-46dc-9e98-f4d080718e9a',
  'Partner 6',
  'https://guftugxbadrjwutxpxsk.supabase.co/storage/v1/object/public/partner-logos/mjgj1l8zbj.png',
  6,
  true,
  '2025-11-03 18:29:13.245022+00',
  '2025-11-03 18:34:02.079569+00'
),
(
  'd695cae5-f816-485e-994e-a77e87dace5c',
  'Partner 7',
  'https://guftugxbadrjwutxpxsk.supabase.co/storage/v1/object/public/partner-logos/45nwpb0tzp3.png',
  7,
  true,
  '2025-11-03 18:29:13.245022+00',
  '2025-11-03 18:34:09.027477+00'
);

-- ============================================
-- IMPORTANT NOTES ABOUT USER DATA
-- ============================================
-- 
-- ⚠️ PROFILES, USER_ROLES, and COURSE_ENROLLMENTS are commented out below
-- because they require auth.users to exist first.
-- 
-- YOU HAVE TWO OPTIONS:
-- 
-- Option 1 (Fresh Start - RECOMMENDED):
-- - Skip migrating old users
-- - Have users re-register in the new system
-- - First user to register will automatically become admin
-- 
-- Option 2 (Migrate Users - COMPLEX):
-- - Manually export users from OLD Supabase Dashboard
-- - In NEW Supabase: Go to Authentication → Users
-- - Click "Add User" and manually create each user
-- - Then uncomment and run the SQL below
-- 
-- ============================================

-- Uncomment these if you choose Option 2 above:

/*
-- ============================================
-- TABLE: profiles
-- ============================================

INSERT INTO profiles (
  id, email, full_name, created_at, updated_at
) VALUES
(
  '6691d91c-c071-4f04-bcf2-622c45bcb97f',
  'nikashio42@gmail.com',
  NULL,
  '2025-10-23 14:17:40.832904+00',
  '2025-10-23 14:17:40.832904+00'
),
(
  '9d3d4b87-57a5-4af1-b574-adcaf69e9541',
  'admin@example.com',
  NULL,
  '2025-10-23 15:24:57.996883+00',
  '2025-10-23 15:24:57.996883+00'
),
(
  'de45632d-216b-4ce9-9345-ce29ad83976c',
  'nikashio41@gmail.com',
  'ნიკა',
  '2025-10-23 16:56:17.583241+00',
  '2025-10-23 16:56:17.583241+00'
),
(
  '9b33701c-1964-45d4-a763-87c436a92a3b',
  'admin1@example.com',
  'gia',
  '2025-10-24 08:43:04.646119+00',
  '2025-10-24 08:43:04.646119+00'
),
(
  '3e61bfe3-0fed-4974-86ad-af8d135d1c2a',
  'mtitberidze2@gmail.com',
  'მარიამი თითბერიძე',
  '2025-10-27 16:52:56.155955+00',
  '2025-10-27 16:52:56.155955+00'
),
(
  'b37a562a-7c68-4f6d-9385-bc8be1886149',
  'nikashio40@gmail.com',
  'gia',
  '2025-10-27 16:55:17.782778+00',
  '2025-10-27 16:55:17.782778+00'
),
(
  '2923ce03-002e-4542-9b72-77c2f7d0c145',
  'xarebashvili.giga@gmail.com',
  NULL,
  '2025-10-27 18:17:47.177345+00',
  '2025-10-27 18:17:47.177345+00'
),
(
  '6077cf23-414c-45eb-b0da-ce062e574352',
  'lipartelianikristina@gmail.com',
  'გიგა ხარებაშვილი',
  '2025-10-31 12:52:35.173479+00',
  '2025-10-31 12:52:35.173479+00'
),
(
  '995c2bd5-45fd-480c-a821-38932b77de8b',
  'admin2@example.com',
  NULL,
  '2025-10-31 13:12:40.282171+00',
  '2025-10-31 13:12:40.282171+00'
);

-- ============================================
-- TABLE: user_roles
-- ============================================

INSERT INTO user_roles (
  id, user_id, role, created_at
) VALUES
(
  'c8f41894-c796-4f11-a30b-bc2ba08e2ee8',
  '6691d91c-c071-4f04-bcf2-622c45bcb97f',
  'admin',
  '2025-10-23 14:17:40.832904+00'
),
(
  '4041d49a-5505-4624-b91e-fa2d5b8f3049',
  '9d3d4b87-57a5-4af1-b574-adcaf69e9541',
  'user',
  '2025-10-23 15:24:57.996883+00'
),
(
  '58ece6c0-4b01-40c7-817c-91eb0cdfc128',
  'de45632d-216b-4ce9-9345-ce29ad83976c',
  'user',
  '2025-10-23 16:56:17.583241+00'
),
(
  '979fe9b5-4247-4ec7-9f2d-c13803140596',
  '9b33701c-1964-45d4-a763-87c436a92a3b',
  'user',
  '2025-10-24 08:43:04.646119+00'
),
(
  '73d9740d-406a-41cd-af62-63f8dcaedd9b',
  '3e61bfe3-0fed-4974-86ad-af8d135d1c2a',
  'user',
  '2025-10-27 16:52:56.155955+00'
),
(
  '0028dbe7-17b9-4d8b-9df2-f90d7d804a52',
  'b37a562a-7c68-4f6d-9385-bc8be1886149',
  'user',
  '2025-10-27 16:55:17.782778+00'
),
(
  '0c45a6d0-cff3-403c-b326-ddd9503e482b',
  '2923ce03-002e-4542-9b72-77c2f7d0c145',
  'user',
  '2025-10-27 18:17:47.177345+00'
),
(
  '7fc06266-d3a5-44fa-bc36-9f4d82a21138',
  '6077cf23-414c-45eb-b0da-ce062e574352',
  'user',
  '2025-10-31 12:52:35.173479+00'
),
(
  '49d49c92-53fb-4fef-ba8f-a6fc2bb3deca',
  '9d3d4b87-57a5-4af1-b574-adcaf69e9541',
  'admin',
  NOW()
),
(
  '8293d982-4b1f-46c6-992d-9130eec96f60',
  '995c2bd5-45fd-480c-a821-38932b77de8b',
  'admin',
  NOW()
);

-- ============================================
-- TABLE: course_enrollments
-- ============================================

INSERT INTO course_enrollments (
  id, user_id, course_id, payment_status, price_paid, 
  tbc_order_id, tbc_payment_id, enrolled_at, paid_at, 
  created_at, updated_at
) VALUES
(
  'ff0d1eed-215d-45c7-aa16-6e75869292e6',
  '9d3d4b87-57a5-4af1-b574-adcaf69e9541',
  '334f696f-4a65-4980-a7cb-5d0a90919bc7',
  'test',
  0.00,
  NULL,
  NULL,
  '2025-10-24 13:47:01.769835+00',
  NULL,
  '2025-10-24 13:47:01.769835+00',
  '2025-10-24 13:47:01.769835+00'
),
(
  '69d4802b-e0c8-43ea-9b99-e8bff37bef6a',
  'de45632d-216b-4ce9-9345-ce29ad83976c',
  '334f696f-4a65-4980-a7cb-5d0a90919bc7',
  'test',
  1200.00,
  NULL,
  NULL,
  '2025-10-27 16:49:24.335756+00',
  NULL,
  '2025-10-27 16:49:24.335756+00',
  '2025-10-27 16:49:24.335756+00'
),
(
  '44cacc95-416c-42a4-976a-0449f6251dc5',
  '3e61bfe3-0fed-4974-86ad-af8d135d1c2a',
  '334f696f-4a65-4980-a7cb-5d0a90919bc7',
  'test',
  1200.00,
  NULL,
  NULL,
  '2025-10-27 16:56:35.48681+00',
  NULL,
  '2025-10-27 16:56:35.48681+00',
  '2025-10-27 16:56:35.48681+00'
),
(
  '0aaf79b1-c1a8-4f23-93f6-fc84ddae47ea',
  '2923ce03-002e-4542-9b72-77c2f7d0c145',
  '334f696f-4a65-4980-a7cb-5d0a90919bc7',
  'test',
  1200.00,
  NULL,
  NULL,
  '2025-10-27 18:22:38.996903+00',
  NULL,
  '2025-10-27 18:22:38.996903+00',
  '2025-10-27 18:22:38.996903+00'
);
*/

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- 
-- ✅ Schema created
-- ✅ Data migrated (courses, registrations, partners)
-- ⚠️  User data commented out (see notes above)
-- 
-- NEXT STEPS:
-- 1. Test your application
-- 2. Sign up to create first admin user
-- 3. Migrate storage files if needed (course images, partner logos)
-- 
-- ============================================

