-- iPay integration support: enrollment status, gateway fields, and payment order tracking

-- Ensure enrollment_status enum contains values required by iPay workflow
ALTER TYPE public.enrollment_status ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE public.enrollment_status ADD VALUE IF NOT EXISTS 'paid';
ALTER TYPE public.enrollment_status ADD VALUE IF NOT EXISTS 'failed';

-- Default new enrollments to pending instead of legacy "test"
ALTER TABLE public.course_enrollments
ALTER COLUMN payment_status SET DEFAULT 'pending';

UPDATE public.course_enrollments
SET payment_status = 'pending'
WHERE payment_status = 'test';

-- Store gateway references on enrollments
ALTER TABLE public.course_enrollments
ADD COLUMN IF NOT EXISTS ipay_order_id text,
ADD COLUMN IF NOT EXISTS ipay_payment_id text,
ADD COLUMN IF NOT EXISTS ipay_payment_hash text,
ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Payment order status enum
DO $$
BEGIN
  CREATE TYPE public.payment_order_status AS ENUM ('pending', 'redirected', 'success', 'failed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- payment_orders table keeps raw gateway payloads and linking metadata
CREATE TABLE IF NOT EXISTS public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  course_title text NOT NULL,
  shop_order_id text NOT NULL UNIQUE,
  intent text NOT NULL DEFAULT 'CAPTURE',
  locale text NOT NULL DEFAULT 'ka',
  amount numeric(10,2) NOT NULL,
  currency_code text NOT NULL DEFAULT 'GEL',
  redirect_url text,
  callback_url text,
  ipay_order_id text,
  ipay_payment_id text,
  ipay_payment_hash text,
  status public.payment_order_status NOT NULL DEFAULT 'pending',
  status_description text,
  error_code text,
  error_message text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  CREATE POLICY "Users can view their payment orders"
  ON public.payment_orders
  FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE POLICY "Admins manage payment orders"
  ON public.payment_orders
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
  CREATE TRIGGER update_payment_orders_updated_at
  BEFORE UPDATE ON public.payment_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

