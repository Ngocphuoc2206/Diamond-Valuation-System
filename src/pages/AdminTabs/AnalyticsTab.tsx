// src/pages/admin/tabs/AnalyticsTab.tsx
// ============================
import React from "react";
import { motion as motion7 } from "framer-motion";

interface AnalyticsTabProps {
  t: (key: string) => string;
}
const fadeInUp7 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ t }) => (
  <motion7.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp7}
    className="space-y-6"
  >
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-serif font-bold mb-6">
        {t("admin.businessAnalytics")}
      </h3>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h4 className="font-medium opacity-90">{t("admin.monthlyRevenu")}</h4>
          <p className="text-3xl font-bold">$342,890</p>
          <p className="text-sm opacity-75">↗ +12.5% from last month</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h4 className="font-medium opacity-90">{t("admin.newCustomers")}</h4>
          <p className="text-3xl font-bold">284</p>
          <p className="text-sm opacity-75">↗ +8.3% from last month</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <h4 className="font-medium opacity-90">
            {t("admin.conversionRate")}
          </h4>
          <p className="text-3xl font-bold">18.2%</p>
          <p className="text-sm opacity-75">↗ +2.1% from last month</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
          <h4 className="font-medium opacity-90">{t("admin.avgOrderValue")}</h4>
          <p className="text-3xl font-bold">$1,847</p>
          <p className="text-sm opacity-75">↗ +5.7% from last month</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4">{t("admin.revenuTrend")}</h4>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">{t("placeholder.revenueChart")}</p>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4">{t("admin.customerAcquisition")}</h4>
          <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">{t("placeholder.customerChart")}</p>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4">{t("admin.productPerformance")}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{t("admin.engagementRings")}</span>
              <span className="font-bold">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-luxury-gold h-2 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span>{t("admin.necklaces")}</span>
              <span className="font-bold">28%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-luxury-gold h-2 rounded-full"
                style={{ width: "28%" }}
              ></div>
            </div>
            <div className="flex justify-between">
              <span>{t("admin.earrings")}</span>
              <span className="font-bold">18%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-luxury-gold h-2 rounded-full"
                style={{ width: "18%" }}
              ></div>
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-4">{t("admin.serviceUsage")}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>{t("admin.valuationServices")}</span>
              <span className="font-bold text-blue-600">342 requests</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("admin.consultationCalls")}</span>
              <span className="font-bold text-green-600">156 calls</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("admin.onlineStoreOrders")}</span>
              <span className="font-bold text-purple-600">156 orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion7.div>
);

export default AnalyticsTab;
