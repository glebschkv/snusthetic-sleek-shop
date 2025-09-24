import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

export default function CheckoutCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl text-muted-foreground">
                Payment Cancelled
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Your payment was cancelled. No charges have been made to your account.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your cart items have been saved and are still available.
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  Need help with your order? Contact our support team or try the checkout process again.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/shop')}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
                <Button 
                  onClick={() => navigate('/checkout')}
                  className="flex-1"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Try Again
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