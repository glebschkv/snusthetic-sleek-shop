// Image utility functions for handling asset URLs in production

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

// Import additional variants
import casinoBlack from '../assets/casino-black.webp';
import minamilistBlack from '../assets/minamilistblack.jpg';
import minamilistGreen from '../assets/minamilistgreen.jpg';

// Force all imports to be used (prevents tree-shaking in production)
const forceImportUsage = {
  casinoSilver,
  casinoGold,
  casinoBlack,
  churchillSilver,
  churchillGreen,
  blankGreen,
  blankSilver,
  escobarGreen,
  escobarGold,
  jackGreen,
  jackSilver,
  monacoGold,
  monacoSilver,
  patriotBlack,
  patriotGreen,
  trumpGold,
  trumpGreen,
  minamilistBlack,
  minamilistGreen,
};

// Ensure the object is used
console.log('Image imports loaded:', Object.keys(forceImportUsage).length);

// Image mapping for product images - maps database URLs to imported assets
const imageMap: Record<string, string> = {
  // Casino variants
  'src/assets/casino-silver.jpg_1.jpeg': casinoSilver,
  'src/assets/casino-silver.jpg.jpeg': casinoSilver,
  'src/assets/casino-gold.jpg_5.jpeg': casinoGold,
  'src/assets/casino-gold.jpg.jpeg': casinoGold,
  'src/assets/casino-black.webp': casinoBlack,
  
  // Churchill variants
  'src/assets/churchill-silver.jpg_1.jpeg': churchillSilver,
  'src/assets/churchill-silver.jpg.jpeg': churchillSilver,
  'src/assets/churchill-green.jpg_2.jpeg': churchillGreen,
  'src/assets/churchill-green.jpg.jpeg': churchillGreen,
  
  // Blank variants
  'src/assets/blank-green.jpg.jpeg': blankGreen,
  'src/assets/blank-silver.jpg.jpeg': blankSilver,
  
  // Escobar variants
  'src/assets/escobar-green.jpg.jpeg': escobarGreen,
  'src/assets/escobar-gold.jpg.jpeg': escobarGold,
  
  // Jack variants
  'src/assets/jack-green.jpg.jpeg': jackGreen,
  'src/assets/jack-silver.jpg.jpeg': jackSilver,
  
  // Monaco variants
  'src/assets/monaco-gold.jpg.jpeg': monacoGold,
  'src/assets/monaco-silver.jpg.jpeg': monacoSilver,
  
  // Patriot variants
  'src/assets/patriot-black.jpg.jpeg': patriotBlack,
  'src/assets/patriot-green.jpg.jpeg': patriotGreen,
  
  // Trump variants
  'src/assets/trump-gold.jpg.jpeg': trumpGold,
  'src/assets/trump-green.jpg.jpeg': trumpGreen,
  
  // Minimalist variants
  'src/assets/minamilistblack.jpg': minamilistBlack,
  'src/assets/minamilistgreen.jpg': minamilistGreen,

  // Public assets mapping (for database entries that reference public/assets)
  '/assets/casino-silver.jpg_1.jpeg': casinoSilver,
  '/assets/casino-gold.jpg_5.jpeg': casinoGold,
  '/assets/churchill-green.jpg_2.jpeg': churchillGreen,
  '/assets/churchill-silver.jpg_1.jpeg': churchillSilver,
  '/assets/blank-green.jpg.jpeg': blankGreen,
  '/assets/blank-silver.jpg.jpeg': blankSilver,
  '/assets/escobar-green.jpg.jpeg': escobarGreen,
  '/assets/jack-green.jpg.jpeg': jackGreen,
  '/assets/jack-silver.jpg.jpeg': jackSilver,
  '/assets/monaco-gold.jpg.jpeg': monacoGold,
  '/assets/monaco-silver.jpg.jpeg': monacoSilver,
  '/assets/patriot-black.jpg.jpeg': patriotBlack,
  '/assets/patriot-green.jpg.jpeg': patriotGreen,
  '/assets/trump-gold.jpg.jpeg': trumpGold,
  '/assets/trump-green.jpg.jpeg': trumpGreen,
};

export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return '/placeholder.svg';
  }
  
  // If it's already a proper URL (starts with http, /, or data:), return as is
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Priority 1: Check imported images first (like hero image - guaranteed to work in production)
  if (imageMap[imageUrl]) {
    return imageMap[imageUrl];
  }
  
  // Priority 2: Handle public/assets/ format (convert to /assets/ and check imported map)
  if (imageUrl.startsWith('public/assets/')) {
    const assetsPath = imageUrl.replace('public/assets/', '/assets/');
    if (imageMap[assetsPath]) {
      return imageMap[assetsPath];
    }
    return assetsPath;
  }
  
  // Priority 3: Convert src/assets path and check imported map
  if (imageUrl.startsWith('src/assets/')) {
    const publicPath = `/assets/${imageUrl.replace('src/assets/', '')}`;
    if (imageMap[publicPath]) {
      return imageMap[publicPath];
    }
    return publicPath;
  }
  
  // Final fallback
  return '/placeholder.svg';
};