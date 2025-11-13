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
  LogOut
} from 'lucide-react';

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

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Simulate fetching stats - will be replaced with Supabase
    setStats({
      totalBookings: 156,
      pendingBookings: 12,
      totalRevenue: 8450000,
      occupancyRate: 78,
      availableRooms: 15,
      unreadMessages: 8
    });
  }, [navigate]);

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
            
            <button
              onClick={() => navigate('/')}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200 text-left"
            >
              <LayoutDashboard className="text-accent mb-2" size={24} />
              <h3 className="font-semibold text-dark">View Website</h3>
              <p className="text-sm text-gray-600">Go to public site</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-dark mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { type: 'booking', message: 'New booking from John Doe - Presidential Suite', time: '5 minutes ago' },
              { type: 'message', message: 'New inquiry about Banquet Hall availability', time: '15 minutes ago' },
              { type: 'booking', message: 'Booking confirmed - COMFY DELUX', time: '1 hour ago' },
              { type: 'payment', message: 'Payment received - ₦200,000', time: '2 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'booking' ? 'bg-blue-100' :
                  activity.type === 'message' ? 'bg-orange-100' :
                  'bg-green-100'
                }`}>
                  {activity.type === 'booking' && <Calendar size={20} className="text-blue-600" />}
                  {activity.type === 'message' && <MessageSquare size={20} className="text-orange-600" />}
                  {activity.type === 'payment' && <DollarSign size={20} className="text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-dark font-medium">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
