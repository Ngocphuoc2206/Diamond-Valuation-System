import React from "react";
import type { ValuationRequest } from "../../types";

const GeneralDetailView: React.FC<{ request: ValuationRequest }> = ({
  request,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold">{request.customerName}</h3>
      <div className="text-sm text-gray-600">
        {request.customerEmail} · {request.customerPhone}
      </div>
      <pre className="mt-4 bg-gray-50 p-3 rounded text-xs overflow-x-auto">
        {JSON.stringify(request, null, 2)}
      </pre>
    </div>
  );
};
export default GeneralDetailView;
