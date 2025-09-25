import { UserPlus, BarChart3, ShoppingCart, Clock, ArrowRight } from 'lucide-react';

const subscriptionSteps = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Sign Up & State Consumption',
    description: 'Tell us your monthly pouch consumption to get started'
  },
  {
    number: 2,
    icon: BarChart3,
    title: 'Forecasting Model Predicts',
    description: 'Our model uses consumption history & seasonality to predict monthly needs'
  },
  {
    number: 3,
    icon: ShoppingCart,
    title: 'Bulk Purchase & Savings',
    description: 'We bulk-purchase from trusted wholesalers for lower costs and pass savings on'
  },
  {
    number: 4,
    icon: Clock,
    title: 'Auto-Deliveries',
    description: 'Schedule deliveries, pause/skip anytime — never run out'
  }
];

const benefits = [
  'Accurate supply: demand forecasting',
  'Lower prices: wholesale aggregation + negotiated shipping',
  'Flexible plans: adjust quantity, cadence, or skip',
  'Attach & upsell: add tins, inserts, and limited designs',
  'Delight: predictable refills mean no last-minute store runs'
];

const TrustSection = () => {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Subscription Service */}
        <div>
          <div className="text-center mb-16">
            <h2 className="text-section mb-6">Subscription Service</h2>
            <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
              Experience predictive, convenient & cost-efficient delivery tailored to your needs.
            </p>
          </div>

          {/* Process Flow */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4">
              {subscriptionSteps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-full mb-4 relative">
                      <step.icon className="h-8 w-8 text-accent-foreground" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">{step.number}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                  
                  {/* Arrow - only show on larger screens and not for last item */}
                  {index < subscriptionSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-6 text-muted-foreground">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-card rounded-lg p-8 shadow-moderate">
            <h3 className="text-xl font-medium text-center mb-8">Predictive, Convenient & Cost-Efficient</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit}</p>
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