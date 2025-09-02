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
  status?: string;
  lastActiveAt?: string;
  avatarUrl?: string;
};

export type Paged<T> = {
  data: {
    items: T[];
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  success?: boolean;
  message?: string;
};

const USER_BASE = "/api/user";

export const UserAPI = {
  // Danh sách + filter/search nếu cần
  list: (page = 1, size = 20, q?: string, role?: string, status?: string) =>
    api.get<Paged<UserDto>>(`${USER_BASE}`, {
      params: { page, size, q, role, status },
    }),

  getById: (id: number) => api.get<{ data: UserDto }>(`${USER_BASE}/${id}`),

  updateById: (id: number, payload: Partial<UserDto>) =>
    api.put<{ data: UserDto }>(`${USER_BASE}/${id}`, payload),

  updateMyProfile: (payload: {
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
  }) => api.put(`${USER_BASE}/me`, payload),

  assignRole: (payload: {
    userId: number;
    role: string;
    fullName: string;
    email: string;
  }) => api.post(`${USER_BASE}/assign-role`, payload),

  suspend: (id: number) => api.post(`${USER_BASE}/${id}/suspend`, {}),

  activate: (id: number) => api.post(`${USER_BASE}/${id}/activate`, {}),

  delete: (id: number) => api.delete(`${USER_BASE}/${id}`),

  bulk: (payload: {
    action: "activate" | "suspend" | "delete";
    userIds: number[];
  }) => api.post(`${USER_BASE}/bulk`, payload),
};

// (Đăng ký user nằm ở Auth)
export const AuthAPI = {
  register: (input: {
    userName: string;
    email: string;
    password: string;
    fullName?: string;
  }) =>
    api.post(`/api/auth/register`, {
      userName: input.userName,
      email: input.email,
      password: input.password,
      fullName: input.fullName ?? "",
    }),
};
