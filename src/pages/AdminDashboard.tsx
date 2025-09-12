// src/pages/AdminDashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

// Tabs
import OverviewTab from "./AdminTabs/OverviewTab";
import UserTab from "./AdminTabs/UsersTab";
import ValuationTab from "./AdminTabs/ValuationsTab";
import OrderTab from "./AdminTabs/OrdersTab"; // <- component tự fetch, không nhận props
import ProductTab from "./AdminTabs/ProductsTab";
import StaffTab from "./AdminTabs/StaffTab";
import AnalyticsTab from "./AdminTabs/AnalyticsTab";
import SettingsTab from "./AdminTabs/SettingsTab";

// Services
import { UserAPI, AuthAPI, type UserDto } from "../services/user";
import { api } from "../services/apiClient";
import { normalizeRole, pickUserRole, toBackendRole } from "../utils/role";

// ===== Mock/Stats mẫu cho các tab khác (giữ nguyên) =====
const dashboardStats = {
  totalUsers: 50,
  totalValuations: 2,
  pendingValuations: 34,
  totalRevenue: 2456789,
  monthlyRevenue: 234567,
  completedOrders: 156,
  pendingOrders: 23,
  customerRating: 4.8,
  avgTurnaroundTime: 4.2,
};

const mockValuations = [
  {
    id: "VAL-2024-0123",
    customer: "John Doe",
    type: "Insurance Appraisal",
    status: "in_progress",
    assignedTo: "Dr. Emma Wilson",
    dueDate: "2024-01-20",
    priority: "normal",
  },
  {
    id: "VAL-2024-0124",
    customer: "Lisa Chen",
    type: "Market Valuation",
    status: "pending",
    assignedTo: "James Rodriguez",
    dueDate: "2024-01-22",
    priority: "high",
  },
];

