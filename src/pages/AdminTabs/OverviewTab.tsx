// src/pages/admin/tabs/OverviewTab.tsx
// ============================
import React from "react";
import { motion } from "framer-motion";

interface OverviewTabProps {
  t: (key: string) => string;
  dashboardStats: {
    totalUsers: number;
    totalValuations: number;
    monthlyRevenue: number;
    customerRating: number;
  };
  recentActivities: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    priority: "high" | "normal" | "low";
  }>;
  onQuickOpen: (tabId: string) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const OverviewTab: React.FC<OverviewTabProps> = ({
  t,
  dashboardStats,
  recentActivities,
  onQuickOpen,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-8"
    >
      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("admin.totalUsers")}
              </p>
              <p className="text-3xl font-bold text-luxury-navy">
                {dashboardStats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              ↗ +12% {t("admin.fromLastMonth")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("admin.totalValuations")}
              </p>
              <p className="text-3xl font-bold text-luxury-navy">
                {dashboardStats.totalValuations.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">💎</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              ↗ +8% {t("admin.fromLastMonth")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("admin.monthlyRevenue")}
              </p>
              <p className="text-3xl font-bold text-luxury-navy">
                ${"" + dashboardStats.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              ↗ +15% {t("admin.fromLastMonth")}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t("admin.customerRating")}
              </p>
              <p className="text-3xl font-bold text-luxury-navy">
                {dashboardStats.customerRating}/5
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              ↗ +0.2 {t("admin.fromLastMonth")}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-serif font-bold mb-6">
          {t("admin.quickActions")}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => onQuickOpen("users")}
            className="flex items-center space-x-3 p-4 border border-luxury-navy rounded-lg hover:bg-luxury-navy hover:text-white transition-colors"
          >
            <span className="text-2xl">👥</span>
            <div className="text-left">
              <p className="font-medium">{t("admin.manageUsers")}</p>
              <p className="text-sm opacity-75">
                {t("admin.viewEditAccounts")}
              </p>
            </div>
          </button>
          <button
            onClick={() => onQuickOpen("valuations")}
            className="flex items-center space-x-3 p-4 border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors"
          >
            <span className="text-2xl">💎</span>
            <div className="text-left">
              <p className="font-medium">{t("admin.valuationQueue")}</p>
              <p className="text-sm opacity-75">{t("admin.monitorPending")}</p>
            </div>
          </button>
          <button
            onClick={() => onQuickOpen("analytics")}
            className="flex items-center space-x-3 p-4 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
          >
            <span className="text-2xl">📈</span>
            <div className="text-left">
              <p className="font-medium">{t("admin.viewAnalytics")}</p>
              <p className="text-sm opacity-75">
                {t("admin.businessInsights")}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-serif font-bold mb-6">
          {t("admin.systemActivities")}
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-full ${
                    activity.type === "valuation"
                      ? "bg-purple-100"
                      : activity.type === "order"
                      ? "bg-blue-100"
                      : activity.type === "user"
                      ? "bg-green-100"
                      : activity.type === "staff"
                      ? "bg-yellow-100"
                      : "bg-gray-100"
                  }`}
                >
                  <span className="text-sm">
                    {activity.type === "valuation"
                      ? "💎"
                      : activity.type === "order"
                      ? "📦"
                      : activity.type === "user"
                      ? "👤"
                      : activity.type === "staff"
                      ? "👨‍💼"
                      : "⚙️"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : activity.priority === "normal"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {activity.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewTab;
