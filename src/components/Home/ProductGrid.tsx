import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCartContext } from '@/contexts/CartContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const { addItem, openCart } = useCartContext();
  const { toast } = useToast();

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
            <div key={product.id} className="group">
              <div className="aspect-square overflow-hidden bg-surface">
                <img
                  src={product.image_url?.replace('/src/assets/', '/src/assets/') || '/placeholder.svg'}
                  alt={`${product.name} - Premium Snus Holder`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Product Details */}
              <div className="pt-6 text-center">
                <h3 className="text-lg font-medium text-foreground mb-2">{product.name}</h3>
                <div className="mb-4">
                  <span className="text-xl font-bold text-foreground">${product.price}</span>
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