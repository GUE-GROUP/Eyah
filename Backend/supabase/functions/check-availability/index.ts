// Eyah's Hotel & Suites - Check Availability Edge Function
// Checks if a room is available for the requested dates

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AvailabilityRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  rooms?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse request body
    const { roomId, checkIn, checkOut, rooms = 1 }: AvailabilityRequest = await req.json()

    // Validate inputs
    if (!roomId || !checkIn || !checkOut) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: roomId, checkIn, checkOut' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate dates
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      return new Response(
        JSON.stringify({ error: 'Check-in date cannot be in the past' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (checkOutDate <= checkInDate) {
      return new Response(
        JSON.stringify({ error: 'Check-out date must be after check-in date' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get room details
    const { data: room, error: roomError } = await supabaseClient
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !room) {
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!room.is_available) {
      return new Response(
        JSON.stringify({ 
          available: false,
          message: 'Room is currently unavailable'
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check for conflicting bookings
    const { data: conflicts, error: conflictError } = await supabaseClient
      .from('bookings')
      .select('id')
      .eq('room_id', roomId)
      .neq('status', 'cancelled')
      .or(`and(check_in.lte.${checkIn},check_out.gt.${checkIn}),and(check_in.lt.${checkOut},check_out.gte.${checkOut}),and(check_in.gte.${checkIn},check_out.lte.${checkOut})`)

    if (conflictError) {
      console.error('Error checking conflicts:', conflictError)
      return new Response(
        JSON.stringify({ error: 'Error checking availability' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const isAvailable = conflicts.length === 0

    // Calculate pricing
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = room.price * nights * rooms

    return new Response(
      JSON.stringify({
        available: isAvailable,
        roomName: room.name,
        pricePerNight: room.price,
        nights: nights,
        totalPrice: totalPrice,
        message: isAvailable 
          ? 'Room is available for your selected dates' 
          : 'Room is not available for the selected dates'
      }),
      { 
        status: 200,
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
