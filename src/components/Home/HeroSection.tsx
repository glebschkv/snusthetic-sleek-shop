import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroProduct from '@/assets/hero-product.jpg';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center hero-gradient">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-display">
                Minimalism
                <br />
                <span className="text-muted-foreground">Redefined</span>
              </h1>
              <p className="text-body-large text-muted-foreground max-w-lg">
                Experience the perfect balance of form and function. Clean lines, 
                premium materials, and thoughtful design for the modern lifestyle.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-surface">
              <img
                src={heroProduct}
                alt="Snusthetic Premium Product"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-accent text-accent-foreground border border-border-subtle rounded-full px-6 py-3 shadow-glow">
              <span className="text-caption font-semibold">New</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;