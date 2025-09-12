export type ValuationWorkflowStatus =
  | "new_request"
  | "consultant_assigned"
  | "customer_contacted"
  | "receipt_created"
  | "valuation_assigned"
  | "valuation_in_progress"
  | "valuation_completed"
  | "consultant_review"
  | "results_sent"
  | "completed"
  | "on_hold"
  | "cancelled";

export interface ValuationRequest {
  id: string;

  // Khách hàng
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  submittedDate: string;

  // Quy trình
  status: ValuationWorkflowStatus;
  priority: "low" | "normal" | "high" | "urgent";

  // Kim cương
  diamondType: string;
  caratWeight: string;

  // Giá trị ước tính (có thể chưa có)
  estimatedValue?: string;

  // Người phụ trách (tuỳ BE mà map)
  // ──────────────────────────────────────────────
  // Dạng cũ bạn đã dùng:
  assignedConsultant?: string;
  assignedValuer?: string;

  // Dạng mới (để mapper dùng trực tiếp):
  assignee?: { id: number; name: string };
  assigneeId?: number;
  assigneeName?: string;

  // Ghi chú
  notes: string;
  customerNotes?: string;
  consultantNotes?: string;
  valuationNotes?: string;

  // Biên lai
  receiptNumber?: string;

  // Kết quả định giá (nếu đã có)
  valuationResults?: {
    marketValue: number;
    insuranceValue: number;
    retailValue: number;
    condition: string;
    certificationDetails: string;
    photos: string[];
  };

  // Lịch sử liên lạc
  communicationLog: {
    date: string;
    type: "email" | "phone" | "meeting" | "system";
    from: string;
    message: string;
  }[];

  // Timeline workflow
  timeline: {
    date: string;
    status: ValuationWorkflowStatus;
    user: string;
    notes?: string;
  }[];
}

export interface StaffStats {
  assignedTasks: number;
  completedToday: number;
  pendingApprovals: number;
  averageRating: number;
  totalCompleted: number;
  monthlyTarget: number;
  monthlyCompleted: number;
}
