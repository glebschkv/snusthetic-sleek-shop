// Import all product images as ES6 modules
import casinoSilver from '../assets/casino-silver.jpg_1.jpeg';
import casinoGold from '../assets/casino-gold.jpg_5.jpeg';
import churchillSilver from '../assets/churchill-silver.jpg_1.jpeg';
import churchillGreen from '../assets/churchill-green.jpg_2.jpeg';
import blankGreen from '../assets/blank-green.jpg.jpeg';
import blankSilver from '../assets/blank-silver.jpg.jpeg';
import escobarGreen from '../assets/escobar-green.jpg.jpeg';
import escobarGold from '../assets/escobar-gold.jpg.jpeg';
import jackGreen from '../assets/jack-green.jpg.jpeg';
import jackSilver from '../assets/jack-silver.jpg.jpeg';
import monacoGold from '../assets/monaco-gold.jpg.jpeg';
import monacoSilver from '../assets/monaco-silver.jpg.jpeg';
import patriotBlack from '../assets/patriot-black.jpg.jpeg';
import patriotGreen from '../assets/patriot-green.jpg.jpeg';
import trumpGold from '../assets/trump-gold.jpg.jpeg';
import trumpGreen from '../assets/trump-green.jpg.jpeg';
import casinoBlack from '../assets/casino-black.webp';
import minamilistBlack from '../assets/minamilistblack.jpg';
import minamilistGreen from '../assets/minamilistgreen.jpg';

// Create a comprehensive mapping that handles all possible path formats
const imageMap: Record<string, string> = {
  // Full path format (src/assets/...)
  'src/assets/casino-silver.jpg_1.jpeg': casinoSilver,
  'src/assets/casino-gold.jpg_5.jpeg': casinoGold,
  'src/assets/casino-black.webp': casinoBlack,
  'src/assets/churchill-silver.jpg_1.jpeg': churchillSilver,
  'src/assets/churchill-green.jpg_2.jpeg': churchillGreen,
  'src/assets/blank-green.jpg.jpeg': blankGreen,
  'src/assets/blank-silver.jpg.jpeg': blankSilver,
  'src/assets/escobar-green.jpg.jpeg': escobarGreen,
  'src/assets/escobar-gold.jpg.jpeg': escobarGold,
  'src/assets/jack-green.jpg.jpeg': jackGreen,
  'src/assets/jack-silver.jpg.jpeg': jackSilver,
  'src/assets/monaco-gold.jpg.jpeg': monacoGold,
  'src/assets/monaco-silver.jpg.jpeg': monacoSilver,
  'src/assets/patriot-black.jpg.jpeg': patriotBlack,
  'src/assets/patriot-green.jpg.jpeg': patriotGreen,
  'src/assets/trump-gold.jpg.jpeg': trumpGold,
  'src/assets/trump-green.jpg.jpeg': trumpGreen,
  'src/assets/minamilistblack.jpg': minamilistBlack,
  'src/assets/minamilistgreen.jpg': minamilistGreen,
  
  // Relative path format (/assets/...)
  '/assets/casino-silver.jpg_1.jpeg': casinoSilver,
  '/assets/casino-gold.jpg_5.jpeg': casinoGold,
  '/assets/casino-black.webp': casinoBlack,
  '/assets/churchill-silver.jpg_1.jpeg': churchillSilver,
  '/assets/churchill-green.jpg_2.jpeg': churchillGreen,
  '/assets/blank-green.jpg.jpeg': blankGreen,
  '/assets/blank-silver.jpg.jpeg': blankSilver,
  '/assets/escobar-green.jpg.jpeg': escobarGreen,
  '/assets/escobar-gold.jpg.jpeg': escobarGold,
  '/assets/jack-green.jpg.jpeg': jackGreen,
  '/assets/jack-silver.jpg.jpeg': jackSilver,
  '/assets/monaco-gold.jpg.jpeg': monacoGold,
  '/assets/monaco-silver.jpg.jpeg': monacoSilver,
  '/assets/patriot-black.jpg.jpeg': patriotBlack,
  '/assets/patriot-green.jpg.jpeg': patriotGreen,
  '/assets/trump-gold.jpg.jpeg': trumpGold,
  '/assets/trump-green.jpg.jpeg': trumpGreen,
  '/assets/minamilistblack.jpg': minamilistBlack,
  '/assets/minamilistgreen.jpg': minamilistGreen,
  
  // Just filename format (for flexible matching)
  'casino-silver.jpg_1.jpeg': casinoSilver,
  'casino-gold.jpg_5.jpeg': casinoGold,
  'casino-black.webp': casinoBlack,
  'churchill-silver.jpg_1.jpeg': churchillSilver,
  'churchill-green.jpg_2.jpeg': churchillGreen,
  'blank-green.jpg.jpeg': blankGreen,
  'blank-silver.jpg.jpeg': blankSilver,
  'escobar-green.jpg.jpeg': escobarGreen,
  'escobar-gold.jpg.jpeg': escobarGold,
  'jack-green.jpg.jpeg': jackGreen,
  'jack-silver.jpg.jpeg': jackSilver,
  'monaco-gold.jpg.jpeg': monacoGold,
  'monaco-silver.jpg.jpeg': monacoSilver,
  'patriot-black.jpg.jpeg': patriotBlack,
  'patriot-green.jpg.jpeg': patriotGreen,
  'trump-gold.jpg.jpeg': trumpGold,
  'trump-green.jpg.jpeg': trumpGreen,
  'minamilistblack.jpg': minamilistBlack,
  'minamilistgreen.jpg': minamilistGreen,
  
  // Alternative naming patterns (without numbered suffixes)
  'casino-silver.jpg.jpeg': casinoSilver,
  'casino-gold.jpg.jpeg': casinoGold,
  'churchill-silver.jpg.jpeg': churchillSilver,
  'churchill-green.jpg.jpeg': churchillGreen,
  '/assets/casino-silver.jpg.jpeg': casinoSilver,
  '/assets/casino-gold.jpg.jpeg': casinoGold,
  '/assets/churchill-silver.jpg.jpeg': churchillSilver,
  '/assets/churchill-green.jpg.jpeg': churchillGreen,
  'src/assets/casino-silver.jpg.jpeg': casinoSilver,
  'src/assets/casino-gold.jpg.jpeg': casinoGold,
  'src/assets/churchill-silver.jpg.jpeg': churchillSilver,
  'src/assets/churchill-green.jpg.jpeg': churchillGreen,
};