const mockStaff = [
  {
    id: "STAFF-001",
    name: "Dr. Emma Wilson",
    email: "emma.wilson@company.com",
    role: "valuation_staff",
    department: "Appraisal",
    activeCases: 8,
    performance: 98.5,
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face",
  },
  {
    id: "STAFF-002",
    name: "James Rodriguez",
    email: "james.rodriguez@company.com",
    role: "consulting_staff",
    department: "Consultation",
    activeCases: 12,
    performance: 95.2,
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "valuation",
    message: "New valuation request submitted by John Doe",
    time: "10 minutes ago",
    priority: "high" as const,
  },
  {
    id: 2,
    type: "order",
    message: "Order #ORD-2024-0156 completed and shipped",
    time: "25 minutes ago",
    priority: "normal" as const,
  },
  {
    id: 3,
    type: "user",
    message: "New customer registration: jane.smith@email.com",
    time: "1 hour ago",
    priority: "low" as const,
  },
  {
    id: 4,
    type: "staff",
    message: "Valuation staff Sarah completed 3 appraisals",
    time: "2 hours ago",
    priority: "normal" as const,
  },
  {
    id: 5,
    type: "system",
    message: "Pricing data synchronized from external API",
    time: "3 hours ago",
    priority: "low" as const,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// ===== Helpers: map BE -> FE =====
function mapUserFromDto(u: UserDto) {
  const role = pickUserRole(u.roles || [{ name: (u as any).role ?? "" }]);
  return {
    id: String(u.id),
    name: u.fullName || u.userName || u.email,
    email: u.email,
    role, // "consultingstaff" | "valuationstaff" | ...
    avatar: u.avatarUrl,
    status: u.status || "active",
  };
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "users"
    | "valuations"
    | "orders"
    | "products"
    | "staff"
    | "analytics"
    | "settings"
  >("overview");

  // ===== State =====
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userPageSize] = useState(20);
  const [userTotalPages, setUserTotalPages] = useState(1);

  const [valuations, setValuations] = useState(mockValuations);
  const [staff, setStaff] = useState(mockStaff);

  // UI state cho Users
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState("all"); // all | customer | staff | admin
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "user" | "product" | "valuation" | "staff" | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState("");
  const [showError, setShowError] = useState("");

  // ===== Toast helpers =====
  const showNotification = (message: string) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(""), 3000);
  };
  const showErrorToast = (message: string) => {
    setShowError(message);
    setTimeout(() => setShowError(""), 3500);
  };

  // ===== Load users from BE =====
  const resolveRoleParam = (filter: string) =>
    filter === "all" ? undefined : filter;

  const reloadUsers = async (
    page = userPage,
    size = userPageSize,
    q = searchQuery,
    role = resolveRoleParam(userFilter)
  ) => {
    try {
      setLoadingUsers(true);
      // UserAPI.list đã unwrap và trả PagedResult<UserDto>
      const pageData = await UserAPI.list(page, size, q || undefined, role);
      const items: UserDto[] = pageData?.items ?? [];
      setUsers(items.map(mapUserFromDto));
      setUserTotalPages(pageData?.totalPages ?? 1);
    } catch (e: any) {
      console.error(e);
      showErrorToast(e?.message || "Load users failed");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    void reloadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPage, userPageSize, userFilter, searchQuery]);

  // ===== Handlers (Users) =====
  const handleUserAction = async (action: string, userId?: string) => {
    try {
      switch (action) {
        case "add":
          setSelectedItem(null);
          setFormData({ name: "", email: "", role: "customer", password: "" });
          setModalType("user");
          setIsModalOpen(true);
          break;

        case "edit": {
          const userToEdit = users.find((u: any) => u.id === userId);
          if (userToEdit) {
            setSelectedItem(userToEdit);
            setFormData({
              name: userToEdit.name,
              email: userToEdit.email,
              role: userToEdit.role, // string
            });
            setModalType("user");
            setIsModalOpen(true);
          }
          break;
        }

        case "suspend": {
          const id = Number(userId);
          if (!Number.isFinite(id)) break;
          if (confirm("Are you sure you want to suspend this user?")) {
            await UserAPI.suspend(id);
            await reloadUsers();
            showNotification("User suspended");
          }
          break;
        }

        case "activate": {
          const id = Number(userId);
          if (!Number.isFinite(id)) break;
          await UserAPI.activate(id);
          await reloadUsers();
          showNotification("User activated");
          break;
        }

        case "delete": {
          const id = Number(userId);
          if (!Number.isFinite(id)) break;
          if (
            confirm(
              "Are you sure you want to delete this user? This action cannot be undone."
            )
          ) {
            await UserAPI.delete(id);
            await reloadUsers();
            showNotification("User deleted");
          }
          break;
        }

        case "bulk_action": {
          if (selectedUsers.length === 0) break;
          const act = prompt("Enter action (suspend/activate/delete):") as
            | "suspend"
            | "activate"
            | "delete"
            | null;
          if (act) {
            await UserAPI.bulk({
              action: act,
              userIds: selectedUsers
                .map((x) => Number(x))
                .filter((n) => Number.isFinite(n)),
            });
            setSelectedUsers([]);
            await reloadUsers();
            showNotification(`Bulk ${act} done`);
          }
          break;
        }
      }
    } catch (err: any) {
      console.error(err);
      showErrorToast(err?.message || "User action failed");
    }
  };

  // ===== Handlers cho các tab khác (mock giữ nguyên) =====
  const handleValuationAction = (action: string, valuationId?: string) => {
    switch (action) {
      case "add":
        setSelectedItem(null);
        setFormData({
          customer: "",
          type: "Insurance Appraisal",
          assignedTo: "",
          priority: "normal",
          dueDate: "",
        });
        setModalType("valuation");
        setIsModalOpen(true);
        break;
      case "reassign": {
        const valuationToReassign = valuations.find(
          (v) => v.id === valuationId
        );
        if (valuationToReassign) {
          setSelectedItem(valuationToReassign);
          setFormData({
            assignedTo: valuationToReassign.assignedTo,
            priority: valuationToReassign.priority,
            notes: "",
          });
          setModalType("valuation");
          setIsModalOpen(true);
        }
        break;
      }
      case "complete":
        if (confirm("Mark this valuation as completed?")) {
          setValuations((prev: any) =>
            prev.map((v: any) =>
              v.id === valuationId ? { ...v, status: "completed" } : v
            )
          );
          showNotification("Valuation marked as completed");
        }
        break;
      case "cancel":
        if (confirm("Are you sure you want to cancel this valuation?")) {
          setValuations((prev) =>
            prev.map((v) =>
              v.id === valuationId ? { ...v, status: "cancelled" } : v
            )
          );
          showNotification("Valuation cancelled");
        }
        break;
    }
  };

  // ===== Settings submit =====
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === "user") {
        if (selectedItem) {
          await UserAPI.assignRole({
            userId: Number(selectedItem.id),
            role: toBackendRole(normalizeRole(formData.role)),
            fullName: formData.name,
            email: formData.email,
          });
          showNotification("User updated");
          await reloadUsers();
        } else {
          // Dùng AuthAPI.register để đồng bộ APIEnvelope
          await AuthAPI.register({
            userName: formData.email,
            email: formData.email,
            password: formData.password || "P@ssw0rd!",
            fullName: formData.name || formData.email,
          });

          // Nếu tạo staff/role khác customer -> gán role
          if (formData.role && formData.role !== "customer") {
            const findRes = await UserAPI.list(1, 1, formData.email);
            const created = findRes.items?.[0] as UserDto | undefined;
            if (created?.id) {
              await UserAPI.assignRole({
                userId: Number(created.id),
                role: formData.role,
                fullName: formData.name,
                email: formData.email,
              });
            }
          }

          showNotification("User created successfully");
          await reloadUsers();
        }
      } else if (modalType === "valuation") {
        if (selectedItem) {
          setValuations((prev) =>
            prev.map((v) =>
              v.id === selectedItem.id
                ? {
                    ...v,
                    assignedTo: formData.assignedTo,
                    priority: formData.priority,
                  }
                : v
            )
          );
          showNotification("Valuation reassigned successfully");
        } else {
          const newValuation = {
            ...formData,
            id: `VAL-2024-${String(Date.now()).slice(-4)}`,
            status: "pending",
          };
          setValuations((prev) => [...prev, newValuation]);
          showNotification("Valuation request created");
        }
      } else if (modalType === "staff") {
        if (selectedItem) {
          setStaff((prev) =>
            prev.map((s) =>
              s.id === selectedItem.id
                ? { ...s, ...formData, id: selectedItem.id }
                : s
            )
          );
          showNotification("Staff updated successfully");
        } else {
          const newStaff = {
            ...formData,
            id: `STAFF-${String(Date.now()).slice(-3)}`,
            activeCases: 0,
            performance: 0,
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          };
          setStaff((prev) => [...prev, newStaff]);
          showNotification("Staff member added successfully");
        }
      }

      setIsModalOpen(false);
      setSelectedItem(null);
      setFormData({});
    } catch (err: any) {
      console.error(err);
      showErrorToast(err?.message || "Action failed");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSettingsUpdate = (settings: any) => {
    console.log("Updating settings:", settings);
    showNotification("Settings updated successfully!");
  };

  // ===== Derived: filter client-side cho Users =====
  const filteredUsers = useMemo(() => {
    return users.filter((u: any) => {
      const matchesFilter =
        userFilter === "all" ||
        (userFilter === "customer" && u.role === "customer") ||
        (userFilter === "staff" &&
          ["consultingstaff", "valuationstaff", "manager"].includes(u.role)) ||
        (userFilter === "admin" && u.role === "admin");

      const q = (searchQuery || "").toLowerCase();
      const matchesSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [users, userFilter, searchQuery]);

  // ===== Access control (roles có thể là string hoặc mảng) =====
  const rawRoles = Array.isArray((user as any)?.roles)
    ? (user as any).roles
    : (user as any)?.roles
    ? [(user as any).roles]
    : [];
  const isAdmin = rawRoles.some(
    (r: any) => String(r).toLowerCase() === "admin"
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t("admin.accessDenied")}
          </h1>
          <p className="text-gray-600 mb-6">{t("admin.noPermission")}</p>
          <Link to="/dashboard" className="btn btn-primary">
            {t("admin.backToDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: t("admin.overview"), icon: "📊" },
    { id: "users", label: t("admin.userManagement"), icon: "👥" },
    { id: "valuations", label: t("admin.valuations"), icon: "💎" },
    { id: "orders", label: t("admin.orders"), icon: "📦" },
    { id: "products", label: t("admin.products"), icon: "🛍️" },
    { id: "staff", label: t("admin.staffManagement"), icon: "👨‍💼" },
    { id: "analytics", label: t("admin.analytics"), icon: "📈" },
    { id: "settings", label: t("admin.systemConfig"), icon: "⚙️" },
  ] as const;

  const handleStaffAction = (action: string, staffId?: string) => {
    switch (action) {
      case "add":
        console.log("add staff");
        break;
      case "view":
        console.log("view staff", staffId);
        break;
      case "schedule":
        console.log("schedule staff", staffId);
        break;
      default:
        console.log(action, staffId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toasts */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {showSuccess}
        </div>
      )}
      {showError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {showError}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-serif font-bold text-luxury-navy">
                {t("admin.title")}{" "}
                <span className="text-luxury-gold">
                  {t("admin.titleHighlight")}
                </span>
              </h1>
              <p className="text-gray-600 mt-1">{t("admin.description")}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-luxury-gold bg-opacity-10 px-4 py-2 rounded-full">
                <span className="text-luxury-gold font-medium">
                  Administrator
                </span>
              </div>
              <img
                src={
                  (user as any)?.avatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                }
                alt={(user as any)?.name}
                className="w-10 h-10 rounded-full border-2 border-luxury-gold"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? "bg-luxury-gold text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main */}
          <div className="lg:col-span-4">
            {activeTab === "overview" && (
              <OverviewTab
                t={t}
                dashboardStats={{
                  totalUsers: dashboardStats.totalUsers,
                  totalValuations: dashboardStats.totalValuations,
                  monthlyRevenue: dashboardStats.monthlyRevenue,
                  customerRating: dashboardStats.customerRating,
                }}
                recentActivities={recentActivities}
                onQuickOpen={(id) => setActiveTab(id as any)}
              />
            )}

            {activeTab === "users" && (
              <>
                <UserTab
                  t={t}
                  loading={loadingUsers}
                  users={users as any}
                  filteredUsers={filteredUsers as any}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                  userStats={{
                    customers: users.filter((u: any) => u.role === "customer")
                      .length,
                    consultingStaff: users.filter(
                      (u: any) => u.role === "consultingstaff"
                    ).length,
                    valuationStaff: users.filter(
                      (u: any) => u.role === "valuationstaff"
                    ).length,
                    managers: users.filter((u: any) => u.role === "manager")
                      .length,
                  }}
                  userFilter={userFilter}
                  setUserFilter={setUserFilter}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleUserAction={handleUserAction}
                />

                {/* Phân trang */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded border disabled:opacity-50"
                    disabled={userPage <= 1 || loadingUsers}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {userPage} / {userTotalPages}
                  </span>
                  <button
                    className="px-3 py-1 rounded border disabled:opacity-50"
                    disabled={loadingUsers || userPage >= userTotalPages}
                    onClick={() => setUserPage((p) => p + 1)}
                  >
                    Next
                  </button>
                  <button
                    className="px-3 py-1 rounded border"
                    disabled={loadingUsers}
                    onClick={() => reloadUsers()}
                  >
                    Reload
                  </button>
                </div>
              </>
            )}

            {activeTab === "valuations" && (
              <ValuationTab
                t={t}
                valuations={valuations as any}
                valuationStats={{
                  pending: valuations.filter((v) => v.status === "pending")
                    .length,
                  inProgress: valuations.filter(
                    (v) => v.status === "in_progress"
                  ).length,
                  completed: valuations.filter((v) => v.status === "completed")
                    .length,
                  overdue: valuations.filter((v) => v.status === "overdue")
                    .length,
                }}
                handleValuationAction={handleValuationAction}
              />
            )}

            {activeTab === "orders" && (
              // ✅ Không truyền props, OrdersTab tự fetch + hiển thị customerName
              <OrderTab />
            )}

            {activeTab === "products" && <ProductTab />}

            {activeTab === "staff" && (
              <StaffTab
                t={t}
                staff={staff as any}
                handleStaffAction={handleStaffAction}
              />
            )}

            {activeTab === "analytics" && <AnalyticsTab t={t} />}

            {activeTab === "settings" && (
              <SettingsTab t={t} onSave={handleSettingsUpdate} />
            )}
          </div>
        </div>
      </div>

      {/* Modal chung */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 capitalize">
              {modalType} form
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {modalType === "user" && (
                <>
                  <input
                    name="name"
                    placeholder="Name"
                    className="w-full border rounded px-3 py-2"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                  <input
                    name="email"
                    placeholder="Email"
                    className="w-full border rounded px-3 py-2"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                  {!selectedItem && (
                    <input
                      name="password"
                      type="password"
                      placeholder="Password (for register)"
                      className="w-full border rounded px-3 py-2"
                      value={formData.password || ""}
                      onChange={handleInputChange}
                    />
                  )}
                  <select
                    name="role"
                    className="w-full border rounded px-3 py-2"
                    value={formData.role || "customer"}
                    onChange={handleInputChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="consultingstaff">Consulting Staff</option>
                    <option value="valuationstaff">Valuation Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </>
              )}

              {modalType === "valuation" && (
                <>
                  <input
                    name="customer"
                    placeholder="Customer"
                    className="w-full border rounded px-3 py-2"
                    value={formData.customer || ""}
                    onChange={handleInputChange}
                  />
                  <input
                    name="assignedTo"
                    placeholder="Assigned To"
                    className="w-full border rounded px-3 py-2"
                    value={formData.assignedTo || ""}
                    onChange={handleInputChange}
                  />
                  <select
                    name="priority"
                    className="w-full border rounded px-3 py-2"
                    value={formData.priority || "normal"}
                    onChange={handleInputChange}
                  >
                    <option value="low">low</option>
                    <option value="normal">normal</option>
                    <option value="high">high</option>
                  </select>
                </>
              )}

              {modalType === "staff" && (
                <>
                  <input
                    name="name"
                    placeholder="Name"
                    className="w-full border rounded px-3 py-2"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                  <input
                    name="email"
                    placeholder="Email"
                    className="w-full border rounded px-3 py-2"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                  />
                  <input
                    name="department"
                    placeholder="Department"
                    className="w-full border rounded px-3 py-2"
                    value={formData.department || ""}
                    onChange={handleInputChange}
                  />
                </>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-luxury-gold text-white hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
