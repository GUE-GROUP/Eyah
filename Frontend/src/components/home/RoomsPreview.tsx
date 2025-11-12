import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Wifi } from 'lucide-react';
import FadeInView from '../animations/FadeInView';
import SlideInView from '../animations/SlideInView';
import { rooms } from '../../data/rooms';

const RoomsPreview: React.FC = () => {
  const featuredRooms = rooms.slice(0, 3);

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
                    to={`/rooms/${room.id}`}
                    className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-4 transition-all"
                  >
                    View Details <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </SlideInView>
          ))}
        </div>

        <FadeInView delay={0.3}>
          <div className="text-center">
            <Link to="/rooms" className="btn-primary inline-flex items-center gap-2">
              View All Rooms <ArrowRight size={20} />
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default RoomsPreview;
