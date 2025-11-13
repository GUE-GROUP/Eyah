// Eyah's Hotel & Suites - Send Confirmation Email Edge Function
// Sends booking confirmation email to guests

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  bookingId: string;
  guestName: string;
  email: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailData: EmailRequest = await req.json()

    // Validate required fields
    if (!emailData.email || !emailData.guestName || !emailData.bookingId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Email template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - Eyah's Hotel & Suites</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0A3A40 0%, #D4A574 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #0A3A40; }
          .total { font-size: 24px; color: #D4A574; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; padding: 12px 30px; background: #D4A574; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Eyah's Hotel & Suites</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="content">
            <h2>Dear ${emailData.guestName},</h2>
            <p>Thank you for choosing Eyah's Hotel & Suites! Your booking has been confirmed.</p>
            
            <div class="booking-details">
              <h3>Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span>${emailData.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span>${emailData.roomName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-in:</span>
                <span>${new Date(emailData.checkIn).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Check-out:</span>
                <span>${new Date(emailData.checkOut).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="total">₦${emailData.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <p><strong>Important Information:</strong></p>
            <ul>
              <li>Check-in time: 2:00 PM</li>
              <li>Check-out time: 12:00 PM</li>
              <li>Please bring a valid ID for check-in</li>
              <li>Payment can be made at the hotel or online</li>
            </ul>

            <center>
              <a href="https://eyahshotel.com/booking/${emailData.bookingId}" class="button">View Booking</a>
            </center>

            <p>If you have any questions or need to make changes to your booking, please contact us:</p>
            <p>
              <strong>Phone:</strong> +234 912 855 5191, +234 816 333 2977<br>
              <strong>Email:</strong> info@eyahshotel.com<br>
              <strong>Address:</strong> 10 Keffi Road, Makurdi, Benue State, Nigeria
            </p>

            <p>We look forward to welcoming you!</p>
            <p>Best regards,<br>The Eyah's Hotel & Suites Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Eyah's Hotel & Suites. All rights reserved.</p>
            <p>10 Keffi Road, Makurdi, 970101, Benue, Nigeria</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email using SendGrid (or your preferred email service)
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    
    if (!SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured')
      // For development, just return success
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email would be sent in production',
          preview: emailHTML 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: emailData.email, name: emailData.guestName }],
          subject: `Booking Confirmation - ${emailData.bookingId}`,
        }],
        from: {
          email: 'bookings@eyahshotel.com',
          name: "Eyah's Hotel & Suites"
        },
        content: [{
          type: 'text/html',
          value: emailHTML
        }]
      })
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.text()
      console.error('SendGrid error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
