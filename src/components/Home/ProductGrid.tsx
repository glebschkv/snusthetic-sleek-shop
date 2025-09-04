import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import monarchHolder from '@/assets/snus-holder-monarch.jpg';
import nationalistHolder from '@/assets/snus-holder-nationalist.jpg';
import heroProduct from '@/assets/hero-product.jpg';

const products = [
  {
    id: 1,
    name: 'The Monarch',
    price: '$149',
    image: monarchHolder,
    description: 'Regal craftsmanship with premium gold finish'
  },
  {
    id: 2,
    name: 'The Nationalist',
    price: '$179',
    image: nationalistHolder,
    description: 'Tactical olive design for the distinguished'
  },
  {
    id: 3,
    name: 'The Degen',
    price: '$199',
    image: heroProduct,
    description: 'Elite luxury for the true connoisseur'
  }
];

const ProductGrid = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section mb-6">Premium Snus Holders</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            Handcrafted luxury storage solutions for the modern snus enthusiast. 
            Each piece combines Swedish heritage with contemporary sophistication.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div key={product.id} className="product-card group">
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
                  <span className="text-lg font-semibold text-accent">{product.price}</span>
                  <Button variant="accent" size="sm" className="group">
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
          <Button size="lg">
            Explore Full Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;