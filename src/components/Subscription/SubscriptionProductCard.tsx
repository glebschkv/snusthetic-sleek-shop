import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star, Package } from 'lucide-react';
import { Product } from '@/types/store';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  quantity_per_month: number;
  price_per_month: number;
  stripe_price_id?: string;
}

interface SubscriptionProductCardProps {
  product: Product;
  onSubscribeClick: () => void;
}

const SubscriptionProductCard: React.FC<SubscriptionProductCardProps> = ({ 
  product, 
  onSubscribeClick 
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const { formatPrice, convertPrice } = useCurrency();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptionPlans();
  }, [product.id]);

  const fetchSubscriptionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('product_id', product.id)
        .eq('is_active', true)
        .order('quantity_per_month');

      if (error) throw error;
      
      // If no plans exist, create default ones
      if (!data || data.length === 0) {
        await createDefaultPlans();
      } else {
        setPlans(data);
        setSelectedPlan(data[0]?.id || '');
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPlans = async () => {
    const defaultQuantities = [5, 10, 15, 20];
    const basePrice = product.price;
    
    const planPromises = defaultQuantities.map(quantity => {
      // Apply bulk discount: 5% off for 10+, 10% off for 15+, 15% off for 20+
      let discountPercent = 0;
      if (quantity >= 20) discountPercent = 15;
      else if (quantity >= 15) discountPercent = 10;
      else if (quantity >= 10) discountPercent = 5;
      
      const discountedPrice = basePrice * (1 - discountPercent / 100);
      const monthlyPrice = discountedPrice * quantity;

      return supabase
        .from('subscription_plans')
        .insert({
          product_id: product.id,
          quantity_per_month: quantity,
          price_per_month: monthlyPrice
        });
    });

    try {
      await Promise.all(planPromises);
      await fetchSubscriptionPlans();
    } catch (error) {
      console.error('Error creating default plans:', error);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      onSubscribeClick();
      return;
    }

    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose a quantity option to continue",
        variant: "destructive"
      });
      return;
    }

    setSubscribing(true);
    
    try {
      const plan = plans.find(p => p.id === selectedPlan);
      if (!plan) throw new Error('Plan not found');

      // Call edge function to create Stripe subscription
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          subscription_plan_id: selectedPlan,
          return_url: window.location.origin + '/profile'
        }
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }

    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubscribing(false);
    }
  };

  const getDiscountPercent = (quantity: number) => {
    if (quantity >= 20) return 15;
    if (quantity >= 15) return 10;
    if (quantity >= 10) return 5;
    return 0;
  };

  const getOriginalPrice = (plan: SubscriptionPlan) => {
    return product.price * plan.quantity_per_month;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {formatPrice(product.price)} per can
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="p-6 border-l">
          <h4 className="font-medium mb-4">Monthly Quantity</h4>
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            <div className="space-y-3">
              {plans.map((plan) => {
                const originalPrice = getOriginalPrice(plan);
                const discountPercent = getDiscountPercent(plan.quantity_per_month);
                const savings = originalPrice - plan.price_per_month;
                
                return (
                  <div key={plan.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={plan.id} id={plan.id} />
                    <Label 
                      htmlFor={plan.id} 
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{plan.quantity_per_month} cans</span>
                          {discountPercent > 0 && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              -{discountPercent}%
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatPrice(plan.price_per_month)}</div>
                          {savings > 0 && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatPrice(originalPrice)}
                            </div>
                          )}
                        </div>
                      </div>
                      {savings > 0 && (
                        <div className="text-xs text-green-600 mt-1">
                          Save {formatPrice(savings)}/month
                        </div>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </div>

        {/* Subscribe Action */}
        <div className="p-6 border-l bg-muted/20">
          <div className="space-y-4">
            <div className="text-center">
              <Badge className="mb-2">10% Subscriber Discount Included</Badge>
              <p className="text-sm text-muted-foreground">
                Free shipping • Cancel anytime
              </p>
            </div>
            
            <Button 
              onClick={handleSubscribe}
              disabled={!selectedPlan || subscribing}
              size="lg"
              className="w-full"
            >
              {subscribing ? 'Processing...' : 'Start Subscription'}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Billing starts immediately. Next delivery in 30 days.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SubscriptionProductCard;