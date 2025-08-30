import { api } from "./apiClient";

// helpers
const qp = (cartKey?: string) => (cartKey ? { cartKey } : {});

export async function createOrGetCart(cartKey?: string) {
  const { data } = await api.post("/api/orders/cart/create", null, {
    params: qp(cartKey),
  });
  return data;
}

export async function getCart(cartKey?: string) {
  const { data } = await api.get("/api/orders/cart", { params: qp(cartKey) });
  return data;
}

export async function addItem(dto: any, cartKey?: string) {
  const { data } = await api.post("/api/orders/cart/items", dto, {
    params: qp(cartKey),
  });
  return data;
}

export async function updateItem(dto: any, cartKey?: string) {
  const { data } = await api.put("/api/orders/cart/items", dto, {
    params: qp(cartKey),
  });
  return data;
}

export async function removeItem(id: number, cartKey?: string) {
  const { data } = await api.delete(`/api/orders/cart/items/${id}`, {
    params: qp(cartKey),
  });
  return data;
}
