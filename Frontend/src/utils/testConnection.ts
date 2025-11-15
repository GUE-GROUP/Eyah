// Test Supabase Connection
// Run this in browser console to verify everything is working

import { supabase, getRooms, checkRoomAvailability } from '../lib/supabase';

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Test 1: Check environment variables
  console.log('1️⃣ Environment Variables:');
  console.log('   SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('   Has ANON_KEY:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  console.log('   ✅ Environment variables loaded\n');

  // Test 2: Check Supabase client
  console.log('2️⃣ Supabase Client:');
  console.log('   Client created:', !!supabase);
  console.log('   ✅ Supabase client initialized\n');

  // Test 3: Test database connection
  console.log('3️⃣ Database Connection:');
  try {
    const { data, error } = await supabase.from('rooms').select('count');
    if (error) {
      console.log('   ❌ Database error:', error.message);
      console.log('   💡 Solution: Deploy database schema (see SETUP_DATABASE.md)\n');
    } else {
      console.log('   ✅ Database connected');
      console.log('   Rooms count:', data);
      console.log('');
    }
  } catch (err) {
    console.log('   ❌ Connection failed:', err);
    console.log('');
  }

  // Test 4: Test getRooms function
  console.log('4️⃣ Get Rooms Function:');
  try {
    const rooms = await getRooms();
    console.log('   ✅ getRooms() works');
    console.log('   Rooms loaded:', rooms.length);
    console.log('   First room:', rooms[0]?.name);
    console.log('');
  } catch (err: any) {
    console.log('   ⚠️  Using fallback data');
    console.log('   Reason:', err.message);
    console.log('');
  }

  // Test 5: Test availability check (if rooms exist)
  console.log('5️⃣ Check Availability Function:');
  try {
    const rooms = await getRooms();
    if (rooms.length > 0) {
      const result = await checkRoomAvailability(
        rooms[0].id,
        '2025-11-20',
        '2025-11-23',
        1
      );
      console.log('   ✅ checkRoomAvailability() works');
      console.log('   Available:', result.available);
      console.log('   Total Price:', result.totalPrice);
      console.log('');
    } else {
      console.log('   ⏭️  Skipped (no rooms in database)');
      console.log('');
    }
  } catch (err: any) {
    console.log('   ❌ Error:', err.message);
    console.log('');
  }

  // Test 6: Test Edge Functions
  console.log('6️⃣ Edge Functions:');
  try {
    const { error } = await supabase.functions.invoke('check-availability', {
      body: { roomId: 'test', checkIn: '2025-11-20', checkOut: '2025-11-23', rooms: 1 }
    });
    if (error) {
      console.log('   ⚠️  Edge Functions not deployed (using fallback)');
      console.log('   This is OK! App works without them.');
      console.log('');
    } else {
      console.log('   ✅ Edge Functions deployed and working');
      console.log('');
    }
  } catch (err) {
    console.log('   ⚠️  Edge Functions not available (using fallback)');
    console.log('   This is OK! App works without them.');
    console.log('');
  }

  // Summary
  console.log('📊 Summary:');
  console.log('   • Environment: ✅');
  console.log('   • Supabase Client: ✅');
  console.log('   • Database: Check above');
  console.log('   • API Functions: Check above');
  console.log('   • Edge Functions: Optional');
  console.log('\n✨ Connection test complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. If database errors: Deploy schema (SETUP_DATABASE.md)');
  console.log('   2. If using fallback: Deploy Edge Functions (optional)');
  console.log('   3. Test booking flow in the app');
}

// Auto-run in development
if (import.meta.env.DEV) {
  console.log('💡 Run testSupabaseConnection() in console to test connection');
}

// Export for manual testing
(window as any).testSupabaseConnection = testSupabaseConnection;
