import { createContext, useContext, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51S8K6LK5475G51yQr2GqoNLnKij1qXuE4Mdp1yc7mLEdS8j2chMOfdysP2ehPvf7xeIjZC5vF4NtnUpVbKO6Aidx00WMTjbpPz');

interface StripeContextType {
  stripe: Promise<Stripe | null>;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

export const StripeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <StripeContext.Provider value={{ stripe: stripePromise }}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};