import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { diamonds, articles } from '../data/mockData';

const HomePage: React.FC = () => {
  // Take first 3 featured articles for the homepage
  const featuredArticles = articles.filter(article => article.featured).slice(0, 3);
  
  // Featured diamonds
  const featuredDiamonds = diamonds.filter(diamond => diamond.featured).slice(0, 3);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2574&auto=format&fit=crop" 
            alt="Stunning diamond" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        <div className="relative z-10 container-custom text-center text-white">
          <motion.h1 
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Diamond Valuation <span className="text-luxury-gold">Excellence</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Expert diamond appraisal services with unmatched precision and trust.
            Discover the true value of your precious gemstones.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/valuation" className="btn bg-luxury-gold text-white hover:bg-opacity-90 px-8 py-3 rounded-md font-medium text-lg">
              Get a Valuation
            </Link>
            <Link to="/knowledge" className="btn bg-transparent text-white border border-white hover:bg-white hover:bg-opacity-10 px-8 py-3 rounded-md font-medium text-lg">
              Learn About Diamonds
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div 
            className="animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
          </motion.div>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Welcome to <span className="text-luxury-gold">Diamond Valuation System</span></h2>
            <p className="text-lg text-gray-600">
              We provide expert diamond appraisal services with state-of-the-art technology and experienced specialists.
              Our mission is to deliver accurate, transparent, and reliable diamond valuations that help our clients
              make informed decisions about their precious gemstones.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Service 1 */}
            <motion.div className="bg-white rounded-lg p-8 shadow-md text-center" variants={fadeIn}>
              <div className="bg-luxury-gold bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-luxury-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Diamond Valuation</h3>
              <p className="text-gray-600">
                Accurate diamond appraisal using advanced technology and expert analysis
                for insurance, resale, or personal knowledge.
              </p>
            </motion.div>
            
            {/* Service 2 */}
            <motion.div className="bg-white rounded-lg p-8 shadow-md text-center" variants={fadeIn}>
              <div className="bg-luxury-gold bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-luxury-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Certification</h3>
              <p className="text-gray-600">
                Professional diamond certification services to authenticate and
                document the precise characteristics of your diamonds.
              </p>
            </motion.div>
            
            {/* Service 3 */}
            <motion.div className="bg-white rounded-lg p-8 shadow-md text-center" variants={fadeIn}>
              <div className="bg-luxury-gold bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-luxury-gold">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Consultation</h3>
              <p className="text-gray-600">
                Personalized guidance from diamond specialists to help you understand 
                your gemstone's quality and value.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Valuation Process Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our <span className="text-luxury-gold">Valuation Process</span></h2>
            <p className="text-lg text-gray-600">
              Experience our streamlined process designed to give you accurate diamond valuations with
              minimal wait time and maximum transparency.
            </p>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Process timeline */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300" />
            
            {/* Step 1 */}
            <motion.div className="relative md:grid md:grid-cols-2 gap-8 mb-12" variants={fadeIn}>
              <div className="md:text-right md:pr-12">
                <div className="hidden md:block absolute right-0 top-6 w-5 h-5 rounded-full bg-luxury-gold transform translate-x-2.5" />
                <h3 className="text-2xl font-bold mb-3">Submit Request</h3>
                <p className="text-gray-600">
                  Fill out our detailed online form with information about your diamond. Include as many 
                  details as you have, such as certification, origin, and physical characteristics.
                </p>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2670&auto=format&fit=crop" 
                  alt="Submit Request" 
                  className="rounded-lg shadow-md w-full h-60 object-cover" 
                />
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div className="relative md:grid md:grid-cols-2 gap-8 mb-12" variants={fadeIn}>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1627903227225-c2a10fefd199?q=80&w=2574&auto=format&fit=crop" 
                  alt="Consultation" 
                  className="rounded-lg shadow-md w-full h-60 object-cover" 
                />
              </div>
              <div className="md:pl-12">
                <div className="hidden md:block absolute left-0 top-6 w-5 h-5 rounded-full bg-luxury-gold transform -translate-x-2.5" />
                <h3 className="text-2xl font-bold mb-3">Consultation</h3>
                <p className="text-gray-600">
                  Our consulting staff will contact you to discuss your valuation needs and arrange 
                  for your diamond to be examined by our experts.
                </p>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div className="relative md:grid md:grid-cols-2 gap-8 mb-12" variants={fadeIn}>
              <div className="md:text-right md:pr-12">
                <div className="hidden md:block absolute right-0 top-6 w-5 h-5 rounded-full bg-luxury-gold transform translate-x-2.5" />
                <h3 className="text-2xl font-bold mb-3">Expert Valuation</h3>
                <p className="text-gray-600">
                  Our gemologists perform a comprehensive analysis using advanced equipment to assess 
                  all aspects of your diamond according to international standards.
                </p>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2574&auto=format&fit=crop" 
                  alt="Expert Valuation" 
                  className="rounded-lg shadow-md w-full h-60 object-cover" 
                />
              </div>
            </motion.div>
            
            {/* Step 4 */}
            <motion.div className="relative md:grid md:grid-cols-2 gap-8" variants={fadeIn}>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1563962585448-ec03defd36a0?q=80&w=2574&auto=format&fit=crop" 
                  alt="Certification" 
                  className="rounded-lg shadow-md w-full h-60 object-cover" 
                />
              </div>
              <div className="md:pl-12">
                <div className="hidden md:block absolute left-0 top-6 w-5 h-5 rounded-full bg-luxury-gold transform -translate-x-2.5" />
                <h3 className="text-2xl font-bold mb-3">Receive Certificate</h3>
                <p className="text-gray-600">
                  Get your comprehensive valuation certificate with all details about your diamond's
                  characteristics, quality, and estimated value in current market conditions.
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          <div className="mt-16 text-center">
            <Link to="/valuation" className="btn btn-primary py-3 px-8 text-lg">
              Start Your Valuation Now
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Diamonds */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Featured <span className="text-luxury-gold">Diamonds</span></h2>
            <p className="text-lg text-gray-600">
              Explore our collection of extraordinary diamonds, each with unique characteristics and exceptional beauty.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredDiamonds.map(diamond => (
              <motion.div 
                key={diamond.id} 
                className="diamond-card group" 
                variants={fadeIn}
              >
                <div className="relative overflow-hidden h-72">
                  <img 
                    src={diamond.images[0]} 
                    alt={diamond.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">{diamond.name}</h3>
                    <p className="text-white opacity-90">{diamond.caratWeight} Carat {diamond.shape}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Clarity:</span>
                      <span className="font-medium">{diamond.clarity}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Color:</span>
                      <span className="font-medium">{diamond.color}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Cut:</span>
                      <span className="font-medium">{diamond.cut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Origin:</span>
                      <span className="font-medium">{diamond.origin}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xl font-bold text-luxury-navy">${diamond.price.toLocaleString()}</span>
                    <Link to={`/diamonds/${diamond.id}`} className="text-luxury-gold hover:text-luxury-navy font-medium">
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Link to="/shop" className="btn btn-secondary py-3 px-8">
              View All Diamonds
            </Link>
          </div>
        </div>
      </section>
      
      {/* Knowledge Base Preview */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Diamond <span className="text-luxury-gold">Knowledge Base</span></h2>
            <p className="text-lg text-gray-600">
              Enhance your understanding of diamonds with our expert articles, guides, and resources.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredArticles.map(article => (
              <motion.div 
                key={article.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md" 
                variants={fadeIn}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.featuredImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-luxury-gold bg-opacity-10 text-luxury-gold text-xs px-2 py-1 rounded">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-xs ml-3">{new Date(article.publishDate).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">{article.excerpt}</p>
                  <Link to={`/knowledge/${article.id}`} className="text-luxury-gold hover:text-luxury-navy font-medium inline-flex items-center">
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center">
            <Link to="/knowledge" className="btn btn-secondary py-3 px-8">
              Explore All Articles
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-luxury-navy text-white">
        <div className="container-custom text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-serif font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Discover Your Diamond's <span className="text-luxury-gold">True Value?</span>
          </motion.h2>
          <motion.p 
            className="text-lg max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Start your diamond valuation journey today with our expert team and receive
            a comprehensive assessment of your precious gemstone.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/valuation" className="btn bg-luxury-gold text-white hover:bg-opacity-90 px-8 py-3 rounded-md font-medium text-lg">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
