import React from "react";
import type { ValuationRequest } from "../../../types";
import WorkQueueList from "../../Lists/WorkQueueList";

type Props = {
  t: (k: string) => string;
  requests: ValuationRequest[];
  role: string;
  onSelectRequest: (r: ValuationRequest) => void;
  onAssignToMe: (id: string) => void;
  onStartValuation: (id: string) => void;
};

const QueueTab: React.FC<Props> = ({
  t,
  requests,
  role,
  onSelectRequest,
  onAssignToMe,
  onStartValuation,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-serif font-bold mb-6">
          {t("staff.workQueue")}
        </h3>
        <WorkQueueList
          t={t}
          requests={requests}
          role={role}
          onSelectRequest={onSelectRequest}
          onAssignToMe={onAssignToMe}
          onStartValuation={onStartValuation}
        />
      </div>
    </div>
  );
};
export default QueueTab;
