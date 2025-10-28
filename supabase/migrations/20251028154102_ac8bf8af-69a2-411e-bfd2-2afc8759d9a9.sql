-- Update nicotine pouch product prices to £3.798 per can (5 cans = £18.99)
UPDATE products 
SET price = 3.798, 
    updated_at = now() 
WHERE product_type = 'nicotine_pouch' 
  AND price = 4.50;