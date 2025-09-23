import { createContext, useContext, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QJEMpCzNDpGZJ5LFKyYL8ej8OuZxNbm7C8zN3Bk7aGvXlIkSxKjTfqzjm3KzRdCqSxVbNjKjGfVqsXgLxQKzN00');

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