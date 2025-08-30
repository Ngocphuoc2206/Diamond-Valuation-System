import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { api } from "../services/apiClient";

// ====== Cấu hình ======
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

// ====== Kiểu envelope giống BE ======
type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type TokenResponse = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string; // ISO
  expiresIn?: number; // optional
};

// ====== Lưu token (local/session) ======
type StoredTokens = {
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: string | null;
};
const LS_KEY = "auth_tokens";
const SS_KEY = "auth_tokens_ss";

function saveTokens(tokens: StoredTokens, remember: boolean) {
  const mine = remember ? localStorage : sessionStorage;
  mine.setItem(remember ? LS_KEY : SS_KEY, JSON.stringify(tokens));
  // dọn kho còn lại để tránh nhầm
  (remember ? sessionStorage : localStorage).removeItem(
    remember ? SS_KEY : LS_KEY
  );
}
function readTokens(): { tokens: StoredTokens; remember: boolean } {
  const ls = localStorage.getItem(LS_KEY);
  if (ls) return { tokens: JSON.parse(ls), remember: true };
  const ss = sessionStorage.getItem(SS_KEY);
  if (ss) return { tokens: JSON.parse(ss), remember: false };
  return { tokens: {}, remember: true };
}
function clearTokens() {
  localStorage.removeItem(LS_KEY);
  sessionStorage.removeItem(SS_KEY);
}

// ====== Giải mã JWT nhanh (lấy claims: uid/email/role/...) ======
function decodeJwt(token?: string | null): any | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

/** =======================
 *  CHUẨN HOÁ ROLE (QUAN TRỌNG)
 *  =======================
 *  - Hỗ trợ BE trả PascalCase (ConsultingStaff), snake_case (consulting_staff),
 *    camel/space/dash… và cả mảng roles.
 */
function normalizeRole(
  raw?: string
):
  | "admin"
  | "manager"
  | "consulting_staff"
  | "valuation_staff"
  | "customer"
  | "guest"
  | "" {
  const s = (raw ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[-_]/g, "");
  if (s === "admin") return "admin";
  if (s === "manager") return "manager";
  if (s === "customer") return "customer";
  if (s === "guest") return "guest";
  if (s === "consultingstaff") return "consulting_staff";
  if (s === "valuationstaff") return "valuation_staff";
  return "";
}

/** Nếu BE trả mảng roles, chọn role "mạnh" nhất theo thứ tự ưu tiên */
function pickPrimaryRole(arr: unknown): string | undefined {
  if (!Array.isArray(arr)) return undefined;
  const canon = (s: string) =>
    s.toLowerCase().replace(/\s+/g, "").replace(/[-_]/g, "");
  const order = [
    "admin",
    "manager",
    "consultingstaff",
    "valuationstaff",
    "customer",
    "guest",
  ];
  const idx = arr
    .map((r) => (typeof r === "string" ? canon(r) : ""))
    .map((r) => order.indexOf(r))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)[0];
  if (idx === undefined) return undefined;
  const want = order[idx];
  return arr.find((r) => typeof r === "string" && canon(r) === want) as
    | string
    | undefined;
}

/** Lấy role từ payload một cách an toàn */
function getRoleFromPayload(payload: any): string {
  const single =
    payload?.role ??
    payload?.Role ??
    payload?.app_role ??
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  const multi =
    payload?.roles ??
    payload?.Roles ??
    payload?.app_roles ??
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/roles"];

  const chosen =
    (Array.isArray(multi) ? pickPrimaryRole(multi) : undefined) ?? single ?? "";
  return normalizeRole(chosen);
}

// ====== Auth Context ======
type AuthContextType = {
  user: User | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loginWithTokens?: (
    accessToken: string,
    refreshToken?: string | null,
    rememberMe?: boolean
  ) => Promise<void>;
  me?: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // nạp từ storage khi khởi tạo
  useEffect(() => {
    const { tokens } = readTokens();
    if (tokens?.accessToken) {
      const payload = decodeJwt(tokens.accessToken);
      if (payload) {
        setUser({
          id: Number(payload.uid ?? payload.userId ?? 0),
          email: payload.email ?? "",
          name: payload.fullName ?? payload.unique_name ?? payload.sub ?? "",
          roles: getRoleFromPayload(payload),
        } as User);
      }
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = true
  ) => {
    try {
      // UserService: body là { userNameOrEmail, password }
      const { data } = await api.post<ApiEnvelope<TokenResponse>>(
        "/api/auth/login",
        {
          userNameOrEmail: email,
          password,
        }
      );

      if (!data?.success || !data.data?.accessToken) {
        throw new Error(data?.message || "Đăng nhập thất bại");
      }

      const { accessToken, refreshToken, expiresAt } = data.data;

      // lưu một lần là đủ
      saveTokens(
        {
          accessToken: accessToken ?? null,
          refreshToken: refreshToken ?? null,
          expiresAt: expiresAt ?? null,
        },
        rememberMe
      );

      const payload = decodeJwt(accessToken);
      setUser(
        payload
          ? ({
              id: Number(payload.uid ?? payload.userId ?? 0),
              email: payload.email ?? email,
              name:
                payload.fullName ?? payload.unique_name ?? payload.sub ?? "",
              roles: getRoleFromPayload(payload),
            } as User)
          : null
      );

      return true;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Có lỗi kết nối. Vui lòng thử lại.";
      throw new Error(msg);
    }
  };

  const loginWithTokens = async (
    accessToken: string,
    refreshToken?: string | null,
    rememberMe: boolean = true
  ) => {
    saveTokens({ accessToken, refreshToken: refreshToken ?? null }, rememberMe);
    const payload = decodeJwt(accessToken);
    setUser(
      payload
        ? ({
            id: Number(payload.uid ?? payload.userId ?? 0),
            email: payload.email ?? "",
            name: payload.fullName ?? payload.unique_name ?? payload.sub ?? "",
            roles: getRoleFromPayload(payload),
          } as User)
        : null
    );
  };

  // BE hiện chưa có GET /api/user/me → có thể gọi /api/user/{id} nếu muốn “tươi” hơn
  const me = async () => {
    return;
  };

  const logout = async () => {
    try {
      const { tokens } = readTokens();
      await api.post<ApiEnvelope<boolean>>("/api/auth/logout", {
        refreshToken: tokens.refreshToken ?? null,
      });
    } catch {
      // bỏ qua lỗi logout
    }
    clearTokens();
    setUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loginWithTokens,
      me,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
