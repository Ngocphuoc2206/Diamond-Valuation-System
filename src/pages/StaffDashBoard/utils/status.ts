import type { ValuationWorkflowStatus, ValuationRequest } from "../types";
// nếu bạn dùng alias @:
import type { CaseListItem } from "../../../services/valuation";
// nếu không có alias @ thì dùng đường dẫn tương đối:
// import type { CaseListItem } from "../../../services/valuation";

/* ========== Chuẩn hoá & mapping status FE ↔ BE ========== */

// Map BE → FE
export function mapBeStatusToFe(be: string): ValuationWorkflowStatus {
  const k = (be || "").toLowerCase();
  switch (k) {
    case "yeucau":
    case "pending":
      return "new_request";
    case "lienhe":
      return "customer_contacted";
    case "bienlai":
      return "receipt_created";
    case "dinhgia":
    case "inprogress":
      return "valuation_in_progress";
    case "ketqua":
      return "results_sent";
    case "complete":
    case "completed":
      return "completed";
    default:
      return "new_request";
  }
}

// Map FE → BE
export function mapFeStatusToBe(fe: ValuationWorkflowStatus): string {
  switch (fe) {
    case "new_request":
      return "YeuCau";
    case "consultant_assigned":
      return "LienHe"; // tuỳ logic
    case "customer_contacted":
      return "LienHe";
    case "receipt_created":
      return "BienLai";
    case "valuation_assigned":
    case "valuation_in_progress":
      return "DinhGia";
    case "valuation_completed":
    case "consultant_review":
    case "results_sent":
      return "KetQua";
    case "completed":
      return "Complete";
    default:
      return "YeuCau";
  }
}

/* ========== Helper hiển thị cho UI ========== */

export const statusKeyFromEnum = (s: ValuationWorkflowStatus) =>
  s
    .split("_")
    .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
    .join("");

export const getStatusInfo = (status: ValuationWorkflowStatus) => {
  const map = {
    new_request: {
      color: "bg-blue-100 text-blue-800",
      icon: "📝",
      label: "New Request",
    },
    consultant_assigned: {
      color: "bg-yellow-100 text-yellow-800",
      icon: "👤",
      label: "Consultant Assigned",
    },
    customer_contacted: {
      color: "bg-green-100 text-green-800",
      icon: "📞",
      label: "Customer Contacted",
    },
    receipt_created: {
      color: "bg-purple-100 text-purple-800",
      icon: "📄",
      label: "Receipt Created",
    },
    valuation_assigned: {
      color: "bg-indigo-100 text-indigo-800",
      icon: "🔬",
      label: "Valuation Assigned",
    },
    valuation_in_progress: {
      color: "bg-orange-100 text-orange-800",
      icon: "⏳",
      label: "Valuation in Progress",
    },
    valuation_completed: {
      color: "bg-teal-100 text-teal-800",
      icon: "✅",
      label: "Valuation Completed",
    },
    consultant_review: {
      color: "bg-cyan-100 text-cyan-800",
      icon: "🔍",
      label: "Consultant Review",
    },
    results_sent: {
      color: "bg-pink-100 text-pink-800",
      icon: "📤",
      label: "Results Sent",
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: "🎉",
      label: "Completed",
    },
    on_hold: {
      color: "bg-gray-100 text-gray-800",
      icon: "⏸️",
      label: "On Hold",
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: "❌",
      label: "Cancelled",
    },
  } as const;
  return (
    map[status] ?? {
      color: "bg-gray-100 text-gray-800",
      icon: "❓",
      label: "Unknown",
    }
  );
};

/* ========== NEW: Map list item BE → ValuationRequest (UI) ========== */

export function mapCaseListItemToValuationRequest(
  x: CaseListItem
): ValuationRequest {
  // ── lấy các phần có thể có từ BE (dùng optional chaining an toàn)
  const contact = (x as any).contact ?? {};
  const origin = (x as any).origin ?? "";
  const carat = (x as any).carat;

  // estimatedValue: ưu tiên trường BE trực tiếp, sau đó thử resultSummary
  const resultSummary = (x as any).resultSummary;
  const estimatedValue =
    (x as any).estimatedValue != null
      ? String((x as any).estimatedValue)
      : resultSummary
      ? String(resultSummary.retailValue ?? resultSummary.marketValue ?? "")
      : undefined;

  const assigneeId = (x as any).assigneeId ?? undefined;
  const assigneeName =
    (x as any).assigneeName ?? (x as any).consultantName ?? undefined;

  // ngày gửi: cố gắng lấy createdAt/submittedDate, fallback ISO now (để không phá kiểu)
  const submittedDate =
    (x as any).createdAt ??
    (x as any).submittedDate ??
    new Date().toISOString();

  // priority: nếu BE không có thì mặc định "normal"
  const priority = ((x as any).priority ??
    "normal") as ValuationRequest["priority"];

  return {
    id: x.id,

    // thông tin KH
    customerName: contact.fullName ?? (x as any).customerName ?? "",
    customerEmail: contact.email ?? (x as any).customerEmail ?? "",
    customerPhone: contact.phone ?? (x as any).customerPhone ?? "",
    submittedDate,

    // workflow
    status: mapBeStatusToFe(x.status as any),
    priority,

    // kim cương (nếu thiếu, trả string rỗng để không phá UI)
    diamondType: origin,
    caratWeight:
      typeof carat === "number" ? String(carat) : String(carat ?? ""),

    // ước tính (có thể undefined nếu chưa có)
    estimatedValue,

    // người phụ trách (đủ cả 3 dạng để UI tiện dùng)
    assignee: assigneeId
      ? { id: assigneeId, name: assigneeName ?? "" }
      : undefined,
    assigneeId,
    assigneeName,
    assignedConsultant: assigneeName, // nếu UI đang đọc field này
    assignedValuer: (x as any).valuerName ?? undefined,

    // ghi chú (bắt buộc string) → mặc định ""
    notes: ((x as any).notes ?? "") as string,
    customerNotes: (x as any).customerNotes ?? undefined,
    consultantNotes: (x as any).consultantNotes ?? undefined,
    valuationNotes: (x as any).valuationNotes ?? undefined,

    // biên lai/kết quả (nếu có)
    receiptNumber: (x as any).receiptNumber ?? undefined,
    valuationResults: (x as any).valuationResults ?? undefined,

    // logs & timeline (bắt buộc array) → mặc định []
    communicationLog: Array.isArray((x as any).communicationLog)
      ? (x as any).communicationLog
      : [],
    timeline: Array.isArray((x as any).timeline) ? (x as any).timeline : [],
  };
}
