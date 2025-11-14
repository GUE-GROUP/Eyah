import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { verificationCode, adminUserId } = await req.json();

    console.log('🔍 Verifying check-in code:', verificationCode);

    // Validate input
    if (!verificationCode || typeof verificationCode !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'INVALID_INPUT',
          message: 'Please enter a valid verification code'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if code format is correct (8 characters)
    if (verificationCode.length !== 8) {
      return new Response(
        JSON.stringify({
          error: 'INVALID_CODE_FORMAT',
          message: 'Verification code must be 8 characters long'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Find booking with this verification code
    const { data: booking, error: fetchError } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        rooms:room_id (
          name,
          price
        )
      `)
      .eq('verification_code', verificationCode.toUpperCase())
      .single();

    if (fetchError || !booking) {
      console.error('❌ Booking not found:', fetchError);
      return new Response(
        JSON.stringify({
          error: 'CODE_NOT_FOUND',
          message: 'Invalid verification code. Please check the code and try again.'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if booking is confirmed
    if (booking.status !== 'confirmed') {
      let statusMessage = '';
      switch (booking.status) {
        case 'pending':
          statusMessage = 'This booking is still pending confirmation. Please wait for confirmation email.';
          break;
        case 'cancelled':
          statusMessage = 'This booking has been cancelled and cannot be checked in.';
          break;
        case 'completed':
          statusMessage = 'This booking has already been completed.';
          break;
        default:
          statusMessage = `This booking cannot be checked in. Status: ${booking.status}`;
      }

      return new Response(
        JSON.stringify({
          error: 'INVALID_STATUS',
          message: statusMessage
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if already checked in
    if (booking.checked_in_at) {
      const checkedInDate = new Date(booking.checked_in_at).toLocaleString();
      return new Response(
        JSON.stringify({
          error: 'ALREADY_CHECKED_IN',
          message: `This guest has already been checked in on ${checkedInDate}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if check-in date is today or in the past
    const checkInDate = new Date(booking.check_in);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkInDate.setHours(0, 0, 0, 0);

    if (checkInDate > today) {
      const formattedDate = new Date(booking.check_in).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      return new Response(
        JSON.stringify({
          error: 'EARLY_CHECKIN',
          message: `Check-in date is ${formattedDate}. Early check-in not allowed.`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Update booking with check-in timestamp
    const { data: updatedBooking, error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        checked_in_at: new Date().toISOString(),
        checked_in_by: adminUserId,
        updated_at: new Date().toISOString()
      })
      .eq('id', booking.id)
      .select(`
        *,
        rooms:room_id (
          name,
          price
        )
      `)
      .single();

    if (updateError) {
      console.error('❌ Error updating booking:', updateError);
      return new Response(
        JSON.stringify({
          error: 'UPDATE_FAILED',
          message: 'Failed to complete check-in. Please try again.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('✅ Check-in successful for booking:', updatedBooking.id);

    // Return guest details
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Guest checked in successfully',
        booking: {
          id: updatedBooking.id,
          guestName: `${updatedBooking.first_name} ${updatedBooking.last_name}`,
          email: updatedBooking.email,
          phone: updatedBooking.phone,
          roomName: updatedBooking.rooms?.name || 'N/A',
          roomPrice: updatedBooking.rooms?.price || 0,
          checkIn: updatedBooking.check_in,
          checkOut: updatedBooking.check_out,
          adults: updatedBooking.adults,
          children: updatedBooking.children,
          rooms: updatedBooking.rooms_count || 1,
          totalAmount: updatedBooking.total_amount,
          specialRequests: updatedBooking.special_requests || '',
          checkedInAt: updatedBooking.checked_in_at,
          verificationCode: updatedBooking.verification_code
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({
        error: 'SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again or contact support.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
