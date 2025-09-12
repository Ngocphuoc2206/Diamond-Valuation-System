import { api } from "./apiClient";

export type CreateReceiptRequest = {
  receiptDate: string; // "YYYY-MM-DD"
  appraiserId: number;
  estimatedValue: number;
  diamond: {
    shapeCut: string;
    caratWeight: number;
    colorGrade?: string;
    clarityGrade?: string;
    cutGrade?: string;
  };
  notes?: string;

  // Bill To + linkage
  caseId?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
};

export type ReceiptResponse = {
  id: string;
  receiptNo: string;
  receiptDate: string;
  estimatedValue: number;
  diamond: {
    shapeCut: string;
    caratWeight: number;
    colorGrade?: string | null;
    clarityGrade?: string | null;
    cutGrade?: string | null;
  };
  notes?: string | null;

  // Bill To
  customerId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  caseId?: string | null;
};

export async function createReceipt(body: CreateReceiptRequest) {
  const { data } = await api.post<ReceiptResponse>("/api/receipts", body);
  return data;
}

export async function getReceipt(id: string) {
  const { data } = await api.get<ReceiptResponse>(`/api/receipts/${id}`);
  return data;
}
