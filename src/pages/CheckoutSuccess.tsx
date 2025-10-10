import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartContext } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCartContext();
  const sessionId = searchParams.get('session_id');
  const isSubscription = searchParams.get('subscription') === 'true';
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    if (!orderConfirmed) {
      clearCart();
      setOrderConfirmed(true);
      
      if (isSubscription) {
        toast.success('Subscription activated! Check your profile to manage it.');
      } else {
        toast.success('Order completed successfully! You will receive a confirmation email shortly.');
      }
    }
  }, [orderConfirmed, clearCart, isSubscription]);

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
                {isSubscription ? 'Subscription Activated!' : 'Payment Successful!'}
              </CardTitle>
              <p className="text-lg font-semibold">
                Thank you for {isSubscription ? 'subscribing with' : 'shopping with'} <span className="font-bold text-primary">SNUSTHETIC</span>!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  {isSubscription 
                    ? 'Your monthly subscription is now active! You\'ll receive your first delivery soon.'
                    : 'Your days of spilling used pouches in your pocket are officially over! Your payment has been processed successfully.'
                  }
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
                  {isSubscription ? (
                    <>
                      <li>• Your first delivery will ship within 1-2 business days</li>
                      <li>• Future deliveries will arrive monthly</li>
                      <li>• Manage your subscription from your profile</li>
                    </>
                  ) : (
                    <>
                      <li>• Your order will be processed within 1-2 business days</li>
                      <li>• You'll get tracking information once shipped</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {isSubscription ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/profile')}
                      className="flex-1"
                    >
                      View Subscription
                    </Button>
                    <Button 
                      onClick={() => navigate('/')}
                      className="flex-1"
                    >
                      Back to Home
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}