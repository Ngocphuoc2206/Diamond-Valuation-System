import { api } from "./apiClient";

/* ---------------- Helpers: normalize ---------------- */
const STATUS_MAP = [
  "YeuCau",
  "LienHe",
  "BienLai",
  "DinhGia",
  "KetQua",
  "Complete",
] as const;

export function normalizeStatus(s: any): string {
  if (typeof s === "number") return STATUS_MAP[s] ?? String(s);
  if (s == null) return "";
  return String(s).trim();
}

export function progressOf(status: string): number {
  switch (status) {
    case "YeuCau":
      return 10;
    case "LienHe":
      return 25;
    case "BienLai":
      return 40;
    case "DinhGia":
      return 65;
    case "KetQua":
      return 85;
    case "Complete":
      return 100;
    default:
      return 0;
  }
}

/* ---------------- Valuations (Ước lượng nhanh) ---------------- */
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
  customerName?: string;
};

type CaseBriefFromApi = {
  id: string;
  submittedAt?: string;
  status?: string | number;
  priority?: "low" | "normal" | "high" | "urgent";
  consultantName?: string | null;
  spec?: {
    origin?: string;
    shape?: string;
    carat?: number;
    color?: string;
    clarity?: string;
  };
  estimate?: { totalPrice?: number; currency?: string };
  actualResult?: { totalPrice?: number; currency?: string };
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

export async function estimate(
  payload: EstimateRequest
): Promise<EstimateResponse> {
  const { data } = await api.post<EstimateResponse>(
    "/api/valuations/estimate",
    payload
  );
  return data;
}

/* ---------------- Cases (CaseService) ---------------- */
export type CreateCaseRequest = {
  fullName: string;
  email: string;
  phone: string;
  preferredMethod: string;
  userId?: number;

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

  existingRequestId?: string;
  notes?: string;
};

export type CreateCaseResponse = {
  caseId: string;
  status: string; // "YeuCau" | ...
};

export async function createValuationCase(
  payload: CreateCaseRequest
): Promise<CreateCaseResponse> {
  const { data } = await api.post<CreateCaseResponse>("/api/cases", payload);
  // phòng khi BE trả status dạng number
  return { ...data, status: normalizeStatus((data as any).status) };
}

/* ---------------- Case detail ---------------- */
export type CaseDetail = {
  id: string;
  status: string; // normalized
  progress?: number;
  createdAt: string;
  updatedAt?: string | null;

  consultantName?: string | null;

  estimatedValue?: number | null;
  marketValue?: number | null;
  insuranceValue?: number | null;

  diamond?: {
    certificateNo?: string | null;
    origin: string;
    shape: string;
    carat: number;
    color: string;
    clarity: string;
    cut: string;
    polish: string;
    symmetry: string;
    fluorescence: string;
    tablePercent?: number | null;
    depthPercent?: number | null;
    measurements?: string | null;
  };

  contact?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    preferredMethod?: string | null;
    userId?: number | null;
  };
};

export async function getCaseDetail(caseId: string): Promise<CaseDetail> {
  const { data } = await api.get<CaseDetail>(`/api/cases/${caseId}`);
  const status = normalizeStatus((data as any).status);
  const progress = data.progress ?? progressOf(status);
  return { ...data, status, progress };
}

/* ---------------- List of user's cases ---------------- */
export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
};

export type CaseListItem = {
  id: string;
  status: string; // normalized
  progress: number; // %
  consultantName?: string | null;
  estimatedValue?: number | null;
  createdAt: string;
};

export async function getMyCases(
  page = 1,
  pageSize = 10,
  status?: string
): Promise<PagedResult<CaseListItem>> {
  const { data } = await api.get<PagedResult<CaseListItem>>("/api/cases/mine", {
    params: { page, pageSize, status },
  });

  // Chuẩn hoá từng item (status & progress)
  const items = (data.items || []).map((x: any) => {
    const st = normalizeStatus(x.status);
    return {
      ...x,
      status: st,
      progress: x.progress ?? progressOf(st),
    } as CaseListItem;
  });

  const totalPages =
    (data as any).totalPages ?? Math.ceil(data.total / data.pageSize);

  return { ...data, items, totalPages };
}
