import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GetSessionRequest {
  session_id: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Missing Stripe secret key')
    }

    const { session_id }: GetSessionRequest = await req.json()

    if (!session_id) {
      throw new Error('Session ID is required')
    }

    // Get checkout session from Stripe
    const sessionResponse = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, {
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    })

    if (!sessionResponse.ok) {
      throw new Error('Failed to retrieve checkout session')
    }

    const session = await sessionResponse.json()

    // Get the payment intent to access its metadata
    const paymentIntentResponse = await fetch(`https://api.stripe.com/v1/payment_intents/${session.payment_intent}`, {
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    })

    if (!paymentIntentResponse.ok) {
      throw new Error('Failed to retrieve payment intent')
    }

    const paymentIntent = await paymentIntentResponse.json()

    // Format address to match the expected structure
    const address = session.shipping_details?.address || session.customer_details?.address
    const formattedAddress = address ? {
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      postal_code: address.postal_code || '',
      country: address.country || ''
    } : null

    return new Response(
      JSON.stringify({
        payment_intent: session.payment_intent,
        customer_details: {
          email: session.customer_details?.email || session.customer_email,
          name: session.customer_details?.name,
          address: formattedAddress
        },
        metadata: paymentIntent.metadata
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error getting checkout session:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})