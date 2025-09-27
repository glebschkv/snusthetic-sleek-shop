import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Truck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useToast } from '@/hooks/use-toast';
import SubscriptionProductCard from '@/components/Subscription/SubscriptionProductCard';
import { Product } from '@/types/store';

const Subscriptions = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to start a subscription",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
  };

  const benefits = [
    "Never run out of your favorite snus",
    "Free shipping on all subscription orders",
    "Cancel or modify anytime",
    "10% discount on all subscription orders",
    "Priority customer support",
    "Flexible delivery schedule"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Never Miss Your
            <span className="text-primary block">Favorite Snus</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get your premium snus delivered automatically every month. Choose your products, 
            select your quantity, and enjoy hassle-free deliveries with exclusive subscriber benefits.
          </p>

          <div className="inline-block bg-muted/50 text-muted-foreground px-4 py-2 rounded-lg border">
            <span className="text-sm font-medium">Coming to your country soon!</span>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Subscribe?</h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">1</Badge>
                <div>
                  <h4 className="font-medium">Choose Your Products</h4>
                  <p className="text-sm text-muted-foreground">Select from our premium snus collection</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">2</Badge>
                <div>
                  <h4 className="font-medium">Set Your Quantity</h4>
                  <p className="text-sm text-muted-foreground">Choose 5, 10, 15, or 20 cans per month</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">3</Badge>
                <div>
                  <h4 className="font-medium">Automatic Delivery</h4>
                  <p className="text-sm text-muted-foreground">Get your order delivered monthly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cancellation Policy */}
        <section className="bg-muted/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Cancellation & Flexibility</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Easy Cancellation</h4>
              <p>Cancel your subscription anytime from your account settings. No questions asked, no fees.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Modify Anytime</h4>
              <p>Change your products, quantities, or delivery schedule whenever you need to.</p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Choose Your Subscription</h2>
            <p className="text-muted-foreground">
              Select your favorite snus and monthly quantity. All subscriptions include free shipping and 10% discount.
            </p>
          </div>

          <div className="grid gap-6">
            {products.map((product) => (
              <SubscriptionProductCard 
                key={product.id} 
                product={product}
                onSubscribeClick={handleSubscribeClick}
              />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Subscriptions;