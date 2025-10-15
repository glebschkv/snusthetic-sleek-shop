-- Add commission tracking to referral_usage table
ALTER TABLE referral_usage 
ADD COLUMN commission_amount NUMERIC DEFAULT 0,
ADD COLUMN commission_percentage NUMERIC DEFAULT 5.0,
ADD COLUMN payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'approved', 'paid', 'cancelled')),
ADD COLUMN payout_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN payout_method TEXT,
ADD COLUMN payout_reference TEXT;

-- Create a payouts table for batch processing
CREATE TABLE referral_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'gbp',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  payment_method TEXT,
  payment_reference TEXT,
  referral_usage_ids UUID[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ,
  notes TEXT
);

-- Add RLS policies for referral_payouts
ALTER TABLE referral_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payouts"
ON referral_payouts
FOR SELECT
USING (auth.uid() = referrer_id);

CREATE POLICY "Admins can view all payouts"
ON referral_payouts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own payout requests"
ON referral_payouts
FOR INSERT
WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins can update payouts"
ON referral_payouts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add payment preferences to profiles
ALTER TABLE profiles
ADD COLUMN payout_method TEXT CHECK (payout_method IN ('paypal', 'bank_transfer', 'stripe', 'store_credit')),
ADD COLUMN payout_email TEXT,
ADD COLUMN payout_minimum NUMERIC DEFAULT 20.00;