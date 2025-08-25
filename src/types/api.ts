export type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export type TokenResponse = {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string; // ISO
  expiresIn?: number; // optional
};

export type LoginApiEnvelope = ApiEnvelope<TokenResponse>;

export type UserDto = {
  id: number;
  userName: string;
  email: string;
  fullName?: string | null;
  role?: string | null; // từ ClaimTypes.Role
  phone?: string | null;
  dateOfBirth?: string | null;
};
