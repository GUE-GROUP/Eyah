import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-primary">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <div className="container-custom relative z-10 text-white text-center">
          <FadeInView>
            <Shield size={48} className="mx-auto mb-4" />
            <h1 className="heading-primary text-white mb-4">Privacy Policy</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Your privacy is important to us
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
                  At Eyah's Hotel & Suites, we are committed to protecting your privacy and ensuring 
                  the security of your personal information. This Privacy Policy explains how we collect, 
                  use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </div>
            </FadeInView>

            <FadeInView delay={0.2}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">1.1 Personal Information</h3>
                    <p>When you make a booking or contact us, we may collect:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Full name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Special requests or preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">1.2 Booking Information</h3>
                    <p>Details about your reservations including:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>Check-in and check-out dates</li>
                      <li>Room type and preferences</li>
                      <li>Number of guests</li>
                      <li>Verification codes</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">1.3 Automatically Collected Information</h3>
                    <p>When you visit our website, we automatically collect:</p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Pages visited and time spent</li>
                      <li>Referring website</li>
                    </ul>
                  </div>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.3}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">2. How We Use Your Information</h2>
                <div className="space-y-3 text-gray-700">
                  <p>We use the collected information for the following purposes:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Process Bookings:</strong> To create, confirm, and manage your reservations</li>
                    <li><strong>Communication:</strong> To send booking confirmations, verification codes, and updates</li>
                    <li><strong>Customer Service:</strong> To respond to inquiries and provide support</li>
                    <li><strong>Improve Services:</strong> To analyze usage patterns and enhance our offerings</li>
                    <li><strong>Marketing:</strong> With your consent, to send promotional materials and special offers</li>
                    <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
                  </ul>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.4}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">3. Information Sharing and Disclosure</h2>
                <div className="space-y-3 text-gray-700">
                  <p>We do not sell your personal information. We may share your information with:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Service Providers:</strong> Third-party vendors who assist with email delivery and website hosting</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  </ul>
                  <p className="mt-4">All third-party service providers are contractually obligated to protect your information and use it only for specified purposes.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.5}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">4. Data Security</h2>
                <div className="space-y-3 text-gray-700">
                  <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Encryption of sensitive data during transmission (SSL/TLS)</li>
                    <li>Secure storage of personal information</li>
                    <li>Regular security assessments and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Employee training on data protection</li>
                  </ul>
                  <p className="mt-4">However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.6}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">5. Cookies and Tracking Technologies</h2>
                <div className="space-y-3 text-gray-700">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Maintain your shopping cart</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Improve user experience</li>
                  </ul>
                  <p className="mt-4">You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.7}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">6. Your Rights and Choices</h2>
                <div className="space-y-3 text-gray-700">
                  <p>You have the following rights regarding your personal information:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                    <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
                    <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
                    <li><strong>Object:</strong> Object to processing of your personal information in certain circumstances</li>
                  </ul>
                  <p className="mt-4">To exercise these rights, please contact us using the information provided below.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.8}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">7. Data Retention</h2>
                <div className="space-y-3 text-gray-700">
                  <p>We retain your personal information for as long as necessary to:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Fulfill the purposes outlined in this Privacy Policy</li>
                    <li>Comply with legal, accounting, or reporting requirements</li>
                    <li>Resolve disputes and enforce our agreements</li>
                  </ul>
                  <p className="mt-4">Booking records are typically retained for 7 years for tax and legal purposes.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={0.9}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">8. Children's Privacy</h2>
                <div className="space-y-3 text-gray-700">
                  <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={1.0}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">9. Changes to This Privacy Policy</h2>
                <div className="space-y-3 text-gray-700">
                  <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
                  <ul className="list-disc list-inside ml-4 space-y-2">
                    <li>Posting the updated policy on our website</li>
                    <li>Updating the "Last Updated" date</li>
                    <li>Sending an email notification for significant changes</li>
                  </ul>
                  <p className="mt-4">Your continued use of our services after changes are posted constitutes acceptance of the updated Privacy Policy.</p>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={1.1}>
              <div>
                <h2 className="text-2xl font-bold text-dark mb-4">10. Contact Us</h2>
                <div className="space-y-3 text-gray-700">
                  <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
                  <div className="bg-cream p-6 rounded-lg mt-4">
                    <p><strong>Eyah's Hotel & Suites</strong></p>
                    <p>Data Protection Officer</p>
                    <p>10 Keffi Road, Makurdi, 970101</p>
                    <p>Benue State, Nigeria</p>
                    <p className="mt-3">
                      <strong>Phone:</strong> +234 912 855 5191, +234 816 333 2977<br />
                      <strong>Email:</strong> privacy@eyahshotel.com<br />
                      <strong>General Inquiries:</strong> info@eyahshotel.com
                    </p>
                  </div>
                </div>
              </div>
            </FadeInView>

            <FadeInView delay={1.2}>
              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-600">
                  By using our website and services, you acknowledge that you have read and understood this Privacy Policy 
                  and agree to the collection, use, and disclosure of your information as described herein.
                </p>
              </div>
            </FadeInView>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
