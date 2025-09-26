-- Add referral_code column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN referral_code TEXT UNIQUE;

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate 8 character alphanumeric code
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Check if code already exists
        SELECT COUNT(*) INTO exists_check 
        FROM public.profiles 
        WHERE referral_code = code;
        
        -- If code doesn't exist, use it
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles to have referral codes
UPDATE public.profiles 
SET referral_code = generate_referral_code() 
WHERE referral_code IS NULL;

-- Make referral_code NOT NULL after setting values
ALTER TABLE public.profiles 
ALTER COLUMN referral_code SET NOT NULL;

-- Create trigger to auto-generate referral codes for new profiles
CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code_trigger
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_referral_code();

-- Create referral_usage table to track when referral codes are used
CREATE TABLE public.referral_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referee_email TEXT NOT NULL,
    order_id UUID,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on referral_usage table
ALTER TABLE public.referral_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for referral_usage
CREATE POLICY "Users can view their own referral usage" 
ON public.referral_usage 
FOR SELECT 
USING (auth.uid() = referrer_id);

CREATE POLICY "System can insert referral usage" 
ON public.referral_usage 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all referral usage" 
ON public.referral_usage 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add referral tracking columns to orders table
ALTER TABLE public.orders 
ADD COLUMN referral_code_used TEXT,
ADD COLUMN referrer_id UUID REFERENCES public.profiles(id),
ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;

-- Create trigger for updated_at on referral_usage
CREATE TRIGGER update_referral_usage_updated_at
    BEFORE UPDATE ON public.referral_usage
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_referral_usage_referrer_id ON public.referral_usage(referrer_id);
CREATE INDEX idx_orders_referral_code ON public.orders(referral_code_used);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);