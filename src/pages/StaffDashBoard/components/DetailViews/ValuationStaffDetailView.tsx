import React, { useState } from "react";
import type { ValuationRequest } from "../../types";
import { getStatusInfo } from "../../utils/status";

type Props = {
  request: ValuationRequest;
  onStartValuation: (id: string) => void;
  onCompleteValuation: (
    id: string,
    payload: {
      marketValue: number;
      insuranceValue: number;
      retailValue: number;
      condition: string;
      certificationDetails: string;
      photos?: string[];
      notes?: string;
    }
  ) => void;
};

const ValuationStaffDetailView: React.FC<Props> = ({
  request,
  onStartValuation,
  onCompleteValuation,
}) => {
  const info = getStatusInfo(request.status);
  const [marketValue, setMarketValue] = useState<number>(0);
  const [insuranceValue, setInsuranceValue] = useState<number>(0);
  const [retailValue, setRetailValue] = useState<number>(0);
  const [condition, setCondition] = useState<string>("");
  const [cert, setCert] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  return (
    <div>
      <h3 className="text-xl font-semibold">
        Valuation – {request.customerName}{" "}
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${info.color}`}>
          {info.label}
        </span>
      </h3>
      <div className="mt-4 space-x-2">
        <button
          className="btn btn-sm"
          onClick={() => onStartValuation(request.id)}
        >
          Start
        </button>
        <input
          className="input input-sm border px-2 py-1 w-24"
          type="number"
          placeholder="Market"
          value={marketValue}
          onChange={(e) => setMarketValue(Number(e.target.value))}
        />
        <input
          className="input input-sm border px-2 py-1 w-24"
          type="number"
          placeholder="Insurance"
          value={insuranceValue}
          onChange={(e) => setInsuranceValue(Number(e.target.value))}
        />
        <input
          className="input input-sm border px-2 py-1 w-24"
          type="number"
          placeholder="Retail"
          value={retailValue}
          onChange={(e) => setRetailValue(Number(e.target.value))}
        />
        <input
          className="input input-sm border px-2 py-1"
          placeholder="Condition"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <input
          className="input input-sm border px-2 py-1"
          placeholder="Certification"
          value={cert}
          onChange={(e) => setCert(e.target.value)}
        />
        <input
          className="input input-sm border px-2 py-1"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button
          className="btn btn-sm"
          onClick={() =>
            onCompleteValuation(request.id, {
              marketValue,
              insuranceValue,
              retailValue,
              condition,
              certificationDetails: cert,
              notes,
            })
          }
        >
          Complete
        </button>
      </div>
    </div>
  );
};
export default ValuationStaffDetailView;
