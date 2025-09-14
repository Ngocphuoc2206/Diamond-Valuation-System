import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import * as CartAPI from "../services/cart";
import {
  getCartKeyForCustomer,
  clearCartKey as clearSessionCartKey,
} from "../utils/cartKey";

type CartItem = {
  id: number;
  sku: string;
  quantity: number;
  unitPrice: number;
  name?: string;
  imageUrl?: string;
  lineTotal?: number;
};
type Cart = {
  id: number;
  cartKey?: string;
  customerId?: number;
  items: CartItem[];
  subtotal: number;
  total: number;
};

type CartCtx = {
  cart?: Cart;
  items: CartItem[];
  /** cartKey cho Customer/Guest (session) */
  cartKey?: string;
  /** tổng tiền hiện tại (từ cart hoặc tính lại) */
  getTotalPrice: () => number;

  refresh: () => Promise<void>;
  add: (payload: {
    sku: string;
    quantity: number;
    unitPrice: number;
    name?: string;
    imageUrl?: string;
  }) => Promise<void>;
  update: (payload: {
    id: number;
    quantity: number;
    unitPrice: number;
  }) => Promise<void>;
  remove: (id: number) => Promise<void>;

  /** xoá cart local (ví dụ sau khi checkout) */
  clearCartLocal: () => void;
};

const CartContext = createContext<CartCtx>({} as CartCtx);
export const useCart = () => useContext(CartContext);

// Giỏ trống dùng làm fallback khi BE trả 400/404
const EMPTY_CART: Cart = { id: 0, items: [], subtotal: 0, total: 0 };

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | undefined>(undefined);

  const isCustomerLike = useMemo(() => {
    const roles = Array.isArray(user?.roles)
      ? user?.roles
      : user?.roles
      ? [user?.roles]
      : [];
    const isCustomer = roles.some(
      (r: any) => String(r).toLowerCase() === "customer"
    );
    return isCustomer || !isAuthenticated; // guest => true
  }, [user?.roles, isAuthenticated]);

  // Lấy cartKey cho Customer/Guest (session).
  const cartKey = useMemo(() => {
    if (!isCustomerLike) return undefined;
    try {
      return getCartKeyForCustomer();
    } catch {
      return undefined;
    }
  }, [isCustomerLike]);

  // ---- API wrappers (role-aware qua cartKey) ----
  const refresh = useCallback(async () => {
    try {
      const data = await CartAPI.getCart(cartKey);
      setCart((data as any)?.data ?? data ?? EMPTY_CART);
    } catch (e: any) {
      // 400/404 khi BE yêu cầu cartKey hoặc chưa có cart -> không để crash UI
      if (e?.response?.status === 400 || e?.response?.status === 404) {
        setCart(EMPTY_CART);
        return;
      }
      console.warn("getCart failed:", e?.response?.data || e?.message);
      setCart(EMPTY_CART);
    }
  }, [cartKey]);

  useEffect(() => {
    (async () => {
      try {
        await CartAPI.createOrGetCart(cartKey);
      } catch (e: any) {
        // bỏ qua 400 (thiếu cartKey hoặc payload chưa hợp lệ theo BE)
        if (e?.response?.status !== 400) {
          console.warn(
            "createOrGetCart failed:",
            e?.response?.data || e?.message
          );
        }
      }
      await refresh();
    })();
  }, [isAuthenticated, isCustomerLike, cartKey, refresh]);

  const add = useCallback(
    async (payload: {
      sku: string;
      quantity: number;
      unitPrice: number;
      name?: string;
      imageUrl?: string;
    }) => {
      try {
        await CartAPI.addItem(payload, cartKey);
      } catch (e) {
        console.warn("addItem failed:", e);
        throw e; // để UI (toast) hiển thị lỗi nhưng không vỡ context
      } finally {
        await refresh();
      }
    },
    [cartKey, refresh]
  );

  const update = useCallback(
    async (payload: { id: number; quantity: number; unitPrice: number }) => {
      try {
        await CartAPI.updateItem(payload, cartKey);
      } catch (e) {
        console.warn("updateItem failed:", e);
        throw e;
      } finally {
        await refresh();
      }
    },
    [cartKey, refresh]
  );

  const remove = useCallback(
    async (id: number) => {
      try {
        await CartAPI.removeItem(id, cartKey);
      } catch (e) {
        console.warn("removeItem failed:", e);
        throw e;
      } finally {
        await refresh();
      }
    },
    [cartKey, refresh]
  );

  const items = useMemo(() => cart?.items ?? [], [cart?.items]);

  const getTotalPrice = useCallback(() => {
    if (typeof cart?.total === "number") return cart.total;
    return items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  }, [cart?.total, items]);

  const clearCartLocal = useCallback(() => {
    // Sau khi checkout xong
    if (isCustomerLike) {
      try {
        clearSessionCartKey();
      } catch {}
    }
    setCart(EMPTY_CART);
  }, [isCustomerLike]);

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        cartKey,
        getTotalPrice,
        refresh,
        add,
        update,
        remove,
        clearCartLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
