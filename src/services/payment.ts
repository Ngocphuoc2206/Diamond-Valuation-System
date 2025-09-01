// src/services/payment.ts
import axios from "axios";

/**
 * Cách 1 (proxy):
 * - FE (5173) sẽ proxy các request bắt đầu bằng /api/payments sang http://localhost:8081
 * - Vì vậy baseURL nên để "" (relative) để request rơi vào proxy của Vite.
 * - Nếu bạn đặt VITE_PAYMENT_BASE_URL thì sẽ dùng giá trị đó; còn không, để "".
 */
const PAYMENT_BASE =
  (import.meta.env.VITE_PAYMENT_BASE_URL as string | undefined)?.trim() || "";

// ---- Types ---------------------------------------------------------------

export type PaymentStatus =
  | "Created"
  | "Pending"
  | "Succeeded"
  | "Failed"
  | "Canceled"
  | string;

export type PaymentViewDto = {
  id: number;
  method: string;
  amount: number;
  currency?: string;
  orderCode?: string;
  status: PaymentStatus;
  failureReason?: string | null;
  providerReference?: string | null;
  redirectUrl?: string | null;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

// ---- Axios client --------------------------------------------------------

export const paymentClient = axios.create({
  baseURL: PAYMENT_BASE, // "" => dùng relative path => Vite proxy sẽ bắt /api/payments/*
  headers: { "Content-Type": "application/json" },
});

// Idempotency key helper
const randKey = () =>
  (globalThis.crypto as any)?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// ---- APIs ----------------------------------------------------------------

export async function createPayment(
  payload: {
    method: string; // "FAKE" ở bản test
    amount: number; // tổng tiền
    currency?: string; // "VND"
    orderCode: string; // mã đơn (tự sinh cũng được)
    returnUrl: string; // FE sẽ nhận redirect về đây
  },
  idempotencyKey?: string
): Promise<ApiEnvelope<PaymentViewDto>> {
  const headers: Record<string, string> = {
    "Idempotency-Key": idempotencyKey || randKey(),
  };

  // BE của bạn chấp nhận returnUrl trong BODY (theo Swagger),
  // đồng thời mình gửi cả QUERY để tương thích các bản khác.
  const res = await paymentClient.post<ApiEnvelope<PaymentViewDto>>(
    `/api/payments`,
    {
      method: payload.method,
      amount: payload.amount,
      currency: payload.currency,
      orderCode: payload.orderCode,
      returnUrl: payload.returnUrl, // body
    },
    {
      headers,
      params: { returnUrl: payload.returnUrl }, // query (tương thích)
    }
  );

  return {
    success: !!res.data?.success,
    message: res.data?.message,
    data: res.data?.data,
  };
}

export async function getPaymentById(
  id: number
): Promise<ApiEnvelope<PaymentViewDto>> {
  const res = await paymentClient.get<ApiEnvelope<PaymentViewDto>>(
    `/api/payments/${id}`
  );
  return {
    success: !!res.data?.success,
    message: res.data?.message,
    data: res.data?.data,
  };
}
