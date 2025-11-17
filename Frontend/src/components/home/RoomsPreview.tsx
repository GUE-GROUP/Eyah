import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Wifi } from 'lucide-react';
import FadeInView from '../animations/FadeInView';
import SlideInView from '../animations/SlideInView';
import { getRooms } from '../../lib/supabase';
import type { Room } from '../../types';

const RoomsPreview: React.FC = () => {
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await getRooms();
        // Get first 3 available rooms
        setFeaturedRooms(allRooms.filter(room => room.is_available).slice(0, 3));
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container-custom">
        <FadeInView>
          <div className="text-center mb-16">
            <p className="text-accent font-semibold text-sm tracking-widest mb-4">
              ACCOMMODATION
            </p>
            <h2 className="heading-secondary mb-6">
              Our Luxury Rooms
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Experience the epitome of comfort and sophistication in our meticulously 
              designed rooms and suites.
            </p>
          </div>
        </FadeInView>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No rooms available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredRooms.map((room, index) => (
            <SlideInView 
              key={room.id} 
              direction={index % 2 === 0 ? 'left' : 'right'}
              delay={index * 0.1}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={room.image_url || '/images/img (7).jpg'} 
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
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
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
                  
                  <Link 
                    to={`/room/${room.id}`}
                    className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-4 transition-all"
                  >
                    View Details <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </SlideInView>
          ))}
          </div>
        )}

        {!loading && featuredRooms.length > 0 && (
          <FadeInView delay={0.3}>
            <div className="text-center">
              <Link to="/rooms" className="btn-primary inline-flex items-center gap-2">
                View All Rooms <ArrowRight size={20} />
              </Link>
            </div>
          </FadeInView>
        )}
      </div>
    </section>
  );
};

export default RoomsPreview;
