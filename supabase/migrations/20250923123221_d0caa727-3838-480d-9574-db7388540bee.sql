-- Add missing columns to existing orders table for Stripe integration
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS items JSONB,
ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'eur',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

-- Update existing orders to have proper currency if null
UPDATE public.orders SET currency = 'eur' WHERE currency IS NULL;

-- Create new policies for Stripe integration
DROP POLICY IF EXISTS "Customers can view their own orders" ON public.orders;

CREATE POLICY "Customers can view their own orders by email" 
ON public.orders 
FOR SELECT 
USING (customer_email = auth.jwt() ->> 'email' OR (auth.uid() IS NOT NULL AND user_id = auth.uid()));

-- Create trigger for automatic timestamp updates if not exists
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON public.orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);