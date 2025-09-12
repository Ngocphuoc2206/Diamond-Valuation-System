import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCaseDetail } from "../services/valuation";
import type { CaseDetail } from "../services/valuation";

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<CaseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await getCaseDetail(id);
        if (!mounted) return;
        setData(res);
      } catch (e: any) {
        if (!mounted) return;
        setError(
          e?.response?.data?.message || e?.message || "Failed to load case"
        );
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!data) return <div className="p-4">No data</div>;

  const {
    status,
    progress,
    createdAt,
    updatedAt,
    consultantName,
    contact,
    diamond,
    marketValue,
    insuranceValue,
    retailValue,
  } = data;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Valuation Case Detail</h1>

      {/* Overview */}
      <div className="rounded border p-4 space-y-2">
        <div>
          <b>Case ID:</b> {id}
        </div>
        <div>
          <b>Status:</b> {status}
        </div>
        <div>
          <b>Created At:</b> {new Date(createdAt).toLocaleString()}
        </div>
        {updatedAt && (
          <div>
            <b>Updated At:</b> {new Date(updatedAt).toLocaleString()}
          </div>
        )}
        {consultantName && (
          <div>
            <b>Consultant:</b> {consultantName}
          </div>
        )}
        {/* Progress */}
        <div className="mt-2">
          <div className="text-sm mb-1">Progress: {progress ?? 0}%</div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded border p-4">
        <h2 className="font-medium mb-2">Contact</h2>
        <div>
          <b>Name:</b> {contact?.fullName}
        </div>
        <div>
          <b>Email:</b> {contact?.email}
        </div>
        <div>
          <b>Phone:</b> {contact?.phone}
        </div>
      </div>

      {/* Diamond spec */}
      <div className="rounded border p-4">
        <h2 className="font-medium mb-2">Diamond</h2>
        <div>
          <b>Cert No:</b> {diamond?.certificateNo ?? "-"}
        </div>
        <div>
          <b>Origin:</b> {diamond?.origin}
        </div>
        <div>
          <b>Shape:</b> {diamond?.shape}
        </div>
        <div>
          <b>Carat:</b> {diamond?.carat}
        </div>
        <div>
          <b>Color:</b> {diamond?.color}
        </div>
        <div>
          <b>Clarity:</b> {diamond?.clarity}
        </div>
        <div>
          <b>Cut:</b> {diamond?.cut}
        </div>
        <div>
          <b>Polish:</b> {diamond?.polish}
        </div>
        <div>
          <b>Symmetry:</b> {diamond?.symmetry}
        </div>
        <div>
          <b>Fluorescence:</b> {diamond?.fluorescence}
        </div>
        {diamond?.tablePercent != null && (
          <div>
            <b>Table %:</b> {diamond.tablePercent}
          </div>
        )}
        {diamond?.depthPercent != null && (
          <div>
            <b>Depth %:</b> {diamond.depthPercent}
          </div>
        )}
        {diamond?.measurements && (
          <div>
            <b>Measurements:</b> {diamond.measurements}
          </div>
        )}
      </div>

      {/* Result */}
      {(marketValue != null ||
        insuranceValue != null ||
        retailValue != null) && (
        <div className="rounded border p-4">
          <h2 className="font-medium mb-2">Result</h2>
          {marketValue != null && (
            <div>
              <b>Market Value:</b> {currency.format(marketValue)}
            </div>
          )}
          {insuranceValue != null && (
            <div>
              <b>Insurance Value:</b> {currency.format(insuranceValue)}
            </div>
          )}
          {retailValue != null && (
            <div>
              <b>Retail Value:</b> {currency.format(retailValue)}
            </div>
          )}
        </div>
      )}

      <div className="pt-2">
        <Link to="/dashboard" className="btn btn-secondary">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default CaseDetailPage;
