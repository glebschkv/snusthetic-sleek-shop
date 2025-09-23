import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Product, ProductVariant } from '@/types/store';
import { useCurrency } from '@/contexts/CurrencyContext';
import ColorSelector from './ColorSelector';
import { getImageUrl } from '@/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onProductUpdate?: (updatedProduct: Product) => void;
}

const ProductCard = ({ product, onAddToCart, onProductUpdate }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);

  const currentImage = getImageUrl(selectedVariant?.image_url || product.image_url);
  const currentPrice = product.price + (selectedVariant?.price_adjustment || 0);
  const hasVariants = variants && variants.length > 0;
  const currentStock = hasVariants ? selectedVariant?.stock_quantity || 0 : product.stock_quantity;
  const isAvailable = hasVariants ? selectedVariant?.is_available : product.is_available;

  const handleVariantUpdate = (updatedVariant: ProductVariant) => {
    const updatedVariants = variants.map(v => 
      v.id === updatedVariant.id ? updatedVariant : v
    );
    setVariants(updatedVariants);
    
    // Update the product with new variants if callback provided
    if (onProductUpdate) {
      onProductUpdate({
        ...product,
        variants: updatedVariants
      });
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariant);
  };

  return (
    <div className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.error('Image failed to load:', currentImage);
            e.currentTarget.src = '/images/placeholder.svg';
          }}
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {hasVariants && (
          <ColorSelector
            variants={variants}
            selectedVariant={selectedVariant}
            onVariantChange={setSelectedVariant}
            onVariantUpdate={handleVariantUpdate}
          />
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(currentPrice)}
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={!isAvailable || currentStock <= 0}
            variant="outline"
            size="sm"
            className="min-w-[100px] text-xs"
          >
            {currentStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
        
        {currentStock > 0 && currentStock <= 5 && (
          <p className="text-xs text-amber-600">
            Only {currentStock} left in stock
            {hasVariants && selectedVariant && ` (${selectedVariant.color_name})`}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;