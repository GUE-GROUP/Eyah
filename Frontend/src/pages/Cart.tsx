import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FadeInView from '../components/animations/FadeInView';

const Cart: React.FC = () => {
  const { cart, removeFromCart, getCartTotal } = useCart();

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-20">
        <div className="container-custom">
          <FadeInView>
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
              <h2 className="heading-tertiary mb-4">Your Cart is Empty</h2>
              <p className="text-body mb-8">
                Start adding rooms to your cart to plan your perfect stay.
              </p>
              <Link to="/rooms" className="btn-primary inline-flex items-center gap-2">
                Browse Rooms <ArrowRight size={20} />
              </Link>
            </div>
          </FadeInView>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-20">
      <div className="container-custom">
        <FadeInView>
          <h1 className="heading-secondary mb-8">Your Cart</h1>
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const nights = calculateNights(item.checkIn, item.checkOut);
              const totalPrice = item.room.price * nights;

              return (
                <FadeInView key={item.room.id} delay={index * 0.1}>
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 aspect-video md:aspect-square bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={item.room.image} 
                          alt={item.room.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-serif text-xl font-bold text-dark mb-2">
                              {item.room.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.room.description}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.room.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-500">Check-in</p>
                            <p className="font-semibold">{new Date(item.checkIn).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Check-out</p>
                            <p className="font-semibold">{new Date(item.checkOut).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Guests</p>
                            <p className="font-semibold">{item.guests} Guest{item.guests > 1 ? 's' : ''}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Nights</p>
                            <p className="font-semibold">{nights} Night{nights > 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div>
                            <p className="text-sm text-gray-500">Price per night</p>
                            <p className="font-semibold">₦{item.room.price.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-accent">₦{totalPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeInView>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <FadeInView delay={0.2}>
              <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
                <h3 className="font-serif text-xl font-bold mb-6">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  {cart.map((item) => {
                    const nights = calculateNights(item.checkIn, item.checkOut);
                    return (
                      <div key={item.room.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.room.name} × {nights} night{nights > 1 ? 's' : ''}</span>
                        <span className="font-semibold">₦{(item.room.price * nights).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-accent">₦{getCartTotal().toLocaleString()}</span>
                  </div>
                </div>

                <Link to="/book" className="w-full btn-primary text-center block">
                  Proceed to Checkout
                </Link>

                <Link to="/rooms" className="w-full btn-outline text-center block mt-4">
                  Continue Shopping
                </Link>
              </div>
            </FadeInView>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
