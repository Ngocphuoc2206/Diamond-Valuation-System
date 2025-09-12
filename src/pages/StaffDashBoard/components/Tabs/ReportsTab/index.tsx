import React from "react";
const ReportsTab: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-serif font-bold mb-4">
        {t("staff.myReports")}
      </h3>
      <p className="text-gray-600 text-sm">
        (TODO) Move your original Reports UI here.
      </p>
    </div>
  );
};
export default ReportsTab;
