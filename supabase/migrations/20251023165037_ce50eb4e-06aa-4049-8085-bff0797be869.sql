-- Add price field to courses table
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT 0.00;

COMMENT ON COLUMN public.courses.price IS 'Course price in GEL';

-- Create enrollment status enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enrollment_status') THEN
        CREATE TYPE public.enrollment_status AS ENUM ('pending', 'completed', 'test');
    END IF;
END
$$;

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT now(),
  payment_status enrollment_status NOT NULL DEFAULT 'test',
  price_paid numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course_enrollments
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can view their own enrollments"
ON public.course_enrollments
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own enrollments" ON public.course_enrollments;
CREATE POLICY "Users can create their own enrollments"
ON public.course_enrollments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.course_enrollments;
CREATE POLICY "Admins can view all enrollments"
ON public.course_enrollments
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete enrollments" ON public.course_enrollments;
CREATE POLICY "Admins can delete enrollments"
ON public.course_enrollments
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update enrollments" ON public.course_enrollments;
CREATE POLICY "Admins can update enrollments"
ON public.course_enrollments
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_course_enrollments_updated_at ON public.course_enrollments;
CREATE TRIGGER update_course_enrollments_updated_at
BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();