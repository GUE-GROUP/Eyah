import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle, 
  AlertCircle,
  User,
  Calendar,
  DollarSign,
  Users,
  Home,
  Clock,
  Shield
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/ToastContainer';

interface GuestDetails {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomName: string;
  roomPrice: number;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  totalAmount: number;
  specialRequests: string;
  checkedInAt: string;
  verificationCode: string;
}

const AdminCheckIn: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState<GuestDetails | null>(null);
  const [error, setError] = useState('');

  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'INVALID_INPUT': 'Please enter a valid verification code',
      'INVALID_CODE_FORMAT': 'Verification code must be 8 characters long',
      'CODE_NOT_FOUND': 'Invalid verification code. Please check the code and try again.',
      'INVALID_STATUS': 'This booking cannot be checked in at this time',
      'ALREADY_CHECKED_IN': 'This guest has already been checked in',
      'EARLY_CHECKIN': 'Check-in date has not arrived yet',
      'UPDATE_FAILED': 'Failed to complete check-in. Please try again.',
      'SERVER_ERROR': 'An unexpected error occurred. Please try again.'
    };
    return errorMessages[errorCode] || 'Verification failed. Please try again.';
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setError('Please enter a verification code');
      return;
    }

    setLoading(true);
    setError('');
    setGuestDetails(null);

    console.group('🔍 Verifying Check-In Code');
    console.log('Code:', verificationCode);

    try {
      const adminUser = localStorage.getItem('adminUser');
      const adminUserId = adminUser ? JSON.parse(adminUser).id : null;

      const { data, error: verifyError } = await supabase.functions.invoke('verify-checkin', {
        body: {
          verificationCode: verificationCode.toUpperCase(),
          adminUserId
        }
      });

      if (verifyError) {
        console.error('❌ Verification error:', verifyError);
        const errorMessage = verifyError.message || 'Failed to verify code. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        console.groupEnd();
        return;
      }

      if (data.error) {
        console.error('❌ Error:', data.error);
        const errorMessage = data.message || getErrorMessage(data.error);
        setError(errorMessage);
        toast.error(errorMessage);
        console.groupEnd();
        return;
      }

      console.log('✅ Check-in successful:', data.booking);
      setGuestDetails(data.booking);
      toast.success('Guest checked in successfully!');
      setVerificationCode('');
      console.groupEnd();

    } catch (err: any) {
      console.error('❌ Error:', err);
      setError('An error occurred. Please try again.');
      toast.error('Check-in failed');
      console.groupEnd();
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVerificationCode('');
    setGuestDetails(null);
    setError('');
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
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-dark">Guest Check-In</h1>
                <p className="text-sm text-gray-600">Verify and process guest arrivals</p>
              </div>
            </div>
            <Shield size={32} className="text-accent" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Search className="text-accent" size={28} />
            <h2 className="text-xl font-bold text-dark">Enter Verification Code</h2>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character code"
                maxLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-center text-2xl font-mono tracking-widest uppercase"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Guest should provide the verification code from their confirmation email
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !verificationCode.trim()}
                className="flex-1 bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Verify & Check In
                  </>
                )}
              </button>
              
              {verificationCode && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Guest Details (shown after successful verification) */}
        {guestDetails && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fadeIn">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={32} />
                <h2 className="text-2xl font-bold">Check-In Successful!</h2>
              </div>
              <p className="text-green-50">Guest has been checked in at {new Date(guestDetails.checkedInAt).toLocaleTimeString()}</p>
            </div>

            {/* Guest Information */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Guest Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-dark flex items-center gap-2">
                    <User size={20} className="text-accent" />
                    Guest Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-dark">{guestDetails.guestName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-dark">{guestDetails.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-dark">{guestDetails.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Verification Code</p>
                      <p className="font-mono font-bold text-green-600 text-lg tracking-wider">{guestDetails.verificationCode}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-dark flex items-center gap-2">
                    <Home size={20} className="text-accent" />
                    Booking Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Room</p>
                      <p className="font-semibold text-dark">{guestDetails.roomName}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Check-In Date</p>
                      <p className="font-semibold text-dark flex items-center gap-2">
                        <Calendar size={16} className="text-accent" />
                        {new Date(guestDetails.checkIn).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Check-Out Date</p>
                      <p className="font-semibold text-dark flex items-center gap-2">
                        <Calendar size={16} className="text-accent" />
                        {new Date(guestDetails.checkOut).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-semibold text-dark flex items-center gap-2">
                        <Users size={16} className="text-accent" />
                        {guestDetails.adults} Adult(s), {guestDetails.children} Child(ren)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-6 p-4 bg-accent/10 rounded-lg border-l-4 border-accent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={24} className="text-accent" />
                    <span className="text-lg font-semibold text-dark">Total Amount</span>
                  </div>
                  <span className="text-2xl font-bold text-accent">₦{guestDetails.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Special Requests */}
              {guestDetails.specialRequests && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-dark mb-2">Special Requests</h4>
                  <p className="text-gray-700">{guestDetails.specialRequests}</p>
                </div>
              )}

              {/* Check-In Time */}
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>Checked in at {new Date(guestDetails.checkedInAt).toLocaleString()}</span>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-200"
                >
                  Check In Another Guest
                </button>
                <button
                  onClick={() => navigate('/admin/bookings')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  View All Bookings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-dark mb-3 flex items-center gap-2">
            <AlertCircle className="text-blue-600" size={20} />
            Check-In Instructions
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Ask the guest for their 8-character verification code</li>
            <li>• Enter the code in the field above and click "Verify & Check In"</li>
            <li>• Verify the guest's identity with a government-issued ID</li>
            <li>• Review booking details and special requests</li>
            <li>• Provide room keys and welcome the guest</li>
            <li>• Only confirmed bookings with valid codes can be checked in</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminCheckIn;
