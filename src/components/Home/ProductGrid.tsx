import { Button } from '@/components/ui/button';
import { ArrowRight, Star, ShoppingCart, Heart, Eye, Crown, Award } from 'lucide-react';
import monarchHolder from '@/assets/snus-holder-monarch.jpg';
import nationalistHolder from '@/assets/snus-holder-nationalist.jpg';
import heroProduct from '@/assets/hero-product.jpg';

const products = [
  {
    id: 1,
    name: 'The Monarch',
    price: '$149',
    originalPrice: '$199',
    image: monarchHolder,
    description: 'Regal craftsmanship with premium gold finish',
    badge: 'Best Seller',
    badgeColor: 'bg-primary',
    rating: 4.9,
    reviews: 847,
    stock: 'In Stock'
  },
  {
    id: 2,
    name: 'The Nationalist',
    price: '$179',
    originalPrice: '$229',
    image: nationalistHolder,
    description: 'Tactical olive design for the distinguished',
    badge: 'Limited Edition',
    badgeColor: 'bg-accent',
    rating: 4.8,
    reviews: 623,
    stock: 'Only 3 left'
  },
  {
    id: 3,
    name: 'The Degen',
    price: '$199',
    originalPrice: '$249',
    image: heroProduct,
    description: 'Elite luxury for the true connoisseur',
    badge: 'Premium',
    badgeColor: 'bg-gradient-accent',
    rating: 5.0,
    reviews: 1203,
    stock: 'Low Stock'
  }
];

const ProductGrid = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Crown className="h-4 w-4" />
            <span>Luxury Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">Handcrafted Snus Holders</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Each piece is meticulously crafted by Swedish artisans using premium materials. 
            Own a piece of luxury that's built to last generations.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {products.map((product) => (
            <div key={product.id} className="product-card group relative">
              {/* Badge */}
              <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 z-10 ${product.badgeColor} text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                {product.badge}
              </div>
              
              {/* Wishlist Button */}
              <button className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-background min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Heart className="h-4 w-4" />
              </button>
              
              <div className="aspect-square overflow-hidden bg-background relative">
                <img
                  src={product.image}
                  alt={`${product.name} - Premium Snus Holder`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 sm:gap-3">
                  <Button size="sm" variant="secondary" className="gap-2 min-h-[44px] text-xs sm:text-sm">
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Quick View</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                  <Button size="sm" className="gap-2 min-h-[44px] text-xs sm:text-sm">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h3 className="text-lg sm:text-xl font-medium">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-primary">{product.price}</span>
                      <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                    </div>
                    <div className={`text-sm font-medium ${product.stock.includes('left') || product.stock.includes('Low') ? 'text-red-500' : 'text-accent'}`}>
                      {product.stock}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <Button className="flex-1 gap-2 min-h-[44px] text-sm sm:text-base">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Add to Cart</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                  <Button variant="outline" size="icon" className="min-w-[44px] min-h-[44px]">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" className="min-h-[52px] text-base font-semibold px-6 sm:px-8">
            Explore Full Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;