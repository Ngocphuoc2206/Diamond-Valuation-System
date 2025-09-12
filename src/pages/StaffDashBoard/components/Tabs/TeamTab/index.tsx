import React from "react";
const TeamTab: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-serif font-bold mb-4">
        {t("staff.teamManagement")}
      </h3>
      <p className="text-gray-600 text-sm">
        (TODO) Move your original Team management UI here.
      </p>
    </div>
  );
};
export default TeamTab;
