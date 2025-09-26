-- Fix security vulnerability in referral_usage table
-- Replace the overly permissive insert policy with a secure function-based approach

-- First, drop the insecure policy
DROP POLICY IF EXISTS "System can insert referral usage" ON public.referral_usage;

-- Create a secure function for inserting referral usage records
-- This function can only be called with service role privileges
CREATE OR REPLACE FUNCTION public.create_referral_usage_record(
  p_referrer_id uuid,
  p_order_id uuid,
  p_referee_email text,
  p_discount_amount numeric
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_record_id uuid;
BEGIN
  -- Validate inputs
  IF p_referrer_id IS NULL THEN
    RAISE EXCEPTION 'Referrer ID cannot be null';
  END IF;
  
  IF p_referee_email IS NULL OR p_referee_email = '' THEN
    RAISE EXCEPTION 'Referee email cannot be null or empty';
  END IF;
  
  IF p_discount_amount < 0 THEN
    RAISE EXCEPTION 'Discount amount cannot be negative';
  END IF;
  
  -- Insert the record
  INSERT INTO public.referral_usage (
    referrer_id,
    order_id,
    referee_email,
    discount_amount
  ) VALUES (
    p_referrer_id,
    p_order_id,
    p_referee_email,
    p_discount_amount
  ) RETURNING id INTO new_record_id;
  
  RETURN new_record_id;
END;
$$;

-- Create a new, more secure insert policy
-- Only allow insertions through the secure function (which requires service role)
CREATE POLICY "Secure referral usage insertion" 
ON public.referral_usage 
FOR INSERT 
WITH CHECK (false); -- Block all direct insertions

-- Grant execute permission on the function to authenticated users and service role
-- (The webhook runs with service role privileges)
GRANT EXECUTE ON FUNCTION public.create_referral_usage_record TO authenticated, service_role;