// src/pages/OrderSuccessPage.tsx
import React from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";

const OrderSuccessPage: React.FC = () => {
  const [params] = useSearchParams();
  const code = params.get("code") || "N/A";
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/shop");
    setTimeout(() => {
      window.location.reload();
    }, 0);
  };

  return (
    <div className="container-custom py-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-3">Đặt hàng thành công</h1>
        <p>
          Mã đơn của bạn: <b>{code}</b>
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Về trang chủ
          </Link>
          <button
            onClick={handleContinueShopping}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};
export default OrderSuccessPage;
