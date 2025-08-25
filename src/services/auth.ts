import { api } from "./apiClient";
import type {
  ApiEnvelope,
  TokenResponse,
  LoginApiEnvelope,
  UserDto,
} from "../types/api";

export async function login(userNameOrEmail: string, password: string) {
  const { data } = await api.post<LoginApiEnvelope>("/api/auth/login", {
    userNameOrEmail,
    password,
  });
  return data;
}

export async function register(payload: {
  userName: string;
  email: string;
  password: string;
  fullName?: string;
}) {
  const { data } = await api.post<ApiEnvelope<TokenResponse>>(
    "/api/auth/register",
    payload
  );
  return data;
}

export async function refresh(refreshToken: string) {
  const { data } = await api.post<ApiEnvelope<TokenResponse>>(
    "/api/auth/refresh",
    { refreshToken }
  );
  return data;
}

// Chưa có GET /api/user/me → dùng GET /api/user/{id} (id lấy từ JWT ở client) hoặc bổ sung /me ở BE
export async function getUserById(id: number) {
  const { data } = await api.get<ApiEnvelope<UserDto>>(`/api/user/${id}`);
  return data;
}

export async function updateMe(
  payload: Partial<Pick<UserDto, "fullName" | "phone" | "dateOfBirth">>
) {
  const { data } = await api.put<ApiEnvelope<UserDto>>(`/api/user/me`, payload);
  return data;
}

export async function logout(refreshToken?: string | null) {
  const { data } = await api.post<ApiEnvelope<boolean>>(`/api/auth/logout`, {
    refreshToken: refreshToken ?? null,
  });
  return data;
}
