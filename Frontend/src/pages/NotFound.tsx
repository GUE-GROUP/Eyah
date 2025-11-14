import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, MapPin } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <FadeInView>
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[200px] font-bold text-accent/20 leading-none">
              404
            </h1>
          </div>

          {/* Icon */}
          <div className="mb-6">
            <MapPin size={64} className="mx-auto text-accent" />
          </div>

          {/* Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for seems to have checked out. 
            Let's get you back to somewhere comfortable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Home size={20} />
              Go to Homepage
            </Link>
            <Link
              to="/rooms"
              className="btn-outline inline-flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <Search size={20} />
              Browse Rooms
            </Link>
          </div>

          {/* Additional Links */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-gray-600 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/about" className="text-accent hover:underline">
                About Us
              </Link>
              <Link to="/contact" className="text-accent hover:underline">
                Contact
              </Link>
              <Link to="/gallery" className="text-accent hover:underline">
                Gallery
              </Link>
              <Link to="/book" className="text-accent hover:underline">
                Book a Room
              </Link>
            </div>
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="mt-8 inline-flex items-center gap-2 text-gray-600 hover:text-accent transition-colors"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </FadeInView>
      </div>
    </div>
  );
};

export default NotFound;
