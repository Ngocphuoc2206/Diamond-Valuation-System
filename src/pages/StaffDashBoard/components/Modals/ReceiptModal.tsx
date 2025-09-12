// src/pages/StaffDashBoard/components/Modals/ReceiptModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { getUserById } from "../../../../services/auth";

type Props = {
  isOpen: boolean;
  request: any | null; // case đang chọn
  defaultAppraiserId?: string; // GUID đăng nhập (nếu đã có)
  onCancel: () => void;
  onSubmit: (form: {
    receiptDate: string;
    appraiserId: string;
    estimatedValue: number;
    notes?: string;
    // Bill To
    customerId?: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    customerAddress?: string;
  }) => void;
};

const GUID_RE =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const ReceiptModal: React.FC<Props> = ({
  isOpen,
  request,
  defaultAppraiserId,
  onCancel,
  onSubmit,
}) => {
  const today = new Date().toISOString().slice(0, 10);

  // Form states
  const [receiptDate, setReceiptDate] = useState(today);
  const [appraiserId, setAppraiserId] = useState(defaultAppraiserId ?? "");
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [notes, setNotes] = useState("");

  // Bill To
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerID, setCustomerID] = useState<number>(0);
  const [consultantName, setConsultantName] = useState("");

  // Diamond (read-only panel)
  const d = (request as any)?.diamond ?? {};
  console.log("Request: ", request);
  const readOnlyDiamond = useMemo(
    () => ({
      shape: d.type ?? d.shape ?? "", // ưu tiên type nếu có
      carat: d.carat ?? "",
      color: d.color ?? "",
      clarity: d.clarity ?? "",
      cut: d.cut ?? "",
    }),
    [request]
  );

  // Prefill mỗi khi mở modal / đổi request / đổi defaultAppraiserId
  useEffect(() => {
    if (!isOpen || !request) return;
    if (defaultAppraiserId) {
      getUserById(Number(appraiserId)).then((res: any) => {
        console.log("res name: ", res.data?.fullName);
        if (res.data?.fullName) {
          setConsultantName(res.data?.fullName);
        }
      });
    }
    setReceiptDate(new Date().toISOString().slice(0, 10));
    setAppraiserId(defaultAppraiserId ?? "");

    setEstimatedValue(
      Number(request?.estimatedValue ?? request?.marketValue ?? 0) || 0
    );
    setNotes(request?.notes ?? "");

    // Bill To
    setCustomerName(request?.customerName ?? request?.contact?.fullName ?? "");
    setCustomerEmail(request?.customerEmail ?? request?.contact?.email ?? "");
    setCustomerPhone(request?.customerPhone ?? request?.contact?.phone ?? "");
    setCustomerID(request?.contact?.userId ?? "");
    console.log("Customer ID: ", request?.contact?.userId ?? "");
    setCustomerAddress(request?.contact?.address ?? "");
  }, [isOpen, request, defaultAppraiserId]);

  if (!isOpen || !request) return null;

  const canSubmit =
    receiptDate?.length === 10 && String(consultantName).trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 grid place-items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Create receipt</h3>

        {/* Row 1: Date + AppraiserId */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Receipt Date</span>
            <input
              type="date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              className="border rounded p-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Consultant Name</span>
            <input
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
              className="border rounded p-2"
            />
          </label>

          {/* Estimated value */}
          <label className="flex flex-col col-span-2">
            <span className="text-sm text-gray-600">Estimated Value</span>
            <input
              type="number"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(Number(e.target.value))}
              className="border rounded p-2"
              min={0}
            />
          </label>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col col-span-2">
            <span className="text-sm text-gray-600">Customer Name</span>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border rounded p-2"
              placeholder="Nguyễn Văn A"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Customer Email</span>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="border rounded p-2"
              placeholder="email@example.com"
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600">Customer Phone</span>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="border rounded p-2"
              placeholder="09xxxxxxxx"
            />
          </label>

          <label className="flex flex-col col-span-2">
            <span className="text-sm text-gray-600">Customer Address</span>
            <input
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="border rounded p-2"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            />
          </label>
        </div>

        {/* Diamond read-only */}
        <div className="bg-gray-50 rounded p-3 text-sm">
          <div>
            Shape: <b>{readOnlyDiamond.shape || "—"}</b>
          </div>
          <div>
            Carat: <b>{readOnlyDiamond.carat || "—"}</b>
          </div>
          <div>
            Color: <b>{readOnlyDiamond.color || "—"}</b>
          </div>
          <div>
            Clarity: <b>{readOnlyDiamond.clarity || "—"}</b>
          </div>
          <div>
            Cut: <b>{readOnlyDiamond.cut || "—"}</b>
          </div>
        </div>

        {/* Notes */}
        <textarea
          className="w-full border rounded p-2"
          placeholder="Notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn btn-primary ${
              !canSubmit ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!canSubmit}
            onClick={() =>
              onSubmit({
                receiptDate,
                appraiserId,
                estimatedValue,
                notes,
                customerId: customerID || undefined,
                customerName: customerName || undefined,
                customerEmail: customerEmail || undefined,
                customerPhone: customerPhone || undefined,
                customerAddress: customerAddress || undefined,
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

export default ReceiptModal;
