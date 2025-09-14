import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { readTokens, saveTokens, clearTokens } from "./tokenStorage";
import type { ApiEnvelope, TokenResponse } from "../types/api";
const apiBaseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export const api: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  withCredentials: false, // bật nếu BE cần cookie
  timeout: 15000,
});

// --- Token attach ---
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { tokens } = readTokens();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  } else if (config.headers) {
    delete (config.headers as any).Authorization;
  }
  return config;
});

// --- Refresh queue (chỉ refresh 1 lần cho nhiều request 401) ---
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;
type PendingReq = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
};
const pendingQueue: PendingReq[] = [];

async function callRefresh(): Promise<string | null> {
  const { tokens, remember } = readTokens();
  const refreshToken = tokens.refreshToken;
  if (!refreshToken) return null;

  try {
    const res = await axios.post<ApiEnvelope<TokenResponse>>(
      `${apiBaseURL}/api/auth/refresh`,
      { refreshToken }
    );
    if (res.data?.success && res.data?.data?.accessToken) {
      const data = res.data.data;
      saveTokens(
        {
          accessToken: data.accessToken ?? null,
          refreshToken: data.refreshToken ?? refreshToken, // BE có rotate
          expiresAt: data.expiresAt ?? null,
        },
        remember
      );
      return data.accessToken ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  pendingQueue.length = 0;
}

api.interceptors.response.use(
  (res: any) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (!original) throw error;

    // Nếu 401 → thử refresh
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = callRefresh();
        const newToken = await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        if (newToken) {
          original.headers = original.headers ?? {};
          (original.headers as any).Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api.request(original);
        } else {
          processQueue(error, null);
          clearTokens();
          // Có thể điều hướng về /login tại đây tuỳ app
          throw error;
        }
      }

      // Nếu đang refresh → đợi
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token?: unknown) => {
            if (token) {
              original.headers = original.headers ?? {};
              (original.headers as any).Authorization = `Bearer ${
                token as string
              }`;
            }
            resolve(api.request(original));
          },
          reject: (err) => reject(err),
          config: original,
        });
      });
    }

    throw error;
  }
);
// --- END refresh queue ---
