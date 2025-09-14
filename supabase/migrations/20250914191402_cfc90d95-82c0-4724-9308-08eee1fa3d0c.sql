-- Update orders table RLS policies for better security

-- First, let's update the INSERT policy to be more secure
-- We'll allow both authenticated users and guest checkout, but with better validation
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create a more secure insert policy that allows:
-- 1. Authenticated users to create orders (will have user_id set)
-- 2. Guest users to create orders (user_id will be null) but only with proper email validation
CREATE POLICY "Users and guests can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- For authenticated users, user_id must match auth.uid()
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  -- For guest orders, user_id must be null and email must be provided
  (auth.uid() IS NULL AND user_id IS NULL AND customer_email IS NOT NULL AND customer_email != '')
);

-- Add a policy to prevent viewing of guest orders by other users
-- Only admins can view guest orders (where user_id is null)
CREATE POLICY "Only admins can view guest orders" 
ON public.orders 
FOR SELECT 
USING (
  user_id IS NOT NULL OR 
  has_role(auth.uid(), 'admin'::app_role)
);