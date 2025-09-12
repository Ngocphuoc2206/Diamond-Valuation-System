import React from "react";
import type { ValuationRequest } from "../../types";
import { getStatusInfo } from "../../utils/status";

type Props = {
  t: (k: string) => string;
  requests: ValuationRequest[];
  role: string;
  onSelectRequest: (r: ValuationRequest) => void;
  onAssignToMe: (id: string) => void;
  onStartValuation: (id: string) => void;
};

const WorkQueueList: React.FC<Props> = ({
  t,
  requests,
  role,
  onSelectRequest,
  onAssignToMe,
  onStartValuation,
}) => {
  const data = [...requests].sort((a, b) => (a.priority < b.priority ? 1 : -1));
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500">
          <th className="py-2">ID</th>
          <th className="py-2">Customer</th>
          <th className="py-2">Diamond</th>
          <th className="py-2">Status</th>
          <th className="py-2">Priority</th>
          <th className="py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {data.map((r) => {
          const info = getStatusInfo(r.status);
          return (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="py-2">{r.id}</td>
              <td className="py-2">{r.customerName}</td>
              <td className="py-2">
                {r.diamondType} · {r.caratWeight} ct
              </td>
              <td className="py-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${info.color}`}
                >
                  {info.label}
                </span>
              </td>
              <td className="py-2 font-medium">{r.priority.toUpperCase()}</td>
              <td className="py-2 text-right space-x-2">
                <button
                  className="btn btn-xs"
                  onClick={() => onSelectRequest(r)}
                >
                  {t("common.view")}
                </button>
                {role === "consulting_staff" && (
                  <button
                    className="btn btn-xs"
                    onClick={() => onAssignToMe(r.id)}
                  >
                    {t("staff.assignMe")}
                  </button>
                )}
                {role === "valuation_staff" && (
                  <button
                    className="btn btn-xs"
                    onClick={() => onStartValuation(r.id)}
                  >
                    {t("staff.start")}
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default WorkQueueList;
