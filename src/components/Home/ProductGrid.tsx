import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import monarchHolder from '@/assets/snus-holder-monarch.jpg';
import nationalistHolder from '@/assets/snus-holder-nationalist.jpg';
import heroProduct from '@/assets/hero-product.jpg';

const products = [
  {
    id: 1,
    name: 'The Monarch',
    price: 149,
    image: monarchHolder,
  },
  {
    id: 2,
    name: 'The Nationalist',
    price: 179,
    image: nationalistHolder,
  },
  {
    id: 3,
    name: 'The Degen',
    price: 199,
    image: heroProduct,
  }
];

const ProductGrid = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">COLLECTION</h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-square overflow-hidden bg-surface">
                <img
                  src={product.image}
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
                <Button className="w-full">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;