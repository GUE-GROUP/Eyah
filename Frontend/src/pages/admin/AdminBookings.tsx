import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X,
  ArrowLeft,
  Download,
  Loader2
} from 'lucide-react';
import { getBookings, updateBookingStatus } from '../../lib/supabase';
import { useToast } from '../../components/ToastContainer';
import type { Booking } from '../../types';

const AdminBookings: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadBookings();
  }, [navigate]);

  const loadBookings = async () => {
    console.group('📋 Admin Bookings - Loading');
    setLoading(true);
    try {
      console.log('Fetching bookings from database...');
      const data = await getBookings();
      
      console.log('✅ Bookings loaded:', data?.length || 0);
      
      // Transform data to match Booking interface
      const transformedBookings: Booking[] = (data || []).map((booking: any) => {
        console.log('Booking data:', booking); // Debug log
        return {
          id: booking.id,
          firstName: booking.first_name,
          lastName: booking.last_name,
          email: booking.email,
          phone: booking.phone,
          roomId: booking.room_id,
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          adults: booking.adults,
          children: booking.children,
          rooms: booking.rooms, // This is now the number field (not overwritten)
          specialRequests: booking.special_requests || '',
          status: booking.status,
          totalAmount: booking.total_amount,
          createdAt: booking.created_at,
          roomName: booking.room?.name || 'Unknown Room', // Extract room name from joined data
          roomPrice: booking.room?.price || 0 // Extract room price from joined data
        };
      });
      
      setBookings(transformedBookings);
      setFilteredBookings(transformedBookings);
      console.groupEnd();
    } catch (error: any) {
      console.error('❌ Error loading bookings:', error);
      toast.error('Failed to load bookings');
      console.groupEnd();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm)
      );
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    setUpdating(bookingId);
    console.log(`Updating booking ${bookingId} to ${newStatus}`);
    
    try {
      await updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      );
      
      toast.success(`Booking ${newStatus} successfully!`);
      console.log('✅ Booking status updated');
    } catch (error: any) {
      console.error('❌ Error updating booking:', error);
      toast.error('Failed to update booking status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-dark">Bookings Management</h1>
                <p className="text-sm text-gray-600">View and manage all bookings</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors duration-200">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent appearance-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Guest</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dates</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-dark">{booking.firstName} {booking.lastName}</p>
                        <p className="text-sm text-gray-500">ID: {booking.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-700">{booking.email}</p>
                        <p className="text-sm text-gray-500">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-700">In: {booking.checkIn}</p>
                        <p className="text-sm text-gray-500">Out: {booking.checkOut}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-700">{booking.adults} Adults, {booking.children} Children</p>
                        <p className="text-gray-500">{booking.rooms} Room(s)</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-dark">₦{booking.totalAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                          title="View Details"
                        >
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              disabled={updating === booking.id}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Confirm"
                            >
                              {updating === booking.id ? (
                                <Loader2 size={18} className="text-green-600 animate-spin" />
                              ) : (
                                <Check size={18} className="text-green-600" />
                              )}
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              disabled={updating === booking.id}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Cancel"
                            >
                              <X size={18} className="text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBookings.length === 0 && !loading && (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No bookings found</p>
              </div>
            )}
          </div>
          )}
        </div>
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-dark mb-6">Booking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Guest Name</p>
                <p className="font-semibold">{selectedBooking.firstName} {selectedBooking.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selectedBooking.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{selectedBooking.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-in</p>
                <p className="font-semibold">{selectedBooking.checkIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out</p>
                <p className="font-semibold">{selectedBooking.checkOut}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Guests</p>
                <p className="font-semibold">{selectedBooking.adults} Adults, {selectedBooking.children} Children</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rooms</p>
                <p className="font-semibold">{selectedBooking.rooms}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Special Requests</p>
                <p className="font-semibold">{selectedBooking.specialRequests || 'None'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-accent">₦{selectedBooking.totalAmount.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-dark font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
