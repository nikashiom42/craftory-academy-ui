-- ============================================
-- Database Dump for Craftory Academy
-- Generated: 2025-11-17
-- ============================================
-- This file contains all data from the database tables
-- Use this to migrate data to a new database instance
-- ============================================

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
-- END OF DATABASE DUMP
-- ============================================
-- 
-- NOTES:
-- 1. This dump contains only DATA, not schema definitions
-- 2. Make sure your target database has the same schema structure
-- 3. Foreign key constraints may need to be temporarily disabled during import
-- 4. UUIDs are preserved to maintain relationships
-- 5. All timestamps are in UTC
-- 
-- TO IMPORT:
-- psql -U your_user -d your_database -f database_dump.sql
-- ============================================
