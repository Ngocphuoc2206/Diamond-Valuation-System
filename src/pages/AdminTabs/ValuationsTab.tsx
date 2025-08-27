// src/pages/admin/tabs/ValuationTab.tsx
// ============================
import React from "react";
import { motion as motion3 } from "framer-motion";

interface Valuation {
  id: string;
  customer: string;
  type: string;
  status: string;
  assignedTo: string;
  dueDate: string;
}
interface ValuationStats {
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

interface ValuationTabProps {
  t: (key: string) => string;
  valuations: Valuation[];
  valuationStats: ValuationStats;
  handleValuationAction: (action: string, valuationId?: string) => void;
}

const fadeInUp3 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const ValuationTab: React.FC<ValuationTabProps> = ({
  t,
  valuations,
  valuationStats,
  handleValuationAction,
}) => (
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
        <button
          onClick={() => handleValuationAction("add")}
          className="btn btn-primary"
        >
          New Valuation Request
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800">
            {t("admin.valuationPending")}
          </h4>
          <p className="text-2xl font-bold text-blue-900">
            {valuationStats.pending}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800">
            {t("admin.valuationInProgress")}
          </h4>
          <p className="text-2xl font-bold text-yellow-900">
            {valuationStats.inProgress}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">
            {t("admin.valuationCompleted")}
          </h4>
          <p className="text-2xl font-bold text-green-900">
            {valuationStats.completed}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-800">
            {t("admin.valuationOverdue")}
          </h4>
          <p className="text-2xl font-bold text-red-900">
            {valuationStats.overdue}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Customer
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Type
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Assigned To
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Due Date
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {valuations.map((valuation) => (
              <tr key={valuation.id}>
                <td className="px-4 py-3 font-medium">{valuation.id}</td>
                <td className="px-4 py-3">{valuation.customer}</td>
                <td className="px-4 py-3">{valuation.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      valuation.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : valuation.status === "in_progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : valuation.status === "pending"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {valuation.status
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </td>
                <td className="px-4 py-3">{valuation.assignedTo}</td>
                <td className="px-4 py-3">{valuation.dueDate}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleValuationAction("reassign", valuation.id)
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleValuationAction("reassign", valuation.id)
                      }
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Reassign
                    </button>
                    {valuation.status !== "completed" && (
                      <button
                        onClick={() =>
                          handleValuationAction("complete", valuation.id)
                        }
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion3.div>
);

export default ValuationTab;
