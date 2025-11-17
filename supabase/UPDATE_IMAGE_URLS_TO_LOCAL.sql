-- ============================================
-- UPDATE IMAGE URLs TO LOCAL PUBLIC FOLDER
-- Run this in your NEW Supabase SQL Editor
-- ============================================

-- Update course image URLs to point to local public folder
UPDATE courses 
SET image_url = '/course-images/0.12476493502505392.webp'
WHERE id = '334f696f-4a65-4980-a7cb-5d0a90919bc7';

-- Update partner logo URLs to point to local public folder
UPDATE partners 
SET logo_url = '/partner-logos/wvz89o4a34.webp'
WHERE id = '440161e6-9989-4fcc-ad4a-51806dac782e';

UPDATE partners 
SET logo_url = '/partner-logos/a3d7huhy2on.webp'
WHERE id = 'e5291009-75dd-42b0-ac38-0b4a3c0b002d';

UPDATE partners 
SET logo_url = '/partner-logos/mhtz701l0id.webp'
WHERE id = 'f028786f-9ef3-48df-836d-91a693732b44';

UPDATE partners 
SET logo_url = '/partner-logos/8yh8k2aejmc.png'
WHERE id = 'df8314f0-08eb-413c-b01a-5e7092338c77';

UPDATE partners 
SET logo_url = '/partner-logos/2gntxsh4j1y.webp'
WHERE id = 'db2eff9d-7666-45ea-b4f1-2eeae4d145e1';

UPDATE partners 
SET logo_url = '/partner-logos/mjgj1l8zbj.png'
WHERE id = 'bb1c3d68-0170-46dc-9e98-f4d080718e9a';

UPDATE partners 
SET logo_url = '/partner-logos/45nwpb0tzp3.png'
WHERE id = 'd695cae5-f816-485e-994e-a77e87dace5c';

-- ============================================
-- VERIFY THE UPDATES
-- ============================================

-- Check course image URL
SELECT id, title, image_url FROM courses;

-- Check partner logo URLs
SELECT id, name, logo_url, display_order 
FROM partners 
ORDER BY display_order;

-- ============================================
-- ✅ DONE!
-- Your images are now served from /public folder
-- ============================================

