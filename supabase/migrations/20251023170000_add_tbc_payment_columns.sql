-- Add TBC payment tracking columns to course_enrollments
ALTER TABLE public.course_enrollments
ADD COLUMN tbc_payment_id text,
ADD COLUMN tbc_order_id text,
ADD COLUMN paid_at timestamp with time zone;

-- Update enrollment_status enum to include 'paid' and 'failed'
ALTER TYPE public.enrollment_status ADD VALUE IF NOT EXISTS 'paid';
ALTER TYPE public.enrollment_status ADD VALUE IF NOT EXISTS 'failed';

-- Add index for faster payment lookups
CREATE INDEX idx_course_enrollments_tbc_payment_id ON public.course_enrollments(tbc_payment_id);

COMMENT ON COLUMN public.course_enrollments.tbc_payment_id IS 'TBC Bank payment ID (payId)';
COMMENT ON COLUMN public.course_enrollments.tbc_order_id IS 'TBC Bank order ID for tracking';
COMMENT ON COLUMN public.course_enrollments.paid_at IS 'Timestamp when payment was confirmed';

