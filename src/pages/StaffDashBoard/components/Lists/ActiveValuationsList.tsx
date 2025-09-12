import React from "react";
import type { ValuationRequest } from "../../types";
import { getStatusInfo } from "../../utils/status";

type Props = {
  t: (k: string) => string;
  userRole: string;
  requests: ValuationRequest[];
  onWorkflowAction: (reqId: string, action: string) => void;
  onOpenTimeline: (req: ValuationRequest) => void;
};

const ActiveValuationsList: React.FC<Props> = ({
  t,
  userRole,
  requests,
  onWorkflowAction,
  onOpenTimeline,
}) => {
  const mine = requests.filter(
    (r) =>
      r.assignedConsultant === undefined ||
      r.assignedConsultant ||
      r.assignedValuer
  );
  return (
    <div className="divide-y">
      {mine.map((req) => {
        const info = getStatusInfo(req.status);
        return (
          <div key={req.id} className="py-4 flex items-start justify-between">
            <div>
              <div className="font-medium">
                {req.customerName} ·{" "}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${info.color}`}
                >
                  {info.icon} {info.label}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {req.diamondType} • {req.caratWeight} ct •{" "}
                {req.priority.toUpperCase()}
              </div>
              <button
                className="text-xs text-blue-600 mt-1"
                onClick={() => onOpenTimeline(req)}
              >
                {t("staff.viewTimeline")}
              </button>
            </div>
            <div className="space-x-2">
              {userRole === "consulting_staff" && (
                <>
                  <button
                    className="btn btn-sm"
                    onClick={() => onWorkflowAction(req.id, "contact_customer")}
                  >
                    {t("staff.contact")}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() => onWorkflowAction(req.id, "create_receipt")}
                  >
                    {t("staff.createReceipt")}
                  </button>
                </>
              )}
              {userRole === "valuation_staff" && (
                <>
                  <button
                    className="btn btn-sm"
                    onClick={() => onWorkflowAction(req.id, "start_valuation")}
                  >
                    {t("staff.start")}
                  </button>
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      onWorkflowAction(req.id, "complete_valuation")
                    }
                  >
                    {t("staff.complete")}
                  </button>
                </>
              )}
              {userRole === "manager" && (
                <button
                  className="btn btn-sm"
                  onClick={() => onWorkflowAction(req.id, "assign_valuation")}
                >
                  {t("staff.assignValuation")}
                </button>
              )}
              <button
                className="btn btn-sm"
                onClick={() => onWorkflowAction(req.id, "send_results")}
              >
                {t("staff.sendResults")}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ActiveValuationsList;
