import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

type SuccessState = {
  orderId: string;
  total: number;
  email?: string;
} | null;

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const data = (location.state as SuccessState) || null;

  // Nếu user vào trực tiếp không có state → đưa về shop
  if (!data) return <Navigate to="/shop" replace />;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="container-custom py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-white rounded-lg shadow-md max-w-2xl mx-auto p-8 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-navy mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua sắm. Chúng tôi đã gửi xác nhận tới
            {' '}
            <strong>{data.email || 'email của bạn'}</strong>.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
            <p className="mb-1"><span className="font-medium">Mã đơn hàng:</span> {data.orderId}</p>
            <p><span className="font-medium">Tổng thanh toán:</span> ${data.total.toLocaleString()}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="btn btn-secondary">Tiếp tục mua sắm</Link>
            <Link to="/customer-dashboard" className="btn btn-primary">Xem đơn hàng của tôi</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
