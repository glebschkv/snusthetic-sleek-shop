-- Update product images to use new paths
UPDATE products 
SET image_url = CASE
  WHEN image_url LIKE '%casino-silver%' THEN '/images/products/casino-silver.jpeg'
  WHEN image_url LIKE '%casino-gold%' THEN '/images/products/casino-gold.jpeg'
  WHEN image_url LIKE '%casino-black%' THEN '/images/products/casino-black.webp'
  WHEN image_url LIKE '%churchill-silver%' THEN '/images/products/churchill-silver.jpeg'
  WHEN image_url LIKE '%churchill-green%' THEN '/images/products/churchill-green.jpeg'
  WHEN image_url LIKE '%blank-green%' THEN '/images/products/blank-green.jpeg'
  WHEN image_url LIKE '%blank-silver%' THEN '/images/products/blank-silver.jpeg'
  WHEN image_url LIKE '%escobar-green%' THEN '/images/products/escobar-green.jpeg'
  WHEN image_url LIKE '%escobar-gold%' THEN '/images/products/escobar-gold.jpeg'
  WHEN image_url LIKE '%jack-green%' THEN '/images/products/jack-green.jpeg'
  WHEN image_url LIKE '%jack-silver%' THEN '/images/products/jack-silver.jpeg'
  WHEN image_url LIKE '%monaco-gold%' THEN '/images/products/monaco-gold.jpeg'
  WHEN image_url LIKE '%monaco-silver%' THEN '/images/products/monaco-silver.jpeg'
  WHEN image_url LIKE '%patriot-black%' THEN '/images/products/patriot-black.jpeg'
  WHEN image_url LIKE '%patriot-green%' THEN '/images/products/patriot-green.jpeg'
  WHEN image_url LIKE '%trump-gold%' THEN '/images/products/trump-gold.jpeg'
  WHEN image_url LIKE '%trump-green%' THEN '/images/products/trump-green.jpeg'
  WHEN image_url LIKE '%minamilistblack%' THEN '/images/products/minamilistblack.jpg'
  WHEN image_url LIKE '%minamilistgreen%' THEN '/images/products/minamilistgreen.jpg'
  ELSE image_url
END
WHERE image_url IS NOT NULL;

-- Update variant images similarly
UPDATE product_variants 
SET image_url = CASE
  WHEN image_url LIKE '%casino-silver%' THEN '/images/products/casino-silver.jpeg'
  WHEN image_url LIKE '%casino-gold%' THEN '/images/products/casino-gold.jpeg'
  WHEN image_url LIKE '%casino-black%' THEN '/images/products/casino-black.webp'
  WHEN image_url LIKE '%churchill-silver%' THEN '/images/products/churchill-silver.jpeg'
  WHEN image_url LIKE '%churchill-green%' THEN '/images/products/churchill-green.jpeg'
  WHEN image_url LIKE '%blank-green%' THEN '/images/products/blank-green.jpeg'
  WHEN image_url LIKE '%blank-silver%' THEN '/images/products/blank-silver.jpeg'
  WHEN image_url LIKE '%escobar-green%' THEN '/images/products/escobar-green.jpeg'
  WHEN image_url LIKE '%escobar-gold%' THEN '/images/products/escobar-gold.jpeg'
  WHEN image_url LIKE '%jack-green%' THEN '/images/products/jack-green.jpeg'
  WHEN image_url LIKE '%jack-silver%' THEN '/images/products/jack-silver.jpeg'
  WHEN image_url LIKE '%monaco-gold%' THEN '/images/products/monaco-gold.jpeg'
  WHEN image_url LIKE '%monaco-silver%' THEN '/images/products/monaco-silver.jpeg'
  WHEN image_url LIKE '%patriot-black%' THEN '/images/products/patriot-black.jpeg'
  WHEN image_url LIKE '%patriot-green%' THEN '/images/products/patriot-green.jpeg'
  WHEN image_url LIKE '%trump-gold%' THEN '/images/products/trump-gold.jpeg'
  WHEN image_url LIKE '%trump-green%' THEN '/images/products/trump-green.jpeg'
  WHEN image_url LIKE '%minamilistblack%' THEN '/images/products/minamilistblack.jpg'
  WHEN image_url LIKE '%minamilistgreen%' THEN '/images/products/minamilistgreen.jpg'
  ELSE image_url
END
WHERE image_url IS NOT NULL;