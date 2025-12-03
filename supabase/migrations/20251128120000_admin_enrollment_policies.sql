-- Migration: Add admin INSERT policy for course_enrollments
-- Allows admins to manually enroll students without payment

-- Add INSERT policy for admins to create enrollments
DROP POLICY IF EXISTS "Admins can create enrollments" ON public.course_enrollments;
CREATE POLICY "Admins can create enrollments"
ON public.course_enrollments
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all profiles (to select users for enrollment)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'));



