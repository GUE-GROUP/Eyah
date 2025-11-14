// Eyah's Hotel & Suites - Resend Email Service
// Handles all email notifications using Resend API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'booking_confirmation' | 'booking_status_update' | 'admin_notification' | 'contact_form';
  to: string;
  data: any;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const emailRequest: EmailRequest = await req.json()
    console.log('📧 Email request received:', emailRequest.type)

    // Validate required fields
    if (!emailRequest.type || !emailRequest.to || !emailRequest.data) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type, to, data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Resend API key
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          message: 'RESEND_API_KEY environment variable is missing'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate email content based on type
    let emailSubject = ''
    let emailHTML = ''
    // Use Resend's test domain until custom domain is verified
    // Change to 'bookings@eyahshotel.com' after domain verification
    let fromEmail = 'onboarding@resend.dev'
    let fromName = "Eyah's Hotel & Suites"

    switch (emailRequest.type) {
      case 'booking_confirmation':
        emailSubject = `Booking Confirmation - ${emailRequest.data.bookingId}`
        emailHTML = generateBookingConfirmationEmail(emailRequest.data)
        break

      case 'booking_status_update':
        emailSubject = `Booking ${emailRequest.data.status} - ${emailRequest.data.bookingId}`
        emailHTML = generateStatusUpdateEmail(emailRequest.data)
        break

      case 'admin_notification':
        emailSubject = `New Booking Alert - ${emailRequest.data.bookingId}`
        emailHTML = generateAdminNotificationEmail(emailRequest.data)
        // Keep same test domain for admin notifications
        break

      case 'contact_form':
        emailSubject = `New Contact Form Submission - ${emailRequest.data.subject}`
        emailHTML = generateContactFormEmail(emailRequest.data)
        // Keep same test domain for contact form
        break

      case 'contact_form_reply':
        emailSubject = `Re: ${emailRequest.data.originalSubject}`
        emailHTML = generateContactFormReplyEmail(emailRequest.data)
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid email type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    console.log('📤 Sending email via Resend...')
    console.log('  To:', emailRequest.to)
    console.log('  Subject:', emailSubject)

    // Send email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: [emailRequest.to],
        subject: emailSubject,
        html: emailHTML,
      })
    })

    const resendData = await resendResponse.json()

    if (!resendResponse.ok) {
      console.error('❌ Resend API error:', resendData)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email', 
          details: resendData 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Email sent successfully!')
    console.log('  Email ID:', resendData.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: resendData.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// =====================================================
// EMAIL TEMPLATES
// =====================================================

function generateBookingConfirmationEmail(data: any): string {
  const { bookingId, guestName, roomName, checkIn, checkOut, totalAmount, adults, children, rooms: roomCount, verificationCode } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0A3A40 0%, #D4A574 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 10px; font-weight: 600; }
        .header p { font-size: 16px; opacity: 0.95; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; color: #0A3A40; margin-bottom: 20px; font-weight: 600; }
        .message { font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.8; }
        .booking-card { background: #f8f9fa; border-left: 4px solid #D4A574; padding: 25px; border-radius: 8px; margin: 30px 0; }
        .booking-card h3 { color: #0A3A40; font-size: 18px; margin-bottom: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #0A3A40; }
        .detail-value { color: #555; text-align: right; }
        .total-row { background: #0A3A40; color: white; padding: 15px; border-radius: 6px; margin-top: 15px; }
        .total-row .detail-label { color: white; }
        .total-row .detail-value { color: #D4A574; font-size: 24px; font-weight: bold; }
        .info-box { background: #e8f4f8; border-left: 4px solid #0A3A40; padding: 20px; border-radius: 6px; margin: 25px 0; }
        .info-box h4 { color: #0A3A40; margin-bottom: 12px; font-size: 16px; }
        .info-box ul { list-style: none; padding-left: 0; }
        .info-box li { padding: 6px 0; color: #555; }
        .info-box li:before { content: "✓ "; color: #D4A574; font-weight: bold; margin-right: 8px; }
        .button { display: inline-block; padding: 14px 32px; background: #D4A574; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 25px 0; transition: background 0.3s; }
        .button:hover { background: #c09563; }
        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 25px 0; }
        .contact-info p { margin: 8px 0; color: #555; }
        .contact-info strong { color: #0A3A40; }
        .verification-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
        .verification-box h3 { font-size: 18px; margin-bottom: 15px; opacity: 0.95; }
        .verification-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; background: white; color: #059669; padding: 20px 30px; border-radius: 8px; display: inline-block; margin: 15px 0; font-family: 'Courier New', monospace; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .verification-box p { font-size: 14px; opacity: 0.9; margin-top: 10px; }
        .footer { background: #0A3A40; color: white; padding: 30px; text-align: center; }
        .footer p { margin: 8px 0; font-size: 14px; opacity: 0.9; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #D4A574; text-decoration: none; margin: 0 10px; }
        @media only screen and (max-width: 600px) {
          .content { padding: 25px 20px; }
          .header { padding: 30px 20px; }
          .detail-row { flex-direction: column; }
          .detail-value { text-align: left; margin-top: 5px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1>🏨 Eyah's Hotel & Suites</h1>
          <p>Your Booking is Confirmed!</p>
        </div>

        <!-- Content -->
        <div class="content">
          <div class="greeting">Dear ${guestName},</div>
          
          <p class="message">
            Thank you for choosing Eyah's Hotel & Suites! We're delighted to confirm your reservation. 
            Your comfort and satisfaction are our top priorities, and we look forward to providing you 
            with an exceptional stay.
          </p>

          <!-- Booking Details Card -->
          <div class="booking-card">
            <h3>📋 Booking Details</h3>
            
            <div class="detail-row">
              <span class="detail-label">Booking ID</span>
              <span class="detail-value">${bookingId}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Room Type</span>
              <span class="detail-value">${roomName}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Check-in Date</span>
              <span class="detail-value">${formatDate(checkIn)}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Check-out Date</span>
              <span class="detail-value">${formatDate(checkOut)}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Guests</span>
              <span class="detail-value">${adults} Adult(s), ${children} Child(ren)</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Number of Rooms</span>
              <span class="detail-value">${roomCount}</span>
            </div>

            <div class="total-row">
              <div class="detail-row" style="border: none; padding: 0;">
                <span class="detail-label">Total Amount</span>
                <span class="detail-value">₦${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          ${verificationCode ? `
          <!-- Verification Code -->
          <div class="verification-box">
            <h3>🔐 Your Check-In Verification Code</h3>
            <div class="verification-code">${verificationCode}</div>
            <p>Present this code at the hotel reception during check-in</p>
            <p style="margin-top: 15px; font-size: 13px;">⚠️ Keep this code secure and do not share it with anyone</p>
          </div>
          ` : ''}

          <!-- Important Information -->
          <div class="info-box">
            <h4>📌 Important Information</h4>
            <ul>
              <li>Check-in time: 2:00 PM</li>
              <li>Check-out time: 12:00 PM</li>
              <li>Please bring a valid government-issued ID</li>
              ${verificationCode ? '<li>Present your verification code at reception</li>' : ''}
              <li>Early check-in subject to availability</li>
              <li>Late check-out can be arranged (additional charges may apply)</li>
            </ul>
          </div>

          <center>
            <a href="https://eyahshotel.com/bookings/${bookingId}" class="button">View Booking Details</a>
          </center>

          <!-- Contact Information -->
          <div class="contact-info">
            <p><strong>📞 Phone:</strong> +234 912 855 5191, +234 816 333 2977</p>
            <p><strong>📧 Email:</strong> info@eyahshotel.com</p>
            <p><strong>📍 Address:</strong> 10 Keffi Road, Makurdi, Benue State, Nigeria</p>
          </div>

          <p class="message">
            If you have any questions or need to make changes to your booking, please don't hesitate to contact us. 
            We're here to help make your stay memorable!
          </p>

          <p style="margin-top: 30px; color: #555;">
            Warm regards,<br>
            <strong style="color: #0A3A40;">The Eyah's Hotel & Suites Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Eyah's Hotel & Suites. All rights reserved.</p>
          <p>10 Keffi Road, Makurdi, 970101, Benue State, Nigeria</p>
          <div class="social-links">
            <a href="https://facebook.com/eyahshotel">Facebook</a> |
            <a href="https://instagram.com/eyahshotel">Instagram</a> |
            <a href="https://twitter.com/eyahshotel">Twitter</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateStatusUpdateEmail(data: any): string {
  const { bookingId, guestName, status, roomName, checkIn, checkOut, reason, verificationCode } = data

  const statusConfig = {
    confirmed: {
      color: '#10b981',
      icon: '✅',
      title: 'Booking Confirmed',
      message: 'Great news! Your booking has been confirmed. We look forward to welcoming you!'
    },
    cancelled: {
      color: '#ef4444',
      icon: '❌',
      title: 'Booking Cancelled',
      message: 'Your booking has been cancelled. If this was a mistake, please contact us immediately.'
    },
    completed: {
      color: '#3b82f6',
      icon: '🎉',
      title: 'Stay Completed',
      message: 'Thank you for staying with us! We hope you had a wonderful experience.'
    }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.confirmed

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Status Update</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: ${config.color}; color: white; padding: 40px 30px; text-align: center; }
        .header .icon { font-size: 48px; margin-bottom: 15px; }
        .header h1 { font-size: 26px; margin-bottom: 10px; }
        .content { padding: 40px 30px; }
        .status-badge { display: inline-block; padding: 8px 16px; background: ${config.color}; color: white; border-radius: 20px; font-weight: 600; margin: 20px 0; }
        .booking-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .booking-info p { margin: 10px 0; color: #555; }
        .booking-info strong { color: #0A3A40; }
        .reason-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .verification-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
        .verification-box h3 { font-size: 18px; margin-bottom: 15px; opacity: 0.95; }
        .verification-code { font-size: 42px; font-weight: bold; letter-spacing: 8px; background: white; color: #059669; padding: 20px 30px; border-radius: 8px; display: inline-block; margin: 15px 0; font-family: 'Courier New', monospace; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .verification-box p { font-size: 14px; opacity: 0.9; margin-top: 10px; }
        .button { display: inline-block; padding: 14px 32px; background: #D4A574; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background: #0A3A40; color: white; padding: 25px; text-align: center; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="icon">${config.icon}</div>
          <h1>${config.title}</h1>
        </div>

        <div class="content">
          <p style="font-size: 18px; margin-bottom: 20px;">Dear ${guestName},</p>
          
          <p style="margin-bottom: 20px;">${config.message}</p>

          <div class="booking-info">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Room:</strong> ${roomName}</p>
            <p><strong>Check-in:</strong> ${formatDate(checkIn)}</p>
            <p><strong>Check-out:</strong> ${formatDate(checkOut)}</p>
            <p><strong>Status:</strong> <span class="status-badge">${status.toUpperCase()}</span></p>
          </div>

          ${reason ? `
            <div class="reason-box">
              <strong>Reason:</strong> ${reason}
            </div>
          ` : ''}

          ${verificationCode && status === 'confirmed' ? `
          <!-- Verification Code -->
          <div class="verification-box">
            <h3>🔐 Your Check-In Verification Code</h3>
            <div class="verification-code">${verificationCode}</div>
            <p>Present this code at the hotel reception during check-in</p>
            <p style="margin-top: 15px; font-size: 13px;">⚠️ Keep this code secure and do not share it with anyone</p>
          </div>
          ` : ''}

          <center>
            <a href="https://eyahshotel.com/bookings/${bookingId}" class="button">View Booking</a>
          </center>

          <p style="margin-top: 30px;">
            If you have any questions, please contact us at:<br>
            <strong>Phone:</strong> +234 912 855 5191<br>
            <strong>Email:</strong> info@eyahshotel.com
          </p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Eyah's Hotel & Suites</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateAdminNotificationEmail(data: any): string {
  const { bookingId, guestName, email, phone, roomName, checkIn, checkOut, totalAmount, adults, children } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Alert</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .header h1 { font-size: 22px; }
        .content { padding: 30px; }
        .alert-box { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-item { background: #f8f9fa; padding: 12px; border-radius: 6px; }
        .info-item strong { display: block; color: #0A3A40; margin-bottom: 5px; }
        .button { display: inline-block; padding: 12px 24px; background: #0A3A40; color: white; text-decoration: none; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🔔 New Booking Alert</h1>
        </div>

        <div class="content">
          <div class="alert-box">
            <strong>Action Required:</strong> A new booking has been created and requires your attention.
          </div>

          <h3>Booking Details</h3>
          <div class="info-grid">
            <div class="info-item">
              <strong>Booking ID</strong>
              ${bookingId}
            </div>
            <div class="info-item">
              <strong>Guest Name</strong>
              ${guestName}
            </div>
            <div class="info-item">
              <strong>Email</strong>
              ${email}
            </div>
            <div class="info-item">
              <strong>Phone</strong>
              ${phone}
            </div>
            <div class="info-item">
              <strong>Room</strong>
              ${roomName}
            </div>
            <div class="info-item">
              <strong>Check-in</strong>
              ${formatDate(checkIn)}
            </div>
            <div class="info-item">
              <strong>Check-out</strong>
              ${formatDate(checkOut)}
            </div>
            <div class="info-item">
              <strong>Guests</strong>
              ${adults} Adults, ${children} Children
            </div>
            <div class="info-item" style="grid-column: 1 / -1;">
              <strong>Total Amount</strong>
              <span style="font-size: 20px; color: #D4A574;">₦${totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <center>
            <a href="https://eyahshotel.com/admin/bookings" class="button">View in Admin Panel</a>
          </center>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateContactFormEmail(data: any): string {
  const { name, email, phone, subject, message } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: #0A3A40; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .info-box { background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 10px 0; }
        .message-box { background: #e8f4f8; border-left: 4px solid #0A3A40; padding: 20px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📨 New Contact Form Submission</h1>
        </div>

        <div class="content">
          <h3>Contact Information</h3>
          <div class="info-box">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>

          <h3>Message</h3>
          <div class="message-box">
            ${message}
          </div>

          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Reply to this inquiry at: <a href="mailto:${email}">${email}</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateContactFormReplyEmail(data: any): string {
  const { recipientName, originalSubject, originalMessage, replyMessage } = data

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reply from Eyah's Hotel & Suites</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0A3A40 0%, #D4A574 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { font-size: 26px; margin-bottom: 10px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #0A3A40; margin-bottom: 20px; font-weight: 600; }
        .reply-box { background: #f8f9fa; border-left: 4px solid #D4A574; padding: 20px; border-radius: 6px; margin: 25px 0; }
        .reply-box h3 { color: #0A3A40; margin-bottom: 15px; font-size: 16px; }
        .original-message { background: #e8f4f8; border-left: 4px solid #0A3A40; padding: 20px; border-radius: 6px; margin: 25px 0; }
        .original-message h4 { color: #0A3A40; margin-bottom: 10px; font-size: 14px; }
        .original-message p { color: #555; font-size: 14px; }
        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 25px 0; }
        .contact-info p { margin: 8px 0; color: #555; }
        .contact-info strong { color: #0A3A40; }
        .footer { background: #0A3A40; color: white; padding: 25px; text-align: center; font-size: 14px; }
        .footer p { margin: 5px 0; opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🏨 Eyah's Hotel & Suites</h1>
          <p>Thank you for contacting us</p>
        </div>

        <div class="content">
          <div class="greeting">Dear ${recipientName},</div>
          
          <p style="margin-bottom: 20px; color: #555;">
            Thank you for reaching out to Eyah's Hotel & Suites. We appreciate your inquiry and are happy to assist you.
          </p>

          <div class="reply-box">
            <h3>Our Response:</h3>
            <p style="color: #333; white-space: pre-wrap;">${replyMessage}</p>
          </div>

          <div class="original-message">
            <h4>Your Original Message:</h4>
            <p><strong>Subject:</strong> ${originalSubject}</p>
            <p style="margin-top: 10px; white-space: pre-wrap;">${originalMessage}</p>
          </div>

          <p style="margin-top: 25px; color: #555;">
            If you have any additional questions or need further assistance, please don't hesitate to contact us.
          </p>

          <div class="contact-info">
            <p><strong>📞 Phone:</strong> +234 912 855 5191, +234 816 333 2977</p>
            <p><strong>📧 Email:</strong> info@eyahshotel.com</p>
            <p><strong>📍 Address:</strong> 10 Keffi Road, Makurdi, Benue State, Nigeria</p>
          </div>

          <p style="margin-top: 30px; color: #555;">
            Warm regards,<br>
            <strong style="color: #0A3A40;">The Eyah's Hotel & Suites Team</strong>
          </p>
        </div>

        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Eyah's Hotel & Suites. All rights reserved.</p>
          <p>10 Keffi Road, Makurdi, 970101, Benue State, Nigeria</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}
