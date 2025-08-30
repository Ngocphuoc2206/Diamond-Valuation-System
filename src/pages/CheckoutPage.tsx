import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { checkout } from "../services/order";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

type PaymentMethod = "COD" | "VNPay" | "Momo" | "Stripe";

type CartItem = {
  id: number;
  sku: string;
  quantity: number;
  unitPrice: number;
  name?: string;
  imageUrl?: string;
  lineTotal?: number;
};

const currency = (n: number) =>
  `$${(Number.isFinite(n) ? n : 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const CheckoutPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { cartKey, items, getTotalPrice, clearCartLocal } = useCart();
  const { user, isAuthenticated } = useAuth();

  // ✅ Customer hoặc Guest đều là "customer-like" (cần cartKey session)
  const isCustomerLike = React.useMemo(() => {
    const roles = Array.isArray(user?.roles)
      ? user?.roles
      : user?.roles
      ? [user?.roles]
      : [];
    const isCustomer = roles.some(
      (r: any) => String(r).toLowerCase() === "customer"
    );
    return isCustomer || !isAuthenticated; // guest => true
  }, [user?.roles, isAuthenticated]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [formData, setFormData] = useState({
    notes: "",
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, type, value } = target;
    const nextValue =
      type === "checkbox" ? (target as HTMLInputElement).checked : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue as any }));
  };

  // Tính tiền
  const { subtotal, tax, insurance, total } = useMemo(() => {
    const sub = getTotalPrice();
    const t = +(sub * 0.08).toFixed(2);
    const ins = formData.insurance ? +(sub * 0.02).toFixed(2) : 0;
    const tot = +(sub + t + ins).toFixed(2);
    return { subtotal: sub, tax: t, insurance: ins, total: tot };
  }, [items, formData.insurance, getTotalPrice]);

  // Submit
  const onPlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items || items.length === 0) {
      setErr("Your cart is empty.");
      toast.error("Your cart is empty.");
      return;
    }

    // Customer/Guest bắt buộc có cartKey (session)
    if (isCustomerLike && !cartKey) {
      setErr("Cart is missing (session). Please add items again.");
      toast.error("Cart is missing. Please add items again.");
      return;
    }

    setIsProcessing(true);
    setErr(null);

    try {
      const payload: any = {
        shippingFee: 0,
        paymentMethod,
        note: formData.notes,
      };
      if (isCustomerLike) {
        payload.cartKey = cartKey; // gửi kèm cho BE
      }

      const res = await checkout(payload);

      if (!res?.success) {
        const message = res?.message || "Checkout failed";
        setErr(message);
        toast.error(`${message} ❌`);
        return;
      }

      const order = res.data;
      const redirect = (order as any)?.payment?.redirectUrl ?? null;

      if (redirect) {
        clearCartLocal();
        window.location.href = redirect;
        return;
      }

      // COD hoặc thanh toán xong
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
        <ToastContainer position="top-right" autoClose={2500} />
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
                            name="paymentMethod"
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
                      autoComplete="cc-number"
                    />
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      required
                      className="input"
                      autoComplete="cc-exp"
                    />
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="CVV"
                      required
                      className="input"
                      autoComplete="cc-csc"
                    />
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      placeholder="Cardholder Name"
                      required
                      className="input"
                      autoComplete="cc-name"
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
                    {isProcessing
                      ? "Processing..."
                      : `Đặt Hàng ${currency(total)}`}
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
              {items.map((it: CartItem) => {
                const line = it.lineTotal ?? it.unitPrice * it.quantity;
                return (
                  <div key={it.id} className="flex justify-between">
                    <span>
                      {(it.name ?? it.sku) as string} x {it.quantity}
                    </span>
                    <span>{currency(line)}</span>
                  </div>
                );
              })}
            </div>
            <hr />
            <div className="flex justify-between mt-4">
              <span>Subtotal</span>
              <span>{currency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{currency(tax)}</span>
            </div>
            {formData.insurance && (
              <div className="flex justify-between">
                <span>Insurance</span>
                <span>{currency(insurance)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span className="text-luxury-gold">{currency(total)}</span>
            </div>
          </motion.div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default CheckoutPage;
