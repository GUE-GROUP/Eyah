import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Users, Wifi, Tv, Wind, Coffee, Check, Loader2, ArrowLeft } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';
import { useToast } from '../components/ToastContainer';
import { getRoom, checkRoomAvailability } from '../lib/supabase';
import type { Room } from '../types';

const RoomDetails: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  
  const [dates, setDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2
  });

  useEffect(() => {
    if (roomId) {
      loadRoom();
    }
  }, [roomId]);

  const loadRoom = async () => {
    try {
      const data = await getRoom(roomId!);
      setRoom(data);
    } catch (error: any) {
      console.error('Error loading room:', error);
      
      if (error.message.includes('Room not found')) {
        toast.error('Room not found');
        navigate('/rooms');
      } else if (error.message.includes('Database not set up')) {
        toast.warning('Database not set up. Using demo data.');
        // Fallback to demo data
        import('../data/rooms').then(module => {
          const demoRoom = module.rooms.find(r => r.id === roomId);
          if (demoRoom) {
            setRoom(demoRoom);
          } else {
            toast.error('Room not found');
            navigate('/rooms');
          }
        });
      } else {
        toast.error('Failed to load room details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAvailability = async () => {
    if (!dates.checkIn || !dates.checkOut) {
      toast.warning('Please select check-in and check-out dates');
      return;
    }

    setCheckingAvailability(true);
    try {
      const result = await checkRoomAvailability(
        roomId!,
        dates.checkIn,
        dates.checkOut,
        1
      );
      
      setAvailability(result);
      
      if (result.available) {
        toast.success(`Room is available! Total: ₦${result.totalPrice.toLocaleString()}`);
      } else {
        toast.error('Room is not available for selected dates');
      }
    } catch (error: any) {
      toast.error('Failed to check availability');
      console.error(error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBookNow = () => {
    if (dates.checkIn && dates.checkOut) {
      navigate(`/book?room=${roomId}&checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`);
    } else {
      navigate(`/book?room=${roomId}`);
    }
  };

  const featureIcons: { [key: string]: React.ReactNode } = {
    'Free WiFi': <Wifi className="w-5 h-5" />,
    'Flat Screen TV': <Tv className="w-5 h-5" />,
    'Air Conditioning': <Wind className="w-5 h-5" />,
    'Mini Bar': <Coffee className="w-5 h-5" />,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Room not found</h2>
          <button onClick={() => navigate('/rooms')} className="btn-primary">
            View All Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="container-custom">
        {/* Back Button */}
        <FadeInView>
          <button
            onClick={() => navigate('/rooms')}
            className="flex items-center gap-2 text-gray-600 hover:text-accent mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Rooms
          </button>
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Room Image */}
          <FadeInView>
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              {!room.is_available && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                  Not Available
                </div>
              )}
            </div>
          </FadeInView>

          {/* Room Details */}
          <FadeInView delay={0.2}>
            <div>
              <h1 className="heading-secondary mb-4">{room.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-accent">
                  ₦{room.price.toLocaleString()}
                </div>
                <span className="text-gray-600">per night</span>
              </div>

              <p className="text-body mb-8">{room.description}</p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">Room Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  {room.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="bg-accent/10 p-2 rounded-lg text-accent">
                        {featureIcons[feature] || <Check className="w-5 h-5" />}
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity */}
              <div className="flex items-center gap-2 mb-8 text-gray-700">
                <Users className="w-5 h-5 text-accent" />
                <span>Capacity: Up to {room.capacity} guests</span>
              </div>

              {/* Availability Checker */}
              <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                <h3 className="font-semibold text-lg mb-4">Check Availability</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={dates.checkIn}
                      onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={dates.checkOut}
                      onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                      min={dates.checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCheckAvailability}
                  disabled={checkingAvailability || !dates.checkIn || !dates.checkOut}
                  className="w-full btn-outline flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingAvailability && <Loader2 className="w-4 h-4 animate-spin" />}
                  {checkingAvailability ? 'Checking...' : 'Check Availability'}
                </button>

                {availability && (
                  <div className={`mt-4 p-4 rounded-lg ${availability.available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`font-semibold ${availability.available ? 'text-green-800' : 'text-red-800'}`}>
                      {availability.message}
                    </p>
                    {availability.available && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>Nights: {availability.nights}</p>
                        <p className="font-bold text-lg mt-1">
                          Total: ₦{availability.totalPrice.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!room.is_available}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {room.is_available ? 'Book Now' : 'Not Available'}
              </button>
            </div>
          </FadeInView>
        </div>

        {/* Additional Information */}
        <FadeInView delay={0.4}>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Calendar className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">Flexible Booking</h3>
              <p className="text-gray-600 text-sm">
                Book with confidence. Free cancellation up to 24 hours before check-in.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Check className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">Best Price Guarantee</h3>
              <p className="text-gray-600 text-sm">
                We guarantee the best rates. Book directly with us for exclusive deals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm">
                Our team is available round the clock to assist you with any queries.
              </p>
            </div>
          </div>
        </FadeInView>
      </div>
    </div>
  );
};

export default RoomDetails;
