import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/contexts/CurrencyContext';
import { storeService } from '@/services/store';
import { CheckoutData } from '@/types/store';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

const Checkout = () => {
  const cart = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const checkoutData: CheckoutData = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        shipping_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        },
        items: cart.items,
        total: cart.getTotal()
      };

      const order = await storeService.createOrder(checkoutData);

      if (order) {
        cart.clearCart();
        toast({
          title: "Order placed successfully!",
          description: `Your order #${order.id.slice(0, 8)} has been received. We'll send you an email confirmation shortly.`,
        });
        navigate('/');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to continue with checkout.</p>
            <Button onClick={() => navigate('/shop')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/shop')} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customer_name">Full Name</Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer_email">Email</Label>
                      <Input
                        id="customer_email"
                        name="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                     ) : (
                       `Place Order - ${formatPrice(cart.getTotal())}`
                     )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                     <div className="text-right">
                       <p className="font-medium">
                         {formatPrice(item.product.price * item.quantity)}
                       </p>
                     </div>
                  </div>
                ))}

                <Separator />

                 <div className="space-y-2">
                   <div className="flex justify-between">
                     <span>Subtotal</span>
                     <span>{formatPrice(cart.getTotal())}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>Shipping</span>
                     <span>Free</span>
                   </div>
                   <Separator />
                   <div className="flex justify-between text-lg font-semibold">
                     <span>Total</span>
                     <span>{formatPrice(cart.getTotal())}</span>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;