import { Button } from '@/components/ui/button';
const heroImage = '/lovable-uploads/14da64e2-328f-483e-8e7c-a7f81612e8dc.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hero Image */}
        <div className="mb-8 sm:mb-12">
          <img 
            src={heroImage} 
            alt="Premium ribbed metal snus holders" 
            className="w-full max-w-4xl mx-auto"
          />
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
          
          <div className="pt-6">
            <Button size="lg" className="text-lg font-semibold px-12 py-6 min-h-[60px]">
              Shop Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;