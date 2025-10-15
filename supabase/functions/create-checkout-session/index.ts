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

    // Create shipping rates for EU/UK and US
    // Shipping costs: £3.50 for EU/UK, £10.00 for US
    // Convert from GBP to currency (using GBP rate of 0.73 to USD)
    const gbpToUsdRate = 1 / 0.73;
    
    const shippingEuUkAmount = Math.round(3.50 * gbpToUsdRate * 100); // £3.50 in cents
    const shippingUsAmount = Math.round(10.00 * gbpToUsdRate * 100); // £10.00 in cents

    // Create EU/UK shipping rate
    const shippingRateEuUk = await fetch('https://api.stripe.com/v1/shipping_rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'display_name': 'Standard Shipping (EU/UK)',
        'type': 'fixed_amount',
        'fixed_amount[amount]': shippingEuUkAmount.toString(),
        'fixed_amount[currency]': currency.toLowerCase(),
        'delivery_estimate[minimum][unit]': 'business_day',
        'delivery_estimate[minimum][value]': '5',
        'delivery_estimate[maximum][unit]': 'business_day',
        'delivery_estimate[maximum][value]': '10',
      }),
    });

    const euUkRate = await shippingRateEuUk.json();

    // Create US shipping rate
    const shippingRateUs = await fetch('https://api.stripe.com/v1/shipping_rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'display_name': 'Standard Shipping (US)',
        'type': 'fixed_amount',
        'fixed_amount[amount]': shippingUsAmount.toString(),
        'fixed_amount[currency]': currency.toLowerCase(),
        'delivery_estimate[minimum][unit]': 'business_day',
        'delivery_estimate[minimum][value]': '7',
        'delivery_estimate[maximum][unit]': 'business_day',
        'delivery_estimate[maximum][value]': '14',
      }),
    });

    const usRate = await shippingRateUs.json();

    // Create Stripe Checkout Session
    const sessionData = new URLSearchParams({
      'mode': 'payment',
      'success_url': success_url,
      'cancel_url': cancel_url,
      'payment_method_types[]': 'card',
      'billing_address_collection': 'required',
      ...(customer_email && { 'customer_email': customer_email }),
    });

    // Add shipping countries and options
    const allowedCountries = [
      'AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ',
      'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ',
      'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ',
      'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ',
      'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET',
      'FI', 'FJ', 'FK', 'FO', 'FR',
      'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY',
      'HK', 'HN', 'HR', 'HT', 'HU',
      'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT',
      'JE', 'JM', 'JO', 'JP',
      'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ',
      'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY',
      'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ',
      'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ',
      'OM',
      'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY',
      'QA',
      'RE', 'RO', 'RS', 'RU', 'RW',
      'SA', 'SB', 'SC', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ',
      'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ',
      'UA', 'UG', 'US', 'UY', 'UZ',
      'VA', 'VC', 'VE', 'VG', 'VN', 'VU',
      'WF', 'WS',
      'XK',
      'YE', 'YT',
      'ZA', 'ZM', 'ZW',
    ];
    allowedCountries.forEach(country => {
      sessionData.append('shipping_address_collection[allowed_countries][]', country);
    });

    // Add shipping options - both rates will be shown, Stripe automatically selects based on address
    sessionData.append('shipping_options[0][shipping_rate]', euUkRate.id);
    sessionData.append('shipping_options[1][shipping_rate]', usRate.id);

    // Add line items to the session data
    lineItems.forEach((item, index) => {
      sessionData.append(`line_items[${index}][price]`, item.price);
      sessionData.append(`line_items[${index}][quantity]`, item.quantity.toString());
    });

    // Add minimal metadata to session (to stay under 500 char limit)
    // Store only essential data, remove imageUrl and use short property names
    const minimalItems = items.map(item => ({
      i: item.id,           // id
      n: item.name,         // name  
      p: item.price,        // price
      q: item.quantity,     // quantity
      c: item.color         // color
    }));
    
    sessionData.append('metadata[items]', JSON.stringify(minimalItems));

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
        
        // Store referral code in session metadata (more reliable for webhooks)
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