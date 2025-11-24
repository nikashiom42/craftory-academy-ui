-- Create course_registrations table for lead collection
CREATE TABLE IF NOT EXISTS public.course_registrations (
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

-- Allow anyone to insert registrations (public form submission)
DROP POLICY IF EXISTS "Anyone can submit registration" ON public.course_registrations;
CREATE POLICY "Anyone can submit registration"
  ON public.course_registrations
  FOR INSERT
  WITH CHECK (true);

-- Only admins can view registrations
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.course_registrations;
CREATE POLICY "Admins can view all registrations"
  ON public.course_registrations
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can update registrations
DROP POLICY IF EXISTS "Admins can update registrations" ON public.course_registrations;
CREATE POLICY "Admins can update registrations"
  ON public.course_registrations
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Only admins can delete registrations
DROP POLICY IF EXISTS "Admins can delete registrations" ON public.course_registrations;
CREATE POLICY "Admins can delete registrations"
  ON public.course_registrations
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create updated_at trigger
DROP TRIGGER IF EXISTS update_course_registrations_updated_at ON public.course_registrations;
CREATE TRIGGER update_course_registrations_updated_at
  BEFORE UPDATE ON public.course_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_course_registrations_created_at ON public.course_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_registrations_status ON public.course_registrations(status);
CREATE INDEX IF NOT EXISTS idx_course_registrations_email ON public.course_registrations(email);