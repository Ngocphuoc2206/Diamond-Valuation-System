import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const FAQPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const categories = [
    { id: 'all', label: t('faq.categories.all'), count: 24 },
    { id: 'valuation', label: t('faq.categories.valuation'), count: 8 },
    { id: 'pricing', label: t('faq.categories.pricing'), count: 5 },
    { id: 'shipping', label: t('faq.categories.shipping'), count: 4 },
    { id: 'certificates', label: t('faq.categories.certificates'), count: 4 },
    { id: 'account', label: t('faq.categories.account'), count: 3 },
  ];

  const faqs = [
    {
      id: '1',
      category: 'valuation',
      question: t('faq.questions.valuationTime'),
      answer: t('faq.answers.valuationTime')
    },
    {
      id: '2',
      category: 'valuation',
      question: t('faq.questions.informationNeeded'),
      answer: t('faq.answers.informationNeeded')
    },
    {
      id: '3',
      category: 'pricing',
      question: t('faq.questions.valuationCost'),
      answer: t('faq.answers.valuationCost')
    },
    {
      id: '4',
      category: 'certificates',
      question: t('faq.questions.valuationDifference'),
      answer: t('faq.answers.valuationDifference')
    },
    {
      id: '5',
      category: 'valuation',
      question: t('faq.questions.insuranceAppraisals'),
      answer: t('faq.answers.insuranceAppraisals')
    },
    {
      id: '6',
      category: 'shipping',
      question: t('faq.questions.safeShipping'),
      answer: t('faq.answers.safeShipping')
    },
    {
      id: '7',
      category: 'pricing',
      question: t('faq.questions.valueTypes'),
      answer: t('faq.answers.valueTypes')
    },
    {
      id: '8',
      category: 'valuation',
      question: t('faq.questions.coloredDiamonds'),
      answer: t('faq.answers.coloredDiamonds')
    },
    {
      id: '9',
      category: 'certificates',
      question: t('faq.questions.certificatesAccepted'),
      answer: t('faq.answers.certificatesAccepted')
    },
    {
      id: '10',
      category: 'pricing',
      question: t('faq.questions.multipleItemsDiscount'),
      answer: t('faq.answers.multipleItemsDiscount')
    },
    {
      id: '11',
      category: 'account',
      question: t('faq.questions.trackRequest'),
      answer: t('faq.answers.trackRequest')
    },
    {
      id: '12',
      category: 'shipping',
      question: t('faq.questions.lossOrDamage'),
      answer: t('faq.answers.lossOrDamage')
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
              {t('faq.title')} <span className="text-luxury-gold">{t('faq.titleHighlight')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              {t('faq.description')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('faq.searchPlaceholder')}
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
              <h3 className="text-lg font-bold mb-6">{t('faq.categoriesTitle')}</h3>
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
                <h4 className="font-bold mb-4">{t('faq.stillHaveQuestions')}</h4>
                <div className="space-y-3">
                  <a
                    href="/contact"
                    className="block btn btn-primary text-center text-sm py-3"
                  >
                    {t('faq.contactUs')}
                  </a>
                  <a
                    href="/valuation"
                    className="block btn btn-secondary text-center text-sm py-3"
                  >
                    {t('faq.startValuation')}
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
                  {activeCategory === 'all' ? t('faq.categories.all') : categories.find(c => c.id === activeCategory)?.label}
                </h2>
                <span className="text-gray-600">
                  {filteredFAQs.length} {filteredFAQs.length === 1 ? t('faq.question') : t('faq.questions')}
                </span>
              </div>
              {searchQuery && (
                <p className="text-gray-600 mt-2">
                  {t('faq.searchResults')}: <strong>"{searchQuery}"</strong>
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
                  <h3 className="text-xl font-bold mb-2">{t('faq.noResults')}</h3>
                  <p className="text-gray-600 mb-6">
                    {t('faq.noResultsDesc')}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="btn btn-primary"
                  >
                    {t('faq.clearSearch')}
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
                <h3 className="text-2xl font-serif font-bold mb-8">{t('faq.popularTopics')}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold mb-3">💎 {t('faq.topics.diamondGrading')}</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('faq.topics.diamondGradingDesc')}
                    </p>
                    <button
                      onClick={() => setActiveCategory('valuation')}
                      className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                    >
                      {t('faq.viewQuestions')} →
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold mb-3">💰 {t('faq.topics.pricingFees')}</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('faq.topics.pricingFeesDesc')}
                    </p>
                    <button
                      onClick={() => setActiveCategory('pricing')}
                      className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                    >
                      {t('faq.viewQuestions')} →
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold mb-3">📋 {t('faq.topics.certificates')}</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('faq.topics.certificatesDesc')}
                    </p>
                    <button
                      onClick={() => setActiveCategory('certificates')}
                      className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                    >
                      {t('faq.viewQuestions')} →
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="font-bold mb-3">🚚 {t('faq.topics.shippingSafety')}</h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('faq.topics.shippingSafetyDesc')}
                    </p>
                    <button
                      onClick={() => setActiveCategory('shipping')}
                      className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                    >
                      {t('faq.viewQuestions')} →
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
              {t('faq.readyToStart')}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('faq.readyToStartDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/valuation" className="btn btn-gold text-lg px-8 py-4">
                {t('faq.startValuation')}
              </a>
              <a href="/contact" className="btn btn-secondary text-lg px-8 py-4">
                {t('faq.contactSupport')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
