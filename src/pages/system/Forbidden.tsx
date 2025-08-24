import React from "react";
import { Link } from "react-router-dom";

const Forbidden: React.FC = () => (
  <div className="h-screen flex flex-col items-center justify-center text-center p-6">
    <h1 className="text-3xl font-semibold mb-2">
      403 – Không có quyền truy cập
    </h1>
    <p className="text-gray-600 mb-6">Bạn không đủ quyền để vào trang này.</p>
    <Link to="/dashboard" className="text-luxury-gold hover:underline">
      Quay lại Dashboard
    </Link>
  </div>
);

export default Forbidden;
