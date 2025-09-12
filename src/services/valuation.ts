import { api } from "./apiClient";

/* ---------------- Helpers: normalize ---------------- */
const VI_STATUS = [
  "YeuCau",
  "LienHe",
  "BienLai",
  "DinhGia",
  "KetQua",
  "Complete",
] as const;

const EN_STATUS = ["Pending", "InProgress", "Completed"] as const;

type AnyStatus =
  | (typeof VI_STATUS)[number]
  | (typeof EN_STATUS)[number]
  | string
  | number
  | null
  | undefined;

export function normalize_Status(s: AnyStatus): string {
  if (typeof s === "number") {
    // Giữ tương thích FE cũ (status dạng index)
    return VI_STATUS[s] ?? String(s);
  }
  if (s == null) return "";
  const raw = String(s).trim();
  // Chuẩn hoá vài alias phổ biến
  const map: Record<string, string> = {
    // English
    pending: "Pending",
    inprogress: "InProgress",
    completed: "Completed",
    complete: "Complete",
    // Vietnamese set
    yeucau: "YeuCau",
    lienhe: "LienHe",
    bienlai: "BienLai",
    dinhgia: "DinhGia",
    ketqua: "KetQua",
  };
  const key = raw.replace(/\s+/g, "").toLowerCase();
  return map[key] ?? raw;
}

/** Map FE(UI) → BE(Request/Response) status keyword */
export function mapFeStatusToBe(fe: string): string {
  const k = (fe || "").toLowerCase().replace(/\s+/g, "");
  switch (k) {
    case "new_request":
    case "newrequest":
    case "pending":
      return "YeuCau";
    case "customer_contacted":
    case "contacted":
      return "LienHe";
    case "receipt_created":
    case "scheduled":
      return "BienLai";
    case "valuation":
    case "inprogress":
      return "DinhGia";
    case "result_prepared":
    case "sent":
      return "KetQua";
    case "completed":
    case "complete":
      return "Complete";
    default:
      // Nếu đã là từ điển BE chuẩn, normalize rồi trả lại
      return normalize_Status(fe);
  }
}

export function progressOf(status: string): number {
  // Hỗ trợ cả 2 bộ status
  switch (normalize_Status(status)) {
    // VI
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
    // EN
    case "Pending":
      return 10;
    case "InProgress":
      return 65;
    case "Completed":
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
  preferredMethod?: string;
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
  status: string; // Pending | InProgress | Completed | YeuCau...
  message?: string;
};

export async function createValuationCase(
  payload: CreateCaseRequest
): Promise<CreateCaseResponse> {
  // Gửi đúng các field BE đang nhận; field thừa sẽ bị ASP.NET bỏ qua
  const body = {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    certificateNo: payload.certificateNo ?? null,
    origin: payload.origin,
    shape: payload.shape,
    carat: payload.carat,
    color: payload.color,
    clarity: payload.clarity,
    cut: payload.cut,
    polish: payload.polish,
    symmetry: payload.symmetry,
    fluorescence: payload.fluorescence,
    // các field chưa có trong BE model được giữ lại để tương lai dùng
    tablePercent: payload.tablePercent,
    depthPercent: payload.depthPercent,
    measurements: payload.measurements,
    notes: payload.notes,
  };
  const { data } = await api.post<CreateCaseResponse>("/api/cases", body);
  return { ...data, status: normalize_Status((data as any).status) };
}

/* ---------------- Case detail ---------------- */
export type CaseDetail = {
  id: string;
  status: string; // normalized
  progress?: number;
  createdAt: string;
  updatedAt?: string | null;

  consultantName?: string | null;

  // Kết quả (nếu có)
  marketValue?: number | null;
  insuranceValue?: number | null;
  retailValue?: number | null;

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
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    preferredMethod?: string | null;
    userId?: number | null;
  };
};

