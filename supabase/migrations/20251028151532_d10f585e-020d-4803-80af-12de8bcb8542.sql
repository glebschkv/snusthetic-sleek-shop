-- Update all nicotine pouch product prices from £3.50 to £4.50
UPDATE products 
SET price = 4.50, updated_at = now()
WHERE product_type = 'nicotine_pouch' AND price = 3.50;