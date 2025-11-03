-- Create partner_logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true);

-- Create partners table
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

-- Anyone can view active partners
CREATE POLICY "Anyone can view active partners"
ON public.partners
FOR SELECT
USING (active = true);

-- Admins can do everything with partners
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

-- Storage policies for partner logos
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

-- Create trigger for updated_at
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert existing partners from config
INSERT INTO public.partners (name, logo_url, display_order, active) VALUES
  ('Partner 1', '/assets/partners/1.webp', 1, true),
  ('Partner 2', '/assets/partners/2.webp', 2, true),
  ('Partner 3', '/assets/partners/3.webp', 3, true),
  ('Partner 4', '/assets/partners/4.png', 4, true),
  ('Partner 5', '/assets/partners/5.webp', 5, true),
  ('Partner 6', '/assets/partners/6.png', 6, true),
  ('Partner 7', '/assets/partners/7.png', 7, true);