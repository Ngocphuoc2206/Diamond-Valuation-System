import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const categories = [
    { id: 'all', label: 'All Questions', count: 24 },
    { id: 'valuation', label: 'Valuation Process', count: 8 },
    { id: 'pricing', label: 'Pricing & Fees', count: 5 },
    { id: 'shipping', label: 'Shipping & Delivery', count: 4 },
    { id: 'certificates', label: 'Certificates', count: 4 },
    { id: 'account', label: 'Account & Orders', count: 3 },
  ];

  const faqs = [
    {
      id: '1',
      category: 'valuation',
      question: 'How long does a diamond valuation take?',
      answer: 'Most diamond valuations are completed within 3-5 business days from the time we receive your diamond or detailed photos and documentation. For urgent insurance claims or legal matters, we offer expedited service with 24-48 hour turnaround for an additional fee.'
    },
    {
      id: '2',
      category: 'valuation',
      question: 'What information do I need to provide for an online valuation?',
      answer: 'For an accurate online valuation, please provide: high-quality photos of your diamond from multiple angles, any existing certificates or appraisals, basic measurements (length, width, depth), and any known details about the diamond\'s characteristics (carat weight, color, clarity, cut grade).'
    },
    {
      id: '3',
      category: 'pricing',
      question: 'How much does a diamond valuation cost?',
      answer: 'Our valuation fees start at $150 for basic online assessments and $300 for comprehensive certified appraisals. Insurance appraisals start at $400. The exact fee depends on the complexity of the piece and the level of detail required.'
    },
    {
      id: '4',
      category: 'certificates',
      question: 'What makes your valuations different from others?',
      answer: 'Our certified gemologists use state-of-the-art equipment and follow international standards. We provide detailed reports that are accepted by major insurance companies and include high-resolution photography, precise measurements, and comprehensive diamond analysis.'
    },
    {
      id: '5',
      category: 'valuation',
      question: 'Do you provide insurance appraisals?',
      answer: 'Yes, we provide certified insurance appraisals that meet insurance company requirements. These include replacement values, detailed descriptions, and high-quality photography. Our appraisals are accepted by all major insurance providers.'
    },
    {
      id: '6',
      category: 'shipping',
      question: 'How do I safely ship my diamond for valuation?',
      answer: 'We provide pre-paid, fully insured shipping labels for diamonds valued over $5,000. For lower-value items, we recommend using registered mail with full insurance coverage. We also offer secure local pickup services in major metropolitan areas.'
    },
    {
      id: '7',
      category: 'pricing',
      question: 'Is there a difference between market value and insurance value?',
      answer: 'Yes, insurance value (replacement cost) is typically 20-50% higher than market value. Insurance value represents what it would cost to replace the item with one of like kind and quality, while market value reflects what you could sell it for today.'
    },
    {
      id: '8',
      category: 'valuation',
      question: 'Can you value colored diamonds and fancy shapes?',
      answer: 'Absolutely! Our gemologists are experienced with all diamond types including colored diamonds, fancy shapes, vintage cuts, and antique pieces. We use specialized equipment and reference databases for accurate valuations of unique stones.'
    },
    {
      id: '9',
      category: 'certificates',
      question: 'What certificates do you accept?',
      answer: 'We work with certificates from GIA, AGS, Gübelin, SSEF, AGL, and other reputable laboratories. If you don\'t have a certificate, we can recommend whether third-party certification would be beneficial for your specific stone.'
    },
    {
      id: '10',
      category: 'pricing',
      question: 'Do you offer discounts for multiple items?',
      answer: 'Yes, we offer volume discounts: 10% off for 3-5 items, 15% off for 6-10 items, and 20% off for 11+ items in a single submission. We also offer special rates for estate evaluations and insurance portfolio reviews.'
    },
    {
      id: '11',
      category: 'account',
      question: 'How do I track my valuation request?',
      answer: 'Once you submit a valuation request, you\'ll receive a tracking number and access to our client portal where you can monitor progress in real-time. You\'ll also receive email updates at each stage of the process.'
    },
    {
      id: '12',
      category: 'shipping',
      question: 'What happens if my diamond is lost or damaged during shipping?',
      answer: 'All shipments are fully insured for the declared value. In the unlikely event of loss or damage, our insurance covers the full replacement value. We use only trusted shipping partners with excellent track records for high-value items.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

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
              Frequently Asked <span className="text-luxury-gold">Questions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Find answers to common questions about our diamond valuation services, 
              pricing, and processes.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQs..."
                  className="w-full px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                />
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-6">Categories</h3>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center justify-between ${
                      activeCategory === category.id
                        ? 'bg-luxury-gold text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-medium">{category.label}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      activeCategory === category.id
                        ? 'bg-white bg-opacity-20'
                        : 'bg-gray-200'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-bold mb-4">Still have questions?</h4>
                <div className="space-y-3">
                  <a
                    href="/contact"
                    className="block btn btn-primary text-center text-sm py-3"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/valuation"
                    className="block btn btn-secondary text-center text-sm py-3"
                  >
                    Start Valuation
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold">
                  {activeCategory === 'all' ? 'All Questions' : categories.find(c => c.id === activeCategory)?.label}
                </h2>
                <span className="text-gray-600">
                  {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                </span>
              </div>
              {searchQuery && (
                <p className="text-gray-600 mt-2">
                  Search results for: <strong>"{searchQuery}"</strong>
                </p>
              )}
            </motion.div>

            {/* FAQ Items */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-4"
            >
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-bold text-lg pr-4">{faq.question}</h3>
                      <svg
                        className={`w-5 h-5 text-luxury-gold transition-transform ${
                          openItems.includes(faq.id) ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openItems.includes(faq.id) && (
                      <div className="px-6 pb-5">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-2">No results found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or browse different categories.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="btn btn-primary"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </motion.div>

            {/* Popular Topics */}
            {searchQuery === '' && activeCategory === 'all' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="mt-16"
              >
                <h3 className="text-2xl font-serif font-bold mb-8">Popular Topics</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold mb-3">💎 Diamond Grading</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Learn about the 4 Cs and how we evaluate diamond quality and characteristics.
                    </p>
                    <button
                      onClick={() => setActiveCategory('valuation')}
                      className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                    >
                      View questions →
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold mb-3">💰 Pricing & Fees</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Understand our transparent pricing structure and what's included in each service.
                    </p>
                    <button
                      onClick={() => setActiveCategory('pricing')}
                      className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                    >
                      View questions →
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold mb-3">📋 Certificates</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Information about diamond certificates and how they affect valuation.
                    </p>
                    <button
                      onClick={() => setActiveCategory('certificates')}
                      className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                    >
                      View questions →
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold mb-3">🚚 Shipping & Safety</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      Safe shipping practices and insurance coverage for your valuable items.
                    </p>
                    <button
                      onClick={() => setActiveCategory('shipping')}
                      className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                    >
                      View questions →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-luxury-navy text-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              If you didn't find the answer you're looking for, our expert team 
              is here to help you with personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/valuation" className="btn btn-gold text-lg px-8 py-4">
                Start Valuation
              </a>
              <a href="/contact" className="btn btn-secondary text-lg px-8 py-4">
                Contact Support
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
