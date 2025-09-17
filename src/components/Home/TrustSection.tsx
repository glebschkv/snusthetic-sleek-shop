import { Shield, Truck, RotateCcw } from 'lucide-react';

const guarantees = [
  {
    icon: Shield,
    title: 'Lifetime Warranty',
    description: 'We stand behind our craftsmanship with a comprehensive lifetime warranty on all products.'
  },
  {
    icon: Truck,
    title: 'Free Global Shipping',
    description: 'Complimentary worldwide shipping with tracking on all orders over $100.'
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Not completely satisfied? Return your purchase within 30 days for a full refund.'
  }
];

const TrustSection = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Guarantees */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-section mb-6">Your Purchase is Protected</h2>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
              Shop with confidence knowing that your investment is backed by our comprehensive guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {guarantees.map((guarantee, index) => (
              <div key={index} className="text-center p-6 bg-gradient-card rounded-lg shadow-moderate">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-full mb-6">
                  <guarantee.icon className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-3">{guarantee.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{guarantee.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;