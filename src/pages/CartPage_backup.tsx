import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const CartPage: React.FC = () => {
  // CartContext server-backed
  const {
    items,
    updateQuantity, // (cartItemId, qty)
    removeItem, // ✅ ĐÚNG TÊN: removeItem (không phải removeFromCart)
    getTotalPrice,
    clearCartLocal,
  } = useCart();
  const { t } = useLanguage();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Xoá toàn bộ trên server: gọi remove từng cartItem (tránh chỉ clear local)
  const handleClearAll = async () => {
    for (const it of items) {
      try {
        await removeItem(it.id);
      } catch {}
    }
    clearCartLocal(); // tuỳ chọn: dọn local
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center max-w-md mx-auto p-6"
        >
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            {t("cart.empty")}
          </h1>
          <p className="text-gray-600 mb-8">{t("cart.emptyDesc")}</p>
          <Link to="/shop" className="btn btn-primary inline-block">
            {t("cart.continueShopping")}
          </Link>
        </motion.div>
      </div>
    );
  }

  // Tính thuế demo 8%
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-luxury-navy text-white py-12 md:py-16">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              {t("cart.title")}{" "}
              <span className="text-luxury-gold">
                {t("cart.titleHighlight")}
              </span>
            </h1>
            <p className="text-lg text-gray-300">{t("cart.description")}</p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold">
                  Cart Items ({items.length})
                </h2>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 pb-6 border-b last:border-b-0"
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name ?? item.sku}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        N/A
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {item.name ?? item.sku}
                      </h3>
                      <p className="text-luxury-gold font-bold text-xl">
                        ${item.unitPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ${item.lineTotal.toLocaleString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)} // ✅ dùng removeItem
                        className="text-red-600 hover:text-red-800 text-sm mt-1"
                      >
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="inline-flex items-center text-luxury-navy hover:text-luxury-gold"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {t("cart.continueShopping")}
            </Link>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-serif font-bold mb-6">
                {t("cart.orderSummary")}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>{t("cart.subtotal")}</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.shipping")}</span>
                  <span className="text-green-600">{t("cart.free")}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.tax")}</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("cart.total")}</span>
                  <span className="text-luxury-gold">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="btn btn-primary w-full text-center block"
                >
                  {t("cart.proceedCheckout")}
                </Link>
                <button type="button" className="btn btn-secondary w-full">
                  {t("cart.requestQuote")}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-medium mb-4">{t("cart.whyChoose")}</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Certified Authentic Diamonds</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>30-Day Return Policy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Free Insured Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{t("cart.lifetimeWarranty")}</span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-gray-600 mb-3">
                  {t("cart.needHelp")}
                </p>
                <Link
                  to="/contact"
                  className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                >
                  {t("cart.contactExperts")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
