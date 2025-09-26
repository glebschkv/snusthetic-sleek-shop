import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartContext } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/integrations/supabase/client';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCartContext();
  const sessionId = searchParams.get('session_id');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId || orderConfirmed) return;

      try {
        // Get session details from Stripe to extract payment intent
        const { data: sessionData, error: sessionError } = await supabase.functions.invoke('get-checkout-session', {
          body: { session_id: sessionId }
        });

        if (sessionError || !sessionData?.payment_intent) {
          console.error('Error getting session:', sessionError);
          toast.error('Could not confirm order. Please contact support.');
          return;
        }

        // Call confirm-payment function
        const { data: confirmData, error: confirmError } = await supabase.functions.invoke('confirm-payment', {
          body: {
            payment_intent_id: sessionData.payment_intent,
            customer_info: sessionData.customer_details
          }
        });

        if (confirmError) {
          console.error('Error confirming payment:', confirmError);
          toast.error('Order confirmation failed. Please contact support.');
          return;
        }

        setOrderConfirmed(true);
        clearCart();
        toast.success('Order completed successfully! You will receive a confirmation email shortly.');
        
      } catch (error) {
        console.error('Error in payment confirmation:', error);
        toast.error('Could not confirm order. Please contact support.');
      }
    };

    confirmPayment();
  }, [sessionId, orderConfirmed, clearCart]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                Payment Successful!
              </CardTitle>
              <p className="text-lg font-semibold">
                Thank you for shopping with <span className="font-bold text-primary">SNUSTHETIC</span>!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Your days of spilling used pouches in your pocket are officially over! Your payment has been processed successfully.
                </p>
                {sessionId && (
                  <p className="text-sm text-muted-foreground">
                    Order ID: {sessionId}
                  </p>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">What happens next?</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• Your order will be processed within 1-2 business days</li>
                  <li>• You'll get tracking information once shipped</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/shop')}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
                <Button 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Back to Home
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}