import { Button } from '@/components/ui/button';
import { Product } from '@/types/store';
import { storeService } from '@/services/store';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {storeService.formatPrice(product.price, product.currency)}
          </span>
          
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!product.is_available || product.stock_quantity <= 0}
            className="min-w-[100px]"
          >
            {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
        
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <p className="text-xs text-amber-600">
            Only {product.stock_quantity} left in stock
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;