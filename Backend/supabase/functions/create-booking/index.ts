// Eyah's Hotel & Suites - Create Booking Edge Function
// Creates a new booking and sends confirmation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingRequest {
  roomId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  specialRequests?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const bookingData: BookingRequest = await req.json()

    // Validate required fields
    const requiredFields = ['roomId', 'firstName', 'lastName', 'email', 'phone', 'checkIn', 'checkOut', 'adults', 'rooms']
    for (const field of requiredFields) {
      if (!bookingData[field as keyof BookingRequest]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(bookingData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check room availability first
    const { data: room, error: roomError } = await supabaseClient
      .from('rooms')
      .select('*')
      .eq('id', bookingData.roomId)
      .single()

    if (roomError || !room) {
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for conflicts
    const { data: conflicts } = await supabaseClient
      .from('bookings')
      .select('id')
      .eq('room_id', bookingData.roomId)
      .neq('status', 'cancelled')
      .or(`and(check_in.lte.${bookingData.checkIn},check_out.gt.${bookingData.checkIn}),and(check_in.lt.${bookingData.checkOut},check_out.gte.${bookingData.checkOut}),and(check_in.gte.${bookingData.checkIn},check_out.lte.${bookingData.checkOut})`)

    if (conflicts && conflicts.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Room is not available for the selected dates' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate total amount
    const checkInDate = new Date(bookingData.checkIn)
    const checkOutDate = new Date(bookingData.checkOut)
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalAmount = room.price * nights * bookingData.rooms

    // Get user ID if authenticated
    const { data: { user } } = await supabaseClient.auth.getUser()

    // Create booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        room_id: bookingData.roomId,
        user_id: user?.id || null,
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children || 0,
        rooms: bookingData.rooms,
        special_requests: bookingData.specialRequests || '',
        status: 'pending',
        total_amount: totalAmount,
        payment_status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking error:', bookingError)
      return new Response(
        JSON.stringify({ error: 'Failed to create booking', details: bookingError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send confirmation email to guest
    try {
      await supabaseClient.functions.invoke('send-email-resend', {
        body: {
          type: 'booking_confirmation',
          to: bookingData.email,
          data: {
            bookingId: booking.id,
            guestName: `${bookingData.firstName} ${bookingData.lastName}`,
            roomName: room.name,
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            totalAmount: booking.total_amount,
            adults: booking.adults,
            children: booking.children,
            rooms: booking.rooms
          }
        }
      })
      console.log('✅ Confirmation email sent to guest')
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email:', emailError)
      // Don't fail the booking if email fails
    }

    // Send notification email to admin
    try {
      await supabaseClient.functions.invoke('send-email-resend', {
        body: {
          type: 'admin_notification',
          to: 'admin@eyahshotel.com', // Change to your admin email
          data: {
            bookingId: booking.id,
            guestName: `${bookingData.firstName} ${bookingData.lastName}`,
            email: bookingData.email,
            phone: bookingData.phone,
            roomName: room.name,
            checkIn: booking.check_in,
            checkOut: booking.check_out,
            totalAmount: booking.total_amount,
            adults: booking.adults,
            children: booking.children
          }
        }
      })
      console.log('✅ Admin notification email sent')
    } catch (emailError) {
      console.error('⚠️ Failed to send admin notification:', emailError)
      // Don't fail the booking if email fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking: {
          id: booking.id,
          roomName: room.name,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          totalAmount: booking.total_amount,
          status: booking.status
        },
        message: 'Booking created successfully. You will receive a confirmation email shortly.'
      }),
      { 
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
