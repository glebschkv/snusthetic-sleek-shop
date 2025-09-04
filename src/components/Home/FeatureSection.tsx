import { Sparkles, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Meticulously crafted with the finest materials and attention to every detail.'
  },
  {
    icon: Zap,
    title: 'Thoughtful Design',
    description: 'Every element serves a purpose, creating harmony between form and function.'
  },
  {
    icon: Shield,
    title: 'Built to Last',
    description: 'Engineered for durability and designed to stand the test of time.'
  }
];

const FeatureSection = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-section mb-6">Why Choose Snusthetic</h2>
          <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
            We believe in creating products that enhance your daily life through 
            thoughtful design and uncompromising quality.
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