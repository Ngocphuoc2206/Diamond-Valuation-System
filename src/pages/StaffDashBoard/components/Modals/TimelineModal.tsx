import React from "react";
import type { ValuationRequest } from "../../types";

const TimelineModal: React.FC<{
  isOpen: boolean;
  request: ValuationRequest | null;
  onClose: () => void;
}> = ({ isOpen, request, onClose }) => {
  if (!isOpen || !request) return null;
  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h3 className="text-lg font-semibold mb-2">Timeline – {request.id}</h3>
        <ul className="space-y-2 text-sm">
          {request.timeline.map((e, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-gray-500 min-w-[90px]">{e.date}</span>
              <span className="font-medium">{e.status}</span>
              {e.user && <span className="text-gray-500">· {e.user}</span>}
              {e.notes && <span className="text-gray-600">– {e.notes}</span>}
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default TimelineModal;
