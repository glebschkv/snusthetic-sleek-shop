import { Star, Shield, Users, Award, Truck, RotateCcw } from 'lucide-react';

const trustStats = [
  { icon: Users, value: '50,000+', label: 'Happy Customers' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
  { icon: Award, value: '15+', label: 'Design Awards' },
  { icon: Shield, value: '100%', label: 'Satisfaction Guarantee' }
];

const testimonials = [
  {
    name: 'Erik Andersson',
    role: 'CEO, Stockholm Tech',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
    rating: 5,
    text: 'Absolutely stunning craftsmanship. The attention to detail is incredible - this holder is a work of art.'
  },
  {
    name: 'Sofia Lindqvist',
    role: 'Design Director',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
    rating: 5,
    text: 'The build quality exceeded my expectations. It\'s clear that each piece is crafted with passion and precision.'
  },
  {
    name: 'Magnus Olsson',
    role: 'Architect',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
    rating: 5,
    text: 'I\'ve owned luxury accessories from many brands, but this is in a league of its own. Pure Swedish excellence.'
  }
];

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
        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {trustStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mb-4">
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-section mb-6">What Our Customers Say</h2>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Snusthetic for their luxury storage needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-card p-6 rounded-lg shadow-moderate">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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