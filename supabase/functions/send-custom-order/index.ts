import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "https://esm.sh/resend@2.0.0"

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'https://snusthetic.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CustomOrderRequest {
  firstName: string
  lastName: string
  email: string
  quantity: string
  requirements: string
}

// Sanitize HTML to prevent XSS attacks
const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { firstName, lastName, email, quantity, requirements }: CustomOrderRequest = await req.json()

    // Sanitize all user inputs before using in HTML
    const safeFirstName = sanitizeHtml(firstName);
    const safeLastName = sanitizeHtml(lastName);
    const safeEmail = sanitizeHtml(email);
    const safeQuantity = sanitizeHtml(quantity);
    const safeRequirements = sanitizeHtml(requirements);

    const businessEmail = Deno.env.get('BUSINESS_EMAIL') || 'snusthetic@gmail.com';

    // Send notification email to business
    const businessEmailResponse = await resend.emails.send({
      from: "Snusthetic Orders <orders@snusthetic.com>",
      to: [businessEmail],
      subject: `New Custom Order Request from ${safeFirstName} ${safeLastName}`,
      html: `
        <h1>New Custom Order Request</h1>
        <p><strong>Customer:</strong> ${safeFirstName} ${safeLastName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Quantity:</strong> ${safeQuantity}</p>
        <div style="margin-top: 10px;">
          ${safeRequirements}
        </div>
        <hr>
        <p>Please follow up with the customer directly at ${safeEmail}</p>
      `,
    })

    // Send confirmation email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Snusthetic <orders@snusthetic.com>",
      to: [email],
      subject: "Your Custom Order Request - Snusthetic",
      html: `
        <h1>Thank you for your custom order request!</h1>
        <p>Hi ${safeFirstName},</p>
        <p>We have received your custom order request with the following details:</p>
        <ul>
          <li><strong>Quantity:</strong> ${safeQuantity}</li>
        </ul>
        <div style="margin: 15px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #333;">
          ${safeRequirements}
        </div>
        <p>Our team will review your request and get back to you within 24-48 hours at this email address.</p>
        <p>Thank you for choosing Snusthetic!</p>
        <p>Best regards,<br>The Snusthetic Team</p>
      `,
    })

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
