export const GUEST_CART_KEY = "guest_cart_key" as const;

// Lấy cartKey từ localStorage
export function getGuestCartKey() {
  return localStorage.getItem(GUEST_CART_KEY) ?? null;
}

// Set cartKey vào localStorage
export function setGuestCartKey(key: string) {
  localStorage.setItem(GUEST_CART_KEY, key);
}

export function clearGuestCartKey() {
  localStorage.removeItem(GUEST_CART_KEY);
}
