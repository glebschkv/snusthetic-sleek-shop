import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product, ProductVariant } from '@/types/store';
import { useCurrency } from '@/contexts/CurrencyContext';
import ColorSelector from './ColorSelector';
import { getImageUrl } from '@/utils/imageUtils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, variant?: ProductVariant) => void;
  onProductUpdate?: (updatedProduct: Product) => void;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({ product, onAddToCart, onProductUpdate, viewMode = 'grid' }: ProductCardProps) => {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking Add to Cart
    onAddToCart(product, selectedVariant);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex gap-4 p-4">
          <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
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
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground text-lg">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-muted-foreground mt-1">
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
              <span className="text-xl font-bold text-foreground">
                {formatPrice(currentPrice)}
              </span>
              
              <Button
                onClick={handleAddToCart}
                disabled={!isAvailable || currentStock <= 0}
                variant="outline"
                size="default"
                className="min-w-[120px]"
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
      </div>
    );
  }

  return (
    <div 
      className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg min-h-[420px] flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-square overflow-hidden flex-shrink-0">
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
      
      <div className="p-4 flex flex-col flex-1">
        {/* Content area that can expand */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-tight">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
            )}
          </div>

          {/* Color selector - visible when variants exist */}
          {hasVariants && (
            <div className="py-1">
              <ColorSelector
                variants={variants}
                selectedVariant={selectedVariant}
                onVariantChange={setSelectedVariant}
                onVariantUpdate={handleVariantUpdate}
              />
            </div>
          )}
        </div>
        
        {/* Stock warning - positioned above button section */}
        {currentStock > 0 && currentStock <= 5 && (
          <p className="text-xs text-amber-600 mb-2">
            Only {currentStock} left in stock
            {hasVariants && selectedVariant && ` (${selectedVariant.color_name})`}
          </p>
        )}
        
        {/* Fixed bottom section for price and button - always at bottom */}
        <div className="flex items-center justify-between mt-auto pt-2">
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
      </div>
    </div>
  );
};

export default ProductCard;