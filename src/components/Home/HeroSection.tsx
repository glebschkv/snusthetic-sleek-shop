import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/Minamilist(GREEN).jpeg';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Image with Overlay Button */}
        <div className="relative mb-8 sm:mb-12">
          <img 
            src={heroImage} 
            alt="Premium ribbed metal snus holders" 
            className="w-full max-w-4xl mx-auto"
          />
          <div className="absolute inset-0 flex items-end justify-end p-8">
            <Button 
              variant="outline"
              className="text-base font-semibold px-8 py-3 bg-transparent text-white border-2 border-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-wider"
              onClick={() => navigate('/shop')}
            >
              Shop Now
            </Button>
          </div>
        </div>
        
        {/* Hero Text */}
        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-none">
            <span className="block">IT'S METAL.</span>
            <span className="block">IT'S RIBBED.</span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto">
            BECAUSE YOUR POUCHES DESERVE BETTER
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;