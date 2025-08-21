import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { products } from '../data/mockData';

const ProductDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('product.notFound')}</h1>
          <p className="text-gray-600 mb-8">{t('product.notFoundDesc')}</p>
          <Link to="/shop" className="btn btn-primary">
            {t('product.backToShop')}
          </Link>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-luxury-navy">{t('product.breadcrumbHome')}</Link>
            <span className="text-gray-400">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-luxury-navy">{t('product.breadcrumbShop')}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-luxury-navy font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-luxury-gold'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              {product.featured && (
                <span className="inline-block bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Featured
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-navy mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-luxury-gold">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-green-600 font-medium">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Diamond Details */}
            {product.diamondDetails && (
              <div>
                <h3 className="text-lg font-bold mb-4">Diamond Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Shape', value: product.diamondDetails.shape },
                    { label: 'Carat Weight', value: product.diamondDetails.caratWeight },
                    { label: 'Color', value: product.diamondDetails.color },
                    { label: 'Clarity', value: product.diamondDetails.clarity },
                    { label: 'Cut', value: product.diamondDetails.cut },
                    { label: 'Polish', value: product.diamondDetails.polish },
                  ].filter(spec => spec.value).map((spec) => (
                    <div key={spec.label} className="bg-white p-4 rounded-lg shadow-sm">
                      <dt className="text-sm font-medium text-gray-500">{spec.label}</dt>
                      <dd className="text-lg font-bold text-luxury-navy">{spec.value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      Total: ${(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product.inStock ? t('product.addToCart') : 'Out of Stock'}
                  </button>
                  <button className="btn btn-secondary w-full text-lg py-4">
                    {t('product.buyNow')}
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="font-bold mb-4">{t('product.guarantees')}</h4>
              <div className="space-y-3">
                {[
                  { icon: '🔒', text: t('product.certifiedAuthentic') },
                  { icon: '🚚', text: t('product.freeShipping') },
                  { icon: '↩️', text: t('product.thirtyDayReturn') },
                  { icon: '🛡️', text: t('product.lifetimeWarranty') },
                  { icon: '📋', text: t('product.certifiedAuthentic') },
                ].map((guarantee, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-lg">{guarantee.icon}</span>
                    <span className="text-sm">{guarantee.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-3">
                {t('product.needHelp')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="btn btn-secondary text-sm px-6 py-2"
                >
                  {t('product.contactExpert')}
                </Link>
                <Link
                  to="/valuation"
                  className="btn btn-gold text-sm px-6 py-2"
                >
                  {t('product.getValuation')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mt-16"
        >
          <h2 className="text-3xl font-serif font-bold text-center mb-12">
            You May Also Like
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.id !== product.id && p.category === product.category)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/shop/product/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <p className="text-luxury-gold font-bold">
                      ${relatedProduct.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
