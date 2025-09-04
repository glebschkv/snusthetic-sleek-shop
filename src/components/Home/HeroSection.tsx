import { Button } from '@/components/ui/button';
import { Star, Shield, Truck, Award } from 'lucide-react';
const heroProduct = '/lovable-uploads/14da64e2-328f-483e-8e7c-a7f81612e8dc.png';

const HeroSection = () => {
  return (
    <section className="relative pt-4 sm:pt-8 pb-16 sm:pb-24 min-h-screen flex items-center hero-gradient overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Content */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-xs sm:text-sm font-medium shadow-moderate">
              ✨ Limited Edition - Only 500 Made
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-none">
              <span className="block">The World's Most</span>
              <span className="block text-primary">Luxurious Snus Holders</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
              Handcrafted from premium materials. Each piece takes 30+ hours to create. 
              Used by Swedish royalty and featured in Wallpaper Magazine.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">4.9/5 (2,847 reviews)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <span>Lifetime Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent" />
                <span className="hidden sm:inline">Free Worldwide Shipping</span>
                <span className="sm:hidden">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-accent" />
                <span className="hidden sm:inline">Award Winning Design</span>
                <span className="sm:hidden">Award Winning</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button size="lg" className="group relative overflow-hidden min-h-[52px] text-base font-semibold">
              <span className="relative z-10">Shop Now - $100</span>
              <span className="ml-2 group-hover:translate-x-1 transition-transform relative z-10">→</span>
            </Button>
            <Button variant="outline" size="lg" className="min-h-[52px] text-base font-semibold">
              View Collection
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              "The pinnacle of Swedish craftsmanship" - 
              <span className="text-primary font-medium"> Monocle Magazine</span>
            </p>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative mt-8 lg:mt-0">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-lg blur-xl group-hover:opacity-30 transition-opacity"></div>
            <img 
              src={heroProduct} 
              alt="Premium Gold Casino Chip Snus Holder - Limited Edition" 
              className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto rounded-lg shadow-prominent group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold animate-pulse">
              Only 12 Left
            </div>
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 z-20 bg-background/90 backdrop-blur-sm text-foreground px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm">
              <div className="font-medium">The Casino Gold</div>
              <div className="text-muted-foreground">$100 Limited Edition</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;