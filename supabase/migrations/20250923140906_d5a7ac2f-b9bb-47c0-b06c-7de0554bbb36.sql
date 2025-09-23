-- Update product image URLs from src/assets/ to /assets/ format
UPDATE public.products 
SET image_url = '/assets/' || SUBSTRING(image_url FROM 'src/assets/(.*)') 
WHERE image_url LIKE 'src/assets/%';

-- Update product variant image URLs from src/assets/ to /assets/ format
UPDATE public.product_variants 
SET image_url = '/assets/' || SUBSTRING(image_url FROM 'src/assets/(.*)') 
WHERE image_url LIKE 'src/assets/%';

-- Update product image URLs from public/assets/ to /assets/ format
UPDATE public.products 
SET image_url = '/assets/' || SUBSTRING(image_url FROM 'public/assets/(.*)') 
WHERE image_url LIKE 'public/assets/%';

-- Update product variant image URLs from public/assets/ to /assets/ format
UPDATE public.product_variants 
SET image_url = '/assets/' || SUBSTRING(image_url FROM 'public/assets/(.*)') 
WHERE image_url LIKE 'public/assets/%';