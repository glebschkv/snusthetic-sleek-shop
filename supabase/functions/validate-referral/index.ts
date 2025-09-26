import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ValidateReferralRequest {
  referral_code: string
  customer_email: string
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

    const { referral_code, customer_email, order_total }: ValidateReferralRequest = await req.json()

    if (!referral_code || !customer_email || !order_total) {
      throw new Error('Missing required fields')
    }

    // Find the referrer by referral code
    const { data: referrer, error: referrerError } = await supabaseClient
      .from('profiles')
      .select('id, display_name')
      .eq('referral_code', referral_code.toUpperCase())
      .single()

    if (referrerError || !referrer) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid referral code',
          discount_amount: 0 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Calculate 10% discount
    const discountPercent = 10
    const discountAmount = (order_total * discountPercent) / 100

    return new Response(
      JSON.stringify({
        success: true,
        referrer_id: referrer.id,
        referrer_name: referrer.display_name,
        discount_percent: discountPercent,
        discount_amount: discountAmount,
        final_total: order_total - discountAmount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error validating referral code:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        discount_amount: 0 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})