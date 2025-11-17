import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
}

interface OrderEmailData {
  order_id: string;
  customer_email: string;
  customer_name: string;
  items: OrderItem[];
  total_amount: number;
  currency: string;
  discount_amount: number;
  quantity_discount_percent?: number;
  referral_code_used?: string;
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
  status: string;
}

const formatCurrency = (amount: number, currency: string): string => {
  const currencySymbols: Record<string, string> = {
    'usd': '$',
    'gbp': '£',
    'eur': '€',
  };
  const symbol = currencySymbols[currency.toLowerCase()] || '$';
  return `${symbol}${amount.toFixed(2)}`;
};

const generateEmailHTML = (data: OrderEmailData): string => {
  const { 
    order_id, 
    customer_name, 
    items, 
    total_amount, 
    currency,
    discount_amount,
    quantity_discount_percent,
    referral_code_used,
    shipping_address,
    created_at,
    status 
  } = data;

  const subtotal = total_amount + discount_amount;
  const orderDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.name}${item.color ? ` - ${item.color}` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatCurrency(item.price * item.quantity, currency)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                      Thank You for Your Order!
                    </h1>
                    <p style="margin: 10px 0 0 0; color: #a0a0a0; font-size: 14px;">
                      Order #${order_id.substring(0, 8)}
                    </p>
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="padding: 30px 40px 20px 40px;">
                    <p style="margin: 0; font-size: 16px; color: #374151; line-height: 24px;">
                      Hi ${customer_name},
                    </p>
                    <p style="margin: 15px 0 0 0; font-size: 16px; color: #374151; line-height: 24px;">
                      We've received your order and it's being processed. Here are the details:
                    </p>
                  </td>
                </tr>

                <!-- Order Details -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      <thead>
                        <tr style="background-color: #f9fafb;">
                          <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600; color: #6b7280;">
                            Item
                          </th>
                          <th style="padding: 12px; text-align: center; font-size: 14px; font-weight: 600; color: #6b7280;">
                            Qty
                          </th>
                          <th style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: #6b7280;">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHTML}
                      </tbody>
                    </table>
                  </td>
                </tr>

                <!-- Order Summary -->
                <tr>
                  <td style="padding: 0 40px 20px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">
                          Subtotal:
                        </td>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; text-align: right;">
                          ${formatCurrency(subtotal, currency)}
                        </td>
                      </tr>
                      ${quantity_discount_percent ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #059669;">
                          Bulk Discount (${quantity_discount_percent}%):
                        </td>
                        <td style="padding: 8px 0; font-size: 14px; color: #059669; text-align: right;">
                          -${formatCurrency(subtotal * quantity_discount_percent / 100, currency)}
                        </td>
                      </tr>
                      ` : ''}
                      ${referral_code_used ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #059669;">
                          Referral Discount:
                        </td>
                        <td style="padding: 8px 0; font-size: 14px; color: #059669; text-align: right;">
                          -${formatCurrency(discount_amount - (quantity_discount_percent ? subtotal * quantity_discount_percent / 100 : 0), currency)}
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">
                          Shipping:
                        </td>
                        <td style="padding: 8px 0; font-size: 14px; color: #6b7280; text-align: right;">
                          Calculated at checkout
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0 8px 0; font-size: 18px; font-weight: bold; color: #111827; border-top: 2px solid #e5e7eb;">
                          Total:
                        </td>
                        <td style="padding: 16px 0 8px 0; font-size: 18px; font-weight: bold; color: #111827; text-align: right; border-top: 2px solid #e5e7eb;">
                          ${formatCurrency(total_amount, currency)}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Shipping Address -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <h2 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #111827;">
                      Shipping Address
                    </h2>
                    <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; font-size: 14px; color: #374151; line-height: 22px;">
                      ${customer_name}<br>
                      ${shipping_address.line1}<br>
                      ${shipping_address.line2 ? `${shipping_address.line2}<br>` : ''}
                      ${shipping_address.city}, ${shipping_address.postal_code}<br>
                      ${shipping_address.country}
                    </div>
                  </td>
                </tr>

                <!-- Order Status -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                      <strong>Order Date:</strong> ${orderDate}
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">
                      <strong>Status:</strong> <span style="color: #059669; text-transform: capitalize;">${status}</span>
                    </p>
                  </td>
                </tr>

                <!-- What's Next -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px;">
                      <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #1e40af;">
                        What's Next?
                      </h3>
                      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #374151; line-height: 22px;">
                        <li>You'll receive a shipping confirmation email when your order ships</li>
                        <li>Track your order status in your account dashboard</li>
                        <li>Questions? Contact us at snusthetic@gmail.com</li>
                      </ul>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                      Thank you for choosing Snusthetic
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
                      © ${new Date().getFullYear()} Snusthetic. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderEmailData = await req.json();
    
    console.log('Sending order confirmation email to:', orderData.customer_email);
    console.log('Order ID:', orderData.order_id);

    const html = generateEmailHTML(orderData);

    const emailResponse = await resend.emails.send({
      from: "Snusthetic <orders@snusthetic.com>",
      to: [orderData.customer_email],
      subject: `Order Confirmation #${orderData.order_id.substring(0, 8)} - Thank You!`,
      html,
    });

    console.log("Order confirmation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending order confirmation email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
