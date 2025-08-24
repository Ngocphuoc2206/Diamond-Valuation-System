// src/services/user.ts
import { api } from "./apiClient";

// Kiểu dữ liệu tối thiểu
export type RoleDto = { id?: number; name: string };

export type UserDto = {
  id: number;
  userName: string;
  email: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  roles?: RoleDto[];
  createdAt?: string;
  isAnonymous?: boolean;
};

export type Paged<T> = {
  data: T[] | T; // tuỳ BE trả data hay data.items
  pagination?: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  success?: boolean;
  message?: string;
};

export const UserAPI = {
  list: (page = 1, size = 20) =>
    api.get<Paged<UserDto>>(`/user`, { params: { page, size } }),
  getById: (id: number) => api.get<{ data: UserDto }>(`/user/${id}`),
  assignRole: (payload: { userId: number; role: string }) =>
    api.post(`/user/assign-role`, payload),

  // Tuỳ chọn: quản lý phiên
  sessions: () => api.get<{ data: any[] }>(`/auth/sessions`),
  revokeSession: (refreshTokenId: number) =>
    api.post(`/auth/revoke`, { refreshTokenId }),
  revokeAllSessions: () => api.post(`/auth/revoke-all`, {}),
};
