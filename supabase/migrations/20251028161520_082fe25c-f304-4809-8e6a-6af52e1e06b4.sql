-- Update the Nationalist Gold variant to use the newly resized image
UPDATE product_variants 
SET image_url = 'https://qqrgwesxjqmdwxyxgipx.supabase.co/storage/v1/object/public/product-images/nationalist-gold.jpg',
    updated_at = now()
WHERE id = 'b22cb340-534d-400a-99d4-e5aa2277ac31';