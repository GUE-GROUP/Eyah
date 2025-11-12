import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import ServicesSection from '../components/home/ServicesSection';
import RoomsPreview from '../components/home/RoomsPreview';
import CTASection from '../components/home/CTASection';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <RoomsPreview />
      <CTASection />
    </div>
  );
};

export default Home;