// Map từ ValuationCase (BE) → CaseDetail (FE)
function mapCaseToDetail(x: any): CaseDetail {
  const status = normalize_Status(x?.status);
  const progress =
    typeof x?.progress === "number" ? x.progress : progressOf(status);

  const detail: CaseDetail = {
    id: x.id,
    status,
    progress,
    createdAt: x.createdAt,
    updatedAt: x.updatedAt ?? null,
    consultantName: x.assigneeName ?? null,

    // Kết quả từ navigation Result (nếu BE include)
    marketValue: x.result?.marketValue ?? null,
    insuranceValue: x.result?.insuranceValue ?? null,
    retailValue: x.result?.retailValue ?? null,

    // Diamond snapshot lưu trên Case
    diamond: {
      certificateNo: x.certificateNo ?? null,
      origin: x.origin,
      shape: x.shape,
      carat: x.carat,
      color: x.color,
      clarity: x.clarity,
      cut: x.cut,
      polish: x.polish,
      symmetry: x.symmetry,
      fluorescence: x.fluorescence,
      tablePercent: x.tablePercent ?? null,
      depthPercent: x.depthPercent ?? null,
      measurements: x.measurements ?? null,
    },

    // Đọc contact từ object x.contact BE include
    contact: x?.contact
      ? {
          id: x.contact.id ?? x.id,
          fullName: x.contact.fullName,
          email: x.contact.email,
          phone: x.contact.phone,
          preferredMethod: x.contact.preferredMethod ?? null,
          userId: x.contact.userId ?? null,
        }
      : undefined,
  };

  return detail;
}

export async function getCaseDetail(caseId: string): Promise<CaseDetail> {
  const { data } = await api.get(`/api/cases/${caseId}`);
  return mapCaseToDetail(data);
}

/* ---------------- List of cases ---------------- */
export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages?: number;
};

// +++ Thêm tóm tắt contact/diamond + estimatedValue cho danh sách +++
type ContactSummary = {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  userId: string | null;
};

type DiamondSummary = {
  type?: string | null;
  shape?: string | null;
  carat?: number | null;
  color?: string | null;
  clarity?: string | null;
  cut?: string | null;
};

export type CaseListItem = {
  id: string;
  status: string; // normalized
  progress: number; // %
  consultantName?: string | null;
  createdAt: string;
  estimatedValue?: number | null;
  contact?: ContactSummary | null;
  diamond?: DiamondSummary | null;
  // Nếu BE có trả summary:
  resultSummary?: { marketValue: number; retailValue: number } | null;
};

function mapListItem(x: any): CaseListItem {
  const st = normalize_Status(x?.status);

  // --- contact summary (giữ logic cũ) ---
  const contact: ContactSummary | null = x?.contact
    ? {
        fullName: x.contact.fullName ?? x.customerName ?? null,
        email: x.contact.email ?? null,
        phone: x.contact.phone ?? null,
        userId: x.contact.userId ?? null,
      }
    : x?.customerName
    ? {
        fullName: x.customerName,
        email: null,
        phone: null,
        userId: x.userId || null,
      }
    : null;

  // --- diamond summary (đầy đủ + fallback) ---
  const diamondObj = x?.diamond ?? null;

  const diamond: DiamondSummary | null = diamondObj
    ? {
        type: diamondObj.type ?? diamondObj.origin ?? null,
        shape: diamondObj.shape ?? null,
        carat: diamondObj.carat ?? null,
        color: diamondObj.color ?? null,
        clarity: diamondObj.clarity ?? null,
        cut: diamondObj.cut ?? null,
      }
    : x?.shape || x?.carat || x?.color || x?.clarity || x?.cut
    ? {
        // BE trả phẳng -> vẫn map đủ field
        type: x.origin ?? null,
        shape: x.shape ?? null,
        carat: x.carat ?? null,
        color: x.color ?? null,
        clarity: x.clarity ?? null,
        cut: x.cut ?? null,
      }
    : null;

  return {
    id: x.id,
    status: st,
    progress: x.progress ?? progressOf(st),
    consultantName: x.assigneeName ?? x.consultantName ?? null,
    createdAt: x.createdAt,
    estimatedValue: x.estimatedValue ?? null,
    contact,
    diamond,
    resultSummary: x.resultSummary ?? null,
  };
}

