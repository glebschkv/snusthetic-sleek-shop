import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

const stripePromise = loadStripe('pk_test_51S8K6LK5475G51yQr2GqoNLnKij1qXuE4Mdp1yc7mLEdS8j2chMOfdysP2ehPvf7xeIjZC5vF4NtnUpVbKO6Aidx00WMTjbpPz');

interface StripeCheckoutProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
  total: number;
  currency: string;
}

function CheckoutForm({ onSuccess, onCancel, total, currency }: Omit<StripeCheckoutProps, 'clientSecret'>) {
  const stripe = useStripe();
  const elements = useElements();
  const { formatPrice } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [elementsReady, setElementsReady] = useState(false);

  useEffect(() => {
    if (elements) {
      const paymentElement = elements.getElement('payment');
      if (paymentElement) {
        paymentElement.on('ready', () => {
          setElementsReady(true);
        });
      }
    }
  }, [elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !elementsReady) {
      return;
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'An error occurred during payment');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
        return;
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Payment Details</h3>
        <div className="bg-muted p-3 rounded-lg mb-4">
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <div className="min-h-[200px]">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
        {!elementsReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || !elementsReady || loading}
          className="flex-1"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Order
        </Button>
      </div>
    </form>
  );
}

export default function StripeCheckout({ clientSecret, onSuccess, onCancel, total, currency }: StripeCheckoutProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        onSuccess={onSuccess}
        onCancel={onCancel}
        total={total}
        currency={currency}
      />
    </Elements>
  );
}