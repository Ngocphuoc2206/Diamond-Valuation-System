import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import type { ReactNode } from "react";
import { CartAPI } from "../services/order";

/** ==== Kiểu dữ liệu đồng bộ với BE ==== */
export type ServerCartItem = {
  id: number; // cartItemId
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  name?: string | null;
  imageUrl?: string | null;
};

export type ServerCart = {
  id: number;
  cartKey: string;
  customerId?: number | null;
  items: ServerCartItem[];
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  total?: number;
};

type CartContextType = {
  cartKey: string | null;
  items: ServerCartItem[];
  subtotal: number;
  total: number;
  loading: boolean;
  error: string | null;

  refresh: () => Promise<void>;

  addToCart: (args: {
    sku: string;
    quantity: number;
    unitPrice: number;
    name?: string;
    imageUrl?: string;
  }) => Promise<void>;

  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;

  clearCartLocal: () => void;
  getTotalPrice: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY_STORAGE = "cart_key";

/** ==== Helpers =================================================================== */
/** Unwrap cho cả 3 dạng: AxiosResponse<ApiResponse<T>>, AxiosResponse<T>, T */
function unwrap<T = any>(res: any): T {
  return res?.data?.data ?? res?.data ?? res;
}

/** Random cartKey (fallback nếu BE lỗi) */
const genCartKey = () =>
  (crypto as any)?.randomUUID?.().replace(/-/g, "") ??
  Math.random().toString(36).slice(2);

/** ==== Provider ================================================================== */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartKey, setCartKey] = useState<string | null>(() =>
    localStorage.getItem(CART_KEY_STORAGE)
  );
  const [items, setItems] = useState<ServerCartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /** Khóa tránh tạo cartKey song song */
  const ensureKeyInflight = useRef<Promise<string> | null>(null);
  /** Khóa tránh refresh chồng nhau khi click nhanh */
  const refreshInflight = useRef<Promise<void> | null>(null);

  /** Tạo/Lấy cartKey hợp lệ từ BE (ưu tiên POST /cart/create) */
  const ensureCartKey = useCallback(async (): Promise<string> => {
    // đã có sẵn -> dùng luôn
    if (cartKey) return cartKey;

    // tránh gọi trùng
    if (!ensureKeyInflight.current) {
      ensureKeyInflight.current = (async () => {
        try {
          // Dùng endpoint create để BE đảm bảo tạo cart + trả cartKey chuẩn
          // (CartAPI.create có thể không cần tham số)
          const created = unwrap<ServerCart>(await CartAPI.create());
          const keyFromBe = created?.cartKey;
          const key = keyFromBe || genCartKey();

          setCartKey(key);
          localStorage.setItem(CART_KEY_STORAGE, key);
          return key;
        } catch {
          // fallback local nếu BE lỗi tạm thời
          const key = genCartKey();
          setCartKey(key);
          localStorage.setItem(CART_KEY_STORAGE, key);
          return key;
        } finally {
          ensureKeyInflight.current = null;
        }
      })();
    }
    return ensureKeyInflight.current;
  }, [cartKey]);

  /** Nạp giỏ từ BE */
  const refresh = useCallback(async () => {
    if (refreshInflight.current) return refreshInflight.current;

    refreshInflight.current = (async () => {
      setLoading(true);
      setError(null);
      try {
        const key = await ensureCartKey();
        const cart = unwrap<ServerCart>(await CartAPI.get(key));

        // một số API trả ApiResponse<CartDto>, một số trả thẳng CartDto
        const arr = cart?.items ?? [];
        setItems(arr);

        const sub =
          cart?.subtotal ??
          arr.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
        setSubtotal(sub);
        setTotal(cart?.total ?? sub);

        // nếu BE vừa trả cartKey (lúc create), đồng bộ lại local
        if (cart?.cartKey && cart.cartKey !== key) {
          setCartKey(cart.cartKey);
          localStorage.setItem(CART_KEY_STORAGE, cart.cartKey);
        }
      } catch (e: any) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to load cart"
        );
      } finally {
        setLoading(false);
        refreshInflight.current = null;
      }
    })();

    return refreshInflight.current;
  }, [ensureCartKey]);

  /** Thêm item lên BE rồi nạp lại giỏ */
  const addToCart: CartContextType["addToCart"] = async (dto) => {
    setError(null);
    const key = await ensureCartKey();

    // bảo vệ tối thiểu payload
    if (!dto?.sku || dto.quantity <= 0) {
      setError("Invalid item payload");
      return;
    }

    await CartAPI.addItem(key, {
      sku: String(dto.sku).trim(),
      quantity: Number(dto.quantity) || 1,
      unitPrice: Number(dto.unitPrice) || 0,
      name: dto.name,
      imageUrl: dto.imageUrl,
    });

    await refresh();
  };

  /** Cập nhật số lượng */
  const updateQuantity: CartContextType["updateQuantity"] = async (
    cartItemId,
    quantity
  ) => {
    setError(null);
    const key = await ensureCartKey();
    await CartAPI.updateItem(key, { cartItemId, quantity });
    await refresh();
  };

  /** Xoá item */
  const removeItem: CartContextType["removeItem"] = async (cartItemId) => {
    setError(null);
    const key = await ensureCartKey();
    await CartAPI.removeItem(key, cartItemId);
    await refresh();
  };

  /** Dọn local sau khi checkout xong (không đụng BE) */
  const clearCartLocal = () => {
    setItems([]);
    setSubtotal(0);
    setTotal(0);
    // Giữ cartKey để dùng tiếp; nếu muốn reset hoàn toàn thì bỏ comment:
    // localStorage.removeItem(CART_KEY_STORAGE);
    // setCartKey(null);
  };

  const getTotalPrice = () =>
    total || items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  /** Nạp lần đầu */
  useEffect(() => {
    // không await để không block render đầu
    refresh();
  }, [refresh]);

  return (
    <CartContext.Provider
      value={{
        cartKey,
        items,
        subtotal,
        total,
        loading,
        error,
        refresh,
        addToCart,
        updateQuantity,
        removeItem,
        clearCartLocal,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
