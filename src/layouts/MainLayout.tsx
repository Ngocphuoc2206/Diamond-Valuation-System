import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Bars3Icon, XMarkIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Valuation Tool', href: '/valuation' },
  { name: 'Diamond Knowledge', href: '/knowledge' },
  { name: 'Contact', href: '/contact' },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchQuery);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-10">
        {/* Top bar */}
        <div className="bg-luxury-navy text-white py-2">
          <div className="container-custom flex items-center justify-between">
            <div className="text-sm">
              <span>Free shipping on orders over $1000</span>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:text-luxury-gold transition">FAQ</a>
              <a href="#" className="hover:text-luxury-gold transition">Contact</a>
              <div className="flex gap-2">
                <a href="#" className="hover:text-luxury-gold transition">EN</a>
                <span>|</span>
                <a href="#" className="hover:text-luxury-gold transition">VI</a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main navbar */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container-custom">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              {/* Logo */}
              <div className="lg:flex lg:items-center lg:gap-12">
                <Link to="/" className="flex">
                  <span className="font-serif text-2xl font-bold text-luxury-navy">
                    Diamond <span className="text-luxury-gold">Valuation</span>
                  </span>
                </Link>
                
                {/* Desktop navigation */}
                <nav className="hidden lg:flex lg:gap-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`text-sm font-medium ${
                        isActive(item.href)
                          ? 'text-luxury-gold'
                          : 'text-gray-700 hover:text-luxury-gold'
                      } py-2 px-1 border-b-2 ${
                        isActive(item.href) ? 'border-luxury-gold' : 'border-transparent'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-4">
                <button 
                  className="p-2 text-gray-500 hover:text-luxury-gold transition-colors"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <span className="sr-only">Search</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
                
                <Link to="/cart" className="relative p-2 text-gray-500 hover:text-luxury-gold transition-colors">
                  <span className="sr-only">Cart</span>
                  <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-medium text-white">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center text-sm font-medium text-gray-700 hover:text-luxury-gold">
                      <span className="mr-1">{user?.name}</span>
                      <UserIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                      <div className="py-1">
                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                        <button
                          onClick={logout}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-luxury-gold">
                    Sign in
                  </Link>
                )}
                
                <Link to="/valuation" className="hidden md:block btn btn-primary">
                  Get Valuation
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-full bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-bold text-luxury-navy">
                  Diamond <span className="text-luxury-gold">Valuation</span>
                </span>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign in
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute inset-0 z-40 flex items-start justify-center pt-16 px-4 sm:px-6 md:pt-24 bg-white/95">
            <div className="w-full max-w-2xl">
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-500 hover:text-luxury-gold"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for diamonds, valuations, or articles..."
                  className="w-full py-3 px-4 border-b-2 border-luxury-navy focus:border-luxury-gold bg-transparent focus:outline-none text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full flex items-center px-4 text-gray-500 hover:text-luxury-gold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </form>
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    onClick={() => setSearchQuery("Diamond certification")}
                  >
                    Diamond certification
                  </button>
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    onClick={() => setSearchQuery("4C's of diamonds")}
                  >
                    4C's of diamonds
                  </button>
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    onClick={() => setSearchQuery("Valuation process")}
                  >
                    Valuation process
                  </button>
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    onClick={() => setSearchQuery("Diamond care")}
                  >
                    Diamond care
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container-custom py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-xl font-bold mb-4">
                Diamond <span className="text-luxury-gold">Valuation</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Your trusted partner for diamond valuation, certification, and expertise in the world of luxury gemstones.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-luxury-gold transition">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-luxury-gold transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-luxury-gold transition">
                  <span className="sr-only">X / Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5549 21H20.7996L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-luxury-gold transition">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-luxury-gold transition">Home</Link></li>
                <li><Link to="/knowledge" className="text-gray-400 hover:text-luxury-gold transition">Diamond Knowledge</Link></li>
                <li><Link to="/valuation" className="text-gray-400 hover:text-luxury-gold transition">Valuation Tool</Link></li>
                <li><Link to="/shop" className="text-gray-400 hover:text-luxury-gold transition">Shop</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-luxury-gold transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-gray-400 hover:text-luxury-gold transition">FAQ</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-luxury-gold transition">Contact Us</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-luxury-gold transition">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-luxury-gold transition">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest diamond trends and valuation insights.</p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="py-2 px-3 bg-gray-800 border border-gray-700 text-white rounded-l-md focus:outline-none focus:ring-1 focus:ring-luxury-gold flex-grow"
                />
                <button 
                  type="submit"
                  className="bg-luxury-gold text-white py-2 px-4 rounded-r-md hover:bg-opacity-90 transition"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="bg-black py-4 text-center text-gray-400 text-sm">
          <div className="container-custom">
            <p>© {new Date().getFullYear()} Diamond Valuation System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
