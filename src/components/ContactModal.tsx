import React, { useState } from "react";

export type ContactPayload = {
  channel: "phone" | "sms" | "email" | "zalo";
  outcome: "connected" | "no_answer" | "busy" | "wrong_number";
  note?: string;
  nextFollowUpAt?: string | null; // ISO
};

export default function ContactModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: ContactPayload) => Promise<void> | void;
}) {
  const [channel, setChannel] = useState<ContactPayload["channel"]>("phone");
  const [outcome, setOutcome] =
    useState<ContactPayload["outcome"]>("connected");
  const [note, setNote] = useState("");
  const [next, setNext] = useState<string>("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      channel,
      outcome,
      note: note || undefined,
      nextFollowUpAt: next || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Ghi nhận liên hệ</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Kênh liên hệ</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="phone">Điện thoại</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="zalo">Zalo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Kết quả</label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as any)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="connected">Đã liên hệ</option>
              <option value="no_answer">Không nghe máy</option>
              <option value="busy">Máy bận</option>
              <option value="wrong_number">Sai số</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Hẹn gọi lại (tuỳ chọn)</label>
            <input
              type="datetime-local"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
