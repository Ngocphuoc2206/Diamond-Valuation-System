import React, { useState } from "react";
import type { ValuationRequest } from "../../types";

type Props = {
  isOpen: boolean;
  request: ValuationRequest | null;
  onCancel: () => void;
  onConfirm: (payload: {
    marketValue: number;
    insuranceValue: number;
    retailValue: number;
    condition: string;
    certificationDetails: string;
    notes?: string;
  }) => void;
};

const ValuationModal: React.FC<Props> = ({
  isOpen,
  request,
  onCancel,
  onConfirm,
}) => {
  const [marketValue, setMarketValue] = useState<number>(0);
  const [insuranceValue, setInsuranceValue] = useState<number>(0);
  const [retailValue, setRetailValue] = useState<number>(0);
  const [condition, setCondition] = useState<string>("");
  const [cert, setCert] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
        <h3 className="text-lg font-semibold mb-2">
          Complete valuation – {request.id}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Market value"
            value={marketValue}
            onChange={(e) => setMarketValue(Number(e.target.value))}
          />
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Insurance value"
            value={insuranceValue}
            onChange={(e) => setInsuranceValue(Number(e.target.value))}
          />
          <input
            className="border rounded p-2"
            type="number"
            placeholder="Retail value"
            value={retailValue}
            onChange={(e) => setRetailValue(Number(e.target.value))}
          />
          <input
            className="border rounded p-2"
            placeholder="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          />
          <input
            className="border rounded p-2 col-span-2"
            placeholder="Certification details"
            value={cert}
            onChange={(e) => setCert(e.target.value)}
          />
          <textarea
            className="border rounded p-2 col-span-2"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() =>
              onConfirm({
                marketValue,
                insuranceValue,
                retailValue,
                condition,
                certificationDetails: cert,
                notes,
              })
            }
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
export default ValuationModal;
