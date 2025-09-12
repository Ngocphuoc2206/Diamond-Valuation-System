import React from "react";
const ValuationsTab: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-serif font-bold mb-4">
        {t("staff.appraisals")}
      </h3>
      <p className="text-gray-600 text-sm">
        (TODO) Move your original Valuation Workstation UI here.
      </p>
    </div>
  );
};
export default ValuationsTab;
