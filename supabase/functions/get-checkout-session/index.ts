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

    return new Response(
      JSON.stringify({
        payment_intent: session.payment_intent,
        customer_details: {
          email: session.customer_details?.email || session.customer_email,
          name: session.customer_details?.name,
          address: session.shipping_details?.address || session.customer_details?.address
        }
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