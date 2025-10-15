-- Update Velo and Zyn nicotine pouch products to £3.50 base price
UPDATE products
SET 
  price = 3.5,
  currency = 'GBP'
WHERE product_type = 'nicotine_pouch';