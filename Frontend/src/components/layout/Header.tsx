import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { cn } from '../../utils/cn';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Hotel Rooms', path: '/rooms' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className={cn(
              'font-serif text-2xl md:text-3xl font-bold transition-colors',
              isScrolled ? 'text-primary' : 'text-white'
            )}>
              EYAH'S
            </span>
            <span className={cn(
              'text-xs md:text-sm font-light tracking-widest transition-colors',
              isScrolled ? 'text-gray-600' : 'text-white/90'
            )}>
              HOTEL & SUITES
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'font-medium transition-colors relative group',
                  location.pathname === link.path
                    ? isScrolled ? 'text-accent' : 'text-white'
                    : isScrolled ? 'text-gray-700 hover:text-accent' : 'text-white/90 hover:text-white'
                )}
              >
                {link.name}
                <span className={cn(
                  'absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full',
                  location.pathname === link.path && 'w-full'
                )} />
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className={cn(
                'relative p-2 transition-colors',
                isScrolled ? 'text-gray-700 hover:text-accent' : 'text-white hover:text-accent'
              )}
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            <Link
              to="/book"
              className="hidden md:block btn-primary"
            >
              Book Room
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden p-2 transition-colors',
                isScrolled ? 'text-gray-700' : 'text-white'
              )}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <nav className="container-custom py-6 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'font-medium py-2 transition-colors',
                    location.pathname === link.path
                      ? 'text-accent'
                      : 'text-gray-700 hover:text-accent'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/book" className="btn-primary text-center">
                Book Room
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
