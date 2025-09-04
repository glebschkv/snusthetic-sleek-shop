import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';

const products = [
  {
    id: 1,
    name: 'Essential Collection',
    price: 189,
    image: product1,
    category: 'Accessories',
    description: 'Timeless design meets modern functionality'
  },
  {
    id: 2,
    name: 'Premium Series',
    price: 299,
    image: product2,
    category: 'Lifestyle',
    description: 'Crafted for the discerning individual'
  },
  {
    id: 3,
    name: 'Signature Line',
    price: 449,
    image: product3,
    category: 'Premium',
    description: 'The pinnacle of minimalist design'
  },
  {
    id: 4,
    name: 'Minimal Pro',
    price: 329,
    image: product1,
    category: 'Tech',
    description: 'Professional grade minimalism'
  },
  {
    id: 5,
    name: 'Studio Edition',
    price: 399,
    image: product2,
    category: 'Lifestyle',
    description: 'Creative expression simplified'
  },
  {
    id: 6,
    name: 'Elite Collection',
    price: 599,
    image: product3,
    category: 'Premium',
    description: 'Uncompromising luxury and design'
  }
];

const categories = ['All', 'Accessories', 'Lifestyle', 'Premium', 'Tech'];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={`product-card group ${
                viewMode === 'list' ? 'flex gap-6' : ''
              }`}>
                <div className={`${
                  viewMode === 'list' 
                    ? 'w-48 h-48 flex-shrink-0' 
                    : 'aspect-square'
                } overflow-hidden bg-surface`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className={`p-6 space-y-4 ${
                  viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-caption text-muted-foreground">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-medium">{product.name}</h3>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">${product.price}</span>
                    <Button className="btn-primary">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;