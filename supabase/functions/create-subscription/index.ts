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

    const { product_id, quantity_type, quantity, currency, converted_price, return_url } = await req.json()

    console.log('Creating subscription for user:', user.id, 'product:', product_id, 'quantity:', quantity)

    // Validate inputs
    if (!product_id || !quantity_type || !quantity) {
      throw new Error('Missing required fields: product_id, quantity_type, quantity')
    }

    // Validate custom quantity minimum
    if (quantity_type === 'custom' && quantity < 5) {
      throw new Error('Custom quantity must be at least 5 cans')
    }

    // Get product details
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        currency,
        flavor,
        strength_mg,
        brand_id,
        brands (
          name
        )
      `)
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      throw new Error('Product not found')
    }

    console.log('Found product:', product)

    // Calculate pricing based on quantity type
    // If converted_price is provided, it's already the final monthly amount (with discount applied)
    // Otherwise, calculate from base price
    let pricePerMonth: number
    let discountPercent = 0

    if (converted_price) {
      // Frontend already calculated final price with discount applied
      pricePerMonth = converted_price
      console.log('Using pre-calculated price:', { pricePerMonth, converted_price })
    } else {
      // Backwards compatibility: calculate discount here
      const basePrice = product.price
      if (quantity_type === '5') discountPercent = 0
      else if (quantity_type === '10') discountPercent = 5
      else if (quantity_type === '20') discountPercent = 10
      else if (quantity_type === 'custom') discountPercent = 10

      const pricePerCan = basePrice * (1 - discountPercent / 100)
      pricePerMonth = pricePerCan * quantity
      console.log('Calculated pricing:', { quantity, discountPercent, pricePerCan, pricePerMonth, basePrice })
    }

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

    // Create Stripe product with full description
    const stripeProduct = await stripe.products.create({
      name: `${product.brands?.name || 'Brand'} ${product.flavor} ${product.strength_mg}mg - Monthly Subscription`,
      description: `${quantity} cans per month of ${product.name}`,
      metadata: {
        product_id: product.id,
        brand: product.brands?.name || '',
        flavor: product.flavor || '',
        strength: product.strength_mg?.toString() || '',
        quantity_type: quantity_type
      }
    })

    console.log('Created Stripe product:', stripeProduct.id)

    // Create Stripe price for this subscription
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(pricePerMonth * 100), // Convert to cents
      currency: (currency || product.currency).toLowerCase(),
      recurring: {
        interval: 'month'
      },
      metadata: {
        product_id: product.id,
        quantity: quantity.toString(),
        quantity_type: quantity_type,
        discount_percent: discountPercent.toString()
      }
    })

    console.log('Created Stripe price:', stripePrice.id)

    // Create Stripe checkout session
    // Note: Stripe subscription mode doesn't support shipping_options
    // Shipping address will be collected but shipping costs must be handled separately
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'NZ', 'IE', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'PT', 'GR', 'CZ', 'PL', 'HU', 'RO', 'BG', 'SK', 'SI', 'HR', 'LT', 'LV', 'EE', 'CY', 'MT', 'LU'],
      },
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: return_url || `${req.headers.get('origin')}/profile?subscription_success=true`,
      cancel_url: `${req.headers.get('origin')}/subscriptions?subscription_cancelled=true`,
      metadata: {
        user_id: user.id,
        product_id: product.id,
        quantity: quantity.toString(),
        quantity_type: quantity_type
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          product_id: product.id,
          quantity: quantity.toString(),
          quantity_type: quantity_type
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