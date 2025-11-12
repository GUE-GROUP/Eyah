import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';
import { rooms } from '../data/rooms';
import type { BookingFormData } from '../types';

const Book: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roomId: searchParams.get('room') || '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: ''
  });

  const selectedRoom = rooms.find(room => room.id === formData.roomId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle final submission
      console.log('Booking submitted:', formData);
      alert('Booking successful! We will contact you shortly.');
      navigate('/');
    }
  };

  const calculateTotal = () => {
    if (!selectedRoom || !formData.checkIn || !formData.checkOut) return 0;
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return selectedRoom.price * nights;
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
                          src={selectedRoom.image} 
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Users className="inline-block mr-2" size={16} />
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        min="1"
                        max={selectedRoom?.capacity || 10}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 bg-white hover:border-accent/50"
                      />
                      {selectedRoom && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          Max: {selectedRoom.capacity}
                        </span>
                      )}
                    </div>
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
                        <span className="font-semibold">{formData.guests}</span>
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
                className="btn-primary ml-auto"
              >
                {step === 3 ? 'Confirm Booking' : 'Next Step'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Book;
