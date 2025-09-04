// src/services/order.ts
import { api } from "./apiClient";

/** ====== API Envelope (chuẩn BE) ====== */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

// Bóc ApiEnvelope chuẩn (camelCase). Nếu API không theo chuẩn, trả raw (fallback).
function unwrap<T>(data: any): T {
  const env = data as Partial<ApiEnvelope<T>>;
  if (env && typeof env === "object" && "success" in env && "data" in env) {
    if (env.success === false) throw new Error(env.message || "Request failed");
    return env.data as T;
  }
  return data as T;
}

/** ====== Kiểu dùng trong Checkout (tạo đơn) ====== */
export type CheckoutAddress = {
  fullName: string;
  phone: string;
  line1?: string;
  line2?: string;
  city?: string;
  district?: string;
  ward?: string;
  country?: string;
  postalCode?: string;
};

export type CheckoutItem = {
  sku: string;
  quantity: number;
  unitPrice: number;
  name?: string;
  imageUrl?: string;
};

export type CheckoutRequest = {
  /** Customer (session cart) sẽ gửi CartKey; non-customer thì để null */
  cartKey?: string | null;

  /** Non-customer (Admin/Staff…) sẽ dùng CustomerId; Customer thì để null */
  customerId?: number | null;
  shippingFee?: number;
  /** "COD" | "VNPay" | "Momo" | "Stripe" | "FAKE" (tùy bạn đặt) */
  paymentMethod?: "COD" | "VNPay" | "Momo" | "Stripe" | "FAKE";
  note?: string;
  items?: CheckoutItem[];
  address?: CheckoutAddress;
  returnUrl?: string;
};

/** ====== Kiểu chung cho đơn hàng ====== */
export type OrderStatus =
  | "Pending"
  | "AwaitingPayment"
  | "Paid"
  | "Cancelled"
  | "Fulfilled";

export type OrderItem = {
  id: number;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  name?: string;
  imageUrl?: string;
};

export type OrderSummary = {
  orderNo: string;
  totalAmount: number; // khớp BE: OrderSummaryDto -> totalAmount (camelCase)
  status: OrderStatus;
  createdAt?: string;
  customerId?: number | null;
  customerName?: string | null;
  customerEmail?: string | null;
  paymentMethod?: string | null;
};

export type OrderDetail = {
  orderNo: string;
  totalAmount: number; // khớp BE: OrderDetailDto -> totalAmount (camelCase)
  status: OrderStatus;
  createdAt?: string;
  items: OrderItem[];
  note?: string | null;
  shippingAddress?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  paymentMethod?: string | null;
};

// Rút gọn cho "Đơn hàng gần đây" (mine)
export type MyOrderBrief = {
  id: number;
  orderNo: string;
  createdAt?: string | null;
  status: OrderStatus;
  total: number; // BE trả "total" cho brief
};

// Tóm tắt cho Dashboard (4 thẻ)
export type MyOrderSummary = {
  totalOrders: number;
  inProgress: number;
  completed: number;
  totalAmount: number;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type OrderSearchQuery = {
  q?: string;
  status?: OrderStatus | "";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
};

/** Hiển thị label trạng thái đẹp mắt (nếu cần ở UI) */
export const statusLabel = (s: OrderStatus) => {
  switch (s) {
    case "Pending":
      return "Chờ xử lý";
    case "AwaitingPayment":
      return "Chờ thanh toán";
    case "Paid":
      return "Đã thanh toán";
    case "Cancelled":
      return "Đã hủy";
    case "Fulfilled":
      return "Đã hoàn tất";
    default:
      return s;
  }
};

/** =========================================================
 * CHECKOUT
 * POST /api/orders/checkout
 * ========================================================= */
export async function checkout(payload: CheckoutRequest): Promise<OrderDetail> {
  const res = await api.post<ApiEnvelope<OrderDetail>>(
    "/api/orders/checkout",
    payload
  );
  return unwrap<OrderDetail>(res.data);
}

/** =========================================================
 * LẤY CHI TIẾT ĐƠN
 * GET /api/orders/{orderNo}
 * ========================================================= */
export async function getOrder(orderNo: string): Promise<OrderDetail> {
  const res = await api.get<ApiEnvelope<OrderDetail>>(
    `/api/orders/${encodeURIComponent(orderNo)}`
  );
  return unwrap<OrderDetail>(res.data);
}

/** =========================================================
 * ĐƠN HÀNG CỦA TÔI (Recent Activity)
 * GET /api/orders/mine?take=5
 * ========================================================= */
export async function getMyRecentOrders(take = 5): Promise<MyOrderBrief[]> {
  const res = await api.get<ApiEnvelope<MyOrderBrief[]>>(`/api/orders/mine`, {
    params: { take },
  });
  return unwrap<MyOrderBrief[]>(res.data);
}

/** =========================================================
 * TÓM TẮT ĐƠN HÀNG CỦA TÔI (4 thẻ Dashboard)
 * GET /api/orders/mine/summary
 * ========================================================= */
export async function getMyOrderSummary(): Promise<MyOrderSummary> {
  const res = await api.get<ApiEnvelope<MyOrderSummary>>(
    `/api/orders/mine/summary`
  );
  return unwrap<MyOrderSummary>(res.data);
}

/** =========================================================
 * TÌM KIẾM + PHÂN TRANG ĐƠN HÀNG (Admin)
 * GET /api/orders?q&status&dateFrom&dateTo&page&pageSize
 * ========================================================= */
export async function searchOrders(
  params: OrderSearchQuery
): Promise<PagedResult<OrderSummary>> {
  const res = await api.get<ApiEnvelope<PagedResult<OrderSummary>>>(
    "/api/orders",
    {
      params,
    }
  );
  return unwrap<PagedResult<OrderSummary>>(res.data);
}

/** =========================================================
 * CẬP NHẬT TRẠNG THÁI (Admin)
 * PUT /api/orders/{orderNo}/status  { status }
 * ========================================================= */
export async function updateOrderStatus(
  orderNo: string,
  status: OrderStatus
): Promise<void> {
  const res = await api.put<ApiEnvelope<null>>(
    `/api/orders/${encodeURIComponent(orderNo)}/status`,
    { status }
  );
  unwrap<null>(res.data);
}
