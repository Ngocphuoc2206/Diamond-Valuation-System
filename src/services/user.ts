// src/services/user.ts
import { api } from "./apiClient";

/** ===== API Envelope (camelCase) + unwrap chung ===== */
export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

function unwrap<T>(x: any): T {
  const env = x as Partial<ApiEnvelope<T>>;
  if (env && typeof env === "object" && "success" in env && "data" in env) {
    if (!env.success) throw new Error(env.message || "Request failed");
    return env.data as T;
  }
  // fallback nếu API trả raw (không nên, nhưng để an toàn)
  return x as T;
}

/** ===== Kiểu dữ liệu ===== */
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

// Dùng lại UserDto cho /me
export type MeDto = UserDto;

export type PagedResult<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

const USER_BASE = "/api/user";

/** ===== User API ===== */
export const UserAPI = {
  // Danh sách + filter/search (trả PagedResult<UserDto>)
  list: async (
    page = 1,
    size = 20,
    q?: string,
    role?: string,
    status?: string
  ): Promise<PagedResult<UserDto>> => {
    const { data } = await api.get<ApiEnvelope<PagedResult<UserDto>>>(
      `${USER_BASE}`,
      {
        params: { page, size, q, role, status },
      }
    );
    return unwrap<PagedResult<UserDto>>(data);
  },

  // Lấy hồ sơ user hiện tại (trả UserDto)
  me: async (): Promise<MeDto> => {
    const { data } = await api.get<ApiEnvelope<MeDto>>(`${USER_BASE}/me`);
    return unwrap<MeDto>(data);
  },

  // Lấy theo id (trả UserDto)
  getById: async (id: number): Promise<UserDto> => {
    const { data } = await api.get<ApiEnvelope<UserDto>>(`${USER_BASE}/${id}`);
    return unwrap<UserDto>(data);
  },

  // Cập nhật theo id (trả UserDto)
  updateById: async (
    id: number,
    payload: Partial<UserDto>
  ): Promise<UserDto> => {
    const { data } = await api.put<ApiEnvelope<UserDto>>(
      `${USER_BASE}/${id}`,
      payload
    );
    return unwrap<UserDto>(data);
  },

  // Cập nhật hồ sơ của chính mình
  updateMyProfile: async (payload: {
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
  }): Promise<null> => {
    const { data } = await api.put<ApiEnvelope<null>>(
      `${USER_BASE}/me`,
      payload
    );
    return unwrap<null>(data);
  },

  assignRole: async (payload: {
    userId: number;
    role: string;
    fullName: string;
    email: string;
  }): Promise<null> => {
    const { data } = await api.post<ApiEnvelope<null>>(
      `${USER_BASE}/assign-role`,
      payload
    );
    return unwrap<null>(data);
  },

  suspend: async (id: number): Promise<null> => {
    const { data } = await api.post<ApiEnvelope<null>>(
      `${USER_BASE}/${id}/suspend`,
      {}
    );
    return unwrap<null>(data);
  },

  activate: async (id: number): Promise<null> => {
    const { data } = await api.post<ApiEnvelope<null>>(
      `${USER_BASE}/${id}/activate`,
      {}
    );
    return unwrap<null>(data);
  },

  delete: async (id: number): Promise<null> => {
    const { data } = await api.delete<ApiEnvelope<null>>(`${USER_BASE}/${id}`);
    return unwrap<null>(data);
  },

  bulk: async (payload: {
    action: "activate" | "suspend" | "delete";
    userIds: number[];
  }): Promise<null> => {
    const { data } = await api.post<ApiEnvelope<null>>(
      `${USER_BASE}/bulk`,
      payload
    );
    return unwrap<null>(data);
  },
};

/** ===== Auth (đăng ký) – theo APIEnvelope ===== */
export const AuthAPI = {
  register: async (input: {
    userName: string;
    email: string;
    password: string;
    fullName?: string;
  }): Promise<null> => {
    const { data } = await api.post<ApiEnvelope<null>>(`/api/auth/register`, {
      userName: input.userName,
      email: input.email,
      password: input.password,
      fullName: input.fullName ?? "",
    });
    return unwrap<null>(data);
  },
};
