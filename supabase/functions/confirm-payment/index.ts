import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConfirmPaymentRequest {
  payment_intent_id: string
  customer_info: {
    email: string
    name: string
    address: {
      line1: string
      line2?: string
      city: string
      postal_code: string
      country: string
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables')
    }

    const { payment_intent_id, customer_info }: ConfirmPaymentRequest = await req.json()

    // Get payment intent from Stripe
    const paymentIntentResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${payment_intent_id}`, {
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    })

    if (!paymentIntentResponse.ok) {
      throw new Error('Failed to retrieve payment intent')
    }

    const paymentIntent = await paymentIntentResponse.json()

    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment not successful')
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Parse items from metadata
    const items = JSON.parse(paymentIntent.metadata.items)

    // Create order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_payment_intent_id: payment_intent_id,
        customer_email: customer_info.email,
        customer_name: customer_info.name,
        shipping_address: customer_info.address,
        total_amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'paid',
        items: items,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      throw new Error('Failed to create order record')
    }

    // Send confirmation email (placeholder for now)
    console.log('Order created successfully:', order)

    return new Response(
      JSON.stringify({
        success: true,
        order_id: order.id,
        message: 'Payment confirmed and order created',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error confirming payment:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})