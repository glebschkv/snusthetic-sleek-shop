import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appliedReferralCode, setAppliedReferralCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  
  const hasSubscriptions = items.some(item => item.is_subscription);
  const hasPhysical = items.some(item => !item.is_subscription);
  const discountAmount = (total * discountPercent) / 100;
  const finalTotal = total - discountAmount;
  
  const handleProceedToPayment = async () => {
    setLoading(true);
    
    try {
      // Prevent mixing (shouldn't happen due to cart validation)
      if (hasSubscriptions && hasPhysical) {
        toast.error('Cart contains mixed product types. Please clear and start over.');
        setLoading(false);
        return;
      }

      if (hasSubscriptions) {
        await handleSubscriptionCheckout();
      } else {
        await handlePhysicalCheckout();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const handleSubscriptionCheckout = async () => {
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please log in to subscribe');
      navigate('/auth', { state: { from: '/subscriptions' } });
      setLoading(false);
      return;
    }

    // Get the subscription item (should only be one)
    const subscriptionItem = items.find(item => item.is_subscription);
    if (!subscriptionItem) {
      toast.error('No subscription found in cart');
      setLoading(false);
      return;
    }

    // Invoke create-subscription edge function
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: {
        product_id: subscriptionItem.product_id,
        quantity_type: subscriptionItem.subscription_data?.quantity_type,
        quantity: subscriptionItem.quantity,
        return_url: `${window.location.origin}/checkout/success?subscription=true`,
      }
    });

    if (error) throw error;

    if (data?.checkout_url) {
      // Clear cart before redirecting to Stripe
      clearCart();
      window.location.href = data.checkout_url;
    } else {
      throw new Error('No checkout URL returned');
    }
  };

  const handlePhysicalCheckout = async () => {
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
    
    const newWindow = window.open(data.url, '_blank');
    if (!newWindow) {
      window.location.href = data.url;
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
          <DialogTitle>
            {hasSubscriptions ? 'Subscription Checkout' : 'Checkout Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={`${item.id}-${item.variant?.id}`} className="flex justify-between text-sm">
                  <span>
                    {item.product?.name} 
                    {item.variant?.color_name && ` (${item.variant.color_name})`}
                    {item.is_subscription && ' - Monthly'}
                    × {item.quantity}
                  </span>
                  <span>
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                    {item.is_subscription && '/mo'}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            
            {/* Only show referral code for physical products */}
            {!hasSubscriptions && (
              <>
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
              </>
            )}
            
            {/* Subscription total */}
            {hasSubscriptions && (
              <div className="flex justify-between font-medium text-lg">
                <span>Monthly Total</span>
                <span>{formatPrice(total)}/month</span>
              </div>
            )}
          </div>

          {/* Referral Code Input - only for physical products */}
          {!hasSubscriptions && (
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
          )}

          <Button 
            onClick={handleProceedToPayment}
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {hasSubscriptions 
              ? `Subscribe for ${formatPrice(total)}/month`
              : `Pay ${formatPrice(finalTotal)}`
            }
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          {hasSubscriptions && (
            <p className="text-xs text-center text-muted-foreground">
              You'll be charged monthly. Cancel anytime.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}