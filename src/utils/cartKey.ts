export const CART_KEY = "cart:key";

export function getCartKeyForCustomer(): string {
  try {
    const key = window.sessionStorage.getItem(CART_KEY);
    if (key) return key;

    const canUUID =
      typeof globalThis.crypto !== "undefined" &&
      typeof (globalThis.crypto as any).randomUUID === "function";

    const newKey = canUUID
      ? (globalThis.crypto as any).randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

    window.sessionStorage.setItem(CART_KEY, newKey);
    return newKey;
  } catch {
    // fallback khi sessionStorage không khả dụng
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

export function clearCartKey() {
  try {
    window.sessionStorage.removeItem(CART_KEY);
  } catch {}
}
