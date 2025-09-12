import React from "react";
const CustomersTab: React.FC<{ t: (k: string) => string }> = ({ t }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-serif font-bold mb-4">
        {t("staff.customerContact")}
      </h3>
      <p className="text-gray-600 text-sm">
        (TODO) Move your original Customers UI here.
      </p>
    </div>
  );
};
export default CustomersTab;
