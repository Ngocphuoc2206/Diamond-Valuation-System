import React from "react";
import PerformanceSummary from "./PerformanceSummary";
import type { StaffStats } from "../../types";

type Props = {
  tabs: { id: string; label: string; icon?: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  stats: StaffStats;
  t: (k: string) => string;
};

const Sidebar: React.FC<Props> = ({ tabs, activeTab, onChange, stats, t }) => {
  return (
    <aside className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-gray-700 mb-3">
          {t("staff.navigation")}
        </h3>
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-md border ${
                activeTab === tab.id
                  ? "bg-gray-100 border-gray-300"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <PerformanceSummary stats={stats} t={t} />
    </aside>
  );
};
export default Sidebar;
