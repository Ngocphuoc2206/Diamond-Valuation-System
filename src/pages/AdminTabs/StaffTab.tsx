// src/pages/admin/tabs/StaffTab.tsx
// ============================
import React from "react";
import { motion as motion6 } from "framer-motion";

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  activeCases: number;
  performance: number;
  status: string;
  avatar: string;
}

interface StaffTabProps {
  t: (key: string) => string;
  staff: Staff[];
  handleStaffAction: (action: string, staffId?: string) => void;
}

const fadeInUp6 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const StaffTab: React.FC<StaffTabProps> = ({
  t,
  staff,
  handleStaffAction,
}) => (
  <motion6.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp6}
    className="space-y-6"
  >
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold">
          {t("admin.staffManagement")}
        </h3>
        <button
          onClick={() => handleStaffAction("add")}
          className="btn btn-primary"
        >
          {t("admin.addNewStaff")}
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800">
            {t("admin.consultingStaff")}
          </h4>
          <p className="text-2xl font-bold text-blue-900">
            {staff.filter((s) => s.role === "consulting_staff").length}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800">
            {t("admin.valuationStaff")}
          </h4>
          <p className="text-2xl font-bold text-purple-900">
            {staff.filter((s) => s.role === "valuation_staff").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">{t("admin.managers")}</h4>
          <p className="text-2xl font-bold text-green-900">
            {staff.filter((s) => s.role === "manager").length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800">
            {t("admin.totalStaff")}
          </h4>
          <p className="text-2xl font-bold text-yellow-900">{staff.length}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Top Performers This Month</h4>
          <div className="space-y-2">
            {staff.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <span>{s.name}</span>
                <span className="font-bold text-green-600">
                  {s.performance}%
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Workload Distribution</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Consulting Team</span>
              <span className="font-bold">
                {staff
                  .filter((s) => s.role === "consulting_staff")
                  .reduce((sum, s) => sum + s.activeCases, 0)}{" "}
                active cases
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Valuation Team</span>
              <span className="font-bold">
                {staff
                  .filter((s) => s.role === "valuation_staff")
                  .reduce((sum, s) => sum + s.activeCases, 0)}{" "}
                active cases
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Average Load</span>
              <span className="font-bold">
                {(
                  staff.reduce((sum, s) => sum + s.activeCases, 0) /
                  (staff.length || 1)
                ).toFixed(1)}{" "}
                cases/staff
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Staff Member
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Role
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Department
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Active Cases
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Performance
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={s.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-gray-500">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      s.role === "valuation_staff"
                        ? "bg-purple-100 text-purple-800"
                        : s.role === "consulting_staff"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {s.role
                      .replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </td>
                <td className="px-4 py-3">{s.department}</td>
                <td className="px-4 py-3 font-bold">{s.activeCases}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <span className="text-green-600 font-bold">
                      {s.performance}%
                    </span>
                    {s.performance >= 95 && (
                      <span className="ml-2 text-yellow-600">⭐</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      s.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStaffAction("view", s.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleStaffAction("schedule", s.id)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Schedule
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion6.div>
);

export default StaffTab;
