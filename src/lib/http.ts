// src/lib/http.ts
import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

type Tokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt?: string; // ISO
};

const TOKEN_KEY = "auth.tokens";

export function saveTokens(t: Tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
}
export function getTokens(): Tokens | null {
  const raw = localStorage.getItem(TOKEN_KEY);
  return raw ? (JSON.parse(raw) as Tokens) : null;
}
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
}

export const http = axios.create({
  baseURL,
  withCredentials: false, // nếu BE dùng cookie thì bật true và cấu hình CORS credentials
});

let isRefreshing = false;
let queue: Array<() => void> = [];

http.interceptors.request.use((config: any) => {
  const tokens = getTokens();
  if (tokens?.accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${tokens.accessToken}`,
    };
  }
  return config;
});

http.interceptors.response.use(
  (res: any) => res,
  async (error: AxiosError) => {
    const original = error.config!;
    // Nếu 401 và chưa refresh
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const tokens = getTokens();
      if (!tokens?.refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // đợi refresh xong
        return new Promise((resolve, reject) => {
          queue.push(() => http.request(original).then(resolve).catch(reject));
        });
      }

      try {
        isRefreshing = true;
        const { data } = await axios.post(`${baseURL}/api/auth/refresh`, {
          refreshToken: tokens.refreshToken,
        });
        const newTokens: Tokens = {
          accessToken: data?.accessToken ?? data?.data?.accessToken,
          refreshToken:
            data?.refreshToken ??
            data?.data?.refreshToken ??
            tokens.refreshToken,
          expiresAt: data?.expiresAt ?? data?.data?.expiresAt,
        };
        saveTokens(newTokens);
        queue.forEach((cb) => cb());
        queue = [];
        return http.request(original);
      } catch (e) {
        clearTokens();
        queue = [];
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Small helpers
export async function get<T>(url: string, params?: any) {
  const { data } = await http.get<T>(url, { params });
  return data;
}
export async function post<T>(url: string, body?: any) {
  const { data } = await http.post<T>(url, body);
  return data;
}
