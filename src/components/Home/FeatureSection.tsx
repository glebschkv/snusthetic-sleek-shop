import { Crown, Eye, Gem } from 'lucide-react';

const features = [
  {
    icon: Crown,
    title: 'Swedish Heritage',
    description: 'Honoring traditional craftsmanship with premium materials and meticulous attention to detail.'
  },
  {
    icon: Eye,
    title: 'Discrete Elegance',
    description: 'Sophisticated storage that maintains your privacy while showcasing exceptional taste.'
  },
  {
    icon: Gem,
    title: 'Luxury Finishes',
    description: 'Hand-selected materials and artisan finishes that age beautifully with time.'
  }
];

const FeatureSection = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-section mb-6">The Snusthetic Difference</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            We honor Swedish snus culture through luxury craftsmanship, creating storage solutions 
            that embody tradition, discretion, and unparalleled quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-6 group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-sage rounded-full shadow-moderate group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-8 w-8 text-sage-foreground" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-medium">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;