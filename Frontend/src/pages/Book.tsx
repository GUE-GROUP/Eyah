import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Loader2 } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';
import { useToast } from '../components/ToastContainer';
import { checkRoomAvailability, createBooking, getRooms } from '../lib/supabase';
import type { BookingFormData } from '../types';
import type { Room } from '../types';

const Book: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roomId: searchParams.get('room') || '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    rooms: 1,
    specialRequests: ''
  });

  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  // Load rooms from Supabase
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    console.group('🎯 Book Page - Loading Rooms');
    console.log('Component:', 'Book.tsx');
    console.log('Timestamp:', new Date().toISOString());
    
    try {
      console.log('📞 Calling getRooms()...');
      const data = await getRooms();
      
      console.log('✅ Rooms loaded successfully!');
      console.log('  Count:', data?.length || 0);
      setRooms(data);
      console.groupEnd();
    } catch (error: any) {
      console.error('❌ Error loading rooms in Book page:');
      console.error('  Error type:', error.constructor.name);
      console.error('  Error message:', error.message);
      console.error('  Full error:', error);
      
      // Check if it's a database setup issue
      if (error.message && error.message.includes('Database not set up')) {
        console.warn('⚠️  Database not set up. Falling back to demo data.');
        toast.error('Database not set up yet. Using demo data.');
        // Import fallback data
        import('../data/rooms').then(module => {
          console.log('📂 Loaded demo data:', module.rooms.length, 'rooms');
          setRooms(module.rooms);
        });
      } else {
        console.warn('⚠️  Failed to load rooms. Falling back to demo data.');
        toast.error('Failed to load rooms. Using demo data.');
        // Import fallback data
        import('../data/rooms').then(module => {
          console.log('📂 Loaded demo data:', module.rooms.length, 'rooms');
          setRooms(module.rooms);
        });
      }
      console.groupEnd();
    } finally {
      setLoading(false);
    }
  };

  const selectedRoom = rooms.find(room => room.id === formData.roomId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle final submission
      await submitBooking();
    }
  };

  const submitBooking = async () => {
    setSubmitting(true);
    try {
      const result = await createBooking(formData);
      if (result.success) {
        toast.success('Booking created successfully! Check your email for confirmation.');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) return 0;
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return selectedRoom.price * nights * formData.rooms;
  };

  const checkAvailability = async () => {
    if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
      toast.warning('Please select room and dates first');
      return;
    }

    setIsCheckingAvailability(true);
    setIsAvailable(null);

    try {
      const result = await checkRoomAvailability(
        formData.roomId,
        formData.checkIn,
        formData.checkOut,
        formData.rooms
      );
      
      setIsAvailable(result.available);
      
      if (result.available) {
        toast.success(`Great news! The room is available. Total: ₦${result.totalPrice.toLocaleString()}`);
      } else {
        toast.error('Sorry, this room is not available for the selected dates.');
      }
    } catch (error: any) {
      toast.error('Failed to check availability. Please try again.');
      console.error(error);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="container-custom max-w-4xl">
        <FadeInView>
          <h1 className="heading-secondary mb-8 text-center">Book Your Stay</h1>
        </FadeInView>

        {/* Progress Steps */}
        <FadeInView delay={0.1}>
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${step >= 1 ? 'text-accent' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-accent bg-accent text-white' : 'border-gray-400'}`}>
                  1
                </div>
                <span className="ml-2 font-semibold hidden sm:inline">Room Details</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300" />
              <div className={`flex items-center ${step >= 2 ? 'text-accent' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-accent bg-accent text-white' : 'border-gray-400'}`}>
                  2
                </div>
                <span className="ml-2 font-semibold hidden sm:inline">Guest Info</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300" />
              <div className={`flex items-center ${step >= 3 ? 'text-accent' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-accent bg-accent text-white' : 'border-gray-400'}`}>
                  3
                </div>
                <span className="ml-2 font-semibold hidden sm:inline">Payment</span>
              </div>
            </div>
          </div>
        </FadeInView>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg p-8 shadow-lg">
            {/* Step 1: Room Selection */}
            {step === 1 && (
              <FadeInView>
                <h2 className="heading-tertiary mb-6">Select Room & Dates</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Room *
                    </label>
                    <select
                      name="roomId"
                      value={formData.roomId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-white hover:border-accent/50 cursor-pointer"
                    >
                      <option value="">Choose a room</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.name} - ₦{room.price.toLocaleString()}/night
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedRoom && (
                    <div className="bg-cream p-4 rounded-lg">
                      <div className="flex gap-4">
                        <img 
                          src={selectedRoom.image_url || '/images/img (7).jpg'} 
                          alt={selectedRoom.name}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-serif text-lg font-bold mb-2">{selectedRoom.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{selectedRoom.description}</p>
                          <p className="text-accent font-bold">₦{selectedRoom.price.toLocaleString()}/night</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="inline-block mr-2" size={16} />
                        Check-in Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="checkIn"
                          value={formData.checkIn}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-white hover:border-accent/50 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Calendar className="inline-block mr-2" size={16} />
                        Check-out Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="checkOut"
                          value={formData.checkOut}
                          onChange={handleChange}
                          min={formData.checkIn || new Date().toISOString().split('T')[0]}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-white hover:border-accent/50 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="inline-block mr-2" size={16} />
                        Adults *
                      </label>
                      <input
                        type="number"
                        name="adults"
                        value={formData.adults}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-white hover:border-accent/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Users className="inline-block mr-2" size={16} />
                        Children
                      </label>
                      <input
                        type="number"
                        name="children"
                        value={formData.children}
                        onChange={handleChange}
                        min="0"
                        max="10"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-white hover:border-accent/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rooms *
                      </label>
                      <input
                        type="number"
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleChange}
                        min="1"
                        max="10"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-white hover:border-accent/50"
                      />
                    </div>
                  </div>

                  {/* Check Availability Button */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={checkAvailability}
                      disabled={isCheckingAvailability || !formData.roomId || !formData.checkIn || !formData.checkOut}
                      className="w-full bg-primary hover:bg-primary-light text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCheckingAvailability ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Checking Availability...
                        </>
                      ) : (
                        'Check Availability'
                      )}
                    </button>
                    
                    {isAvailable !== null && (
                      <div className={`mt-4 p-4 rounded-lg ${isAvailable ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {isAvailable ? (
                          <p className="font-semibold">✓ Room is available for your selected dates!</p>
                        ) : (
                          <p className="font-semibold">✗ Room is not available. Please select different dates.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </FadeInView>
            )}

            {/* Step 2: Guest Information */}
            {step === 2 && (
              <FadeInView>
                <h2 className="heading-tertiary mb-6">Guest Information</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                  </div>
                </div>
              </FadeInView>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <FadeInView>
                <h2 className="heading-tertiary mb-6">Payment & Confirmation</h2>
                
                <div className="space-y-6">
                  <div className="bg-cream p-6 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Room:</span>
                        <span className="font-semibold">{selectedRoom?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-semibold">{new Date(formData.checkIn).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-semibold">{new Date(formData.checkOut).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Guests:</span>
                        <span className="font-semibold">{formData.adults + formData.children}</span>
                      </div>
                      <div className="flex justify-between pt-4 border-t">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-2xl font-bold text-accent">₦{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Payment will be processed upon arrival. A confirmation email will be sent to {formData.email}.
                    </p>
                  </div>
                </div>
              </FadeInView>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="btn-outline"
                >
                  Previous
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary ml-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {step === 3 ? (submitting ? 'Creating Booking...' : 'Confirm Booking') : 'Next Step'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Book;
