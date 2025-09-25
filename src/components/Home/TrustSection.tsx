import { Package, Zap, ShoppingCart, Repeat } from 'lucide-react';

const restockFeatures = [
  {
    icon: Package,
    title: 'TELL US YOUR USAGE',
    description: 'Monthly pouch count. That\'s it.'
  },
  {
    icon: Zap,
    title: 'WE PREDICT YOUR NEEDS',
    description: 'Smart tracking. Zero guesswork.'
  },
  {
    icon: ShoppingCart,
    title: 'BULK BUYING POWER',
    description: 'Wholesale prices. Direct to you.'
  },
  {
    icon: Repeat,
    title: 'AUTOMATIC RESTOCKS',
    description: 'Never run out. Skip anytime.'
  }
];

const keyBenefits = [
  'Lower prices through bulk purchasing',
  'Never run out of pouches again', 
  'Skip or modify deliveries anytime',
  'Add limited edition holders to orders',
  'No last-minute gas station runs'
];

const TrustSection = () => {
  return (
    <section className="py-8 sm:py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div>
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-impact font-black tracking-wider leading-none mb-6">
              NEVER RUN OUT
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Automatic restocks. Bulk pricing. Zero hassle.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {restockFeatures.map((feature, index) => (
                <div key={index} className="group">
                  <div className="bg-card border border-border rounded-lg p-6 h-full hover:border-primary/20 transition-all duration-300">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold tracking-wide">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8 tracking-wide">WHY SUBSCRIBE?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full"></div>
                  <p className="text-foreground font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;