/**
 * Resolves image URLs to their imported module paths
 * Handles various path formats that might be stored in the database
 */
export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    console.log('No image URL provided, returning placeholder');
    return '/placeholder.svg';
  }
  
  // Try direct lookup first
  if (imageMap[imageUrl]) {
    console.log(`Direct match found for: ${imageUrl}`);
    return imageMap[imageUrl];
  }
  
  // Try extracting just the filename
  const filename = imageUrl.split('/').pop();
  if (filename && imageMap[filename]) {
    console.log(`Filename match found for: ${filename}`);
    return imageMap[filename];
  }
  
  // Try removing leading slash
  const withoutLeadingSlash = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  if (imageMap[withoutLeadingSlash]) {
    console.log(`Match found after removing leading slash: ${withoutLeadingSlash}`);
    return imageMap[withoutLeadingSlash];
  }
  
  // Try adding common prefixes
  const withAssetsPrefix = `/assets/${filename}`;
  if (imageMap[withAssetsPrefix]) {
    console.log(`Match found with /assets/ prefix: ${withAssetsPrefix}`);
    return imageMap[withAssetsPrefix];
  }
  
  const withSrcAssetsPrefix = `src/assets/${filename}`;
  if (imageMap[withSrcAssetsPrefix]) {
    console.log(`Match found with src/assets/ prefix: ${withSrcAssetsPrefix}`);
    return imageMap[withSrcAssetsPrefix];
  }
  
  // Log unmapped URLs to help identify missing mappings
  console.warn(`No mapping found for image URL: ${imageUrl}`);
  console.warn('Available mappings:', Object.keys(imageMap));
  
  return '/placeholder.svg';
};
