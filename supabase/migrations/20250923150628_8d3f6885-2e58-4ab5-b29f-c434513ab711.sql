-- Update product image URLs to use Supabase Storage
UPDATE products SET image_url = 'https://qqrgwesxjqmdwxyxgipx.supabase.co/storage/v1/object/public/product-images/casinoblack.jpg' WHERE name = 'The Degen';
UPDATE products SET image_url = 'https://qqrgwesxjqmdwxyxgipx.supabase.co/storage/v1/object/public/product-images/minamilistgreen.jpg' WHERE name = 'The Bulldog';

-- Update product variant image URLs to use Supabase Storage
UPDATE product_variants SET image_url = 'https://qqrgwesxjqmdwxyxgipx.supabase.co/storage/v1/object/public/product-images/casinoblack.jpg' WHERE color_name = 'Black' AND product_id = (SELECT id FROM products WHERE name = 'The Degen');
UPDATE product_variants SET image_url = 'https://qqrgwesxjqmdwxyxgipx.supabase.co/storage/v1/object/public/product-images/casinogold.jpg' WHERE color_name = 'Yellow' AND product_id = (SELECT id FROM products WHERE name = 'The Degen');
UPDATE product_variants SET image_url = 'https://qqrgwesxjqmdwxyxgipx.supabase.co/storage/v1/object/public/product-images/minamilistgreen.jpg' WHERE color_name = 'Green' AND product_id = (SELECT id FROM products WHERE name = 'The Bulldog');
UPDATE product_variants SET image_url = 'https://qqrgwesxjqmdwxyxgipx.supabase.co/storage/v1/object/public/product-images/minamilistblack.jpg' WHERE color_name = 'Gray' AND product_id = (SELECT id FROM products WHERE name = 'The Bulldog');