import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, Loader2 } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useShopifyProducts } from '@/hooks/useShopifyProducts';
import { shopifyService } from '@/services/shopify';
import { ShopifyProduct } from '@/types/shopify';
import { useToast } from '@/hooks/use-toast';
import ShopifySetup from '@/components/ShopifySetup';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { products, categories, loading, error } = useShopifyProducts();
  const { toast } = useToast();

  // Check if Shopify is configured
  const isShopifyConfigured = import.meta.env.VITE_SHOPIFY_DOMAIN && 
    import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN &&
    import.meta.env.VITE_SHOPIFY_DOMAIN !== 'your-shop.myshopify.com' &&
    import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN !== 'your-storefront-access-token';

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.productType === selectedCategory);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const firstVariant = product.variants.edges[0]?.node;
    
    if (!firstVariant) {
      toast({
        title: "Error",
        description: "This product has no available variants",
        variant: "destructive",
      });
      return;
    }

    if (!firstVariant.availableForSale) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    try {
      const checkoutUrl = await shopifyService.createCart(firstVariant.id);
      
      if (checkoutUrl) {
        // Open Shopify checkout in a new tab
        window.open(checkoutUrl, '_blank');
        toast({
          title: "Added to Cart",
          description: "Redirecting to secure checkout...",
        });
      } else {
        throw new Error('Failed to create checkout');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-hero mb-6">Shop Collection</h1>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Discover our full range of premium products, each designed with meticulous 
            attention to detail and uncompromising quality.
          </p>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-8 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "btn-primary" : "btn-secondary"}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} products
              </span>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-muted' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-muted' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {!isShopifyConfigured ? (
            <ShopifySetup />
          ) : loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive mb-4">{error}</p>
              <p className="text-sm text-muted-foreground">
                Please check your Shopify configuration in the environment variables.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          ) : (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => {
                const firstImage = product.images.edges[0]?.node;
                const price = parseFloat(product.priceRange.minVariantPrice.amount);
                const isAvailable = product.variants.edges.some(variant => variant.node.availableForSale);
                
                return (
                  <div key={product.id} className={`product-card group ${
                    viewMode === 'list' ? 'flex gap-6' : ''
                  }`}>
                    <div className={`${
                      viewMode === 'list' 
                        ? 'w-48 h-48 flex-shrink-0' 
                        : 'aspect-square'
                    } overflow-hidden bg-surface`}>
                      {firstImage ? (
                        <img
                          src={firstImage.url}
                          alt={firstImage.altText || product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-6 space-y-4 ${
                      viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''
                    }`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-caption text-muted-foreground">
                            {product.productType}
                          </span>
                          {!isAvailable && (
                            <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-medium">{product.title}</h3>
                        <p className="text-muted-foreground line-clamp-2">
                          {product.description.replace(/<[^>]*>/g, '')}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">
                          ${price.toFixed(2)} {product.priceRange.minVariantPrice.currencyCode}
                        </span>
                        <Button 
                          className="btn-primary"
                          onClick={() => handleAddToCart(product)}
                          disabled={!isAvailable}
                        >
                          {isAvailable ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;