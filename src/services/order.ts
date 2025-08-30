import { api } from "./apiClient";

export async function checkout(payload: any) {
  const { data } = await api.post("/api/orders/checkout", payload);
  return data;
}
