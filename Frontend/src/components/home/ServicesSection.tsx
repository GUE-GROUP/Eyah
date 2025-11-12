import React from 'react';
import { Dumbbell, Calendar, Utensils, Bed } from 'lucide-react';
import FadeInView from '../animations/FadeInView';
import { services } from '../../data/services';

const iconMap: { [key: string]: React.ReactNode } = {
  dumbbell: <Dumbbell size={32} />,
  calendar: <Calendar size={32} />,
  utensils: <Utensils size={32} />,
  bed: <Bed size={32} />,
};

const ServicesSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-cream">
      <div className="container-custom">
        <FadeInView>
          <div className="text-center mb-16">
            <p className="text-accent font-semibold text-sm tracking-widest mb-4">
              WHAT WE OFFER
            </p>
            <h2 className="heading-secondary mb-6">
              Indulge In Five-Star<br />Facility & Sophistication
            </h2>
            <p className="text-body max-w-2xl mx-auto">
              Our lavishly appointed rooms & suites feature world-class amenities, including 
              state-of-the-art technology and premium services.
            </p>
          </div>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <FadeInView key={service.id} delay={index * 0.1}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-accent mb-4">
                    {iconMap[service.icon]}
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3 text-dark">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
