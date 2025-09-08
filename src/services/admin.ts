import { api } from "./apiClient";

/** Kiểu dữ liệu tổng quan cho AdminDashboard */
export type AdminOverview = {
  totals: {
    valuations: number;
    byStatus: Partial<Record<ValStatus, number>>;
  };
  recentCases: Array<{
    id: string;
    status: string;
    createdAt: string;
    consultantName?: string | null;
  }>;
  // có thể mở rộng: users, orders, revenue...
};

type ValStatus =
  | "YeuCau"
  | "LienHe"
  | "BienLai"
  | "DinhGia"
  | "KetQua"
  | "Complete";

async function safeGet<T>(url: string, params?: any): Promise<T | null> {
  try {
    const { data } = await api.get<T>(url, { params });
    return data;
  } catch {
    return null;
  }
}

/** Lấy tổng số hồ sơ theo status bằng cách gọi pageSize=1 để đọc `total` */
async function getCaseCountByStatus(
  status?: ValStatus
): Promise<number | null> {
  // Sửa path này cho đúng endpoint admin list của bạn:
  //  - Nếu list admin là `/api/cases` → giữ nguyên
  //  - Nếu là `/api/cases/admin` → đổi path
  const data = await safeGet<{
    items: any[];
    page: number;
    pageSize: number;
    total: number;
  }>("/api/cases", { page: 1, pageSize: 1, status });

  return data ? data.total : null;
}

/** Lấy N hồ sơ gần đây cho Recent Activity */
async function getRecentCases(limit = 5) {
  const data = await safeGet<{
    items: Array<{
      id: string;
      status: string;
      createdAt: string;
      consultantName?: string | null;
    }>;
    total: number;
  }>("/api/cases", { page: 1, pageSize: limit });

  return data?.items ?? [];
}

/** API tổng hợp: GHÉP các call con phía trên */
export async function loadAdminOverview(): Promise<AdminOverview | null> {
  // nếu không có quyền (403) ở bất kỳ call nào → vẫn trả về phần còn chạy được
  const [all, yeuCau, lienHe, bienLai, dinhGia, ketQua, complete, recent] =
    await Promise.all([
      getCaseCountByStatus(undefined),
      getCaseCountByStatus("YeuCau"),
      getCaseCountByStatus("LienHe"),
      getCaseCountByStatus("BienLai"),
      getCaseCountByStatus("DinhGia"),
      getCaseCountByStatus("KetQua"),
      getCaseCountByStatus("Complete"),
      getRecentCases(5),
    ]);

  if (all == null) {
    // Không gọi được list cases admin (thường là 403) → trả null để UI hiển thị thông báo
    return null;
  }

  return {
    totals: {
      valuations: all,
      byStatus: {
        YeuCau: yeuCau ?? 0,
        LienHe: lienHe ?? 0,
        BienLai: bienLai ?? 0,
        DinhGia: dinhGia ?? 0,
        KetQua: ketQua ?? 0,
        Complete: complete ?? 0,
      },
    },
    recentCases: recent,
  };
}
