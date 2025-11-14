import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  BedDouble,
  MessageSquare,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RecentActivity {
  id: string;
  type: 'booking' | 'message' | 'checkin';
  message: string;
  time: string;
  timestamp: string;
  relatedId: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    availableRooms: 0,
    unreadMessages: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadStats();
    loadRecentActivities();
  }, [navigate]);

  const loadStats = async () => {
    console.group('📊 Admin Dashboard - Loading Stats');
    try {
      // Get total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get pending bookings
      const { count: pendingBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get total revenue (sum of confirmed bookings)
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('total_amount')
        .in('status', ['confirmed', 'completed']);
      
      const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;

      // Get available rooms
      const { count: availableRooms } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true })
        .eq('is_available', true);

      // Get unread messages
      const { count: unreadMessages } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      // Calculate occupancy rate (simplified)
      const { count: totalRooms } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true });
      
      const occupancyRate = totalRooms ? Math.round(((totalRooms - (availableRooms || 0)) / totalRooms) * 100) : 0;

      console.log('✅ Stats loaded:', {
        totalBookings,
        pendingBookings,
        totalRevenue,
        availableRooms,
        unreadMessages,
        occupancyRate
      });

      setStats({
        totalBookings: totalBookings || 0,
        pendingBookings: pendingBookings || 0,
        totalRevenue: totalRevenue,
        occupancyRate: occupancyRate,
        availableRooms: availableRooms || 0,
        unreadMessages: unreadMessages || 0
      });
      console.groupEnd();
    } catch (error: any) {
      console.error('❌ Error loading stats:', error);
      console.groupEnd();
      // Keep default values on error
    }
  };

  const loadRecentActivities = async () => {
    console.group('📋 Loading Recent Activities');
    try {
      const activities: RecentActivity[] = [];

      // Get recent bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, first_name, last_name, status, created_at, checked_in_at, rooms:room_id(name)')
        .order('created_at', { ascending: false })
        .limit(5);

      bookings?.forEach((booking: any) => {
        // Check-in activity
        if (booking.checked_in_at) {
          activities.push({
            id: `checkin-${booking.id}`,
            type: 'checkin',
            message: `${booking.first_name} ${booking.last_name} checked in - ${booking.rooms?.name || 'Room'}`,
            time: getRelativeTime(booking.checked_in_at),
            timestamp: booking.checked_in_at,
            relatedId: booking.id
          });
        }
        
        // Booking activity
        activities.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          message: `${booking.status === 'confirmed' ? 'Booking confirmed' : 'New booking'} - ${booking.first_name} ${booking.last_name} - ${booking.rooms?.name || 'Room'}`,
          time: getRelativeTime(booking.created_at),
          timestamp: booking.created_at,
          relatedId: booking.id
        });
      });

      // Get recent messages
      const { data: messages } = await supabase
        .from('contact_messages')
        .select('id, name, subject, created_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(5);

      messages?.forEach((message: any) => {
        activities.push({
          id: `message-${message.id}`,
          type: 'message',
          message: `New inquiry from ${message.name} - ${message.subject}`,
          time: getRelativeTime(message.created_at),
          timestamp: message.created_at,
          relatedId: message.id
        });
      });

      // Sort by timestamp (most recent first) and take top 10
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      console.log('✅ Activities loaded:', sortedActivities.length);
      setRecentActivities(sortedActivities);
      console.groupEnd();
    } catch (error: any) {
      console.error('❌ Error loading activities:', error);
      console.groupEnd();
    }
  };

  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return then.toLocaleDateString();
  };

  const handleActivityClick = (activity: RecentActivity) => {
    if (activity.type === 'booking' || activity.type === 'checkin') {
      navigate('/admin/bookings');
    } else if (activity.type === 'message') {
      navigate('/admin/messages');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <TrendingUp className="text-green-500" size={20} />
      </div>
      <h3 className="text-2xl font-bold text-dark mb-1">{value}</h3>
      <p className="text-gray-600 font-semibold">{title}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LayoutDashboard className="text-accent" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-dark">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Eyah's Hotel & Suites Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total Bookings"
            value={stats.totalBookings}
            subtitle="All time bookings"
            color="bg-blue-500"
          />
          <StatCard
            icon={Users}
            title="Pending Bookings"
            value={stats.pendingBookings}
            subtitle="Awaiting confirmation"
            color="bg-yellow-500"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`₦${stats.totalRevenue.toLocaleString()}`}
            subtitle="This month"
            color="bg-green-500"
          />
          <StatCard
            icon={BedDouble}
            title="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            subtitle="Current occupancy"
            color="bg-purple-500"
          />
          <StatCard
            icon={BedDouble}
            title="Available Rooms"
            value={stats.availableRooms}
            subtitle="Ready for booking"
            color="bg-teal-500"
          />
          <StatCard
            icon={MessageSquare}
            title="Unread Messages"
            value={stats.unreadMessages}
            subtitle="Customer inquiries"
            color="bg-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-dark mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/checkin')}
              className="p-4 border-2 border-green-200 bg-green-50 rounded-lg hover:border-green-500 hover:bg-green-100 transition-all duration-200 text-left"
            >
              <CheckCircle className="text-green-600 mb-2" size={24} />
              <h3 className="font-semibold text-dark">Guest Check-In</h3>
              <p className="text-sm text-gray-600">Verify and check in guests</p>
            </button>

            <button
              onClick={() => navigate('/admin/bookings')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left"
            >
              <Calendar className="text-accent mb-2" size={24} />
              <h3 className="font-semibold text-dark">Manage Bookings</h3>
              <p className="text-sm text-gray-600">View and manage all bookings</p>
            </button>
            
            <button
              onClick={() => navigate('/admin/rooms')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left"
            >
              <BedDouble className="text-accent mb-2" size={24} />
              <h3 className="font-semibold text-dark">Manage Rooms</h3>
              <p className="text-sm text-gray-600">Update room availability</p>
            </button>
            
            <button
              onClick={() => navigate('/admin/messages')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left"
            >
              <MessageSquare className="text-accent mb-2" size={24} />
              <h3 className="font-semibold text-dark">Messages</h3>
              <p className="text-sm text-gray-600">Respond to inquiries</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activities</p>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => handleActivityClick(activity)}
                  className="w-full flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-accent transition-all duration-200 text-left"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'booking' ? 'bg-blue-100' :
                    activity.type === 'message' ? 'bg-orange-100' :
                    'bg-green-100'
                  }`}>
                    {activity.type === 'booking' && <Calendar size={20} className="text-blue-600" />}
                    {activity.type === 'message' && <MessageSquare size={20} className="text-orange-600" />}
                    {activity.type === 'checkin' && <CheckCircle size={20} className="text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-dark font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
