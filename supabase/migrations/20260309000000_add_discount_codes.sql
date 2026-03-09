-- Create discount_codes table
CREATE TABLE public.discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage discount codes" ON public.discount_codes
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Add discount_code_used to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_code_used TEXT;

-- RPC for atomic usage increment
CREATE OR REPLACE FUNCTION public.increment_discount_code_usage(p_code TEXT)
RETURNS VOID AS $$
  UPDATE public.discount_codes
  SET current_uses = current_uses + 1, updated_at = NOW()
  WHERE code = p_code;
$$ LANGUAGE sql SECURITY DEFINER;

-- Seed WYATT discount code: 20% off, no limits
INSERT INTO public.discount_codes (code, description, discount_type, discount_value, is_active)
VALUES ('WYATT', '20% off entire order', 'percentage', 20, true);
