/**
 * Image URL handler for Supabase Storage and fallbacks
 * Images are now stored in Supabase Storage bucket 'product-images'
 */

const SUPABASE_URL = 'https://qqrgwesxjqmdwxyxgipx.supabase.co';
const STORAGE_BUCKET = 'product-images';

/**
 * Generate Supabase Storage URL for a given filename
 */
export const getSupabaseStorageUrl = (filename: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;
};

export const getImageUrl = (imageUrl: string | null | undefined): string => {
  // Return placeholder if no URL provided
  if (!imageUrl) {
    return '/images/placeholder.svg';
  }

  // If it's already a full URL (http/https), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a Supabase Storage URL pattern, return as-is
  if (imageUrl.includes('supabase.co/storage/v1/object/public/')) {
    return imageUrl;
  }

  // If it starts with /, assume it's already a public path
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // If it contains 'assets' or 'src', extract just the filename and use Storage
  if (imageUrl.includes('assets/') || imageUrl.includes('src/')) {
    const filename = imageUrl.split('/').pop();
    return filename ? getSupabaseStorageUrl(filename) : '/images/placeholder.svg';
  }

  // If it's just a filename, try Supabase Storage first
  return getSupabaseStorageUrl(imageUrl);
};

/**
 * Helper to get the correct image path for admin uploads
 */
export const formatImagePath = (filename: string): string => {
  // Remove any existing path and just keep filename
  const cleanFilename = filename.split('/').pop() || filename;
  return getSupabaseStorageUrl(cleanFilename);
};
