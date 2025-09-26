import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface CheckoutSessionCompletedEvent {
  id: string;
  type: 'checkout.session.completed';
  data: {
    object: {
      id: string;
      payment_intent: string;
      customer_details: {
        email: string;
        name: string;
        address?: any;
      };
      shipping_details?: {
        address?: any;
      };
      amount_total: number;
      currency: string;
      metadata: Record<string, string>;
      payment_status: string;
    };
  };
}

async function verifyStripeSignature(payload: string, signature: string): Promise<boolean> {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return false;
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(STRIPE_WEBHOOK_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigElements = signature.split(',');
    const timestamp = sigElements.find(el => el.startsWith('t='))?.split('=')[1];
    const sig = sigElements.find(el => el.startsWith('v1='))?.split('=')[1];

    if (!timestamp || !sig) {
      console.error('Invalid signature format');
      return false;
    }

    const payloadToVerify = `${timestamp}.${payload}`;
    const expectedSig = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payloadToVerify)
    );

    const expectedHex = Array.from(new Uint8Array(expectedSig))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return expectedHex === sig;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

async function handleCheckoutSessionCompleted(event: CheckoutSessionCompletedEvent) {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
  const session = event.data.object;

  console.log('Processing checkout session completed:', session.id);
  console.log('Session metadata:', session.metadata);

  try {
    // Check if order already exists to prevent duplicates
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id')
      .eq('stripe_payment_intent_id', session.payment_intent)
      .maybeSingle();

    if (existingOrder) {
      console.log('Order already exists for payment intent:', session.payment_intent);
      return { success: true, message: 'Order already processed' };
    }

    // Extract minimal items from metadata and reconstruct full item data
    const itemsData = session.metadata.items;
    if (!itemsData) {
      throw new Error('No items found in session metadata');
    }

    let minimalItems;
    try {
      minimalItems = JSON.parse(itemsData);
    } catch (error) {
      console.error('Error parsing items from metadata:', error);
      throw new Error('Invalid items data in session metadata');
    }

    // Reconstruct full items data from minimal metadata
    const items = minimalItems.map((item: any) => ({
      id: item.i,
      name: item.n,
      price: item.p,
      quantity: item.q,
      color: item.c,
      // imageUrl will be null since we don't store it in metadata to save space
      imageUrl: null
    }));

    const referralCode = session.metadata.referral_code;
    const discountAmount = session.metadata.discount_amount ? parseFloat(session.metadata.discount_amount) : 0;

    console.log('Items:', items);
    console.log('Referral code:', referralCode);
    console.log('Discount amount:', discountAmount);

    // Get user ID if email matches a registered user
    let userId = null;
    if (session.customer_details.email) {
      const { data: authUser, error: authError } = await supabase.auth.admin.listUsers();
      if (!authError && authUser.users) {
        const matchingUser = authUser.users.find(user => user.email === session.customer_details.email);
        if (matchingUser) {
          userId = matchingUser.id;
        }
      }
    }

    // Format shipping address
    const shippingAddress = session.shipping_details?.address || session.customer_details.address;
    const formattedAddress = shippingAddress ? {
      line1: shippingAddress.line1 || '',
      line2: shippingAddress.line2 || '',
      city: shippingAddress.city || '',
      postal_code: shippingAddress.postal_code || '',
      state: shippingAddress.state || '',
      country: shippingAddress.country || ''
    } : null;

    // Handle referral code if provided
    let referrerId = null;
    if (referralCode) {
      const { data: referrerProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle();

      if (referrerProfile) {
        referrerId = referrerProfile.id;
        console.log('Found referrer:', referrerId);
      } else {
        console.log('Referral code not found:', referralCode);
      }
    }

    // Create the order
    const orderData = {
      user_id: userId,
      customer_email: session.customer_details.email,
      customer_name: session.customer_details.name,
      total_amount: session.amount_total / 100, // Convert from cents
      currency: session.currency.toLowerCase(),
      status: 'completed',
      stripe_payment_intent_id: session.payment_intent,
      items: items,
      shipping_address: formattedAddress,
      referrer_id: referrerId,
      referral_code_used: referralCode,
      discount_amount: discountAmount
    };

    console.log('Creating order with data:', orderData);

    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Order created successfully:', newOrder.id);

    // Create referral usage record if referral was used
    if (referrerId && referralCode) {
      const referralUsageData = {
        referrer_id: referrerId,
        order_id: newOrder.id,
        referee_email: session.customer_details.email,
        discount_amount: discountAmount
      };

      console.log('Creating referral usage record:', referralUsageData);

      const { error: referralError } = await supabase
        .from('referral_usage')
        .insert(referralUsageData);

      if (referralError) {
        console.error('Error creating referral usage:', referralError);
        // Don't throw here - order is more important than referral tracking
      } else {
        console.log('Referral usage recorded successfully');
      }
    }

    return { success: true, orderId: newOrder.id };

  } catch (error) {
    console.error('Error processing checkout session:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('No stripe signature header found');
      return new Response('No signature header', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Verify the webhook signature
    const isValidSignature = await verifyStripeSignature(body, signature);
    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Parse the event
    const event = JSON.parse(body);
    console.log('Received webhook event:', event.type, event.id);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const result = await handleCheckoutSessionCompleted(event);
        console.log('Webhook processing result:', result);
        
        return new Response(JSON.stringify({ 
          received: true, 
          result: result 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        console.log('Unhandled event type:', event.type);
        return new Response(JSON.stringify({ 
          received: true, 
          message: 'Event type not handled' 
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});