// src/pages/admin/tabs/ValuationTab.tsx
// ============================
import React, { useMemo, useState } from "react";
import { motion as motion3 } from "framer-motion";
import {
  type CaseListItem,
  beToFeStatus,
  isCaseOverdue,
  type ValuationWorkflowStatus,
} from "../../services/valuation"; // <-- đi lên 3 cấp tới src/services/valuation

type Counters = {
  unresolved: number;
  inprogress: number;
  completed: number;
  overdue: number;
};

interface ValuationTabProps {
  t: (key: string) => string;
  valuations: CaseListItem[];
  valuationStats:
    | Counters
    | {
        pending?: number;
        inProgress?: number;
        completed: number;
        overdue: number;
        unresolved?: number;
        inprogress?: number;
      };
  /** Chỉ còn action "view" theo yêu cầu */
  handleValuationAction: (action: "view", valuationId?: string) => void;
}

const fadeInUp3 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Danh sách FE status theo beToFeStatus để render filter
const STATUS_OPTIONS: { value: ValuationWorkflowStatus; label: string }[] = [
  { value: "new_request", label: "New Request" },
  { value: "customer_contacted", label: "Customer Contacted" },
  { value: "receipt_created", label: "Receipt Created" },
  { value: "valuation_in_progress", label: "Valuation In Progress" },
  { value: "result_prepared", label: "Result Prepared" },
  { value: "completed", label: "Completed" },
];

export const ValuationTab: React.FC<ValuationTabProps> = ({
  t,
  valuations,
  valuationStats,
  handleValuationAction,
}) => {
  // Chuẩn hoá counters để compatible cả 2 kiểu tên (mới & cũ)
  const counters: Counters = {
    unresolved:
      (valuationStats as any).unresolved ??
      (valuationStats as any).pending ??
      0,
    inprogress:
      (valuationStats as any).inprogress ??
      (valuationStats as any).inProgress ??
      0,
    completed: (valuationStats as any).completed ?? 0,
    overdue: (valuationStats as any).overdue ?? 0,
  };

  // ==== FILTER STATE ====
  const [statusFilter, setStatusFilter] = useState<
    ValuationWorkflowStatus | "all" | "overdue"
  >("all");
  const [assignee, setAssignee] = useState<string>("");
  const [q, setQ] = useState<string>("");

  // ==== APPLY FILTERS (dựa theo beToFeStatus + overdue theo createdAt) ====
  const filtered = useMemo(() => {
    return valuations.filter((v) => {
      // status filter
      if (statusFilter === "overdue") {
        if (!isCaseOverdue(v, "createdAt")) return false;
      } else if (statusFilter !== "all") {
        const fe = beToFeStatus(v.status); // map BE -> FE
        if (fe !== statusFilter) return false;
      }

      // optional: filter assignee (contains)
      if (assignee) {
        const who = (v.consultantName ?? "").toLowerCase();
        if (!who.includes(assignee.toLowerCase())) return false;
      }

      // optional: search in id, customer name, type/valuationName, shape
      if (q) {
        const hay = `${v.id} ${v.contact?.fullName ?? ""} ${
          v.valuationName ?? ""
        } ${v.diamond?.shape ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }

      return true;
    });
  }, [valuations, statusFilter, assignee, q]);

  return (
    <motion3.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp3}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-bold">
            {t("admin.valuationmangement")}
          </h3>
          {/* Theo yêu cầu "chỉ xem": bỏ nút ở header để tránh nhầm lẫn */}
        </div>

        {/* Cards thống kê */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800">
              {t("admin.valuationPending")}
            </h4>
            <p className="text-2xl font-bold text-blue-900">
              {counters.unresolved}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800">
              {t("admin.valuationInProgress")}
            </h4>
            <p className="text-2xl font-bold text-yellow-900">
              {counters.inprogress}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800">
              {t("admin.valuationCompleted")}
            </h4>
            <p className="text-2xl font-bold text-green-900">
              {counters.completed}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800">
              {t("admin.valuationOverdue")}
            </h4>
            <p className="text-2xl font-bold text-red-900">
              {counters.overdue}
            </p>
          </div>
        </div>

        {/* BỘ LỌC */}
        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("common.status") || "Status"}
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as ValuationWorkflowStatus | "all" | "overdue"
                )
              }
              className="border rounded-md px-3 py-2"
            >
              <option value="all">{t("common.all") || "All"}</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="overdue">
                {t("admin.valuationOverdue") || "Overdue"}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              {t("common.assignedTo") || "Assigned To"}
            </label>
            <input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="border rounded-md px-3 py-2"
              placeholder={t("common.enterName") || "Enter name"}
            />
          </div>

          <div className="ml-auto flex-1 min-w-[220px]">
            <label className="block text-xs text-gray-600 mb-1">
              {t("common.search") || "Search"}
            </label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder={t("search.placeholder") || "ID, customer, type..."}
            />
          </div>
        </div>

        {/* Bảng danh sách */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("common.customer") || "Customer"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("common.type") || "Type"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("common.status") || "Status"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("common.assignedTo") || "Assigned To"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("common.dueDate") || "Due Date"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("common.actions") || "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((v) => {
                const fe = beToFeStatus(v.status); // FE workflow status
                // Badge theo nhóm FE
                const badgeClass =
                  fe === "completed"
                    ? "bg-green-100 text-green-800"
                    : fe === "new_request"
                    ? "bg-blue-100 text-blue-800"
                    : fe === "valuation_in_progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : fe === "result_prepared"
                    ? "bg-purple-100 text-purple-800"
                    : fe === "customer_contacted" || fe === "receipt_created"
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-gray-100 text-gray-800";

                const overdue = isCaseOverdue(v, "createdAt");

                // Nhãn hiển thị cho FE status
                const feLabelMap: Record<ValuationWorkflowStatus, string> = {
                  new_request: "New Request",
                  customer_contacted: "Customer Contacted",
                  receipt_created: "Receipt Created",
                  valuation_assigned: "Valuation Assigned",
                  valuation_in_progress: "Valuation In Progress",
                  consultant_review: "Consultant Review",
                  result_prepared: "Result Prepared",
                  completed: "Completed",
                };
                const label = feLabelMap[fe] ?? fe;

                return (
                  <tr key={v.id}>
                    <td className="px-4 py-3 font-medium">{v.id}</td>
                    <td className="px-4 py-3">{v.contact?.fullName ?? "-"}</td>
                    <td className="px-4 py-3">
                      {v.valuationName ?? v.diamond?.shape ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${badgeClass}`}
                      >
                        {label}
                      </span>
                      {overdue && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                          Overdue
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{v.consultantName ?? "-"}</td>
                    <td className="px-4 py-3">{v.dueDate ?? "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleValuationAction("view", v.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {t("common.view") || "View"}
                        </button>
                        {/* Theo yêu cầu: chỉ xem, không có Reassign/Complete */}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-500"
                    colSpan={7}
                  >
                    {t("common.noData") || "No data"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion3.div>
  );
};

export default ValuationTab;
