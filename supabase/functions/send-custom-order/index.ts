import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CustomOrderRequest {
  firstName: string
  lastName: string
  email: string
  quantity: string
  requirements: string
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { firstName, lastName, email, quantity, requirements }: CustomOrderRequest = await req.json()

    // Send notification email to business
    const businessEmailResponse = await resend.emails.send({
      from: "Snusthetic Orders <onboarding@resend.dev>",
      to: ["snusthetic@gmail.com"],
      subject: `New Custom Order Request from ${firstName} ${lastName}`,
      html: `
        <h1>New Custom Order Request</h1>
        <p><strong>Customer:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <div style="margin-top: 10px;">
          ${requirements}
        </div>
        <hr>
        <p>Please follow up with the customer directly at ${email}</p>
      `,
    })

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Snusthetic <onboarding@resend.dev>",
      to: [email],
      subject: "Your Custom Order Request - Snusthetic",
      html: `
        <h1>Thank you for your custom order request!</h1>
        <p>Hi ${firstName},</p>
        <p>We have received your custom order request with the following details:</p>
        <ul>
          <li><strong>Quantity:</strong> ${quantity}</li>
        </ul>
        <div style="margin: 15px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #333;">
          ${requirements}
        </div>
        <p>Our team will review your request and get back to you within 24-48 hours at this email address.</p>
        <p>Thank you for choosing Snusthetic!</p>
        <p>Best regards,<br>The Snusthetic Team</p>
      `,
    })

    console.log('Business email sent:', businessEmailResponse)
    console.log('Customer email sent:', customerEmailResponse)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Custom order request sent successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending custom order emails:', error)
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