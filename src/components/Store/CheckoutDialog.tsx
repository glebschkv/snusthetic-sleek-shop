import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartContext } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, ExternalLink } from 'lucide-react';
import { ReferralCodeInput } from './ReferralCodeInput';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const { items, getTotal, clearCart } = useCartContext();
  const { selectedCurrency, formatPrice } = useCurrency();
  const total = getTotal();
  const [loading, setLoading] = useState(false);
  const [appliedReferralCode, setAppliedReferralCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  
  const discountAmount = (total * discountPercent) / 100;
  const finalTotal = total - discountAmount;
  
  const handleProceedToPayment = async () => {

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
          customer_email: null,
          success_url: successUrl,
          cancel_url: cancelUrl,
          referral_code: appliedReferralCode || null,
          discount_amount: discountAmount
        }
      });

      if (error) throw error;
      
      // Open Stripe Checkout in a new window to avoid iframe restrictions
      const newWindow = window.open(data.url, '_blank');
      if (!newWindow) {
        // Fallback to current window if popup was blocked
        window.location.href = data.url;
      }
      
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
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              {appliedReferralCode && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-medium text-lg">
                <span>Final Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Referral Code Input */}
            <ReferralCodeInput 
              onReferralApplied={(code, discount) => {
                setAppliedReferralCode(code);
                setDiscountPercent(discount);
              }}
              onReferralRemoved={() => {
                setAppliedReferralCode('');
                setDiscountPercent(0);
              }}
              appliedCode={appliedReferralCode}
            />

            <Button 
              onClick={handleProceedToPayment}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Pay {formatPrice(finalTotal)}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}