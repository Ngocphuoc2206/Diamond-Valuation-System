import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-md mx-auto p-6"
        >
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-6xl mb-6">✉️</div>
            <h1 className="text-3xl font-serif font-bold text-luxury-navy mb-4">
              {t('contact.messageSent')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('contact.messageReceived')}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '', email: '', phone: '', subject: '', message: '', contactMethod: 'email'
                });
              }}
              className="btn btn-primary"
            >
              {t('contact.sendAnother')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-luxury-navy text-white py-16 md:py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {t('contact.title')} <span className="text-luxury-gold">{t('contact.titleHighlight')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              {t('contact.description')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-luxury-gold bg-opacity-10 rounded-full">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy mb-1">{t('contact.phoneNumber')}</h3>
                    <p className="text-gray-600">+ 342506338</p>
                    <p className="text-sm text-gray-500">{t('contact.mondayFriday')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-luxury-gold bg-opacity-10 rounded-full">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy mb-1">{t('contact.emailAddress')}</h3>
                    <p className="text-gray-600">congty@diamondvalley.com</p>
                    <p className="text-sm text-gray-500">Chúng tôi trả lời trong vòng 24 giờ</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-luxury-gold bg-opacity-10 rounded-full">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy mb-1">{t('contact.address')}</h3>
                    <p className="text-gray-600">
                      {t('contact.officeAddress')}
                    </p>
                    <p className="text-sm text-gray-500">Chỉ theo lịch hẹn</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-luxury-gold bg-opacity-10 rounded-full">
                    <svg className="w-6 h-6 text-luxury-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-navy mb-1">{t('contact.officeHours')}</h3>
                    <p className="text-gray-600">
                      {t('contact.mondayFriday')}<br />
                      {t('contact.saturday')}<br />
                      {t('contact.sunday')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-bold text-red-800 mb-2">Emergency Valuations</h4>
                <p className="text-sm text-red-600 mb-2">
                  For urgent insurance claims or legal matters:
                </p>
                <p className="font-bold text-red-800">+1 (555) 999-URGENT</p>
                <p className="text-xs text-red-500">24/7 Emergency Line</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-serif font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder={t('contact.name')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder={t('placeholder.emailFormat')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      placeholder={t('placeholder.phoneFormat')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.contactMethod')}
                    </label>
                    <select
                      name="contactMethod"
                      value={formData.contactMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                    >
                      <option value="email">{t('contact.email')}</option>
                      <option value="phone">{t('contact.phone')}</option>
                      <option value="text">{t('contact.either')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.subject')} *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                  >
                    <option value="">Select a subject</option>
                    <option value="valuation">Diamond Valuation Inquiry</option>
                    <option value="certification">Certification Questions</option>
                    <option value="purchase">Purchase Consultation</option>
                    <option value="insurance">Insurance Claims</option>
                    <option value="appraisal">Appraisal Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.message')} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                    placeholder={t('contact.message')}
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 text-luxury-gold focus:ring-luxury-gold border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/privacy" className="text-luxury-gold hover:text-luxury-navy">
                      Privacy Policy
                    </a>{' '}
                    and consent to being contacted regarding my inquiry.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>{t('contact.sending')}</span>
                    </div>
                  ) : (
                    t('contact.sendMessage')
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* FAQ Quick Links */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-16"
        >
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold text-center mb-8">
              {t('contact.faqsTitle')}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-bold mb-3">{t('contact.howLongValuation')}</h4>
                <p className="text-gray-600 text-sm mb-4">
                  {t('contact.howLongAnswer')}
                </p>
                <a href="/knowledge" className="text-luxury-gold hover:text-luxury-navy text-sm font-medium">
                  Learn more →
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-bold mb-3">{t('contact.whatInfoNeeded')}</h4>
                <p className="text-gray-600 text-sm mb-4">
                  {t('contact.whatInfoAnswer')}
                </p>
                <a href="/valuation" className="text-luxury-gold hover:text-luxury-navy text-sm font-medium">
                  Start valuation →
                </a>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-bold mb-3">{t('contact.insuranceAccepted')}</h4>
                <p className="text-gray-600 text-sm mb-4">
                  {t('contact.insuranceAnswer')}
                </p>
                <a href="/knowledge" className="text-luxury-gold hover:text-luxury-navy text-sm font-medium">
                  {t('contact.viewCredentials')}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
