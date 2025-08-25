import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div className="h-screen flex flex-col items-center justify-center text-center p-6">
    <h1 className="text-3xl font-semibold mb-2">404 – Trang không tồn tại</h1>
    <Link to="/dashboard" className="text-luxury-gold hover:underline">
      Về Dashboard
    </Link>
  </div>
);

export default NotFound;
