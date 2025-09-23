import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartContext } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CheckoutDialog from '@/components/Store/CheckoutDialog';
import { useState } from 'react';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal } = useCartContext();
  const { formatPrice } = useCurrency();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const total = getTotal();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
    }
  }, [items, navigate]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant?.id}`} className="flex items-center gap-4 p-4 border rounded-lg">
                    {(item.variant?.image_url || item.product?.image_url) && (
                      <img
                        src={item.variant?.image_url || item.product?.image_url}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product?.name}</h3>
                      {item.variant?.color_name && (
                        <p className="text-sm text-muted-foreground">Color: {item.variant.color_name}</p>
                      )}
                      <p className="text-sm font-medium">{formatPrice(item.product?.price || 0)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1), item.variant?.id)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant?.id)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id, item.variant?.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variant?.id}`} className="flex justify-between text-sm">
                      <span>{item.product?.name} {item.variant?.color_name && `(${item.variant.color_name})`} × {item.quantity}</span>
                      <span>{formatPrice((item.product?.price || 0) * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                
                <div className="flex justify-between font-semibold text-lg mb-6">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <Button 
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
    </div>
  );
}