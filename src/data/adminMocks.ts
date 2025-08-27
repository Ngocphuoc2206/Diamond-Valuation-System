import type {
  ActivityItem,
  DashboardStats,
  OrderItem,
  ProductItem,
  StaffItem,
  ValuationItem,
} from "../types/admin";

export const dashboardStats: DashboardStats = {
  totalUsers: 1247,
  totalValuations: 892,
  pendingValuations: 34,
  totalRevenue: 2456789,
  monthlyRevenue: 234567,
  completedOrders: 156,
  pendingOrders: 23,
  customerRating: 4.8,
  avgTurnaroundTime: 4.2,
};

export const mockOrders: OrderItem[] = [
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
  },
  {
    id: "ORD-2024-0096",
    customer: "Sarah Williams",
    items: 3,
    total: 8750,
    status: "processing",
    date: "2024-01-13",
  },
];

export const mockProducts: ProductItem[] = [
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

export const mockValuations: ValuationItem[] = [
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

export const mockStaff: StaffItem[] = [
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

export const recentActivities: ActivityItem[] = [
  {
    id: 1,
    type: "valuation",
    message: "New valuation request submitted by John Doe",
    time: "10 minutes ago",
    priority: "high",
  },
  {
    id: 2,
    type: "order",
    message: "Order #ORD-2024-0156 completed and shipped",
    time: "25 minutes ago",
    priority: "normal",
  },
  {
    id: 3,
    type: "user",
    message: "New customer registration: jane.smith@email.com",
    time: "1 hour ago",
    priority: "low",
  },
  {
    id: 4,
    type: "staff",
    message: "Valuation staff Sarah completed 3 appraisals",
    time: "2 hours ago",
    priority: "normal",
  },
  {
    id: 5,
    type: "system",
    message: "Pricing data synchronized from external API",
    time: "3 hours ago",
    priority: "low",
  },
];
