import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import FadeInView from '../components/animations/FadeInView';
import SlideInView from '../components/animations/SlideInView';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/img (4).jpg)' }}
        />
        <div className="container-custom relative z-20 text-white text-center">
          <FadeInView>
            <h1 className="heading-primary text-white mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We'd love to hear from you. Get in touch with us today.
            </p>
          </FadeInView>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <SlideInView direction="left">
              <div>
                <h2 className="heading-tertiary mb-6">Get In Touch</h2>
                <p className="text-body mb-8">
                  Have questions or need assistance? Our team is here to help. 
                  Reach out to us through any of the following channels.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <MapPin className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Location</h3>
                      <p className="text-gray-600">Makurdi, Benue State, Nigeria</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Phone className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Phone</h3>
                      <p className="text-gray-600">+234 912 855 5191</p>
                      <p className="text-gray-600">+234 816 333 2977</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Mail className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Email</h3>
                      <p className="text-gray-600">info@eyahshotel.com</p>
                      <p className="text-gray-600">reservations@eyahshotel.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Clock className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark mb-1">Working Hours</h3>
                      <p className="text-gray-600">24/7 Reception & Support</p>
                      <p className="text-gray-600">Check-in: 2:00 PM</p>
                      <p className="text-gray-600">Check-out: 12:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </SlideInView>

            {/* Contact Form */}
            <SlideInView direction="right">
              <div className="bg-cream p-8 rounded-lg">
                <h2 className="heading-tertiary mb-6">Send Us A Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                  </div>

                  <button type="submit" className="w-full btn-primary">
                    Send Message
                  </button>
                </form>
              </div>
            </SlideInView>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[500px] bg-gray-200">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d525818.917598424!2d8.530306!3d7.733926!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x105081ad0dc0150d%3A0xac1351e39bebeeeb!2s10%20Keffi%20Road%2C%20Makurdi%2C%20970101%2C%20Benue%2C%20Nigeria!5e1!3m2!1sen!2sus!4v1763031437960!5m2!1sen!2sus" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Eyah's Hotel & Suites Location"
        />
      </section>
    </div>
  );
};

export default Contact;
