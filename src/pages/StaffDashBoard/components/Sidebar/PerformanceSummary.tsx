import React from "react";
import type { StaffStats } from "../../types";

type Props = { stats: StaffStats; t: (k: string) => string };

const PerformanceSummary: React.FC<Props> = ({ stats, t }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-700 mb-3">
        {t("staff.performanceSummary")}
      </h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li>
          • {t("staff.assignedTasks")}: <b>{stats.assignedTasks}</b>
        </li>
        <li>
          • {t("staff.completedToday")}: <b>{stats.completedToday}</b>
        </li>
        <li>
          • {t("staff.pendingApprovals")}: <b>{stats.pendingApprovals}</b>
        </li>
        <li>
          • {t("staff.totalCompleted")}: <b>{stats.totalCompleted}</b>
        </li>
        <li>
          • {t("staff.monthlyTarget")}: <b>{stats.monthlyTarget}</b>
        </li>
        <li>
          • {t("staff.monthlyCompleted")}: <b>{stats.monthlyCompleted}</b>
        </li>
        <li>
          • {t("staff.averageRating")}: <b>{stats.averageRating}</b>
        </li>
      </ul>
    </div>
  );
};
export default PerformanceSummary;
