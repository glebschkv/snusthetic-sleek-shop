-- Create brands table
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Brands are publicly readable
CREATE POLICY "Brands are publicly readable"
ON public.brands
FOR SELECT
USING (true);

-- Admins can manage brands
CREATE POLICY "Admins can insert brands"
ON public.brands
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update brands"
ON public.brands
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete brands"
ON public.brands
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add brand and product attributes to products table
ALTER TABLE public.products 
ADD COLUMN brand_id UUID REFERENCES public.brands(id),
ADD COLUMN flavor TEXT,
ADD COLUMN strength_mg INTEGER,
ADD COLUMN product_type TEXT DEFAULT 'physical';

-- Add custom quantity support to subscription_plans
ALTER TABLE public.subscription_plans
ADD COLUMN is_custom BOOLEAN DEFAULT false,
ADD COLUMN min_quantity INTEGER,
ADD COLUMN max_quantity INTEGER;

-- Insert Zyn and Velo brands
INSERT INTO public.brands (name, description) VALUES
('Zyn', 'Premium nicotine pouches with a variety of flavors'),
('Velo', 'Strong nicotine pouches for experienced users');

-- Create Nicotine Pouches category
INSERT INTO public.categories (name, slug, description) VALUES
('Nicotine Pouches', 'nicotine-pouches', 'Premium nicotine pouches - Zyn and Velo products');

-- Get the category and brand IDs for use in product creation
DO $$
DECLARE
  nicotine_category_id UUID;
  zyn_brand_id UUID;
  velo_brand_id UUID;
BEGIN
  SELECT id INTO nicotine_category_id FROM public.categories WHERE slug = 'nicotine-pouches';
  SELECT id INTO zyn_brand_id FROM public.brands WHERE name = 'Zyn';
  SELECT id INTO velo_brand_id FROM public.brands WHERE name = 'Velo';

  -- Create Zyn products (9 total)
  -- Cool Mint
  INSERT INTO public.products (name, description, price, currency, category_id, brand_id, flavor, strength_mg, product_type, stock_quantity, is_available) VALUES
  ('Zyn Cool Mint 3mg', 'Refreshing cool mint flavor with 3mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Cool Mint', 3, 'nicotine_pouch', 1000, true),
  ('Zyn Cool Mint 6mg', 'Refreshing cool mint flavor with 6mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Cool Mint', 6, 'nicotine_pouch', 1000, true),
  ('Zyn Cool Mint 9mg', 'Refreshing cool mint flavor with 9mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Cool Mint', 9, 'nicotine_pouch', 1000, true),
  
  -- Red Berry
  ('Zyn Red Berry 3mg', 'Sweet and tangy red berry flavor with 3mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Red Berry', 3, 'nicotine_pouch', 1000, true),
  ('Zyn Red Berry 6mg', 'Sweet and tangy red berry flavor with 6mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Red Berry', 6, 'nicotine_pouch', 1000, true),
  ('Zyn Red Berry 9mg', 'Sweet and tangy red berry flavor with 9mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Red Berry', 9, 'nicotine_pouch', 1000, true),
  
  -- Menthol Ice
  ('Zyn Menthol Ice 3mg', 'Icy menthol flavor with 3mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Menthol Ice', 3, 'nicotine_pouch', 1000, true),
  ('Zyn Menthol Ice 6mg', 'Icy menthol flavor with 6mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Menthol Ice', 6, 'nicotine_pouch', 1000, true),
  ('Zyn Menthol Ice 9mg', 'Icy menthol flavor with 9mg nicotine strength', 3.50, 'USD', nicotine_category_id, zyn_brand_id, 'Menthol Ice', 9, 'nicotine_pouch', 1000, true);

  -- Create Velo products (12 total)
  -- Freezing Peppermint
  INSERT INTO public.products (name, description, price, currency, category_id, brand_id, flavor, strength_mg, product_type, stock_quantity, is_available) VALUES
  ('Velo Freezing Peppermint 10mg', 'Intense freezing peppermint with 10mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Freezing Peppermint', 10, 'nicotine_pouch', 1000, true),
  ('Velo Freezing Peppermint 14mg', 'Intense freezing peppermint with 14mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Freezing Peppermint', 14, 'nicotine_pouch', 1000, true),
  ('Velo Freezing Peppermint 17mg', 'Intense freezing peppermint with 17mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Freezing Peppermint', 17, 'nicotine_pouch', 1000, true),
  
  -- Peppermint Storm
  ('Velo Peppermint Storm 10mg', 'Bold peppermint storm with 10mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Peppermint Storm', 10, 'nicotine_pouch', 1000, true),
  ('Velo Peppermint Storm 14mg', 'Bold peppermint storm with 14mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Peppermint Storm', 14, 'nicotine_pouch', 1000, true),
  ('Velo Peppermint Storm 17mg', 'Bold peppermint storm with 17mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Peppermint Storm', 17, 'nicotine_pouch', 1000, true),
  
  -- Ruby Berry
  ('Velo Ruby Berry 10mg', 'Rich ruby berry flavor with 10mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Ruby Berry', 10, 'nicotine_pouch', 1000, true),
  ('Velo Ruby Berry 14mg', 'Rich ruby berry flavor with 14mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Ruby Berry', 14, 'nicotine_pouch', 1000, true),
  ('Velo Ruby Berry 17mg', 'Rich ruby berry flavor with 17mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Ruby Berry', 17, 'nicotine_pouch', 1000, true),
  
  -- Orange Spark
  ('Velo Orange Spark 10mg', 'Zesty orange spark with 10mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Orange Spark', 10, 'nicotine_pouch', 1000, true),
  ('Velo Orange Spark 14mg', 'Zesty orange spark with 14mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Orange Spark', 14, 'nicotine_pouch', 1000, true),
  ('Velo Orange Spark 17mg', 'Zesty orange spark with 17mg nicotine strength', 3.50, 'USD', nicotine_category_id, velo_brand_id, 'Orange Spark', 17, 'nicotine_pouch', 1000, true);
END $$;