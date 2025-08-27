import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";

// Tabs (created earlier)
import OverviewTab from "./AdminTabs/OverviewTab";
import UserTab from "./AdminTabs/UsersTab";
import ValuationTab from "./AdminTabs/ValuationsTab";
import OrderTab from "./AdminTabs/OrdersTab";
import ProductTab from "./AdminTabs/ProductsTab";
import StaffTab from "./AdminTabs/StaffTab";
import AnalyticsTab from "./AdminTabs/AnalyticsTab";
import SettingsTab from "./AdminTabs/SettingsTab";

// ===== Mock / initial data (kept from original) =====
import { users as initialUsers } from "../data/mockData";

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

const mockOrders = [
  {
    id: "ORD-2024-0098",
    customer: "Jane Smith",
    items: 2,
    total: 3450,
    status: "delivered",
    date: "2024-01-15",
    email: "jane.smith@email.com",
  },
  {
    id: "ORD-2024-0097",
    customer: "Michael Johnson",
    items: 1,
    total: 15999,
    status: "shipped",
    date: "2024-01-14",
    email: "michael.j@email.com",
  },
  {
    id: "ORD-2024-0096",
    customer: "Sarah Williams",
    items: 3,
    total: 8750,
    status: "processing",
    date: "2024-01-13",
    email: "sarah.w@email.com",
  },
];

