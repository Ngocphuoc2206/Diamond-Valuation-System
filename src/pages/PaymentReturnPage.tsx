// src/pages/PaymentReturnPage.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getPaymentById, type PaymentViewDto } from "../services/payment";
import { useCart } from "../context/CartContext";

const isSuccessStatus = (s: unknown) => {
  if (s === true) return true;
  if (s === 1) return true;
  const str = String(s ?? "").toLowerCase();
  return ["succeeded", "success", "ok", "1"].includes(str);
};

const PaymentReturnPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCartLocal } = useCart(); // ✅ dùng đúng hàm từ CartContext

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentViewDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1) Lấy pid từ URL; nếu không có thì fallback bằng sessionStorage.lastPaymentId
  const pidParam = params.get("pid");
  let pid = pidParam ? Number(pidParam) : NaN;
  if (!Number.isFinite(pid)) {
    const last = sessionStorage.getItem("lastPaymentId");
    if (last) pid = Number(last);
  }
  const hasPid = Number.isFinite(pid);

  // 2) Gọi API lấy trạng thái nếu có pid
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!hasPid) {
        setLoading(false);
        return;
      }

      try {
        const res = await getPaymentById(pid as number);
        if (!mounted) return;

        if (res.success && res.data) {
          sessionStorage.removeItem("lastPaymentId");
          setPayment(res.data);

          // ✅ Nếu thanh toán thành công → xóa giỏ & điều hướng
          if (isSuccessStatus(res.data.status)) {
            try {
              clearCartLocal(); // xóa state + session cart key
            } catch {
              // bỏ qua nếu provider khác tên (nhưng theo file bạn gửi là clearCartLocal)
            }

            if (res.data.orderCode) {
              setTimeout(() => {
                navigate(
                  `/order/success?code=${encodeURIComponent(
                    res.data!.orderCode!
                  )}`
                );
              }, 300);
            }
          }
        } else {
          setError(res.message || "Không lấy được trạng thái thanh toán.");
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Lỗi khi truy vấn thanh toán.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPid, pid, clearCartLocal, navigate]);

  const status = payment?.status ?? (hasPid ? "Unknown" : "Returned");

  // UI khi thiếu pid & không có fallback
  if (!hasPid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <section className="bg-luxury-navy text-white py-12">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              Kết quả thanh toán
            </h1>
            <p className="text-lg text-gray-300">
              Thiếu mã thanh toán. Có thể bạn đã quay lại không đúng cách.
            </p>
          </div>
        </section>

        <div className="container-custom py-10">
          <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
            <p>
              Vui lòng trở lại giỏ hàng hoặc lịch sử đơn để kiểm tra tình trạng
              đơn hàng của bạn.
            </p>
            <div className="flex gap-3">
              <Link
                to="/"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Về trang chủ
              </Link>
              <Link
                to="/shop"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // UI mặc định khi có pid
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-luxury-navy text-white py-12">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">
            Kết quả thanh toán
          </h1>
        </div>
      </section>

      <div className="container-custom py-10">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
          {loading && <p>Đang tải kết quả…</p>}

          {!loading && error && (
            <div className="p-4 rounded border border-red-300 bg-red-50 text-red-700">
              <div className="flex items-start justify-between gap-3">
                <span>{error}</span>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Thử lại
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="space-y-2">
                <p>
                  <b>Trạng thái:</b> {String(status)}
                </p>
                {payment?.failureReason && (
                  <p className="text-red-600">
                    <b>Lý do:</b> {payment.failureReason}
                  </p>
                )}
                {payment?.orderCode && (
                  <p>
                    <b>Mã đơn:</b> {payment.orderCode}
                  </p>
                )}
                {hasPid && (
                  <p>
                    <b>Payment ID:</b> {pid}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                {payment?.orderCode && (
                  <Link
                    to={`/order/success?code=${encodeURIComponent(
                      payment.orderCode
                    )}`}
                    className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Xem đơn hàng
                  </Link>
                )}
                <Link
                  to="/"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Về trang chủ
                </Link>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => navigate("/shop")}
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentReturnPage;
