// src/pages/CheckoutPage.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPayment } from "../services/payment";
import { checkout } from "../services/order";
import { useCart } from "../context/CartContext";
import { getCartKeyForCustomer } from "../utils/cartKey";

// Kiểu địa chỉ chỉ phục vụ form (BE CheckoutDto hiện không dùng các field này)
type FormAddress = {
  fullName: string;
  phone: string;
  email?: string;
  line1?: string;
  city?: string;
  district?: string;
  note?: string;
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart() as any;
  const total = useMemo(() => getTotalPrice?.() ?? 0, [items, getTotalPrice]);

  const [method, setMethod] = useState<"COD" | "FAKE">("FAKE");
  const [addr, setAddr] = useState<FormAddress>({
    fullName: "",
    phone: "",
    email: "",
    line1: "",
    city: "",
    district: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      // 1) Tạo đơn hàng ở OrderService
      // - Nếu là khách (customer với giỏ local) → truyền CartKey
      // - Nếu là nhân sự (non-customer) → truyền CustomerId (BE tự lấy từ token nếu bạn sửa controller)
      const cartKey = getCartKeyForCustomer(); // hoặc lấy từ context bạn đang dùng
      const order = await checkout({
        cartKey,
        shippingFee: 0,
        paymentMethod: method,
        note: addr.note,
      });

      // 2a) COD: điều hướng trang success
      if (method === "COD") {
        navigate(`/order/success?code=${encodeURIComponent(order.orderNo)}`);
        return;
      }

      // 2b) FAKE: tạo Payment rồi redirect sang cổng giả
      const retUrl = `${window.location.origin}/payment/return`;
      const res = await createPayment({
        method: "FAKE",
        amount: order.totalAmount ?? total, // ưu tiên total từ BE
        currency: "VND",
        orderCode: order.orderNo, // dùng mã đơn do BE trả về
        returnUrl: retUrl,
      });

      if (!res.success || !res.data?.redirectUrl || !res.data?.id) {
        throw new Error(res.message || "Không tạo được thanh toán.");
      }

      // Lưu pid để PaymentReturnPage có thể fallback đọc lại
      sessionStorage.setItem("lastPaymentId", String(res.data.id));

      // Redirect sang cổng Fake Payment
      window.location.href = res.data.redirectUrl;
    } catch (ex: any) {
      setErr(ex?.message || "Có lỗi khi xử lý thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        {/* Địa chỉ nhận hàng */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Địa chỉ nhận hàng</h2>
          <div className="space-y-3">
            <input
              className="w-full border p-2 rounded"
              placeholder="Họ tên"
              value={addr.fullName}
              onChange={(e) => setAddr({ ...addr, fullName: e.target.value })}
              required
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Số điện thoại"
              value={addr.phone}
              onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
              required
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Email (tuỳ chọn)"
              value={addr.email}
              onChange={(e) => setAddr({ ...addr, email: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Địa chỉ"
              value={addr.line1}
              onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="Tỉnh/TP"
                value={addr.city}
                onChange={(e) => setAddr({ ...addr, city: e.target.value })}
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Quận/Huyện"
                value={addr.district}
                onChange={(e) => setAddr({ ...addr, district: e.target.value })}
              />
            </div>
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Ghi chú"
              value={addr.note}
              onChange={(e) => setAddr({ ...addr, note: e.target.value })}
            />
          </div>
        </div>

        {/* Phương thức thanh toán + Tổng tiền */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Phương thức thanh toán</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pm"
                checked={method === "FAKE"}
                onChange={() => setMethod("FAKE")}
              />
              <span>FAKE Payment (mô phỏng)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pm"
                checked={method === "COD"}
                onChange={() => setMethod("COD")}
              />
              <span>Thanh toán khi nhận hàng (COD)</span>
            </label>
          </div>

          <div className="mt-6 border-t pt-4">
            <p className="font-medium">
              Tổng tiền: <b>{Number(total).toLocaleString()} VND</b>
            </p>
          </div>

          {err && (
            <div className="mt-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
