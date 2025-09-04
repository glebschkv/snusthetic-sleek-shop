import { Button } from '@/components/ui/button';
import { Mail, Gift } from 'lucide-react';

const NewsletterSection = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
          <Gift className="h-4 w-4" />
          <span>Exclusive Offer</span>
        </div>
        
        <h2 className="text-section mb-6">
          Get 15% Off Your First Order
        </h2>
        
        <p className="text-body-large text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join our exclusive community and be the first to know about new collections, 
          limited editions, and special offers. Plus, get an instant 15% discount on your first purchase.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full pl-12 pr-4 py-4 bg-background border border-border-subtle rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button size="lg" className="gap-2 whitespace-nowrap">
            Get 15% Off
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          No spam, unsubscribe at any time. By subscribing, you agree to our privacy policy.
        </p>

        <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Exclusive Previews</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Limited Edition Access</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Special Discounts</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;