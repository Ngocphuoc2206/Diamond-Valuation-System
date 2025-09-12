import React from "react";
import type { ValuationRequest, StaffStats } from "../../../types";
import TaskSummaryCards from "../../SummaryCards/TaskSummaryCards";
import ActiveValuationsList from "../../Lists/ActiveValuationsList";

type Props = {
  t: (k: string) => string;
  stats: StaffStats;
  requests: ValuationRequest[];
  userRole: string;
  onWorkflowAction: (reqId: string, action: string) => void;
  onOpenTimeline: (req: ValuationRequest) => void;
};

const TasksTab: React.FC<Props> = ({
  t,
  stats,
  requests,
  userRole,
  onWorkflowAction,
  onOpenTimeline,
}) => {
  return (
    <div className="space-y-6">
      <TaskSummaryCards t={t} stats={stats} />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-serif font-bold mb-6">
          {t("staff.myValuationWorkflow")}
        </h3>
        <ActiveValuationsList
          t={t}
          userRole={userRole}
          requests={requests}
          onWorkflowAction={onWorkflowAction}
          onOpenTimeline={onOpenTimeline}
        />
      </div>
    </div>
  );
};
export default TasksTab;
