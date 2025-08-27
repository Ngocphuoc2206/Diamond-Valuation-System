// src/services/cart.ts
import { clearGuestCartKey, getGuestCartKey } from "../utils/cartKey";
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

const apiVersionParam = {
  /* "api-version": "1.0" */
};

// Kiểm tra user đã login (có token) hay chưa
function isLoggedIn(): boolean {
  const t1 = localStorage.getItem("auth.tokens"); // ví dụ {accessToken, refreshToken}
  const t2 = localStorage.getItem("auth_tokens"); // một số nơi dùng key khác
  return !!(t1 || t2);
}

// ==== Helpers ====
// unwrap để luôn trả về CartDto (hoặc throw nếu fail)
function unwrap(res: ApiResponse<CartDto>): CartDto {
  if (!res.success || !res.data) {
    throw new Error(res.message || "Cart API failed");
  }
  return res.data;
}

/** Đảm bảo guest có cartKey trong localStorage:
 *  - Nếu có -> GET lại cart theo key đó
 *  - Nếu chưa -> POST tạo mới và lưu guest_cartKey
 */

export async function ensureGuestCart(): Promise<CartDto> {
  const existingKey = getGuestCartKey();
  if (existingKey) {
    try {
      const r = await api.get<ApiResponse<CartDto>>(`/api/orders/cart`, {
        params: { ...apiVersionParam, cartKey: existingKey },
      });
      return unwrap(r.data);
    } catch {
      // Nếu GET lỗi (cartKey không hợp lệ) thì tạo mới
      console.log("Existing cartKey is invalid, creating a new cart");
      const r2 = await api.get<ApiResponse<CartDto>>(
        `/api/orders/cart/${encodeURIComponent(existingKey)}`,
        { params: { ...apiVersionParam } }
      );
      return unwrap(r2.data);
    }
  }

  // Chưa có cartKey thì tạo mới
  const r3 = await api.post<ApiResponse<CartDto>>(
    `/api/orders/cart/create`,
    null,
    { params: { ...apiVersionParam, cartKey: undefined, customerId: null } }
  );
  return unwrap(r3.data);
}

// ---- GET/CREATE CART ----
export async function getOrCreateCart() {
  if (isLoggedIn()) {
    // User đã login -> cart liên quan customerId
    const r = await api.post<ApiResponse<CartDto>>(
      `/api/orders/cart/create`,
      null,
      { params: { ...apiVersionParam } }
    );
    // Khi đã login thành công, nếu trước đó có guest cart thì nên migrate ở nơi khác (Auth flow)
    return unwrap(r.data);
  }
  // GUEST
  return ensureGuestCart();
}

// ---- GET CART ----
export async function getCart() {
  if (isLoggedIn()) {
    // User đã login -> cart liên quan customerId
    const r = await api.get<ApiResponse<CartDto>>(`/api/orders/cart`, {
      params: { ...apiVersionParam },
    });
    return unwrap(r.data);
  } else {
    const cartKey = getGuestCartKey();
    if (!cartKey) {
      const cart = await ensureGuestCart();
      return cart;
    }
    const r = await api.get<ApiResponse<CartDto>>(`/api/orders/cart`, {
      params: { ...apiVersionParam, cartKey },
    });
    return unwrap(r.data);
  }
}

// ---- ADD ITEM ----
export async function addCartItem(payload: {
  sku: string;
  quantity: number;
  unitPrice: number;
  name?: string;
  imageUrl?: string;
}) {
  if (isLoggedIn()) {
    // User đã login -> cart liên quan customerId
    const r = await api.post<ApiResponse<CartDto>>(
      `/api/orders/cart/items`,
      payload,
      { params: { ...apiVersionParam } }
    );
    return unwrap(r.data);
  } else {
    const cartKey = getGuestCartKey();
    const r = await api.post<ApiResponse<CartDto>>(
      `/api/orders/cart/items`,
      payload,
      { params: { ...apiVersionParam, cartKey } }
    );
    return unwrap(r.data);
  }
}

// ---- UPDATE ITEM ----
export async function updateCartItem(payload: {
  cartItemId: number;
  quantity: number;
}) {
  if (isLoggedIn()) {
    // USER
    const r = await api.put<ApiResponse<CartDto>>(
      `/api/orders/cart/items`,
      payload,
      { params: { ...apiVersionParam } }
    );
    return unwrap(r.data);
  } else {
    // GUEST
    const cart = await ensureGuestCart();
    const r = await api.put<ApiResponse<CartDto>>(
      `/api/orders/cart/items`,
      payload,
      { params: { ...apiVersionParam, cartKey: cart.cartKey } }
    );
    return unwrap(r.data);
  }
}

// ---- REMOVE ITEM ----
export async function removeCartItem(cartItemId: number) {
  if (isLoggedIn()) {
    // USER
    const r = await api.delete<ApiResponse<CartDto>>(
      `/api/orders/cart/items/${cartItemId}`,
      { params: { ...apiVersionParam } }
    );
    return unwrap(r.data);
  } else {
    // GUEST
    const cart = await ensureGuestCart();
    const r = await api.delete<ApiResponse<CartDto>>(
      `/api/orders/cart/items/${cartItemId}`,
      { params: { ...apiVersionParam, cartKey: cart.cartKey } }
    );
    return unwrap(r.data);
  }
}

/** Tuỳ chọn: gọi khi user đăng nhập thành công để migrate giỏ guest sang user.
 *  Bạn có thể gọi hàm này trong Auth flow (sau khi set token).
 */
export async function migrateGuestCartIfAny() {
  const guestKey = getGuestCartKey();
  if (!guestKey || !isLoggedIn()) return;

  try {
    await api.post<ApiResponse<CartDto>>(
      `/api/orders/cart/migrate`, // <-- nếu BE đặt tên khác, đổi ở đây
      { guestKey },
      { params: { ...apiVersionParam } }
    );
  } finally {
    // Dù migrate thành công hay không, cũng nên clear để tránh xung đột
    clearGuestCartKey();
  }
}
