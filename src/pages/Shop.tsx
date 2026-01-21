import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Grid, List, ShoppingCart, Search } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useProducts } from '@/hooks/useProducts';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import ProductCard from '@/components/Store/ProductCard';
import ProductCardSkeleton from '@/components/Store/ProductCardSkeleton';
import CategoryFilter from '@/components/Store/CategoryFilter';
import SearchBar from '@/components/Store/SearchBar';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { products, categories, loading, error } = useProducts();
  const cart = useCartContext();
  const { toast } = useToast();

  // Filter to only show physical products (snus holders)
  const physicalProducts = products.filter(p => p.product_type === 'physical');

  // Apply category and search filters
  const filteredProducts = physicalProducts
    .filter(product => selectedCategory === 'all' || product.category?.slug === selectedCategory)
    .filter(product => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    });

  const handleAddToCart = (product: any, variant?: any) => {
    cart.addItem(product, 1, variant);
    const variantText = variant ? ` (${variant.color_name})` : '';
    toast({
      title: "Added to cart!",
      description: `${product.name}${variantText} has been added to your cart.`,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Grid classes for reuse
  const gridClasses = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'space-y-4';

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              PREMIUM SNUS HOLDERS
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Ribbed metal holders designed for style and durability
            </p>
          </div>
        </section>

        {/* Cart Button */}
        <div className="fixed top-20 right-4 z-50">
          <Button
            onClick={cart.toggleCart}
            className="rounded-full w-14 h-14 shadow-lg"
            size="sm"
            aria-label={`Open shopping cart${cart.getItemCount() > 0 ? `, ${cart.getItemCount()} items` : ''}`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {cart.getItemCount() > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 text-xs flex items-center justify-center"
                aria-hidden="true"
              >
                {cart.getItemCount()}
              </span>
            )}
          </Button>
        </div>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {error ? (
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
            ) : (
              <>
                {/* Filters and View Controls */}
                <div className="flex flex-col gap-4 mb-8">
                  {/* Search and Category Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                      {/* Search Bar */}
                      <SearchBar
                        onSearch={setSearchQuery}
                        placeholder="Search holders..."
                      />

                      {/* Category Filter */}
                      <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                      />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex gap-2" role="group" aria-label="View mode">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        aria-label="Grid view"
                        aria-pressed={viewMode === 'grid'}
                      >
                        <Grid className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        aria-label="List view"
                        aria-pressed={viewMode === 'list'}
                      >
                        <List className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>

                  {/* Active filters indicator */}
                  {(searchQuery || selectedCategory !== 'all') && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Showing {filteredProducts.length} of {physicalProducts.length} products
                        {searchQuery && ` for "${searchQuery}"`}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-auto py-1 px-2 text-xs"
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </div>

                {/* Loading State with Skeletons */}
                {loading ? (
                  <div className={gridClasses}>
                    {[...Array(8)].map((_, i) => (
                      <ProductCardSkeleton key={i} viewMode={viewMode} />
                    ))}
                  </div>
                ) : filteredProducts.length === 0 ? (
                  /* Empty State */
                  <div className="text-center py-16">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery
                        ? `No results for "${searchQuery}"`
                        : selectedCategory !== 'all'
                          ? 'No products in this category'
                          : 'Check back later for new products'}
                    </p>
                    {(searchQuery || selectedCategory !== 'all') && (
                      <div className="flex justify-center gap-4">
                        {searchQuery && (
                          <Button variant="outline" onClick={() => setSearchQuery('')}>
                            Clear Search
                          </Button>
                        )}
                        {selectedCategory !== 'all' && (
                          <Button variant="secondary" onClick={() => setSelectedCategory('all')}>
                            View All Products
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Products Grid/List */
                  <div className={gridClasses}>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
