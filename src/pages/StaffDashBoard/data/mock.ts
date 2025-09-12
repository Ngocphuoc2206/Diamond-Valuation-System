import type { StaffStats, ValuationRequest } from "../types";

export const mockValuationRequests: ValuationRequest[] = [
  {
    id: "VR-001",
    customerName: "Nguyen Van A",
    customerEmail: "a@example.com",
    customerPhone: "+84 912 345 678",
    submittedDate: "2025-09-05",
    status: "new_request",
    priority: "high",
    diamondType: "Natural",
    caratWeight: "1.2",
    estimatedValue: "$8,000 - $10,000",
    assignedConsultant: undefined,
    assignedValuer: undefined,
    notes: "Khách muốn tư vấn qua email",
    communicationLog: [
      {
        date: "2025-09-05",
        type: "system",
        from: "system",
        message: "Request submitted",
      },
    ],
    timeline: [{ date: "2025-09-05", status: "new_request", user: "System" }],
  },
  {
    id: "VR-002",
    customerName: "Tran Thi B",
    customerEmail: "b@example.com",
    customerPhone: "+84 977 111 222",
    submittedDate: "2025-09-06",
    status: "consultant_assigned",
    priority: "normal",
    diamondType: "Lab Grown",
    caratWeight: "0.9",
    estimatedValue: "$2,500 - $3,500",
    assignedConsultant: "Linh Le",
    assignedValuer: undefined,
    notes: "Hẹn gọi chiều thứ 5",
    communicationLog: [
      {
        date: "2025-09-06",
        type: "system",
        from: "system",
        message: "Consultant assigned",
      },
    ],
    timeline: [
      { date: "2025-09-06", status: "consultant_assigned", user: "Manager" },
    ],
  },
  {
    id: "VR-003",
    customerName: "Le Quang C",
    customerEmail: "c@example.com",
    customerPhone: "+84 933 999 000",
    submittedDate: "2025-09-07",
    status: "valuation_in_progress",
    priority: "urgent",
    diamondType: "Natural",
    caratWeight: "2.1",
    estimatedValue: "$15,000 - $18,000",
    assignedConsultant: "Huy Nguyen",
    assignedValuer: "An Pham",
    notes: "Gấp – đã có receipt",
    receiptNumber: "RC-20250907-01",
    communicationLog: [
      {
        date: "2025-09-07",
        type: "system",
        from: "system",
        message: "Valuation started",
      },
    ],
    timeline: [
      { date: "2025-09-07", status: "receipt_created", user: "Huy Nguyen" },
      { date: "2025-09-07", status: "valuation_assigned", user: "Manager" },
      { date: "2025-09-08", status: "valuation_in_progress", user: "An Pham" },
    ],
  },
];

export const staffStats: StaffStats = {
  assignedTasks: 12,
  completedToday: 8,
  pendingApprovals: 3,
  averageRating: 4.9,
  totalCompleted: 234,
  monthlyTarget: 50,
  monthlyCompleted: 38,
};
