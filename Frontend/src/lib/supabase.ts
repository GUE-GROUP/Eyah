// Eyah's Hotel & Suites - Supabase Client Configuration

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Enhanced logging for debugging
console.group('🔧 Supabase Configuration');
console.log('Environment:', import.meta.env.MODE);
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
if (supabaseUrl) {
  console.log('Supabase URL:', supabaseUrl);
}
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
} else {
  console.log('✅ Supabase client ready');
}
console.groupEnd();

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Database types (auto-generated from Supabase)
export type Database = {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          features: any;
          capacity: number;
          is_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['rooms']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>;
      };
      bookings: {
        Row: {
          id: string;
          room_id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          check_in: string;
          check_out: string;
          adults: number;
          children: number;
          rooms: number;
          special_requests: string | null;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          total_amount: number;
          payment_status: 'pending' | 'paid' | 'refunded';
          payment_reference: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          status: 'unread' | 'read' | 'responded';
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>;
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'staff';
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admin_users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['admin_users']['Insert']>;
      };
    };
  };
};

// Helper functions for common operations

/**
 * Check if a room is available for the given dates
 */
export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
  rooms: number = 1
) {
  try {
    // Try Edge Function first
    const { data, error } = await supabase.functions.invoke('check-availability', {
      body: { roomId, checkIn, checkOut, rooms }
    });

    if (error) {
      console.warn('Edge Function not available, using direct database query');
      // Fallback to direct database query
      return await checkAvailabilityDirect(roomId, checkIn, checkOut, rooms);
    }
    return data;
  } catch (error) {
    console.error('Error checking availability:', error);
    // Fallback to direct database query
    return await checkAvailabilityDirect(roomId, checkIn, checkOut, rooms);
  }
}

/**
 * Direct database availability check (fallback)
 */
async function checkAvailabilityDirect(
  roomId: string,
  checkIn: string,
  checkOut: string,
  rooms: number = 1
) {
  // Get room details
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  if (roomError || !room) {
    throw new Error('Room not found');
  }

  if (!room.is_available) {
    return {
      available: false,
      message: 'Room is currently unavailable'
    };
  }

  // Check for conflicting bookings
  const { data: conflicts, error: conflictError } = await supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .neq('status', 'cancelled')
    .or(`and(check_in.lte.${checkIn},check_out.gt.${checkIn}),and(check_in.lt.${checkOut},check_out.gte.${checkOut}),and(check_in.gte.${checkIn},check_out.lte.${checkOut})`);

  if (conflictError) {
    throw new Error('Error checking availability');
  }

  const isAvailable = conflicts.length === 0;

  // Calculate pricing
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = room.price * nights * rooms;

  return {
    available: isAvailable,
    roomName: room.name,
    pricePerNight: room.price,
    nights: nights,
    totalPrice: totalPrice,
    message: isAvailable 
      ? 'Room is available for your selected dates' 
      : 'Room is not available for the selected dates'
  };
}

/**
 * Create a new booking
 */
export async function createBooking(bookingData: any) {
  try {
    // Try Edge Function first
    const { data, error } = await supabase.functions.invoke('create-booking', {
      body: bookingData
    });

    if (error) {
      console.warn('Edge Function not available, using direct database insert');
      // Fallback to direct database insert
      return await createBookingDirect(bookingData);
    }
    return data;
  } catch (error) {
    console.error('Error creating booking via Edge Function:', error);
    // Fallback to direct database insert
    return await createBookingDirect(bookingData);
  }
}

/**
 * Direct database booking creation (fallback)
 */
