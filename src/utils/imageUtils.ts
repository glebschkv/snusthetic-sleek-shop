// Simple image loading using ES6 imports (like hero image)

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

// Simple mapping from database URLs to imported images
const imageMap: Record<string, string> = {
  // All possible database URL formats mapped to imports
  'src/assets/casino-silver.jpg_1.jpeg': casinoSilver,
  'src/assets/casino-silver.jpg.jpeg': casinoSilver,
  'src/assets/casino-gold.jpg_5.jpeg': casinoGold,
  'src/assets/casino-gold.jpg.jpeg': casinoGold,
  'src/assets/casino-black.webp': casinoBlack,
  'src/assets/churchill-silver.jpg_1.jpeg': churchillSilver,
  'src/assets/churchill-silver.jpg.jpeg': churchillSilver,
  'src/assets/churchill-green.jpg_2.jpeg': churchillGreen,
  'src/assets/churchill-green.jpg.jpeg': churchillGreen,
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
  // /assets/ format
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

// Simple function - just lookup the imported image (like hero image)
export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) {
    return '/placeholder.svg';
  }
  
  // Direct lookup in imported images (guaranteed to work in production)
  return imageMap[imageUrl] || '/placeholder.svg';
};