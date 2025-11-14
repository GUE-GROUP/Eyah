// Eyah's Hotel & Suites - Send Booking Status Update Email
// Triggered when admin updates booking status

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StatusUpdateRequest {
  bookingId: string;
  newStatus: 'confirmed' | 'cancelled' | 'completed';
  reason?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const requestData: StatusUpdateRequest = await req.json()

    // Validate required fields
    if (!requestData.bookingId || !requestData.newStatus) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: bookingId, newStatus' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('📧 Sending status update email for booking:', requestData.bookingId)

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('*, room:rooms(name)')
      .eq('id', requestData.bookingId)
      .single()

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('📧 Booking details:', {
      id: booking.id,
      status: requestData.newStatus,
      verificationCode: booking.verification_code
    })

    // Send status update email
    const emailResponse = await supabaseClient.functions.invoke('send-email-resend', {
      body: {
        type: 'booking_status_update',
        to: booking.email,
        data: {
          bookingId: booking.id,
          guestName: `${booking.first_name} ${booking.last_name}`,
          status: requestData.newStatus,
          roomName: booking.room.name,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          reason: requestData.reason || '',
          verificationCode: booking.verification_code || null
        }
      }
    })

    if (emailResponse.error) {
      console.error('❌ Failed to send email:', emailResponse.error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailResponse.error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Status update email sent successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Status update email sent successfully' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
