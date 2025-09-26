import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  imageUrl?: string;
}

interface CheckoutRequest {
  items: CartItem[];
  currency: string;
  customer_email?: string;
  success_url: string;
  cancel_url: string;
  referral_code?: string;
  discount_amount?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key not configured');
    }

    const { items, currency, customer_email, success_url, cancel_url, referral_code, discount_amount }: CheckoutRequest = await req.json();

    // Create line items for Stripe Checkout
    const lineItems = [];

    for (const item of items) {
      // Create or retrieve Stripe product
      const productData = new URLSearchParams({
        name: `${item.name}${item.color ? ` (${item.color})` : ''}`,
        description: `Product ID: ${item.id}`,
      });

      // Add image URL if available (URLSearchParams doesn't handle arrays, so we append manually)
      if (item.imageUrl) {
        productData.append('images[]', item.imageUrl);
      }

      const productResponse = await fetch('https://api.stripe.com/v1/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: productData,
      });

      if (!productResponse.ok) {
        const error = await productResponse.text();
        console.error('Error creating Stripe product:', error);
        throw new Error('Failed to create Stripe product');
      }

      const product = await productResponse.json();

      // Create Stripe price for the product
      const priceResponse = await fetch('https://api.stripe.com/v1/prices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          unit_amount: (item.price * 100).toString(), // Convert to cents
          currency: currency.toLowerCase(),
          product: product.id,
        }),
      });

      if (!priceResponse.ok) {
        const error = await priceResponse.text();
        console.error('Error creating Stripe price:', error);
        throw new Error('Failed to create Stripe price');
      }

      const price = await priceResponse.json();

      lineItems.push({
        price: price.id,
        quantity: item.quantity,
      });
    }

    // Create Stripe Checkout Session
    const sessionData = new URLSearchParams({
      'mode': 'payment',
      'success_url': success_url,
      'cancel_url': cancel_url,
      'payment_method_types[]': 'card',
      'billing_address_collection': 'required',
      ...(customer_email && { 'customer_email': customer_email }),
    });

    // Add shipping countries (append multiple values)
    const allowedCountries = ['US', 'CA', 'GB', 'SE', 'NO', 'DK', 'FI'];
    allowedCountries.forEach(country => {
      sessionData.append('shipping_address_collection[allowed_countries][]', country);
    });

    // Add line items to the session data
    lineItems.forEach((item, index) => {
      sessionData.append(`line_items[${index}][price]`, item.price);
      sessionData.append(`line_items[${index}][quantity]`, item.quantity.toString());
    });

    // Add items to metadata for payment confirmation
    sessionData.append('metadata[items]', JSON.stringify(items));

    // Create discount if referral code is provided
    if (referral_code && discount_amount && discount_amount > 0) {
      // Create a coupon for the discount
      const couponResponse = await fetch('https://api.stripe.com/v1/coupons', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'amount_off': Math.round(discount_amount * 100).toString(), // Convert to cents
          'currency': currency.toLowerCase(),
          'duration': 'once',
          'name': `Referral Discount - ${referral_code}`,
        }),
      });

      if (couponResponse.ok) {
        const coupon = await couponResponse.json();
        sessionData.append('discounts[0][coupon]', coupon.id);
        
        // Store referral code in metadata
        sessionData.append('metadata[referral_code]', referral_code);
        sessionData.append('metadata[discount_amount]', discount_amount.toString());
      }
    }

    const sessionResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: sessionData,
    });

    if (!sessionResponse.ok) {
      const error = await sessionResponse.text();
      console.error('Error creating Stripe checkout session:', error);
      throw new Error('Failed to create checkout session');
    }

    const session = await sessionResponse.json();

    return new Response(JSON.stringify({ 
      url: session.url,
      session_id: session.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-checkout-session function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});