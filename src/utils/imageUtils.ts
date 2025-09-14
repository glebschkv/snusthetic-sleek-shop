// Image utility functions for handling asset URLs in production

// Import all product images as ES6 modules
import casinoSilver from '../assets/casino-silver.jpg_1.jpeg';
import casinoGold from '../assets/casino-gold.jpg_5.jpeg';
import churchillSilver from '../assets/churchill-silver.jpg_1.jpeg';
import churchillGreen from '../assets/churchill-green.jpg_2.jpeg';

// Image mapping for product images
const imageMap: Record<string, string> = {
  'src/assets/casino-silver.jpg_1.jpeg': casinoSilver,
  'src/assets/casino-gold.jpg_5.jpeg': casinoGold,
  'src/assets/churchill-silver.jpg_1.jpeg': churchillSilver,
  'src/assets/churchill-green.jpg_2.jpeg': churchillGreen,
  // Add more mappings as needed
};

export const getImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return '/placeholder.svg';
  
  // If it's already a proper URL (starts with http, /, or data:), return as is
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Check if we have an imported image for this path
  if (imageMap[imageUrl]) {
    return imageMap[imageUrl];
  }
  
  // Fallback: try to convert src/assets path to public path
  if (imageUrl.startsWith('src/assets/')) {
    return `/${imageUrl}`;
  }
  
  // Final fallback
  return '/placeholder.svg';
};