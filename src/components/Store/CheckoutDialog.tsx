import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartContext } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, ExternalLink } from 'lucide-react';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, getTotal, clearCart } = useCartContext();
  const { selectedCurrency, formatPrice } = useCurrency();
  const total = getTotal();
  const [loading, setLoading] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    name: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      postal_code: '',
      country: 'SE'
    }
  });

  const handleProceedToPayment = async () => {
    if (!customerInfo.email || !customerInfo.name || !customerInfo.address.line1 || 
        !customerInfo.address.city || !customerInfo.address.postal_code) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const successUrl = `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/checkout/cancel`;

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          items: items.map(item => ({
            id: item.id,
            name: item.product?.name || 'Product',
            price: item.product?.price || 0,
            quantity: item.quantity,
            color: item.variant?.color_name,
            imageUrl: item.variant?.image_url || item.product?.image_url
          })),
          currency: selectedCurrency.code.toLowerCase(),
          customer_email: customerInfo.email,
          success_url: successUrl,
          cancel_url: cancelUrl
        }
      });

      if (error) throw error;
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
            <div>
              <h3 className="font-medium mb-3">Order Summary</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant?.id}`} className="flex justify-between text-sm">
                    <span>{item.product?.name} {item.variant?.color_name && `(${item.variant.color_name})`} × {item.quantity}</span>
                    <span>{formatPrice((item.product?.price || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-medium">Contact Information</h3>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <h3 className="font-medium mt-6">Shipping Address</h3>
              
              <div>
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  value={customerInfo.address.line1}
                  onChange={(e) => setCustomerInfo(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line1: e.target.value }
                  }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  value={customerInfo.address.line2}
                  onChange={(e) => setCustomerInfo(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, line2: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={customerInfo.address.city}
                    onChange={(e) => setCustomerInfo(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postal">Postal Code *</Label>
                  <Input
                    id="postal"
                    value={customerInfo.address.postal_code}
                    onChange={(e) => setCustomerInfo(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, postal_code: e.target.value }
                    }))}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleProceedToPayment}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proceed to Stripe Checkout
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}