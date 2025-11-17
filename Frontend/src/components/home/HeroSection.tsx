import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const featuredRooms = [
    {
      image: '/images/img (7).jpg',
      title: 'COMFY DELUX',
      location: 'Makurdi, Benue State',
      price: 40000
    },
    {
      image: '/images/img (7).jpg',
      title: 'Super Deluxe',
      location: 'Makurdi, Benue State',
      price: 45000
    },
    {
      image: '/images/img (8).jpg',
      title: 'Luxury Splash',
      location: 'Makurdi, Benue State',
      price: 50000
    },
    {
      image: '/images/img (9).jpg',
      title: 'Presidential Suite',
      location: 'Makurdi, Benue State',
      price: 200000
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % featuredRooms.length
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [featuredRooms.length]);

  const currentRoom = featuredRooms[currentImageIndex];

  return (
    <section className="hero-section">
      {/* Background Image */}
      <div 
        className="hero-background"
        style={{ 
          backgroundImage: 'url(/images/img (1).jpg)',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="hero-overlay" />

      {/* Content Container */}
      <div className="hero-content">
        <div className="hero-grid">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              Eyah's A Sanctuary Of Elegance And Comfort.
            </h1>
            <p className="hero-description">
              Indulge in the pinnacle of luxury. EYAH'S Hotel offers an exquisite escape with meticulously designed rooms, world-class amenities, and unparalleled service in the heart of Makurdi.
            </p>
            <div className="hero-buttons">
              <Link to="/book" className="hero-btn-primary">
                Book Now
              </Link>
              {/* <button className="hero-btn-video">
                <div className="video-play-icon">
                  <div className="play-triangle" />
                </div>
                <span>Watch Video</span>
              </button> */}
            </div>
          </motion.div>

          {/* Right Side - Floating Image Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hero-card-wrapper"
          >
            <div className="hero-card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="hero-card-image"
                >
                  <img 
                    src={currentRoom.image} 
                    alt={currentRoom.title} 
                  />
                </motion.div>
              </AnimatePresence>
              <div className="hero-card-content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="hero-card-info"
                  >
                    <div>
                      <h3 className="hero-card-title">
                        {currentRoom.title}
                      </h3>
                      <p className="hero-card-location">
                        <MapPin size={16} />
                        {currentRoom.location}
                      </p>
                    </div>
                    <div className="hero-card-price">
                      <div className="price-amount">₦{currentRoom.price.toLocaleString()}</div>
                      <div className="price-period">/night</div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Indicator Dots */}
              <div className="hero-card-indicators">
                {featuredRooms.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`indicator-dot ${index === currentImageIndex ? 'active' : ''}`}
                    aria-label={`View room ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="hero-scroll"
      >
        <span className="scroll-text">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="scroll-indicator"
        >
          <div className="scroll-dot" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
