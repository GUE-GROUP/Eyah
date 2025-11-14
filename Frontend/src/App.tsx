import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Book from './pages/Book';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminRooms from './pages/admin/AdminRooms';
import AdminMessages from './pages/admin/AdminMessages';
import AdminCheckIn from './pages/admin/AdminCheckIn';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/ToastContainer';

// Scroll to top component
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CartProvider>
      <ScrollToTop />
      {isAdminRoute ? (
        // Admin routes without Header/Footer
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/checkin" element={<AdminCheckIn />} />
        </Routes>
      ) : (
        // Public routes with Header/Footer
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/room/:roomId" element={<RoomDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/book" element={<Book />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </CartProvider>
  );
}

function AppWrapper() {
  return (
    <Router>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Router>
  );
}

export default AppWrapper;
