import React, { useState } from "react";
import type { ValuationRequest } from "../../types";
import { getStatusInfo } from "../../utils/status";

type Props = {
  request: ValuationRequest;
  onAssignToMe: (id: string) => void;
  onMarkAsContacted: (id: string, notes?: string) => void;
  onCreateReceipt: (id: string, rn: string) => void;
};

const ConsultingStaffDetailView: React.FC<Props> = ({
  request,
  onAssignToMe,
  onMarkAsContacted,
  onCreateReceipt,
}) => {
  const info = getStatusInfo(request.status);
  const [notes, setNotes] = useState("");
  const [receipt, setReceipt] = useState("");
  return (
    <div>
      <h3 className="text-xl font-semibold">
        Consulting – {request.customerName}{" "}
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${info.color}`}>
          {info.label}
        </span>
      </h3>
      <div className="mt-4 space-x-2">
        <button className="btn btn-sm" onClick={() => onAssignToMe(request.id)}>
          Assign to me
        </button>
        <input
          className="input input-sm border px-2 py-1"
          placeholder="Contact notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          className="btn btn-sm"
          onClick={() => onMarkAsContacted(request.id, notes)}
        >
          Mark contacted
        </button>
        <input
          className="input input-sm border px-2 py-1"
          placeholder="Receipt number"
          value={receipt}
          onChange={(e) => setReceipt(e.target.value)}
        />
        <button
          className="btn btn-sm"
          onClick={() => onCreateReceipt(request.id, receipt)}
        >
          Create receipt
        </button>
      </div>
    </div>
  );
};
export default ConsultingStaffDetailView;
