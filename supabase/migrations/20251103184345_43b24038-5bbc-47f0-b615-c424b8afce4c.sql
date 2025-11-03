-- Add why_section and info_session_cta columns to courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS why_section jsonb,
ADD COLUMN IF NOT EXISTS info_session_cta jsonb;