import { api } from "./apiClient";

/**
 * ---------------- Valuations (Ước lượng nhanh) ----------------
 */
export type EstimateRequest = {
  certificateNo?: string | null;
  origin: "Natural" | "Lab-Grown" | string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  tablePercent?: number;
  depthPercent?: number;
  measurements?: string;
  customerName?: string; // snapshot tên KH (nếu muốn lưu)
};

export type EstimateResponse = {
  requestId: string;
  resultId: string;
  pricePerCarat: number;
  totalPrice: number;
  currency: string;
  algorithmVersion: string;
  valuatedAt: string;
};

/** Gọi BE để ước lượng giá (không tạo hồ sơ) */
export async function estimate(
  payload: EstimateRequest
): Promise<EstimateResponse> {
  // route viết thường cho thống nhất (ASP.NET không phân biệt hoa/thường)
  const { data } = await api.post<EstimateResponse>(
    "/api/valuations/estimate",
    payload
  );
  return data;
}

/**
 * ---------------- Cases (Tạo hồ sơ thật - CaseService) ----------------
 *
 * LƯU Ý:
 * - Đây là request “chính thức” từ user → đi vào CaseService (không phải EstimateService).
 * - Nếu trước đó bạn đã gọi estimate() thì có thể truyền existingRequestId để “gắn” lại.
 * - Nếu backend tự lấy UserId từ JWT, có thể bỏ userId ở đây.
 */
export type CreateCaseRequest = {
  // Liên hệ
  fullName: string;
  email: string;
  phone: string;
  preferredMethod: string; // "Email" | "Phone" | "Zalo" | ...

  /** Tuỳ BE: nếu lấy từ JWT thì có thể bỏ */
  userId?: number;

  // Diamond specs
  certificateNo?: string | null;
  origin: "Natural" | "Lab-Grown" | string;
  shape: string;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  polish: string;
  symmetry: string;
  fluorescence: string;
  tablePercent?: number;
  depthPercent?: number;
  measurements?: string;

  /** Nếu đã estimate trước đó, truyền id để tái sử dụng request */
  existingRequestId?: string;

  notes?: string;
};

export type CreateCaseResponse = {
  caseId: string;
  status: string; // "YeuCau" | ...
};

/** Gọi CaseService để tạo hồ sơ định giá chính thức (request valuation) */
export async function createValuationCase(
  payload: CreateCaseRequest
): Promise<CreateCaseResponse> {
  // route viết thường cho thống nhất
  const { data } = await api.post<CreateCaseResponse>("/api/cases", payload);
  return data;
}

/** Lấy chi tiết hồ sơ (dùng để hiển thị sau khi tạo thành công) */
export async function getCaseDetail(caseId: string) {
  const { data } = await api.get(`/api/cases/${caseId}`);
  return data;
}
