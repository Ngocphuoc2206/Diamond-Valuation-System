// src/services/order.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";
export const api = axios.create({ baseURL: API_BASE });

export type CheckoutAddress = {
  fullName: string;
  phone: string;
  email?: string;
  line1: string;
  city?: string;
  district?: string;
  note?: string;
};

export type CreateOrderRequest = {
  orderCode: string; // mã đơn (FE sinh tạm cũng được)
  amount: number; // tổng tiền
  currency?: string; // "VND"
  paymentMethod: "COD" | "FAKE";
  address: CheckoutAddress;
};

export type OrderView = {
  orderCode: string;
  amount: number;
  paymentMethod: "COD" | "FAKE";
  status: string; // e.g. "Created"
};

// CÁCH 1: Nếu có BE Order:
export async function createOrder(req: CreateOrderRequest): Promise<OrderView> {
  const { data } = await api.post<OrderView>("/api/orders", req);
  return data;
}

// CÁCH 2: Nếu CHƯA có BE Order, fake local (dùng tạm):
export function createOrderLocal(req: CreateOrderRequest): OrderView {
  // lưu localStorage lịch sử đơn hàng nếu muốn
  return {
    orderCode: req.orderCode,
    amount: req.amount,
    paymentMethod: req.paymentMethod,
    status: "Created",
  };
}
