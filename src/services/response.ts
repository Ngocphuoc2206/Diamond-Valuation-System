// src/services/response.ts
import { api } from "./apiClient";

export type TimelineEntry = { step: string; note?: string; timestamp?: string };

export async function getTimeline(caseId: string) {
  const { data } = await api.get(`/api/response/${caseId}/timeline`);
  return data as {
    id: string;
    valuationCaseId: string;
    step: string;
    note: string;
    timestamp: string;
  }[];
}

export async function addTimeline(caseId: string, entry: TimelineEntry) {
  await api.post(`/api/response/${caseId}/timeline`, entry);
}

export async function assignCase(
  caseId: string,
  assigneeId: number,
  assigneeName?: string
) {
  await api.post(`/api/response/${caseId}/assign`, {
    assigneeId,
    assigneeName,
  });
}

export async function updateStatusR(caseId: string, status: string) {
  await api.post(`/api/response/${caseId}/status`, { status });
}

export async function completeValuationR(
  caseId: string,
  payload: {
    marketValue: number;
    insuranceValue: number;
    retailValue: number;
    condition: string;
    certificationDetails: string;
    notes?: string;
  }
) {
  const { data } = await api.post(`/api/response/${caseId}/complete`, payload);
  return data;
}
