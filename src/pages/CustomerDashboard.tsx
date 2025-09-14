// src/pages/CustomerDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// services (đã cấu hình theo ApiEnvelope)
import { UserAPI, type MeDto } from "../services/user";
import { getMyRecentOrders, type MyOrderBrief } from "../services/order";

// 🔗 Valuation services
import {
  getMyCases,
  getCaseDetail, // NEW: lấy chi tiết case
  type CaseListItem,
  type CaseDetail, // NEW: type chi tiết
  type PagedResult,
} from "../services/valuation";

type ValuationStatus =
  | "submitted"
  | "consultant_assigned"
  | "customer_contacted"
  | "receipt_created"
  | "valuation_assigned"
  | "valuation_in_progress"
  | "valuation_completed"
  | "consultant_review"
  | "results_sent"
  | "customer_received"
  | "completed";

interface CustomerNotification {
  id: string;
  date: string;
  type: "status_update" | "message" | "results_ready" | "appointment";
  title: string;
  message: string;
  read: boolean;
  actionRequired?: boolean;
}

const CustomerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "overview" | "valuations" | "notifications" | "profile"
  >("overview");

  // ==== DỮ LIỆU THẬT TỪ BE ====
  const [me, setMe] = useState<MeDto | null>(null);
  const [recentOrders, setRecentOrders] = useState<MyOrderBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // ==== Cases list (paging/filter) ====
  const [casesPage, setCasesPage] = useState<PagedResult<CaseListItem> | null>(
    null
  );
  const [casesLoading, setCasesLoading] = useState(false);
  const [casesError, setCasesError] = useState<string | null>(null);
  const [casePage, setCasePage] = useState(1);
  const casePageSize = 10;
  const [caseStatus, setCaseStatus] = useState<string | undefined>(undefined);

  // ==== Modal detail ====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Notifications (mock)
  const [notifications, setNotifications] = useState([
    {
      id: "not-001",
      date: "2024-01-22",
      type: "results_ready" as const,
      title: "Valuation Complete - VAL-2024-0123",
      message:
        "Your diamond valuation is complete! Results are now available for download.",
      read: false,
      actionRequired: true,
    },
    {
      id: "not-002",
      date: "2024-01-21",
      type: "status_update" as const,
      title: "Consultant Assigned - VAL-2024-0156",
      message:
        "Mike Chen has been assigned as your consultant and will contact you within 24 hours.",
      read: true,
    },
    {
      id: "not-003",
      date: "2024-01-25",
      type: "status_update" as const,
      title: "Request Received - VAL-2024-0167",
      message:
        "We have received your valuation request and it is being processed.",
      read: true,
    },
  ]);

  // --- Helpers: status mapping (ĐỒNG BỘ VỚI STAFF) ---

  // 1) Chuẩn hoá status BE -> FE
  const normalizeStatus = (status?: string): ValuationStatus => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "yeucau":
      case "submitted":
        return "submitted";

      case "lienhe":
      case "customer_contacted":
        return "customer_contacted";

      case "bienlai":
      case "receipt_created":
        return "receipt_created";

      // Trong BE không có "valuation_assigned" riêng, nhưng nếu có vẫn map hợp lý
      case "dinhgia":
      case "valuation_assigned":
      case "valuation_in_progress":
        return "valuation_in_progress";

      case "ketqua":
      case "valuation_completed":
      case "results_sent": // nếu BE/FE có bước trung gian này, vẫn xem là đã có kết quả
      case "result_prepared":
        return "valuation_completed";

      case "complete":
      case "completed":
      case "customer_received":
        return "completed";

      case "consultant_assigned":
        return "consultant_assigned";

      case "consultant_review":
        return "consultant_review";

      default:
        return "submitted";
    }
  };

  // 2) Bảng màu, nhãn, % tiến độ: dùng FE status DUY NHẤT
  const STATUS_COLOR: Record<ValuationStatus, string> = {
    submitted: "bg-blue-100 text-blue-800",
    consultant_assigned: "bg-purple-100 text-purple-800",
    customer_contacted: "bg-indigo-100 text-indigo-800",
    receipt_created: "bg-green-100 text-green-800",
    valuation_assigned: "bg-yellow-100 text-yellow-800",
    valuation_in_progress: "bg-orange-100 text-orange-800",
    valuation_completed: "bg-emerald-100 text-emerald-800",
    consultant_review: "bg-teal-100 text-teal-800",
    results_sent: "bg-teal-100 text-teal-800",
    customer_received: "bg-teal-100 text-teal-800",
    completed: "bg-gray-100 text-gray-800",
  };

  const STATUS_TEXT: Record<ValuationStatus, string> = {
    submitted: "Request Submitted",
    consultant_assigned: "Consultant Assigned",
    customer_contacted: "Consultant Contacted",
    receipt_created: "Diamond Received",
    valuation_assigned: "Valuation Assigned",
    valuation_in_progress: "Valuation in Progress",
    valuation_completed: "Results Ready",
    consultant_review: "Consultant Review",
    results_sent: "Results Available",
    customer_received: "Customer Received",
    completed: "Process Complete",
  };

  const STATUS_PROGRESS: Record<ValuationStatus, number> = {
    submitted: 10,
    consultant_assigned: 20,
    customer_contacted: 30,
    receipt_created: 40,
    valuation_assigned: 50,
    valuation_in_progress: 65, // giống Staff
    valuation_completed: 85,
    consultant_review: 90,
    results_sent: 95,
    customer_received: 98,
    completed: 100,
  };

  // 3) Wrapper hàm public: NHỚ luôn normalize trước khi lấy màu/nhãn/%
  const getStatusColor = (status: string) =>
    STATUS_COLOR[normalizeStatus(status)];
  const getStatusText = (status: string) =>
    STATUS_TEXT[normalizeStatus(status)];
  const getProgressPercentage = (status: string) =>
    STATUS_PROGRESS[normalizeStatus(status)];

  // Load Dashboard summary (me + recent orders)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [meDto, orders] = await Promise.all([
          UserAPI.me(),
          getMyRecentOrders(5),
        ]);
        if (!mounted) return;
        setMe(meDto);
        setRecentOrders(orders);
      } catch (e: any) {
        if (!mounted) return;
        setErr(
          e?.response?.data?.message || e?.message || "Load dashboard failed"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load danh sách valuation cases khi đổi tab/page/status
  useEffect(() => {
    if (activeTab !== "valuations") return;
    let mounted = true;
    (async () => {
      try {
        setCasesLoading(true);
        setCasesError(null);
        const data = await getMyCases(casePage, casePageSize, caseStatus);
        console.log(data);
        if (!mounted) return;
        setCasesPage(data);
      } catch (e: any) {
        if (!mounted) return;
        setCasesError(
          e?.response?.data?.message || e?.message || "Load failed"
        );
      } finally {
        if (mounted) setCasesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [activeTab, casePage, caseStatus]);

  // Load detail khi mở modal
  useEffect(() => {
    if (!isModalOpen || !selectedCaseId) return;
    let mounted = true;
    (async () => {
      try {
        setDetailLoading(true);
        setDetailError(null);
        setCaseDetail(null);
        const data = await getCaseDetail(selectedCaseId);
        if (!mounted) return;
        setCaseDetail(data);
      } catch (e: any) {
        if (!mounted) return;
        setDetailError(
          e?.response?.data?.message || e?.message || "Load case detail failed"
        );
      } finally {
        if (mounted) setDetailLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isModalOpen, selectedCaseId]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50";
      case "high":
        return "text-orange-600 bg-orange-50";
      case "normal":
        return "text-blue-600 bg-blue-50";
      case "low":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const markNotificationAsRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabs = [
    { id: "overview", label: t("customer.overview"), icon: "📊" },
    { id: "valuations", label: t("customer.valuations"), icon: "💎" },
    {
      id: "notifications",
      label: `${t("dashboard.notifications")} ${
        unreadCount > 0 ? `(${unreadCount})` : ""
      }`,
      icon: "🔔",
    },
    { id: "profile", label: t("customer.profile"), icon: "👤" },
  ] as const;

  const notify = (message: string) => {
    const timer = setTimeout(() => setShowNotification(""), 3000);
    setShowNotification(message);
    return () => clearTimeout(timer);
  };
  const [showNotification, setShowNotification] = useState("");

  // ===== Thống kê cho Overview (từ đơn hàng gần đây) =====
  const inProgressCount = useMemo(
    () =>
      recentOrders.filter(
        (o) => o.status === "Pending" || o.status === "AwaitingPayment"
      ).length,
    [recentOrders]
  );
  const completedCount = useMemo(
    () =>
      recentOrders.filter(
        (o) => o.status === "Paid" || o.status === "Fulfilled"
      ).length,
    [recentOrders]
  );
  const totalAmountRecent = useMemo(
    () => recentOrders.reduce((s, o) => s + (o.total || 0), 0),
    [recentOrders]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-28 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-72 bg-gray-200 rounded mt-8 animate-pulse" />
        </div>
      </div>
    );
  }
  if (err) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto p-6">
          <div className="p-4 border rounded-xl bg-red-50 text-red-700">
            ⚠️ {err}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {showNotification}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  {t("customer.dashboard")}
                </h1>
                <p className="text-gray-600">
                  {t("customer.welcomeBack")},{" "}
                  {me?.fullName || me?.userName || user?.name || "Guest"}!
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate("/valuation")}
                  className="btn btn-primary"
                >
                  {t("customer.requestValuation")}
                </button>
                <button
                  onClick={() => navigate("/communication")}
                  className="btn btn-secondary"
                >
                  {t("communication.messages")}
                </button>
                <div className="relative">
                  <span className="text-2xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-luxury-gold text-luxury-gold"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview — đúng như bản gốc của bạn */}
        {activeTab === "overview" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            {/* Quick Stats (theo 5 đơn gần nhất) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Tổng số đơn gần đây
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentOrders.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Đang tiến hành
                    </p>
                    <p className="text-2xl font-bold text-orange-600">
                      {inProgressCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Hoàn thành
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {completedCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Tổng giá trị (gần đây)
                    </p>
                    <p className="text-2xl font-bold text-luxury-gold">
                      ${totalAmountRecent.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity: đơn gần đây từ BE */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button
                  onClick={() => navigate("/orders")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Xem tất cả
                </button>
              </div>
              <div className="p-6">
                {recentOrders.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    Chưa có đơn hàng nào.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((o) => (
                      <div
                        key={o.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-shrink-0">
                          <span className="text-2xl">🧾</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Đơn #{o.orderNo}</h4>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {o.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Thời gian:{" "}
                            {o.createdAt
                              ? new Date(o.createdAt).toLocaleString()
                              : "—"}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-semibold">
                            ${o.total.toLocaleString()}
                          </div>
                          <button
                            onClick={() =>
                              navigate(
                                `/orders/${encodeURIComponent(o.orderNo)}`
                              )
                            }
                            className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* My Valuations (REAL API) */}
        {activeTab === "valuations" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Valuation Requests</h3>
                <div className="flex items-center gap-3">
                  {/* Filter status theo enum BE */}
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={caseStatus ?? ""}
                    onChange={(e) => {
                      setCasePage(1);
                      setCaseStatus(e.target.value || undefined);
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="YeuCau">Yêu Cầu</option>
                    <option value="LienHe">Liên Hệ</option>
                    <option value="BienLai">Biên Lai</option>
                    <option value="DinhGia">Định Giá</option>
                    <option value="KetQua">Kết Quả</option>
                    <option value="Complete">Hoàn tất</option>
                  </select>

                  <button
                    onClick={() => navigate("/valuation")}
                    className="btn btn-primary"
                  >
                    New Request
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {casesLoading ? (
                  <div className="p-6 text-sm text-gray-500">Loading…</div>
                ) : casesError ? (
                  <div className="p-6 text-sm text-red-600">{casesError}</div>
                ) : !casesPage || casesPage.items.length === 0 ? (
                  <div className="p-6 text-sm text-gray-500">
                    Chưa có yêu cầu định giá. Nhấn{" "}
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => navigate("/valuation")}
                    >
                      New Request
                    </button>{" "}
                    để bắt đầu.
                  </div>
                ) : (
                  <>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Case
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Consultant
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {casesPage.items.map((it) => (
                          <tr key={it.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {it.id}
                              </div>
                              <div className="text-xs text-gray-400">
                                Created:{" "}
                                {new Date(it.createdAt).toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  it.status
                                )}`}
                              >
                                {getStatusText(it.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-luxury-gold h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${it.progress}%`,
                                  }}
                                />
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {it.progress}% Complete
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {it.consultantName ?? "Not Assigned"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {it.estimatedValue != null
                                  ? it.estimatedValue.toLocaleString()
                                  : "TBD"}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedCaseId(it.id);
                                  setIsModalOpen(true); // 👉 mở modal
                                }}
                                className="text-luxury-gold hover:text-luxury-navy"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between p-4">
                      <div className="text-sm">
                        Tổng: {casesPage.total} · Trang {casesPage.page}/
                        {casesPage.totalPages ??
                          Math.ceil(casesPage.total / casesPage.pageSize)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="border rounded px-3 py-1 disabled:opacity-50"
                          onClick={() => setCasePage((p) => Math.max(1, p - 1))}
                          disabled={(casesPage.page ?? 1) <= 1}
                        >
                          Prev
                        </button>
                        <button
                          className="border rounded px-3 py-1 disabled:opacity-50"
                          onClick={() =>
                            setCasePage((p) =>
                              Math.min(
                                (casesPage.totalPages ??
                                  Math.ceil(
                                    casesPage.total / casesPage.pageSize
                                  )) ||
                                  1,
                                p + 1
                              )
                            )
                          }
                          disabled={
                            (casesPage.totalPages ??
                              Math.ceil(
                                casesPage.total / casesPage.pageSize
                              )) <= (casesPage.page ?? 1)
                          }
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.length === 0 && (
                  <div className="p-6 text-sm text-gray-500">
                    Không có thông báo.
                  </div>
                )}
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-6 ${
                      !n.read
                        ? "bg-blue-50 border-l-4 border-l-blue-400"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4
                            className={`font-medium ${
                              !n.read ? "text-blue-900" : "text-gray-900"
                            }`}
                          >
                            {n.title}
                          </h4>
                          {n.actionRequired && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{n.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{n.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!n.read && (
                          <button
                            onClick={() => markNotificationAsRead(n.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Mark as Read
                          </button>
                        )}
                        {n.type === "results_ready" && (
                          <button
                            onClick={() =>
                              notify("Results viewed successfully!")
                            }
                            className="btn btn-primary btn-sm"
                          >
                            View Results
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">
                Profile Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={me?.fullName || user?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={me?.email || user?.email || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+84 9xx xxx xxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold">
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Text Message</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => notify("Profile updated successfully!")}
                  className="btn btn-primary"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Case Detail MODAL */}
      {isModalOpen && selectedCaseId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                Valuation Details — {selectedCaseId}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedCaseId(null);
                  setCaseDetail(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Loading/Err/Content */}
            {detailLoading && (
              <div className="p-4 text-sm text-gray-500">Loading…</div>
            )}
            {detailError && (
              <div className="p-4 text-sm text-red-600">{detailError}</div>
            )}
            {!detailLoading && !detailError && caseDetail && (
              <div className="space-y-6">
                {/* Status & Progress */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Current Status</h4>
                    <div className="space-y-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          caseDetail.status
                        )}`}
                      >
                        {getStatusText(caseDetail.status)}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-luxury-gold h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              caseDetail.progress ??
                              getProgressPercentage(caseDetail.status)
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {caseDetail.progress ??
                          getProgressPercentage(caseDetail.status)}
                        % Complete
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Request Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date(caseDetail.createdAt).toLocaleString()}
                      </p>
                      {caseDetail.updatedAt && (
                        <p>
                          <strong>Updated:</strong>{" "}
                          {new Date(caseDetail.updatedAt).toLocaleString()}
                        </p>
                      )}
                      <p>
                        <strong>Consultant:</strong>{" "}
                        {caseDetail.consultantName || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diamond Details */}
                {caseDetail.diamond && (
                  <div>
                    <h4 className="font-medium mb-3">Diamond Details</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <p>
                          <strong>Certificate #:</strong>{" "}
                          {caseDetail.diamond.certificateNo || "—"}
                        </p>
                        <p>
                          <strong>Origin:</strong> {caseDetail.diamond.origin}
                        </p>
                        <p>
                          <strong>Shape:</strong> {caseDetail.diamond.shape}
                        </p>
                        <p>
                          <strong>Carat:</strong> {caseDetail.diamond.carat}
                        </p>
                        <p>
                          <strong>Color:</strong> {caseDetail.diamond.color}
                        </p>
                        <p>
                          <strong>Clarity:</strong> {caseDetail.diamond.clarity}
                        </p>
                        <p>
                          <strong>Cut:</strong> {caseDetail.diamond.cut}
                        </p>
                        <p>
                          <strong>Polish:</strong> {caseDetail.diamond.polish}
                        </p>
                        <p>
                          <strong>Symmetry:</strong>{" "}
                          {caseDetail.diamond.symmetry}
                        </p>
                        <p>
                          <strong>Fluor.:</strong>{" "}
                          {caseDetail.diamond.fluorescence}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact */}
                {caseDetail.contact && (
                  <div>
                    <h4 className="font-medium mb-3">Contact</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <p>
                          <strong>Name:</strong> {caseDetail.contact.fullName}
                        </p>
                        <p>
                          <strong>Email:</strong> {caseDetail.contact.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {caseDetail.contact.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Values */}
                <div>
                  <h4 className="font-medium mb-3">Values</h4>
                  <div className="bg-green-50 p-4 rounded-lg grid md:grid-cols-3 gap-4 text-sm">
                    <p>
                      <strong>Estimated Value:</strong>{" "}
                      {caseDetail.retailValue != null
                        ? caseDetail.retailValue.toLocaleString()
                        : "TBD"}
                    </p>
                    <p>
                      <strong>Market Value:</strong>{" "}
                      {caseDetail.marketValue != null
                        ? caseDetail.marketValue.toLocaleString()
                        : "—"}
                    </p>
                    <p>
                      <strong>Insurance Value:</strong>{" "}
                      {caseDetail.insuranceValue != null
                        ? caseDetail.insuranceValue.toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  {caseDetail.status === "completed" && (
                    <>
                      <button
                        onClick={() => {
                          notify("Certificate downloaded successfully!");
                          setIsModalOpen(false);
                        }}
                        className="btn btn-primary"
                      >
                        Download Certificate
                      </button>
                      <button
                        onClick={() => {
                          notify("Report downloaded successfully!");
                          setIsModalOpen(false);
                        }}
                        className="btn btn-secondary"
                      >
                        Download Report
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedCaseId(null);
                      setCaseDetail(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
