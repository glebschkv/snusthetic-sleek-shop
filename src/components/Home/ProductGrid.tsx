import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';

const products = [
  {
    id: 1,
    name: 'Essential Collection',
    price: '$189',
    image: product1,
    description: 'Timeless design meets modern functionality'
  },
  {
    id: 2,
    name: 'Premium Series',
    price: '$299',
    image: product2,
    description: 'Crafted for the discerning individual'
  },
  {
    id: 3,
    name: 'Signature Line',
    price: '$449',
    image: product3,
    description: 'The pinnacle of minimalist design'
  }
];

const ProductGrid = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section mb-6">Featured Collection</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated selection of premium products, 
            each designed with meticulous attention to detail and quality.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="aspect-square overflow-hidden bg-background">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">{product.name}</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{product.price}</span>
                  <Button variant="ghost" size="sm" className="btn-ghost group">
                    View
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="btn-primary">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;