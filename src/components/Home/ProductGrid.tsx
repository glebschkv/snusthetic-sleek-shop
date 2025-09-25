import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCartContext } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/utils/imageUtils';
import { useState } from 'react';

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const { addItem, openCart } = useCartContext();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  const ProductCard = ({ product }: { product: any }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Get all available images (main product + variants)
    const allImages = [
      product.image_url,
      ...(product.variants?.map((v: any) => v.image_url).filter(Boolean) || [])
    ].filter(Boolean);

    const handleMouseEnter = () => {
      if (allImages.length > 1) {
        // Immediately switch to next image
        setCurrentImageIndex(1);
        
        const interval = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        }, 500);
        
        // Store interval for cleanup
        (document.getElementById(`product-${product.id}`) as any)._interval = interval;
      }
    };

    const handleMouseLeave = () => {
      const interval = (document.getElementById(`product-${product.id}`) as any)?._interval;
      if (interval) {
        clearInterval(interval);
      }
      setCurrentImageIndex(0);
    };

    return (
      <div 
        id={`product-${product.id}`}
        key={product.id} 
        className="group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-square overflow-hidden bg-surface relative">
          <img
            src={getImageUrl(allImages[currentImageIndex])}
            alt={`${product.name} - Premium Snus Holder`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            onError={(e) => {
              console.error('Image failed to load:', allImages[currentImageIndex]);
              e.currentTarget.src = '/images/placeholder.svg';
            }}
          />
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {allImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="pt-6 text-center">
          <h3 className="text-lg font-medium text-foreground mb-2">{product.name}</h3>
          <div className="mb-4">
            <span className="text-xl font-bold text-foreground">{formatPrice(product.price)}</span>
          </div>
          <Button 
            className="w-full" 
            onClick={() => handleAddToCart(product)}
            disabled={!product.is_available || product.stock_quantity <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    );
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
    openCart();
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6">COLLECTION</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="group">
                <Skeleton className="aspect-square w-full" />
                <div className="pt-6 text-center space-y-4">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-8 w-1/2 mx-auto" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">COLLECTION</h2>
          <p className="text-muted-foreground">Unable to load products. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Take first 3 products for homepage display
  const featuredProducts = products.slice(0, 3);
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">COLLECTION</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* View All Products Link */}
        <div className="text-center mt-12">
          <Link to="/shop">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;