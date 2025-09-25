import { useState } from 'react';
import { Product, ProductVariant } from '@/types/store';
import { getImageUrl } from '@/utils/imageUtils';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProductImageGalleryProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

const ProductImageGallery = ({ product, selectedVariant }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Build array of images - main product image + variant images
  const images = [
    product.image_url,
    ...(product.variants?.map(v => v.image_url).filter(Boolean) || [])
  ].filter(Boolean);

  // Get current image URL
  const currentImage = getImageUrl(
    currentImageIndex < images.length ? images[currentImageIndex] : 
    selectedVariant?.image_url || product.image_url
  );

  const goToPrevious = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative group">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.svg';
            }}
          />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Zoom button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <div className="aspect-square">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                currentImageIndex === index 
                  ? 'border-primary' 
                  : 'border-transparent hover:border-border'
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`${product.name} view ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.svg';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image indicator */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentImageIndex === index ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;