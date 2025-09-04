// src/services/admin.ts
import { api } from "./apiClient";

export type RevenuePoint = { date: string; total: number };

export type AdminOverview = {
  users?: any;
  valuations?: any;
  products?: any;
  orders?: {
    totalOrders: number;
    newOrders: number;
    awaitingPayment: number;
    paid: number;
    cancelled: number;
    fulfilled: number;
    totalRevenue: number;
    revenueDaily: RevenuePoint[];
    recentOrders: Array<{
      orderNo: string;
      total: number;
      status: string;
      createdAt: string;
      customerId?: number;
      customerName?: string;
    }>;
  };
};

export async function getAdminOverview(days = 30): Promise<AdminOverview> {
  const res = await api.get<{ success: boolean; data: AdminOverview }>(
    "/api/admin/overview",
    { params: { days } }
  );
  return res.data.data;
}
