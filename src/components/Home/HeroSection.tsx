import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
// Hero image now uses public path

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-start justify-center bg-background overflow-hidden pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Image with Overlay Button */}
        <div className="relative mb-4 sm:mb-6">
          <img 
            src="/images/hero.jpeg" 
            alt="Premium ribbed metal snus holders" 
            className="w-full max-w-4xl mx-auto"
          />
          {/* Tagline overlay on top of image */}
          <div className="absolute top-8 left-8 right-8">
            <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white font-extrabold italic tracking-wide max-w-lg">
              BECAUSE YOUR POUCHES DESERVE BETTER
            </p>
          </div>
          {/* Shop Now button overlay */}
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
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-impact font-black tracking-wider leading-none">
            <span className="block">IT'S METAL.</span>
            <span className="block">IT'S RIBBED.</span>
          </h1>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;