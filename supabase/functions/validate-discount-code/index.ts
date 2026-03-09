import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidateDiscountCodeRequest {
  code: string
  order_total: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { code, order_total }: ValidateDiscountCodeRequest = await req.json()

    if (!code || !order_total) {
      throw new Error('Missing required fields: code and order_total')
    }

    // Look up the discount code (case-insensitive)
    const { data: discountCode, error: lookupError } = await supabaseClient
      .from('discount_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()

    if (lookupError || !discountCode) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid discount code',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Check if active
    if (!discountCode.is_active) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'This discount code is no longer active',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Check date range
    const now = new Date()
    if (discountCode.valid_from && new Date(discountCode.valid_from) > now) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'This discount code is not yet valid',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }
    if (discountCode.valid_to && new Date(discountCode.valid_to) < now) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'This discount code has expired',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Check usage limit
    if (discountCode.max_uses !== null && discountCode.current_uses >= discountCode.max_uses) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'This discount code has reached its usage limit',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Check minimum order amount
    if (discountCode.min_order_amount && order_total < discountCode.min_order_amount) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Minimum order amount of ${discountCode.min_order_amount} required`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Calculate discount amount
    let discountAmount: number
    if (discountCode.discount_type === 'percentage') {
      discountAmount = (order_total * discountCode.discount_value) / 100
    } else {
      discountAmount = Math.min(discountCode.discount_value, order_total)
    }

    return new Response(
      JSON.stringify({
        success: true,
        code: discountCode.code,
        discount_type: discountCode.discount_type,
        discount_value: discountCode.discount_value,
        discount_amount: discountAmount,
        description: discountCode.description,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error validating discount code:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})