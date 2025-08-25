// src/services/order.ts
import { http } from "../lib/http";

// services/order.ts
const BASE = "/api/orders";
export const CartAPI = {
  create: () => http.post(`${BASE}/cart/create`),
  get: (cartKey: string) => http.get(`${BASE}/cart`, { params: { cartKey } }),
  addItem: (cartKey: string, body: any) =>
    http.post(`${BASE}/cart/items`, body, { params: { cartKey } }),
  updateItem: (cartKey: string, body: any) =>
    http.put(`${BASE}/cart/items`, body, { params: { cartKey } }),
  removeItem: (cartKey: string, cartItemId: number) =>
    http.delete(`${BASE}/cart/items/${cartItemId}`, { params: { cartKey } }),
};

export const OrderAPI = {
  checkout: (payload: any) =>
    http.post("api/orders/checkout", payload).then((r) => r.data),
  detail: (orderNo: string) =>
    http.get(`api/orders/${orderNo}`).then((r) => r.data),
};