export async function listCases(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}): Promise<PagedResult<CaseListItem>> {
  const { data } = await api.get("/api/cases", { params });
  const items = (data.items || []).map(mapListItem);
  const totalPages =
    (data as any).totalPages ?? Math.ceil(data.total / data.pageSize);
  return { ...(data as any), items, totalPages };
}

/* ---------------- List of user's cases (mine) ---------------- */
// Nếu BE chưa có /api/cases/mine, sẽ fallback về /api/cases
export async function getMyCases(
  page = 1,
  pageSize = 10,
  status?: string
): Promise<PagedResult<CaseListItem>> {
  try {
    const { data } = await api.get<PagedResult<any>>("/api/cases/mine", {
      params: { page, pageSize, status },
    });
    const items = (data.items || []).map(mapListItem);
    const totalPages =
      (data as any).totalPages ?? Math.ceil(data.total / data.pageSize);
    return { ...(data as any), items, totalPages };
  } catch (e: any) {
    if (e?.response?.status === 404) {
      // fallback
      return listCases({ page, pageSize, status });
    }
    throw e;
  }
}

/* ---------------- Update Status (RequestService) ---------------- */
export async function updateStatus(
  caseId: string,
  status: string
): Promise<void> {
  // chấp nhận cả FE-key (valuation/result_prepared/...) và BE-key (YeuCau/...)
  const be = mapFeStatusToBe(status);
  await api.put(`/api/cases/${caseId}/status`, { status: be });
}

/* ---------------- Assign (RequestService) ---------------- */
/** Cần BE có route PUT /api/cases/{id}/assign (đã hướng dẫn thêm ở BE). */
export async function assignCase(
  caseId: string,
  assigneeId: number,
  assigneeName?: string
): Promise<void> {
  await api.put(`/api/cases/${caseId}/assign`, { assigneeId, assigneeName });
}

/* ---------------- Complete (RequestService) ---------------- */
export type ValuationResult = {
  marketValue: number;
  insuranceValue: number;
  retailValue: number;
  condition: string;
  certificationDetails: string;
  notes?: string | null;
};

export async function completeCase(caseId: string, payload: ValuationResult) {
  const { data } = await api.post(`/api/cases/${caseId}/complete`, payload);
  return data as ValuationResult;
}

export async function listUnassignedCases(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  const { data } = await api.get("/api/cases/unassigned", { params });
  const items = (data.items || []).map(mapListItem);
  const totalPages =
    (data as any).totalPages ?? Math.ceil(data.total / data.pageSize);
  return { ...(data as any), items, totalPages };
}

export async function listAssignedToMe(params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}) {
  const { data } = await api.get("/api/cases/assigned-to-me", { params });
  const items = (data.items || []).map(mapListItem);
  const totalPages =
    (data as any).totalPages ?? Math.ceil(data.total / data.pageSize);
  return { ...(data as any), items, totalPages };
}

export async function claimCase(caseId: string): Promise<void> {
  await api.post(`/api/cases/${caseId}/claim`);
}

// ===== Contact =====
export async function addContactLog(
  caseId: string,
  payload: {
    channel: "phone" | "email" | "zalo" | "other";
    outcome: "reached" | "voicemail" | "wrong_number" | "no_answer";
    note?: string;
    nextFollowUpAt?: string | null;
  }
) {
  await api.post(`/api/cases/${caseId}/contact-log`, payload);
}

export async function getContactLogs(caseId: string) {
  const { data } = await api.get(`/api/cases/${caseId}/contact-log`);
  return data as Array<{
    id: string;
    channel: string;
    outcome: string;
    note?: string;
    nextFollowUpAt?: string;
    createdAt: string;
  }>;
}
