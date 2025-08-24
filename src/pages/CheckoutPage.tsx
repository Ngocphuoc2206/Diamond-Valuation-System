import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { OrderAPI } from "../services/order";
import { toast } from "react-toastify";

type PaymentMethod = "COD" | "VNPay" | "Momo" | "Stripe";

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { cartKey, items, getTotalPrice, clearCartLocal } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [formData, setFormData] = useState({
    notes: "",
    newsletter: false,
    insurance: true,
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  /** Xử lý thay đổi input (fix lỗi checked) */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Tính tiền
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const insurance = formData.insurance ? subtotal * 0.02 : 0;
  const total = subtotal + tax + insurance;

  // Submit
  const onPlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cartKey) {
      setErr("Cart is missing. Please add items again.");
      return;
    }
    if (items.length === 0) {
      setErr("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    setErr(null);

    try {
      const payload = {
        cartKey,
        shippingFee: 0,
        paymentMethod,
        note: formData.notes,
      };

      const res = await OrderAPI.checkout(payload);

      if (!res?.success) {
        setErr(res?.message || "Checkout failed");
        toast.error(res?.message || "Checkout failed ❌");
        return;
      }

      const order = res.data;
      const redirect = (order as any)?.payment?.redirectUrl ?? null;

      if (redirect) {
        clearCartLocal();
        window.location.href = redirect;
        return;
      }

      // COD hoặc đã thanh toán xong
      clearCartLocal();
      toast.success("Đặt hàng thành công 🎉");
      navigate("/");
    } catch (e: any) {
      const msg =
        e?.response?.data?.message || e?.message || "Đặt hàng thất bại";
      setErr(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center"
        >
          <h1 className="text-2xl font-bold mb-4">🛒 Cart Empty</h1>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-luxury-navy text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            {t("checkout.title")}
          </h1>
          <p className="text-lg text-gray-300">{t("checkout.description")}</p>
        </div>
      </section>

      <div className="container-custom py-12">
        <form onSubmit={onPlaceOrder} className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1 */}
            {currentStep === 1 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-serif font-bold mb-6">
                  {t("checkout.paymentInfo")}
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {(["COD", "VNPay", "Momo", "Stripe"] as PaymentMethod[]).map(
                    (pm) => (
                      <label
                        key={pm}
                        className={`border rounded-md p-3 cursor-pointer flex items-center justify-between ${
                          paymentMethod === pm
                            ? "border-luxury-gold ring-2 ring-luxury-gold/30"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value={pm}
                            checked={paymentMethod === pm}
                            onChange={() => setPaymentMethod(pm)}
                          />
                          <span className="font-medium">{pm}</span>
                        </div>
                      </label>
                    )
                  )}
                </div>

                {paymentMethod === "Stripe" && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Card Number"
                      required
                      className="input"
                    />
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="input"
                    />
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      required
                      className="input"
                    />
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Cardholder Name"
                      required
                      className="input"
                    />
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="btn btn-primary"
                  >
                    {t("checkout.continue")}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-serif font-bold mb-6">Review</h2>

                {err && <div className="text-red-600 mb-4">{err}</div>}

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Order notes"
                  rows={4}
                  className="w-full border rounded-md p-3 mb-4"
                />

                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="insurance"
                    checked={formData.insurance}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Add shipping insurance (2%)</span>
                </label>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="btn btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn btn-primary"
                  >
                    {isProcessing ? "Processing..." : `Đặt Hàng $${total}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white p-6 rounded-lg shadow-md sticky top-6"
          >
            <h3 className="text-xl font-serif font-bold mb-6">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between">
                  <span>
                    {it.name ?? it.sku} x {it.quantity}
                  </span>
                  <span>${it.lineTotal.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <hr />
            <div className="flex justify-between mt-4">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            {formData.insurance && (
              <div className="flex justify-between">
                <span>Insurance</span>
                <span>${insurance.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span className="text-luxury-gold">
                ${total.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
