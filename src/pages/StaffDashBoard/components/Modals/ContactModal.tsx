import React, { useState } from "react";
import type { ValuationRequest } from "../../types";

type Props = {
  isOpen: boolean;
  request: ValuationRequest | null;
  onCancel: () => void;
  onConfirm: (notes: string) => void;
};

const ContactModal: React.FC<Props> = ({
  isOpen,
  request,
  onCancel,
  onConfirm,
}) => {
  const [notes, setNotes] = useState("");
  if (!isOpen || !request) return null;
  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h3 className="text-lg font-semibold mb-2">
          Contact {request.customerName}
        </h3>
        <textarea
          className="w-full border rounded p-2 h-28"
          placeholder="Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onConfirm(notes)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
export default ContactModal;
