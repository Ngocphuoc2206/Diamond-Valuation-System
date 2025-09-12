// src/pages/ReceiptDetailPage.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";

// Nếu dự án dùng React Query v5:
//   npm i @tanstack/react-query
//   và bạn đã bọc <QueryClientProvider> ở App.tsx
import { useQuery } from "@tanstack/react-query";
// Nếu dự án đang dùng react-query v3/v4 thì dùng:
// import { useQuery } from "react-query";

import { getReceipt } from "../services/invoices"; // ĐIỀU CHỈNH đường dẫn đúng của bạn
// Nếu chưa có Spinner sẵn, dùng tạm div:
const Spinner = () => <div className="p-6 text-center">Loading…</div>;

// Kiểu dữ liệu (match BE)
type Receipt = {
  id: string;
  receiptNo: string;
  receiptDate: string; // "YYYY-MM-DD"
  estimatedValue?: number;
  diamond: {
    shapeCut: string;
    caratWeight: number;
    colorGrade?: string | null;
    clarityGrade?: string | null;
    cutGrade?: string | null;
  };
  notes?: string | null;
};

export default function ReceiptDetailPage() {
  const { id } = useParams<{ id: string }>();

  // Nếu không có id trên URL
  if (!id) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <p className="text-red-600">Missing receipt id</p>
        <Link to="/staff" className="text-blue-600 underline">
          ← Back
        </Link>
      </div>
    );
  }

  const { data, isLoading, isError, error } = useQuery<Receipt>({
    queryKey: ["receipt", id],
    queryFn: () => getReceipt(id),
  });

  if (isLoading) return <Spinner />;

  if (isError) {
    const msg =
      (error as any)?.response?.data?.message ||
      (error as Error)?.message ||
      "Failed to load receipt";
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <p className="text-red-600">{msg}</p>
        <Link to="/staff" className="text-blue-600 underline">
          ← Back
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <p className="text-red-600">Receipt not found</p>
        <Link to="/staff" className="text-blue-600 underline">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow print:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-xl font-semibold">Receipt #{data.receiptNo}</h1>
        <button
          onClick={() => window.print()}
          className="px-3 py-1 rounded bg-gray-800 text-white text-sm"
        >
          Print
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-1">Date: {data.receiptDate}</p>

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>Shape/Cut:</div>
        <div className="font-medium">{data.diamond.shapeCut}</div>

        <div>Carat:</div>
        <div className="font-medium">{data.diamond.caratWeight}</div>

        <div>Color:</div>
        <div className="font-medium">{data.diamond.colorGrade ?? "-"}</div>

        <div>Clarity:</div>
        <div className="font-medium">{data.diamond.clarityGrade ?? "-"}</div>

        <div>Cut:</div>
        <div className="font-medium">{data.diamond.cutGrade ?? "-"}</div>

        <div>Estimated value:</div>
        <div className="font-bold">
          {new Intl.NumberFormat("vi-VN").format(data.estimatedValue ?? 0)} ₫
        </div>
      </div>

      {data.notes ? (
        <div className="mt-4 text-sm">
          <div className="text-gray-600">Notes</div>
          <div className="font-medium whitespace-pre-wrap">{data.notes}</div>
        </div>
      ) : null}

      <div className="mt-6">
        <Link to="/staff" className="text-blue-600 underline">
          ← Back to Staff
        </Link>
      </div>
    </div>
  );
}
