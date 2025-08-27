export type UserRole =
  | "customer"
  | "consulting_staff"
  | "valuation_staff"
  | "manager"
  | "admin";

export type UserItem = {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status?: "active" | "suspended";
};

export type OrderItem = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "new" | "processing" | "shipped" | "delivered";
  date: string;
  email?: string;
};

export type ProductItem = {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "archived";
  image?: string;
};

export type ValuationItem = {
  id: string;
  customer: string;
  type: string;
  status: "pending" | "in_progress" | "completed" | "overdue" | "cancelled";
  assignedTo: string;
  dueDate: string;
  priority: "normal" | "high" | "urgent";
};

export type StaffItem = {
  id: string;
  name: string;
  email: string;
  role: "consulting_staff" | "valuation_staff" | "manager";
  department: string;
  activeCases: number;
  performance: number; // %
  status: "active" | "inactive";
  avatar?: string;
};

export type DashboardStats = {
  totalUsers: number;
  totalValuations: number;
  pendingValuations: number;
  totalRevenue: number;
  monthlyRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  customerRating: number;
  avgTurnaroundTime: number;
};

export type ActivityItem = {
  id: number | string;
  type: "valuation" | "order" | "user" | "staff" | "system";
  message: string;
  time: string;
  priority: "low" | "normal" | "high";
};
