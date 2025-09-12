import React from "react";
import type { StaffStats } from "../../types";

type Props = { t: (k: string) => string; stats: StaffStats };

const Card: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
}> = ({ title, value, subtitle }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-bold mt-1">{value}</div>
    {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
  </div>
);

const TaskSummaryCards: React.FC<Props> = ({ t, stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card title={t("staff.assignedTasks")} value={stats.assignedTasks} />
      <Card title={t("staff.completedToday")} value={stats.completedToday} />
      <Card
        title={t("staff.pendingApprovals")}
        value={stats.pendingApprovals}
      />
      <Card title={t("staff.totalCompleted")} value={stats.totalCompleted} />
    </div>
  );
};
export default TaskSummaryCards;
