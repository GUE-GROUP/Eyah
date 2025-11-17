import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'rooms' | 'facilities' | 'dining'>('all');

  const galleryImages = [
    // Rooms
    { id: 1, src: '/gallery/Avalanche suite.jpg', category: 'rooms', title: 'Avalanche Suite' },
    { id: 2, src: '/gallery/Business Executive.jpg', category: 'rooms', title: 'Business Executive' },
    { id: 3, src: '/gallery/comfy deluxe.jpg', category: 'rooms', title: 'Comfy Deluxe' },
    { id: 4, src: '/gallery/luxury splash.jpg', category: 'rooms', title: 'Luxury Splash' },
    { id: 5, src: '/gallery/super deluxe.jpg', category: 'rooms', title: 'Super Deluxe' },
    { id: 6, src: '/gallery/bathroom.jpg', category: 'rooms', title: 'Luxury Bathroom' },
    
    // Facilities
    { id: 7, src: '/gallery/baquete hall.jpg', category: 'facilities', title: 'Banquet Hall' },
    { id: 8, src: '/gallery/gym.jpg', category: 'facilities', title: 'Gym & Fitness Center' },
    { id: 9, src: '/gallery/Eyah-hotl.jpg', category: 'facilities', title: 'Hotel Exterior' },
    { id: 10, src: '/gallery/Gallary-1.jpg', category: 'facilities', title: 'Hotel Lobby' },
    { id: 11, src: '/gallery/gallary-2.jpg', category: 'facilities', title: 'Reception Area' },
    { id: 12, src: '/gallery/gallery-3.jpg', category: 'facilities', title: 'Hotel Facilities' },
    { id: 13, src: '/gallery/gallery-4.jpg', category: 'facilities', title: 'Conference Room' },
    { id: 14, src: '/gallery/gallery-5.jpg', category: 'facilities', title: 'Event Space' },
    { id: 15, src: '/gallery/gallery-8.jpg', category: 'facilities', title: 'Hotel Amenities' },
    { id: 16, src: '/gallery/gallery-9.jpg', category: 'facilities', title: 'Lounge Area' },
    { id: 17, src: '/gallery/gallery-11.jpg', category: 'facilities', title: 'Hotel Interior' },
    
    // Dining
    { id: 18, src: '/gallery/kitchen.jpg', category: 'dining', title: 'Professional Kitchen' },
  ];

  const filteredImages = galleryImages.filter(img => 
    filter === 'all' || img.category === filter
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/gallery/Eyah-hotl.jpg)' }}
        />
        <div className="container-custom relative z-20 text-white text-center">
          <FadeInView>
            <h1 className="heading-primary text-white mb-4">Gallery</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore the beauty and elegance of Eyah's Hotel & Suites
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 justify-center">
            {['all', 'rooms', 'facilities', 'dining'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-6 py-2 rounded-full font-semibold transition-all capitalize ${
                  filter === cat
                    ? 'bg-accent text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <FadeInView key={image.id} delay={index * 0.05}>
                <motion.div
                  className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(image.src)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-semibold">{image.title}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Gallery"
              className="max-w-full max-h-full object-contain"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
