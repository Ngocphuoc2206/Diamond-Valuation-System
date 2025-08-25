// src/services/cart.ts
import { api } from "./apiClient";

export type CartItemDto = {
  id: number;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  name?: string;
  imageUrl?: string;
};

export type CartDto = {
  id: number;
  cartKey: string;
  customerId?: number | null;
  items: CartItemDto[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
};

type ApiResponse<T> = { success: boolean; message: string; data: T | null };

// ⚙️ Nếu BE có API versioning thì set ở đây (bỏ nếu không cần)
const apiVersionParam = {
  /* "api-version": "1.0" */
};

// ==== Helpers ====
// unwrap để luôn trả về CartDto (hoặc throw nếu fail)
function unwrap(res: ApiResponse<CartDto>): CartDto {
  if (!res.success || !res.data) {
    throw new Error(res.message || "Cart API failed");
  }
  return res.data;
}

// ---- GET/CREATE CART ----
export async function getOrCreateCart(
  cartKey: string,
  customerId?: number | null
) {
  // 1) GET query param
  try {
    const r1 = await api.get<ApiResponse<CartDto>>(`/api/orders/cart`, {
      params: { ...apiVersionParam, cartKey },
    });
    return unwrap(r1.data);
  } catch {
    // 2) thử GET theo path param
    try {
      const r2 = await api.get<ApiResponse<CartDto>>(
        `/api/orders/cart/${encodeURIComponent(cartKey)}`,
        { params: { ...apiVersionParam } }
      );
      return unwrap(r2.data);
    } catch {
      // 3) POST tạo mới
      const r3 = await api.post<ApiResponse<CartDto>>(
        `/api/orders/cart/create`,
        null,
        { params: { ...apiVersionParam, cartKey, customerId } }
      );
      return unwrap(r3.data);
    }
  }
}

// ---- GET CART ----
export async function getCart(cartKey: string) {
  const r = await api.get<ApiResponse<CartDto>>(`/api/orders/cart`, {
    params: { ...apiVersionParam, cartKey },
  });
  return unwrap(r.data);
}

// ---- ADD ITEM ----
export async function addCartItem(
  cartKey: string,
  payload: {
    sku: string;
    quantity: number;
    unitPrice: number;
    name?: string;
    imageUrl?: string;
  }
) {
  const r = await api.post<ApiResponse<CartDto>>(
    `/api/orders/cart/items`,
    payload,
    { params: { ...apiVersionParam, cartKey } }
  );
  return unwrap(r.data);
}

// ---- UPDATE ITEM ----
export async function updateCartItem(
  cartKey: string,
  payload: { cartItemId: number; quantity: number }
) {
  const r = await api.put<ApiResponse<CartDto>>(
    `/api/orders/cart/items`,
    payload,
    { params: { ...apiVersionParam, cartKey } }
  );
  return unwrap(r.data);
}

// ---- REMOVE ITEM ----
export async function removeCartItem(cartKey: string, cartItemId: number) {
  const r = await api.delete<ApiResponse<CartDto>>(
    `/api/orders/cart/items/${cartItemId}`,
    { params: { ...apiVersionParam, cartKey } }
  );
  return unwrap(r.data);
}
