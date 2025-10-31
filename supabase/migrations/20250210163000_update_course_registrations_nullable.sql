-- Allow nullable values for optional lead fields and clean up existing empty strings
ALTER TABLE public.course_registrations
  ALTER COLUMN personal_id DROP NOT NULL,
  ALTER COLUMN city DROP NOT NULL;

UPDATE public.course_registrations
SET personal_id = NULL
WHERE personal_id = '';

UPDATE public.course_registrations
SET city = NULL
WHERE city = '';
