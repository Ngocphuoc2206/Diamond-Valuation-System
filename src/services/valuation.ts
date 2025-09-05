import { api } from "./apiClient";

// Request gửi sang API Valuations
export type EstimateRequest = {
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

// Gọi BE để estimate
export async function estimate(
  payload: EstimateRequest
): Promise<EstimateResponse> {
  const { data } = await api.post<EstimateResponse>(
    "/api/Valuations/estimate",
    payload
  );
  return data;
}

// ---------------- Cases ----------------
export type CreateCaseRequest = {
  fullName: string;
  email: string;
  phone: string;
  preferredMethod: string;
  userId?: number;
  // diamond specs
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
  tablePercent?: number;
  depthPercent?: number;
  measurements?: string;
  existingRequestId?: string;
  notes?: string;
};

export type CreateCaseResponse = { caseId: string; status: string };

export async function createValuationCase(
  payload: CreateCaseRequest
): Promise<CreateCaseResponse> {
  const { data } = await api.post<CreateCaseResponse>("/api/Cases", payload);
  return data;
}

export async function getCaseDetail(caseId: string) {
  const { data } = await api.get(`/api/Cases/${caseId}`);
  return data;
}
