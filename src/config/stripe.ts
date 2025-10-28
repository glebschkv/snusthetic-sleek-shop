// Stripe configuration
// The publishable key is safe to expose in the frontend
export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('VITE_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
}
