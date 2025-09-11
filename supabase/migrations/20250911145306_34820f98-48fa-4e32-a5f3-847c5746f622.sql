-- Fix image paths by removing /src prefix
UPDATE products 
SET image_url = REPLACE(image_url, '/src/assets/', '/src/assets/')
WHERE image_url LIKE '/src/assets/%';