// src/pages/admin/tabs/OverviewTab.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
// 👇 sửa đường dẫn: từ tabs/ -> services/
import { getAdminOverview, type AdminOverview } from "../../services/admin";

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

const numberFmt = (n: number | undefined) =>
  typeof n === "number" ? n.toLocaleString() : "0";

const OverviewTab: React.FC<OverviewTabProps> = ({
  t,
  dashboardStats,
  recentActivities,
  onQuickOpen,
}) => {
  // ===== Load số liệu thật từ BE =====
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<AdminOverview | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const d = await getAdminOverview(days); // GET /api/admin/overview?days=...
        setData(d);
      } catch (e: any) {
        // Nếu bị 403 → gợi ý quyền
        const msg =
          e?.response?.status === 403
            ? "Request failed with status code 403 — cần token có quyền Admin."
            : e?.message || "Failed to load overview";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [days]);

  // ===== Map BE -> UI (fallback sang props nếu BE chưa có) =====
  const totalUsers = useMemo(
    () => (data?.users as any)?.total ?? dashboardStats.totalUsers,
    [data, dashboardStats.totalUsers]
  );

  const totalValuations = useMemo(
    () => (data?.valuations as any)?.total ?? dashboardStats.totalValuations,
    [data, dashboardStats.totalValuations]
  );

  // Ưu tiên tính doanh thu theo khoảng (sum revenueDaily); fallback totalRevenue; cuối cùng props
  const monthlyRevenue = useMemo(() => {
    const daily = data?.orders?.revenueDaily as
      | { date: string; total: number }[]
      | undefined;
    if (daily?.length) {
      return daily.reduce((s, x) => s + (Number(x.total) || 0), 0);
    }
    if (typeof data?.orders?.totalRevenue === "number")
      return data.orders.totalRevenue;
    return dashboardStats.monthlyRevenue;
  }, [data, dashboardStats.monthlyRevenue]);

  const customerRating = dashboardStats.customerRating; // chưa có từ BE → giữ props

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-8"
    >
      {/* Header + Range */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("admin.overview")}</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Khoảng:</label>
          <select
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={7}>7 ngày</option>
            <option value={14}>14 ngày</option>
            <option value={30}>30 ngày</option>
            <option value={90}>90 ngày</option>
          </select>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6">Đang tải...</div>
      )}
      {!loading && err && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4">
          {err}
        </div>
      )}

      {/* Key Metrics */}
      {!loading && !err && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("admin.totalUsers")}
                </p>
                <p className="text-3xl font-bold text-luxury-navy">
                  {numberFmt(totalUsers)}
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

          {/* Valuations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("admin.totalValuations")}
                </p>
                <p className="text-3xl font-bold text-luxury-navy">
                  {numberFmt(totalValuations)}
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

          {/* Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("admin.monthlyRevenue")}
                </p>
                <p className="text-3xl font-bold text-luxury-navy">
                  {"₫" + numberFmt(monthlyRevenue)}
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

          {/* Rating */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {t("admin.customerRating")}
                </p>
                <p className="text-3xl font-bold text-luxury-navy">
                  {customerRating}/5
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
      )}

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
          {(recentActivities || []).map((activity) => (
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
