-- Fix orders table RLS policies to prevent unauthorized access to customer data

-- Drop ALL existing policies on orders table first
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Only admins can view guest orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view their own orders by email" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users and guests can create orders" ON public.orders;

-- Create secure SELECT policies
-- Policy for authenticated users to view only their own orders
CREATE POLICY "Users can view only their own orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy for admins to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create secure INSERT policies
-- Policy for authenticated users to create orders (only with their own user_id)
CREATE POLICY "Authenticated users can create their own orders" 
ON public.orders 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for guest orders (no user_id, must have customer_email and name)
CREATE POLICY "Guests can create orders without user_id" 
ON public.orders 
FOR INSERT 
TO anon
WITH CHECK (
  user_id IS NULL 
  AND customer_email IS NOT NULL 
  AND customer_email != ''
  AND customer_name IS NOT NULL 
  AND customer_name != ''
);