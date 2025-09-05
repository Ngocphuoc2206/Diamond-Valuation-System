import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCaseDetail } from "../services/valuation";

const CaseDetailPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getCaseDetail(id!);
        if (!mounted) return;
        setData(res);
      } catch (e: any) {
        setError(e?.message || "Failed to load case");
      } finally {
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

  const { contact, request, result, status, createdAt } = data;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Valuation Case Detail</h1>

      <div className="rounded border p-4">
        <div>
          <b>Case ID:</b> {id}
        </div>
        <div>
          <b>Status:</b> {status}
        </div>
        <div>
          <b>Created At:</b> {new Date(createdAt).toLocaleString()}
        </div>
      </div>

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

      <div className="rounded border p-4">
        <h2 className="font-medium mb-2">Request</h2>
        <div>
          <b>Cert No:</b> {request?.certificateNo}
        </div>
        <div>
          <b>Origin:</b> {request?.spec?.origin}
        </div>
        <div>
          <b>Shape:</b> {request?.spec?.shape}
        </div>
        <div>
          <b>Carat:</b> {request?.spec?.carat}
        </div>
        <div>
          <b>Color:</b> {request?.spec?.color}
        </div>
        <div>
          <b>Clarity:</b> {request?.spec?.clarity}
        </div>
        <div>
          <b>Cut:</b> {request?.spec?.cut}
        </div>
      </div>

      {result && (
        <div className="rounded border p-4">
          <h2 className="font-medium mb-2">Result</h2>
          <div>
            <b>Market Value:</b> {result.marketValue}
          </div>
          <div>
            <b>Insurance Value:</b> {result.insuranceValue}
          </div>
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
