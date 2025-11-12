import React from 'react';
import { Award, Users, Heart, Shield } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';
import SlideInView from '../components/animations/SlideInView';

const About: React.FC = () => {
  const values = [
    {
      icon: <Award size={40} />,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, ensuring top-notch quality.'
    },
    {
      icon: <Users size={40} />,
      title: 'Guest-Centric',
      description: 'Our guests are at the heart of everything we do. Your comfort is our priority.'
    },
    {
      icon: <Heart size={40} />,
      title: 'Hospitality',
      description: 'Warm, genuine hospitality that makes you feel at home away from home.'
    },
    {
      icon: <Shield size={40} />,
      title: 'Trust',
      description: 'Building lasting relationships through trust, integrity, and reliability.'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/img (1).jpg)' }}
        />
        <div className="container-custom relative z-20 text-white text-center">
          <FadeInView>
            <h1 className="heading-primary text-white mb-4">About Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover the story behind Makurdi's premier luxury hotel
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <SlideInView direction="left">
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="/images/img (2).jpg" 
                    alt="Our Story" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/10 rounded-lg -z-10" />
              </div>
            </SlideInView>

            <div>
              <FadeInView delay={0.2}>
                <p className="text-accent font-semibold text-sm tracking-widest mb-4">
                  OUR STORY
                </p>
                <h2 className="heading-secondary mb-6">
                  The Story of Eyah's<br />Hotel & Suites
                </h2>
                <div className="space-y-4 text-body">
                  <p>
                    Eyah's Hotel and Suites in Makurdi is a fancy place to stay. We make sure you 
                    have a top-notch vacation by providing luxurious hotel rooms, events halls, 
                    excellent service, and friendly staff.
                  </p>
                  <p>
                    Our hotel is the perfect place to relax and have fun with many activities 
                    available. We offer an extraordinary escape with our meticulously designed, 
                    opulent rooms and suites, providing the pinnacle of comfort and sophistication.
                  </p>
                  <p>
                    Each space is thoughtfully curated to ensure a stay like no other in the heart 
                    of Makurdi. Complementing our luxurious accommodations, our exceptional services 
                    include personalized concierge assistance. Our dedicated team is committed to 
                    exceeding your expectations, ensuring every moment of your stay is marked by 
                    elegance and indulgence.
                  </p>
                </div>
              </FadeInView>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-cream">
        <div className="container-custom">
          <FadeInView>
            <div className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest mb-4">
                OUR VALUES
              </p>
              <h2 className="heading-secondary mb-6">
                What We Stand For
              </h2>
              <p className="text-body max-w-2xl mx-auto">
                Our core values guide everything we do, ensuring exceptional experiences 
                for every guest.
              </p>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <FadeInView key={index} delay={index * 0.1}>
                <div className="bg-white p-8 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
                  <div className="text-accent mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold mb-3 text-dark">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {value.description}
                  </p>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <FadeInView delay={0}>
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">50+</div>
                <div className="text-white/80">Luxury Rooms</div>
              </div>
            </FadeInView>
            <FadeInView delay={0.1}>
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">1000+</div>
                <div className="text-white/80">Happy Guests</div>
              </div>
            </FadeInView>
            <FadeInView delay={0.2}>
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">24/7</div>
                <div className="text-white/80">Service</div>
              </div>
            </FadeInView>
            <FadeInView delay={0.3}>
              <div className="text-center">
                <div className="text-5xl font-bold text-accent mb-2">5★</div>
                <div className="text-white/80">Rating</div>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
