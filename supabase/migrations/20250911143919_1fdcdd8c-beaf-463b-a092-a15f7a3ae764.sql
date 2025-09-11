-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table for future user sessions
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for future order management
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_email TEXT,
  customer_name TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to categories and products
CREATE POLICY "Categories are publicly readable" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Products are publicly readable" 
ON public.products 
FOR SELECT 
USING (true);

-- Create policies for cart items (user-specific)
CREATE POLICY "Users can view their own cart items" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for orders (user-specific and public insert for guest checkout)
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('All', 'all', 'All products'),
  ('Snus Holders', 'snus-holders', 'Premium metal snus holders'),
  ('Accessories', 'accessories', 'Additional accessories');

-- Insert sample products
INSERT INTO public.products (name, description, price, currency, category_id, image_url, stock_quantity, is_available) VALUES
  (
    'DEGEN Metal Snus Holder', 
    'Premium ribbed metal snus holder for the modern user',
    29.99,
    'USD',
    (SELECT id FROM public.categories WHERE slug = 'snus-holders'),
    '/src/assets/snus-holder-degen.jpg',
    50,
    true
  ),
  (
    'MONARCH Metal Snus Holder', 
    'Elite ribbed metal snus holder with premium finish',
    39.99,
    'USD',
    (SELECT id FROM public.categories WHERE slug = 'snus-holders'),
    '/src/assets/snus-holder-monarch.jpg',
    30,
    true
  ),
  (
    'NATIONALIST Metal Snus Holder', 
    'Patriotic ribbed metal snus holder with unique design',
    34.99,
    'USD',
    (SELECT id FROM public.categories WHERE slug = 'snus-holders'),
    '/src/assets/snus-holder-nationalist.jpg',
    25,
    true
  );