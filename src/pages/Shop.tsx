import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, Loader2, ShoppingCart } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/Store/ProductCard';
import CartDrawer from '@/components/Store/CartDrawer';
import CategoryFilter from '@/components/Store/CategoryFilter';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { products, categories, loading, error } = useProducts();
  const cart = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category?.slug === selectedCategory);

  const handleAddToCart = (product: any) => {
    cart.addItem(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleCheckout = () => {
    cart.closeCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              SHOP COLLECTION
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Premium ribbed metal snus holders for the discerning user
            </p>
          </div>
        </section>

        {/* Cart Button */}
        <div className="fixed top-20 right-4 z-50">
          <Button
            onClick={cart.toggleCart}
            className="rounded-full w-14 h-14 shadow-lg"
            size="sm"
          >
            <ShoppingCart className="h-5 w-5" />
            {cart.getItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center">
                {cart.getItemCount()}
              </span>
            )}
          </Button>
        </div>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive text-lg">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4">No products found</h3>
                <p className="text-muted-foreground">Check back later for new products.</p>
              </div>
            ) : (
              <>
                {/* Filters and View Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                  {/* Category Filter */}
                  <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />

                  {/* View Mode Toggle */}
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Products Grid/List */}
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : 'space-y-6'
                }`}>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={cart.closeCart}
        items={cart.items}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onCheckout={handleCheckout}
        total={cart.getTotal()}
      />

      <Footer />
    </div>
  );
};

export default Shop;