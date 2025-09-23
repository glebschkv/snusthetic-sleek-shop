// Image utility functions for handling asset URLs in production

// Import all product images as ES6 modules
import casinoSilver from '../assets/casino-silver.jpg_1.jpeg';
import casinoGold from '../assets/casino-gold.jpg_5.jpeg';
import churchillSilver from '../assets/churchill-silver.jpg_1.jpeg';
import churchillGreen from '../assets/churchill-green.jpg_2.jpeg';
import blankGreen from '../assets/blank-green.jpg.jpeg';
import blankSilver from '../assets/blank-silver.jpg.jpeg';
import escobarGreen from '../assets/escobar-green.jpg.jpeg';
import jackGreen from '../assets/jack-green.jpg.jpeg';
import jackSilver from '../assets/jack-silver.jpg.jpeg';
import monacoGold from '../assets/monaco-gold.jpg.jpeg';
import monacoSilver from '../assets/monaco-silver.jpg.jpeg';
import patriotBlack from '../assets/patriot-black.jpg.jpeg';
import patriotGreen from '../assets/patriot-green.jpg.jpeg';
import trumpGold from '../assets/trump-gold.jpg.jpeg';
import trumpGreen from '../assets/trump-green.jpg.jpeg';

// Force all imports to be used (prevents tree-shaking in production)
const forceImportUsage = {
  casinoSilver,
  casinoGold,
  churchillSilver,
  churchillGreen,
  blankGreen,
  blankSilver,
  escobarGreen,
  jackGreen,
  jackSilver,
  monacoGold,
  monacoSilver,
  patriotBlack,
  patriotGreen,
  trumpGold,
  trumpGreen,
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
};

export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return '/placeholder.svg';
  }
  
  // If it's already a proper URL (starts with http, /, or data:), return as is
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Priority 1: Handle public/assets/ format (convert to /assets/)
  if (imageUrl.startsWith('public/assets/')) {
    return imageUrl.replace('public/assets/', '/assets/');
  }
  
  // Priority 2: Convert src/assets path to public assets path
  if (imageUrl.startsWith('src/assets/')) {
    const publicPath = `/assets/${imageUrl.replace('src/assets/', '')}`;
    return publicPath;
  }
  
  // Priority 3: Check imported images as fallback
  if (imageMap[imageUrl]) {
    return imageMap[imageUrl];
  }
  
  // Final fallback
  return '/placeholder.svg';
};