import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 👈 thêm useNavigate
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate(); // 👈 init
  const { cartItems, getTotalPrice, clearCart } = useCart(); // 👈 lấy clearCart

  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '', country: 'United States',
    // Payment Information
    cardNumber: '', expiryDate: '', cvv: '', cardName: '',
    // Order Notes
    notes: '',
    // Preferences
    newsletter: false, insurance: true,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const insurance = formData.insurance ? subtotal * 0.02 : 0;
  const total = subtotal + tax + insurance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Giả lập xử lý đặt hàng
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: gọi API backend tạo đơn hàng ở đây
    const orderId = `ORD-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // Xoá giỏ & điều hướng tới trang thành công kèm state
    clearCart();
    setIsProcessing(false);
    navigate('/order-success', {
      replace: true,
      state: { orderId, total, email: formData.email }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-serif font-bold text-luxury-navy mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before proceeding to checkout.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-luxury-navy text-white py-12">
        <div className="container-custom">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">{t('checkout.title')}</h1>
            <p className="text-lg text-gray-300">{t('checkout.description')}</p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Steps */}
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                {[
                  { step: 1, title: t('checkout.shippingInfo') },
                  { step: 2, title: t('checkout.paymentInfo') },
                  { step: 3, title: 'Review' },
                ].map((item) => (
                  <div key={item.step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep >= item.step ? 'bg-luxury-gold text-white' : 'bg-gray-200 text-gray-600'
                    }`}>{item.step}</div>
                    <span className={`ml-2 font-medium ${currentStep >= item.step ? 'text-luxury-navy' : 'text-gray-500'}`}>
                      {item.title}
                    </span>
                    {item.step < 3 && (
                      <div className={`w-12 h-0.5 mx-4 ${currentStep > item.step ? 'bg-luxury-gold' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-serif font-bold mb-6">{t('checkout.shippingInfo')}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('checkout.firstName')} *</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('checkout.lastName')} *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('contact.email')} *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <select name="country" value={formData.country} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold">
                      <option value="United States">United States</option>
                      <option value="Canada">Việt Nam</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
        
                    </select>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-primary">
                    {t('checkout.continue')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-serif font-bold mb-6">{t('checkout.paymentInfo')}</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number *</label>
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder={t('placeholder.cardNumber')} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                      <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder={t('placeholder.expiryDate')} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV *</label>
                      <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder={t('placeholder.cvv')} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                    <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                    {t('checkout.backToShipping')}
                  </button>
                  <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-primary">
                    {t('checkout.continue')}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review & Options */}
            {currentStep === 3 && (
              <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-serif font-bold mb-6">Review & Additional Options</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Special Instructions (Optional)</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={4} placeholder={t('placeholder.orderNotes')} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold" />
                </div>

                <div className="space-y-4 mb-6">
                  <label className="flex items-center">
                    <input type="checkbox" name="insurance" checked={formData.insurance} onChange={handleInputChange} className="text-luxury-gold focus:ring-luxury-gold" />
                    <span className="ml-3">Add shipping insurance (2% of order value - <strong>recommended</strong>)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="newsletter" checked={formData.newsletter} onChange={handleInputChange} className="text-luxury-gold focus:ring-luxury-gold" />
                    <span className="ml-3">Subscribe to our newsletter for exclusive offers and diamond insights</span>
                  </label>
                </div>

                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                    Back to Payment
                  </button>
                  <button type="submit" disabled={isProcessing} className="btn btn-primary flex items-center space-x-2 disabled:opacity-50">
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>{t('checkout.processing')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('checkout.placeOrder')}</span>
                        <span>${total.toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-serif font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between"><span>Tax (estimated)</span><span>${tax.toLocaleString()}</span></div>
                {formData.insurance && (
                  <div className="flex justify-between"><span>Shipping Insurance</span><span>${insurance.toLocaleString()}</span></div>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-luxury-gold">${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    <span>Secure SSL Encryption</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    <span>{t('checkout.moneyBackGuarantee')}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
