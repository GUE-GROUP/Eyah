import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParallaxSection from '../animations/ParallaxSection';

const CTASection: React.FC = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <ParallaxSection speed={0.5}>
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: 'url(/images/img (1).jpg)',
              minHeight: '150%'
            }}
          />
        </ParallaxSection>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary/75" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="heading-secondary text-white mb-6">
            Your Private Haven<br />
            Awaits You
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience unparalleled luxury and comfort. Book your perfect getaway today 
            and create unforgettable memories at Eyah's Hotel & Suites.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/book" 
              className="bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Book Your Stay
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-md transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
