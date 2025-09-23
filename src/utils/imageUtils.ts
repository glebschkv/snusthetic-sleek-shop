/**
 * Simplified image URL handler for production
 * Images should be stored in /public/images/products/
 */

export const getImageUrl = (imageUrl: string | null | undefined): string => {
  // Return placeholder if no URL provided
  if (!imageUrl) {
    return '/images/placeholder.svg';
  }

  // If it's already a full URL (http/https), return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it starts with /, assume it's already a public path
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // If it contains 'assets' or 'src', extract just the filename
  if (imageUrl.includes('assets/') || imageUrl.includes('src/')) {
    const filename = imageUrl.split('/').pop();
    return `/images/products/${filename}`;
  }

  // Otherwise, assume it's just a filename and add the path
  return `/images/products/${imageUrl}`;
};

/**
 * Helper to get the correct image path for admin uploads
 */
export const formatImagePath = (filename: string): string => {
  // Remove any existing path and just keep filename
  const cleanFilename = filename.split('/').pop() || filename;
  return `/images/products/${cleanFilename}`;
};
