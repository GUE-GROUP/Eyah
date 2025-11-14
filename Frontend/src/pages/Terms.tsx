import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="container-custom relative z-10 text-white text-center">
          <FadeInView>
            <FileText size={48} className="mx-auto mb-4" />
            <h1 className="heading-primary text-white mb-4">Terms & Conditions</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Please read these terms carefully before using our services
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <FadeInView>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-accent hover:text-accent-dark mb-8 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </FadeInView>

          <div className="bg-white rounded-xl shadow-md p-8 md:p-12 space-y-8">
            <FadeInView delay={0.1}>
              <div>
                <p className="text-gray-600 mb-6">
                  <strong>Last Updated:</strong> November 14, 2025
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Eyah's Hotel & Suites. By accessing and using our website and services, 
                  you agree to be bound by these Terms and Conditions. Please read them carefully.
                </p>
              </div>
            </FadeInView>

            <FadeInView delay={0.2}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">1. Booking and Reservations</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>1.1 Booking Confirmation:</strong> All bookings are subject to availability and confirmation. You will receive a confirmation email with your booking details and verification code.</p>
                  <p><strong>1.2 Pricing:</strong> All prices are quoted in Nigerian Naira (₦) and are subject to change without notice. The price confirmed at the time of booking will be honored.</p>
                  <p><strong>1.3 Verification Code:</strong> A unique verification code will be provided for check-in. This code must be presented at reception upon arrival.</p>
                  <p><strong>1.4 Booking Modifications:</strong> Changes to bookings are subject to availability and may incur additional charges. Contact us directly to modify your reservation.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.3}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">2. Check-In and Check-Out</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>2.1 Check-In Time:</strong> Standard check-in time is 2:00 PM. Early check-in is subject to availability and may incur additional charges.</p>
                  <p><strong>2.2 Check-Out Time:</strong> Standard check-out time is 12:00 PM (noon). Late check-out is subject to availability and may incur additional charges.</p>
                  <p><strong>2.3 Verification Code:</strong> Your unique verification code must be presented at check-in. This code is provided in your booking confirmation email.</p>
                  <p><strong>2.4 Age Requirement:</strong> Guests must be 18 years or older to check in unless accompanied by a parent or legal guardian.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.4}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">3. Cancellation and Refund Policy</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>3.1 Cancellation Period:</strong> Cancellations made 48 hours or more before the check-in date will receive a full refund minus a 10% processing fee.</p>
                  <p><strong>3.2 Late Cancellation:</strong> Cancellations made less than 48 hours before check-in will forfeit 50% of the booking amount.</p>
                  <p><strong>3.3 No-Show:</strong> Failure to check in without prior cancellation will result in forfeiture of the entire booking amount.</p>
                  <p><strong>3.4 Refund Processing:</strong> Approved refunds will be processed within 7-14 business days to the original payment method.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.5}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">4. Guest Responsibilities</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>4.1 Property Care:</strong> Guests are responsible for any damage to hotel property during their stay. Charges for damages will be billed to the guest's account.</p>
                  <p><strong>4.2 Conduct:</strong> Guests must conduct themselves in a respectful manner. The hotel reserves the right to refuse service or remove guests who engage in disruptive or illegal behavior.</p>
                  <p><strong>4.3 Smoking Policy:</strong> Smoking is prohibited in all indoor areas. Designated smoking areas are available. Violation may result in cleaning fees.</p>
                  <p><strong>4.4 Pets:</strong> Pets are not permitted unless specifically designated as service animals.</p>
                  <p><strong>4.5 Noise:</strong> Quiet hours are from 10:00 PM to 7:00 AM. Guests must respect other guests' right to peaceful enjoyment.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.6}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">5. Liability and Insurance</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>5.1 Personal Property:</strong> The hotel is not responsible for loss or damage to guests' personal property. We recommend using the in-room safe for valuables.</p>
                  <p><strong>5.2 Limitation of Liability:</strong> The hotel's liability is limited to direct damages and does not exceed the total amount paid for the booking.</p>
                  <p><strong>5.3 Force Majeure:</strong> The hotel is not liable for failure to perform obligations due to circumstances beyond our control, including natural disasters, government actions, or other force majeure events.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.7}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">6. Privacy and Data Protection</h2>
                <div className="space-y-3 text-gray-700">
                  <p><strong>6.1 Data Collection:</strong> We collect and process personal information as described in our <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.</p>
                  <p><strong>6.2 Data Security:</strong> We implement appropriate security measures to protect your personal information.</p>
                  <p><strong>6.3 Marketing:</strong> With your consent, we may send promotional materials. You can opt out at any time.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.8}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">7. Modifications to Terms</h2>
                <div className="space-y-3 text-gray-700">
                  <p>Eyah's Hotel & Suites reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.9}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">8. Contact Information</h2>
                <div className="space-y-3 text-gray-700">
                  <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                  <div className="bg-cream p-6 rounded-lg mt-4">
                    <p><strong>Eyah's Hotel & Suites</strong></p>
                    <p>10 Keffi Road, Makurdi, 970101</p>
                    <p>Benue State, Nigeria</p>
                    <p className="mt-3">
                      <strong>Phone:</strong> +234 912 855 5191, +234 816 333 2977<br />
                      <strong>Email:</strong> info@eyahshotel.com
                    </p>
                  </div>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={1.0}>
              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-600">
                  By making a booking with Eyah's Hotel & Suites, you acknowledge that you have read, 
                  understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
