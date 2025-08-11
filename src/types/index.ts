// User types
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security - not always included in responses
  role: 'guest' | 'customer' | 'consulting_staff' | 'valuation_staff' | 'manager' | 'admin';
  avatar?: string;
}

// Diamond types
export interface Diamond {
  id: string;
  name: string;
  price: number;
  origin: string;
  shape: string;
  caratWeight: number;
  color: string;
  clarity: string;
  cut: string;
  proportions: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  measurements: {
    length: number;
    width: number;
    depth: number;
  };
  certificateNumber?: string;
  images: string[];
  description: string;
  featured: boolean;
}

// Valuation Request types
export interface ValuationRequest {
  id: string;
  customerId: string;
  customerName: string;
  status: 'submitted' | 'consulting' | 'received' | 'in_valuation' | 'completed';
  createdAt: string;
  updatedAt: string;
  diamondDetails: Partial<Diamond>;
  assignedTo?: string;
  certificateUrl?: string;
  receiptNumber?: string;
  notes?: string;
}

// Product types (for e-commerce)
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  diamondDetails?: Partial<Diamond>;
}

// Article types (for knowledge base)
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  summary: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  featuredImage: string;
  featured: boolean;
  readTime: string;
}

// Cart Item types (for shopping cart)
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// Statistics Dashboard
export interface DashboardStats {
  valuationRequests: {
    total: number;
    completed: number;
    pending: number;
  };
  revenue: {
    total: number;
    monthly: number[];
  };
  customerRatings: number;
  averageTurnaroundTime: number;
}
