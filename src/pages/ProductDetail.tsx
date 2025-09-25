import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Product, ProductVariant } from '@/types/store';
import { useProducts } from '@/hooks/useProducts';
import { useCartContext } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import ColorSelector from '@/components/Store/ColorSelector';
import QuantitySelector from '@/components/Store/QuantitySelector';
import ProductImageGallery from '@/components/Store/ProductImageGallery';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Share2, Heart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addItem, openCart } = useCartContext();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!loading && products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.variants && foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0]);
        }
      }
    }
  }, [products, loading, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const currentPrice = product.price + (selectedVariant?.price_adjustment || 0);
  const currentStock = hasVariants ? selectedVariant?.stock_quantity || 0 : product.stock_quantity;
  const isAvailable = hasVariants ? selectedVariant?.is_available : product.is_available;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    });
    openCart();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || '',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 pl-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Product content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductImageGallery 
              product={product} 
              selectedVariant={selectedVariant} 
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(currentPrice)}
                </span>
                {hasVariants && selectedVariant?.price_adjustment && selectedVariant.price_adjustment !== 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-4">
                {isAvailable && currentStock > 0 ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
                
                {currentStock > 0 && currentStock <= 5 && (
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    Only {currentStock} left
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color Selection */}
            {hasVariants && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Color</h3>
                <ColorSelector
                  variants={product.variants || []}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                  size="lg"
                />
                {selectedVariant && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Selected: {selectedVariant.color_name}
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={currentStock}
                disabled={!isAvailable || currentStock <= 0}
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!isAvailable || currentStock <= 0}
                className="w-full"
                size="lg"
              >
                {currentStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button
                onClick={handleBuyNow}
                disabled={!isAvailable || currentStock <= 0}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Buy Now
              </Button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SKU:</span>
                  <span>{product.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{product.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability:</span>
                  <span>{isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;