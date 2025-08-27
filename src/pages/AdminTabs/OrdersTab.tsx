// src/pages/admin/tabs/OrderTab.tsx
// ============================
import React from "react";
import { motion as motion4 } from "framer-motion";

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: string;
  date: string;
}
interface OrderStats {
  newOrders: number;
  processing: number;
  shipped: number;
  delivered: number;
  totalRevenue: number;
}

interface OrderTabProps {
  t: (key: string) => string;
  orders: Order[];
  orderStats: OrderStats;
  handleOrderAction: (action: string, orderId?: string) => void;
}

const fadeInUp4 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const OrderTab: React.FC<OrderTabProps> = ({
  t,
  orders,
  orderStats,
  handleOrderAction,
}) => (
  <motion4.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp4}
    className="space-y-6"
  >
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold">
          {t("admin.ordermanager")}
        </h3>
        <div className="flex space-x-3">
          <select className="px-3 py-2 border rounded-md">
            <option>All Orders</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
          <button
            onClick={() => handleOrderAction("export")}
            className="btn btn-secondary"
          >
            Export
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800">{t("admin.neworders")}</h4>
          <p className="text-2xl font-bold text-blue-900">
            {orderStats.newOrders}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800">
            {t("admin.processing")}
          </h4>
          <p className="text-2xl font-bold text-yellow-900">
            {orderStats.processing}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800">{t("admin.shipped")}</h4>
          <p className="text-2xl font-bold text-purple-900">
            {orderStats.shipped}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">{t("admin.delivered")}</h4>
          <p className="text-2xl font-bold text-green-900">
            {orderStats.delivered}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800">
            {t("admin.totalrevenue")}
          </h4>
          <p className="text-2xl font-bold text-gray-900">
            ${(orderStats.totalRevenue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Order ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Customer
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Items
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Total
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.customer}</td>
                <td className="px-4 py-3">{order.items} items</td>
                <td className="px-4 py-3 font-bold">
                  ${order.total.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs capitalize ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">{order.date}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOrderAction("view", order.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleOrderAction("update_status", order.id)
                      }
                      className="text-green-600 hover:text-green-800"
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion4.div>
);

export default OrderTab;
