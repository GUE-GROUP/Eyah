import React from 'react';
import FadeInView from '../animations/FadeInView';
import SlideInView from '../animations/SlideInView';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <SlideInView direction="left">
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <img 
                  src="/images/img (2).jpg" 
                  alt="Eyah's Hotel" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-accent/10 rounded-lg -z-10" />
            </div>
          </SlideInView>

          {/* Content Side */}
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
                  of Makurdi. Our dedicated team is committed to exceeding your expectations, 
                  ensuring every moment of your stay is marked by elegance and indulgence.
                </p>
              </div>
            </FadeInView>

            <FadeInView delay={0.4}>
              <div className="mt-8 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">50+</div>
                  <div className="text-sm text-gray-600">Luxury Rooms</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">5★</div>
                  <div className="text-sm text-gray-600">Star Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Service</div>
                </div>
              </div>
            </FadeInView>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
