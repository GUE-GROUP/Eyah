import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Wifi, ArrowRight } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';
import { rooms } from '../data/rooms';

const Rooms: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'deluxe' | 'suite'>('all');

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true;
    if (filter === 'deluxe') return room.name.toLowerCase().includes('deluxe');
    if (filter === 'suite') return room.name.toLowerCase().includes('suite');
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/img (8).jpg)' }}
        />
        <div className="container-custom relative z-20 text-white text-center">
          <FadeInView>
            <h1 className="heading-primary text-white mb-4">Our Luxury Rooms</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover your perfect sanctuary. Each room is designed to provide 
              the ultimate comfort and sophistication.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Rooms
            </button>
            <button
              onClick={() => setFilter('deluxe')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === 'deluxe'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Deluxe Rooms
            </button>
            <button
              onClick={() => setFilter('suite')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === 'suite'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Suites
            </button>
          </div>
        </div>
      </section>

      {/* Rooms Grid */}
      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, index) => (
              <FadeInView key={room.id} delay={index * 0.1}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={room.image} 
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full font-semibold">
                      ₦{room.price.toLocaleString()}/night
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-serif text-2xl font-bold mb-2 text-dark">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {room.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{room.capacity} Guests</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wifi size={16} />
                        <span>Free WiFi</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                      <div className="flex flex-wrap gap-2">
                        {room.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {room.features.length > 3 && (
                          <span className="text-xs text-gray-500">+{room.features.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/book?room=${room.id}`}
                      className="w-full btn-primary text-center inline-flex items-center justify-center gap-2"
                    >
                      Book Now <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;
