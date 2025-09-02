import React from "react";
import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status?: string;
  password?: string;
}

interface UserTabProps {
  users: User[];
  filteredUsers: User[];
  selectedUsers: string[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  userStats: {
    customers: number;
    consultingStaff: number;
    valuationStaff: number;
    managers: number;
  };
  userFilter: string;
  setUserFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  handleUserAction: (action: string, userId?: string) => void;
  t: (key: string) => string;

  /** optional – để hiển thị skeleton trong lúc gọi BE */
  loading?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function formatRole(role: string) {
  return (role || "")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function roleBadgeClass(role: string) {
  switch (role) {
    case "customer":
      return "bg-blue-100 text-blue-800";
    case "admin":
      return "bg-red-100 text-red-800";
    case "manager":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-purple-100 text-purple-800"; // consulting_staff, valuation_staff, …
  }
}

const SkeletonRow: React.FC = () => (
  <tr>
    <td className="px-4 py-3">
      <div className="h-4 w-4 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        <div className="space-y-1">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-56 bg-gray-200 rounded" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="h-6 w-24 bg-gray-200 rounded-full" />
    </td>
    <td className="px-4 py-3">
      <div className="h-6 w-20 bg-gray-200 rounded-full" />
    </td>
    <td className="px-4 py-3">
      <div className="h-4 w-24 bg-gray-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="flex space-x-2">
        <div className="h-4 w-12 bg-gray-200 rounded" />
        <div className="h-4 w-12 bg-gray-200 rounded" />
        <div className="h-4 w-12 bg-gray-200 rounded" />
      </div>
    </td>
  </tr>
);

const UserTab: React.FC<UserTabProps> = ({
  users,
  filteredUsers,
  selectedUsers,
  setSelectedUsers,
  userStats,
  userFilter,
  setUserFilter,
  searchQuery,
  setSearchQuery,
  handleUserAction,
  t,
  loading = false,
}) => {
  const hasData = filteredUsers.length > 0;

  const allChecked = hasData && selectedUsers.length === filteredUsers.length;

  const toggleCheckAll = (checked: boolean) => {
    if (loading || !hasData) return;
    setSelectedUsers(checked ? filteredUsers.map((u) => u.id) : []);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="bg-white rounded-lg shadow-md p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold">
          {t("admin.userManagement")}
        </h3>
        <button
          onClick={() => handleUserAction("add")}
          className="btn btn-primary"
          disabled={loading}
        >
          {t("admin.addNewUser")}
        </button>
      </div>

      {/* User Statistics */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800">
            {t("admin.totalCustomers")}
          </h4>
          <p className="text-2xl font-bold text-blue-900">
            {userStats.customers}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800">
            {t("admin.consultingStaff")}
          </h4>
          <p className="text-2xl font-bold text-green-900">
            {userStats.consultingStaff}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800">
            {t("admin.valuationStaff")}
          </h4>
          <p className="text-2xl font-bold text-purple-900">
            {userStats.valuationStaff}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800">{t("admin.managers")}</h4>
          <p className="text-2xl font-bold text-yellow-900">
            {userStats.managers}
          </p>
        </div>
      </div>

      {/* User Filters and Search */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex space-x-3">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
            disabled={loading}
          >
            <option value="all">{t("admin.allUsers")}</option>
            <option value="customer">{t("admin.customers")}</option>
            <option value="staff">{t("admin.staff")}</option>
            <option value="admin">{t("admin.admins")}</option>
          </select>
          <input
            type="search"
            placeholder={t("placeholder.searchUsers")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-md"
            disabled={loading}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleUserAction("bulk_action")}
            className="btn btn-secondary text-sm"
            disabled={loading || selectedUsers.length === 0}
            title={
              selectedUsers.length === 0 ? t("admin.selectUsersFirst") : ""
            }
          >
            {t("admin.bulkActions")} ({selectedUsers.length})
          </button>
          <button
            onClick={() => handleUserAction("add")}
            className="btn btn-primary text-sm"
            disabled={loading}
          >
            {t("admin.addNewUser")}
          </button>
        </div>
      </div>

      {/* Empty state */}
      {!loading && !hasData && (
        <div className="border rounded-lg py-10 text-center text-gray-600">
          <p className="mb-3">{t("admin.noUsersFound")}</p>
          {users.length > 0 && (
            <p className="text-sm text-gray-500">
              {t("admin.tryDifferentFilterOrSearch")}
            </p>
          )}
        </div>
      )}

      {/* User Table */}
      {(loading || hasData) && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!allChecked}
                    onChange={(e) => toggleCheckAll(e.target.checked)}
                    className="rounded"
                    disabled={loading || !hasData}
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.user")}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.role")}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.status")}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.lastActive")}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={`sk-${i}`} />
                  ))
                : filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user.id]);
                            } else {
                              setSelectedUsers(
                                selectedUsers.filter((id) => id !== user.id)
                              );
                            }
                          }}
                          className="rounded"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              user.avatar ||
                              "https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=32&h=32&fit=crop&crop=face"
                            }
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${roleBadgeClass(
                            user.role
                          )}`}
                        >
                          {formatRole(user.role)}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.status === "suspended"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.status || "active"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-gray-600">—</td>

                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUserAction("edit", user.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {t("admin.edit")}
                          </button>

                          {user.status === "suspended" ? (
                            <button
                              onClick={() =>
                                handleUserAction("activate", user.id)
                              }
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              {t("admin.activate")}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleUserAction("suspend", user.id)
                              }
                              className="text-yellow-600 hover:text-yellow-800 font-medium"
                            >
                              {t("admin.suspend")}
                            </button>
                          )}

                          {user.role !== "admin" && (
                            <button
                              onClick={() =>
                                handleUserAction("delete", user.id)
                              }
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              {t("admin.delete")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UserTab;
