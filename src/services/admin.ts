// src/services/adminOverview.ts
import { api } from "./apiClient";
import { UserAPI } from "./user";
import { getMyCases } from "./valuation";

/**
 * FE-only Admin Overview aggregator (SAFE)
 * - Users: /api/user (UserAPI.list)  ✅
 * - Cases by status: /api/cases/mine ✅ (tạm thời đếm của chính user)
 * - Orders: /api/orders               ✅
 */

export type AdminOverview = {
  users: { total: number };
  valuations: {
    total: number;
    byStatus: Record<
      "YeuCau" | "LienHe" | "BienLai" | "DinhGia" | "KetQua" | "Complete",
      number
    >;
  };
  orders: {
    totalRevenue: number;
    revenueDaily: Array<{ date: string; total: number }>;
  };
};

// ---------- Helpers ----------
function toISODate(d: Date) {
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
}
function startOfDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(23, 59, 59, 999);
  return x;
}

// ---------- Users (SAFE) ----------
export async function countUsersSafe(): Promise<number> {
  // UserAPI.list -> /api/user?page=1&size=1 (gateway có)
  const page = await UserAPI.list(1, 1);
  return page?.total ?? page?.items?.length ?? 0;
}

// ---------- Cases (SAFE - mine) ----------
export async function countMyCasesByStatusSafe(
  status?: string
): Promise<number> {
  const page = await getMyCases(1, 1, status); // /api/cases/mine
  return page?.total ?? page?.items?.length ?? 0;
}

// ---------- Orders ----------
export async function getOrdersInRangeSafe(fromISO: string, toISO: string) {
  const { data } = await api.get("/api/orders", {
    params: { createdFrom: fromISO, createdTo: toISO, page: 1, pageSize: 500 },
  });
  return (data?.items ?? []) as Array<{ total: number; createdAt: string }>;
}

// ---------- Combined: getAdminOverview ----------
export async function getAdminOverview(days = 30): Promise<AdminOverview> {
  const today = new Date();
  const from = startOfDay(new Date(today.getTime() - (days - 1) * 86400000));
  const to = endOfDay(today);
  const fromISO = toISODate(from);
  const toISO = toISODate(to);

  const [
    totalUsers,
    yeuCau,
    lienHe,
    bienLai,
    dinhGia,
    ketQua,
    complete,
    orders,
  ] = await Promise.all([
    countUsersSafe(),
    countMyCasesByStatusSafe("YeuCau"),
    countMyCasesByStatusSafe("LienHe"),
    countMyCasesByStatusSafe("BienLai"),
    countMyCasesByStatusSafe("DinhGia"),
    countMyCasesByStatusSafe("KetQua"),
    countMyCasesByStatusSafe("Complete"),
    getOrdersInRangeSafe(fromISO, toISO),
  ]);

  // Tính doanh thu + gom theo ngày
  let totalRevenue = 0;
  const mapDaily = new Map<string, number>();
  for (const o of orders) {
    const amount = Number(o.total) || 0;
    totalRevenue += amount;
    const day = toISODate(new Date(o.createdAt));
    mapDaily.set(day, (mapDaily.get(day) || 0) + amount);
  }

  const daysList: Array<{ date: string; total: number }> = [];
  for (
    let d = new Date(from);
    d.getTime() <= to.getTime();
    d = new Date(d.getTime() + 86400000)
  ) {
    const k = toISODate(d);
    daysList.push({ date: k, total: mapDaily.get(k) || 0 });
  }

  return {
    users: { total: totalUsers },
    valuations: {
      total: yeuCau + lienHe + bienLai + dinhGia + ketQua + complete,
      byStatus: {
        YeuCau: yeuCau,
        LienHe: lienHe,
        BienLai: bienLai,
        DinhGia: dinhGia,
        KetQua: ketQua,
        Complete: complete,
      },
    },
    orders: {
      totalRevenue,
      revenueDaily: daysList,
    },
  };
}