async function createBookingDirect(bookingData: any) {
  // Validate required fields
  const requiredFields = ['roomId', 'firstName', 'lastName', 'email', 'phone', 'checkIn', 'checkOut', 'adults', 'rooms'];
  for (const field of requiredFields) {
    if (!bookingData[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Get room details for pricing
  const { data: room, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', bookingData.roomId)
    .single();

  if (roomError || !room) {
    throw new Error('Room not found');
  }

  // Calculate total amount
  const checkInDate = new Date(bookingData.checkIn);
  const checkOutDate = new Date(bookingData.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = room.price * nights * bookingData.rooms;

  // Get current user if authenticated
  const { data: { user } } = await supabase.auth.getUser();

  // Create booking
  const { data: booking, error: bookingError } = await supabase
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
    .single();

  if (bookingError) {
    console.error('Booking error:', bookingError);
    throw new Error('Failed to create booking: ' + bookingError.message);
  }

  return {
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
  };
}

/**
 * Get all rooms
 */
export async function getRooms() {
  console.group('📦 getRooms() - Fetching rooms from database');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  
  try {
    console.log('🔄 Executing query: SELECT * FROM rooms WHERE is_available = true ORDER BY price ASC');
    
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_available', true)
      .order('price', { ascending: true });

    if (error) {
      console.error('❌ Database Error Details:');
      console.error('  Code:', error.code);
      console.error('  Message:', error.message);
      console.error('  Details:', error.details);
      console.error('  Hint:', error.hint);
      console.error('  Full Error:', error);
      
      // If table doesn't exist, provide helpful error message
      if (error.message.includes('relation "public.rooms" does not exist')) {
        console.error('💡 Solution: Database tables not created. Run migrations in Supabase SQL Editor.');
        console.error('   File: Backend/supabase/migrations/20251113000001_initial_schema.sql');
        console.groupEnd();
        throw new Error('Database not set up. Please deploy the database schema first. See Backend/SETUP_GUIDE.md');
      }
      
      console.groupEnd();
      throw error;
    }
    
    console.log('✅ Query successful!');
    console.log('  Rooms fetched:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('  First room:', data[0].name);
      console.log('  Room IDs:', data.map(r => r.id));
    } else {
      console.warn('⚠️  No rooms found in database. Run seed.sql to add rooms.');
    }
    console.groupEnd();
    
    return data;
  } catch (error: any) {
    console.error('❌ Unexpected error in getRooms():', error);
    console.groupEnd();
    throw error;
  }
}

/**
 * Get a single room by ID
 */
export async function getRoom(roomId: string) {
  console.group('🏨 getRoom() - Fetching single room');
  console.log('Room ID:', roomId);
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    console.log('🔄 Executing query: SELECT * FROM rooms WHERE id =', roomId);
    
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      console.error('❌ Database Error Details:');
      console.error('  Code:', error.code);
      console.error('  Message:', error.message);
      console.error('  Details:', error.details);
      console.error('  Full Error:', error);
      
      // If table doesn't exist, provide helpful error message
      if (error.message.includes('relation "public.rooms" does not exist')) {
        console.error('💡 Solution: Database tables not created.');
        console.groupEnd();
        throw new Error('Database not set up. Please deploy the database schema first.');
      }
      if (error.code === 'PGRST116') {
        console.error('💡 Room with ID', roomId, 'not found in database');
        console.groupEnd();
        throw new Error('Room not found');
      }
      console.groupEnd();
      throw error;
    }
    
    console.log('✅ Room fetched successfully!');
    console.log('  Room name:', data.name);
    console.log('  Room price:', data.price);
    console.log('  Available:', data.is_available);
    console.groupEnd();
    
    return data;
  } catch (error: any) {
    console.error('❌ Unexpected error in getRoom():', error);
    console.groupEnd();
    throw error;
  }
}

/**
 * Get room with availability status
 */
export async function getRoomWithAvailability(roomId: string, checkIn?: string, checkOut?: string) {
  try {
    const room = await getRoom(roomId);
    
    // If dates provided, check availability
    if (checkIn && checkOut) {
      const availability = await checkRoomAvailability(roomId, checkIn, checkOut, 1);
      return {
        ...room,
        availability
      };
    }
    
    return room;
  } catch (error) {
    console.error('Error fetching room with availability:', error);
    throw error;
  }
}

/**
 * Submit a contact message
 */
export async function submitContactMessage(messageData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(messageData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Get all bookings
 */
export async function getBookings(status?: string) {
  let query = supabase
    .from('bookings')
    .select('*, room:rooms(name, price)')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/**
 * Admin: Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
  reason?: string
) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;

  // Send status update email (don't fail if email fails)
  if (status !== 'pending') {
    try {
      await supabase.functions.invoke('send-status-update', {
        body: {
          bookingId,
          newStatus: status,
          reason
        }
      });
      console.log('✅ Status update email sent');
    } catch (emailError) {
      console.error('⚠️ Failed to send status update email:', emailError);
      // Don't throw error, just log it
    }
  }

  return data;
}

/**
 * Admin: Get all contact messages (excluding deleted)
 */
export async function getContactMessages(status?: string) {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  // Filter out deleted messages if deleted_at column exists
  return data?.filter(msg => !msg.deleted_at) || data;
}

/**
 * Admin: Update message status
 */
export async function updateMessageStatus(
  messageId: string,
  status: 'unread' | 'read' | 'responded'
) {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Move message to trash (soft delete)
 */
export async function moveMessageToTrash(messageId: string) {
  // Check if deleted_at column exists by trying to update
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', messageId)
    .select()
    .single();

  // If column doesn't exist, just delete the message directly
  if (error && error.message.includes('column')) {
    const { error: deleteError } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', messageId);
    
    if (deleteError) throw deleteError;
    return { id: messageId };
  }

  if (error) throw error;
  return data;
}

/**
 * Admin: Restore message from trash
 */
export async function restoreMessageFromTrash(messageId: string) {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ deleted_at: null })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Get trashed messages
 */
export async function getTrashedMessages() {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) {
      // If column doesn't exist, return empty array
      if (error.message.includes('column')) {
        return [];
      }
      throw error;
    }
    return data;
  } catch (error: any) {
    // Return empty array if there's any error
    console.warn('Trash feature not available yet. Run migration to enable.');
    return [];
  }
}

/**
 * Admin: Permanently delete message
 */
export async function permanentlyDeleteMessage(messageId: string) {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', messageId);

  if (error) throw error;
}

/**
 * Admin: Toggle room availability
 */
export async function toggleRoomAvailability(roomId: string, isAvailable: boolean) {
  const { data, error } = await supabase
    .from('rooms')
    .update({ is_available: isAvailable })
    .eq('id', roomId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Admin: Sign in
 */
export async function adminSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  // Check if user is admin
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', data.user.id)
    .eq('is_active', true)
    .single();

  if (adminError || !adminUser) {
    await supabase.auth.signOut();
    throw new Error('Unauthorized: Not an admin user');
  }

  return { user: data.user, adminUser };
}

/**
 * Admin: Sign out
 */
export async function adminSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Subscribe to real-time changes
 */
export function subscribeToBookings(callback: (payload: any) => void) {
  return supabase
    .channel('bookings')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'bookings' },
      callback
    )
    .subscribe();
}

export function subscribeToMessages(callback: (payload: any) => void) {
  return supabase
    .channel('messages')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'contact_messages' },
      callback
    )
    .subscribe();
}
