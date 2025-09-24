import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  color?: string
  imageUrl?: string
}

interface PaymentRequest {
  items: CartItem[]
  currency: string
  customer_email?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
    
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not configured')
    }

    const { items, currency = 'eur', customer_email }: PaymentRequest = await req.json()

    if (!items || items.length === 0) {
      throw new Error('No items in cart')
    }

    // Calculate total amount in cents
    const amount = Math.round(items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0) * 100)

    // Create payment intent with Stripe
    const paymentIntentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: currency.toLowerCase(),
        automatic_payment_methods: JSON.stringify({ enabled: true }),
        'metadata[items]': JSON.stringify(items),
        'metadata[customer_email]': customer_email || '',
      }),
    })

    if (!paymentIntentResponse.ok) {
      const error = await paymentIntentResponse.text()
      throw new Error(`Stripe API error: ${error}`)
    }

    const paymentIntent = await paymentIntentResponse.json()

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        amount: amount,
        currency: currency,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})