const mockProducts = [
  {
    id: "RING-2024-001",
    name: "Classic Solitaire Ring",
    description: "2.5ct Round Brilliant",
    sku: "RING-2024-001",
    category: "Engagement Rings",
    price: 15999,
    stock: 5,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=40&h=40&fit=crop",
  },
  {
    id: "NECK-2024-002",
    name: "Diamond Tennis Necklace",
    description: "5ct Total Weight",
    sku: "NECK-2024-002",
    category: "Necklaces",
    price: 12500,
    stock: 3,
    status: "active",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=40&h=40&fit=crop",
  },
];

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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // ===== State (kept at parent) =====
  const [users, setUsers] = useState(initialUsers);
  const [orders, setOrders] = useState(mockOrders);
  const [products, setProducts] = useState(mockProducts);
  const [valuations, setValuations] = useState(mockValuations);
  const [staff, setStaff] = useState(mockStaff);

  // UI state for Users
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "user" | "product" | "valuation" | "staff" | "order" | null
  >(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState("");

  const showNotification = (message: string) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(""), 3000);
  };

  // ===== Handlers (same logic, callable from tabs) =====
  const handleUserAction = (action: string, userId?: string) => {
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
            role: userToEdit.role,
            password: userToEdit.password || "",
          });
          setModalType("user");
          setIsModalOpen(true);
        }
        break;
      }
      case "suspend":
        if (confirm("Are you sure you want to suspend this user?")) {
          setUsers((prev: any[]) =>
            prev.map((u: any) =>
              u.id === userId ? { ...u, status: "suspended" } : u
            )
          );
          showNotification("User suspended successfully");
        }
        break;
      case "activate":
        setUsers((prev: any[]) =>
          prev.map((u: any) =>
            u.id === userId ? { ...u, status: "active" } : u
          )
        );
        showNotification("User activated successfully");
        break;
      case "delete":
        if (
          confirm(
            "Are you sure you want to delete this user? This action cannot be undone."
          )
        ) {
          setUsers((prev: any[]) => prev.filter((u: any) => u.id !== userId));
          showNotification("User deleted successfully");
        }
        break;
      case "bulk_action":
        if (selectedUsers.length > 0) {
          const action = prompt("Enter action (suspend/activate/delete):");
          if (
            action === "delete" &&
            confirm(`Delete ${selectedUsers.length} users?`)
          ) {
            setUsers((prev: any[]) =>
              prev.filter((u: any) => !selectedUsers.includes(u.id))
            );
            setSelectedUsers([]);
            showNotification(`${selectedUsers.length} users deleted`);
          }
        }
        break;
    }
  };

  const handleProductAction = (action: string, productId?: string) => {
    switch (action) {
      case "add":
        setSelectedItem(null);
        setFormData({
          name: "",
          description: "",
          sku: "",
          category: "rings",
          price: 0,
          stock: 0,
          status: "active",
        });
        setModalType("product");
        setIsModalOpen(true);
        break;
      case "edit": {
        const productToEdit = products.find((p) => p.id === productId);
        if (productToEdit) {
          setSelectedItem(productToEdit);
          setFormData(productToEdit);
          setModalType("product");
          setIsModalOpen(true);
        }
        break;
      }
      case "archive":
        if (confirm("Are you sure you want to archive this product?")) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === productId ? { ...p, status: "archived" } : p
            )
          );
          showNotification("Product archived successfully");
        }
        break;
      case "activate":
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, status: "active" } : p))
        );
        showNotification("Product activated successfully");
        break;
    }
  };

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
          setValuations((prev) =>
            prev.map((v) =>
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

  const handleOrderAction = (action: string, orderId?: string) => {
    switch (action) {
      case "view": {
        const order = orders.find((o) => o.id === orderId);
        if (order)
          alert(
            `Order Details:\nID: ${order.id}\nCustomer: ${order.customer}\nTotal: $${order.total}\nStatus: ${order.status}`
          );
        break;
      }
      case "update_status": {
        const newStatus = prompt(
          "Enter new status (processing/shipped/delivered):"
        );
        if (newStatus) {
          setOrders((prev) =>
            prev.map((o) =>
              o.id === orderId ? { ...o, status: newStatus } : o
            )
          );
          showNotification("Order status updated");
        }
        break;
      }
      case "export": {
        const csvData = orders
          .map((o) => `${o.id},${o.customer},${o.total},${o.status}`)
          .join("\n");
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "orders_export.csv";
        a.click();
        showNotification("Orders exported successfully");
        break;
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "user") {
      if (selectedItem) {
        setUsers((prev: any[]) =>
          prev.map((u: any) =>
            u.id === selectedItem.id
              ? { ...u, ...formData, id: selectedItem.id }
              : u
          )
        );
        showNotification("User updated successfully");
      } else {
        const newUser = {
          ...formData,
          id: `user_${Date.now()}`,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        };
        setUsers((prev: any[]) => [...prev, newUser]);
        showNotification("User created successfully");
      }
    } else if (modalType === "product") {
      if (selectedItem) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedItem.id
              ? { ...p, ...formData, id: selectedItem.id }
              : p
          )
        );
        showNotification("Product updated successfully");
      } else {
        const newProduct = {
          ...formData,
          id: `product_${Date.now()}`,
          image:
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=40&h=40&fit=crop",
        };
        setProducts((prev) => [...prev, newProduct]);
        showNotification("Product created successfully");
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

  // ===== Derived data =====
  const filteredUsers = users.filter((user: any) => {
    const matchesFilter =
      userFilter === "all" ||
      (userFilter === "customer" && user.role === "customer") ||
      (userFilter === "staff" &&
        ["consulting_staff", "valuation_staff", "manager"].includes(
          user.role
        )) ||
      (userFilter === "admin" && user.role === "admin");

    const matchesSearch =
      !searchQuery ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const userStats = {
    customers: users.filter((u: any) => u.role === "customer").length,
    consultingStaff: users.filter((u: any) => u.role === "consulting_staff")
      .length,
    valuationStaff: users.filter((u: any) => u.role === "valuation_staff")
      .length,
    managers: users.filter((u: any) => u.role === "manager").length,
  };

  const orderStats = {
    newOrders: orders.filter((o) => o.status === "new").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  const valuationStats = {
    pending: valuations.filter((v) => v.status === "pending").length,
    inProgress: valuations.filter((v) => v.status === "in_progress").length,
    completed: valuations.filter((v) => v.status === "completed").length,
    overdue: valuations.filter((v) => v.status === "overdue").length,
  };

  const productStats = {
    total: products.length,
    inStock: products.filter((p) => p.stock > 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  // ===== Access control =====
  if (user?.role !== "admin") {
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
  ];

  const handleStaffAction = (action: string, staffId?: string) => {
    switch (action) {
      case "add":
        // mở modal thêm mới staff ...
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
      {/* Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {showSuccess}
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
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                }
                alt={user?.name}
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
                    onClick={() => setActiveTab(tab.id)}
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
                onQuickOpen={setActiveTab}
              />
            )}

            {activeTab === "users" && (
              <UserTab
                t={t}
                users={users as any}
                filteredUsers={filteredUsers as any}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
                userStats={userStats}
                userFilter={userFilter}
                setUserFilter={setUserFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleUserAction={handleUserAction}
              />
            )}

            {activeTab === "valuations" && (
              <ValuationTab
                t={t}
                valuations={valuations as any}
                valuationStats={valuationStats}
                handleValuationAction={handleValuationAction}
              />
            )}

            {activeTab === "orders" && (
              <OrderTab
                t={t}
                orders={orders as any}
                orderStats={orderStats}
                handleOrderAction={handleOrderAction}
              />
            )}

            {activeTab === "products" && (
              <ProductTab
                t={t}
                products={products as any}
                productStats={productStats}
                handleProductAction={handleProductAction}
              />
            )}

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

      {/* Simple modal (optional – you can replace with your own modal lib) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 capitalize">
              {modalType} form
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Example generic fields – adapt per modalType as needed */}
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
                  <select
                    name="role"
                    className="w-full border rounded px-3 py-2"
                    value={formData.role || "customer"}
                    onChange={handleInputChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="consulting_staff">Consulting Staff</option>
                    <option value="valuation_staff">Valuation Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </>
              )}

              {modalType === "product" && (
                <>
                  <input
                    name="name"
                    placeholder="Name"
                    className="w-full border rounded px-3 py-2"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                  <input
                    name="sku"
                    placeholder="SKU"
                    className="w-full border rounded px-3 py-2"
                    value={formData.sku || ""}
                    onChange={handleInputChange}
                  />
                  <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    className="w-full border rounded px-3 py-2"
                    value={formData.price ?? 0}
                    onChange={handleInputChange}
                  />
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
