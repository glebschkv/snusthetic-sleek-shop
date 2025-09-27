import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateSubscriptionRequest {
  subscription_plan_id: string;
  return_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    // Get user from token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { subscription_plan_id, return_url } = await req.json() as CreateSubscriptionRequest

    console.log('Creating subscription for user:', user.id, 'plan:', subscription_plan_id)

    // Get subscription plan details
    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select(`
        *,
        products (
          id,
          name,
          description,
          price,
          currency
        )
      `)
      .eq('id', subscription_plan_id)
      .single()

    if (planError || !plan) {
      throw new Error('Subscription plan not found')
    }

    console.log('Found plan:', plan)

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-08-16',
    })

    // Get or create Stripe customer
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    let customerId: string

    // Check if customer already exists in Stripe
    const existingCustomers = await stripe.customers.list({
      email: user.email,
      limit: 1
    })

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email!,
        name: profile?.display_name || user.email!,
        metadata: {
          supabase_user_id: user.id
        }
      })
      customerId = customer.id
    }

    console.log('Using Stripe customer:', customerId)

    // Create or get Stripe product and price
    let stripePriceId = plan.stripe_price_id

    if (!stripePriceId) {
      // Create Stripe product
      const stripeProduct = await stripe.products.create({
        name: `${plan.products.name} - ${plan.quantity_per_month} cans/month`,
        description: `Monthly subscription for ${plan.quantity_per_month} cans of ${plan.products.name}`,
        metadata: {
          subscription_plan_id: plan.id,
          product_id: plan.products.id
        }
      })

      // Create Stripe price
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(plan.price_per_month * 100), // Convert to cents
        currency: plan.products.currency.toLowerCase(),
        recurring: {
          interval: 'month'
        },
        metadata: {
          subscription_plan_id: plan.id
        }
      })

      stripePriceId = stripePrice.id

      // Update subscription plan with Stripe price ID
      await supabaseClient
        .from('subscription_plans')
        .update({ stripe_price_id: stripePriceId })
        .eq('id', plan.id)
    }

    console.log('Using Stripe price:', stripePriceId)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: return_url || `${req.headers.get('origin')}/profile?subscription_success=true`,
      cancel_url: `${req.headers.get('origin')}/subscriptions?subscription_cancelled=true`,
      metadata: {
        user_id: user.id,
        subscription_plan_id: plan.id
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          subscription_plan_id: plan.id
        }
      }
    })

    console.log('Created checkout session:', session.id)

    return new Response(
      JSON.stringify({
        success: true,
        checkout_url: session.url,
        session_id: session.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating subscription:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})