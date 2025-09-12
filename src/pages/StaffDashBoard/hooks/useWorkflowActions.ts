import { useState } from "react";
import type { ValuationRequest, ValuationWorkflowStatus } from "../types";

// RequestService (cases)
import {
  updateStatus as updateStatusReq,
  assignCase as assignCaseReq,
  completeCase as completeCaseReq,
} from "../../../services/valuation";

// ResponseService (timeline/assign/status/complete) — nếu bạn chưa tạo file này, có thể bỏ các import dưới
import {
  addTimeline as addTimelineRes,
  updateStatusR as updateStatusRes,
  completeValuationR as completeValuationRes,
} from "../../../services/response";

/**
 * useWorkflowActions
 * - initial: danh sách request ban đầu (nếu có)
 * - currentUserName: để log timeline
 * - currentUserId: nếu truyền, hàm Assign sẽ gọi BE để gán người phụ trách
 */
export const useWorkflowActions = (
  initial: ValuationRequest[],
  currentUserName?: string,
  currentUserId?: number
) => {
  const [valuationRequests, setValuationRequests] =
    useState<ValuationRequest[]>(initial);

  const pushTimeline = (
    req: ValuationRequest,
    status: ValuationWorkflowStatus,
    notes = ""
  ): ValuationRequest => ({
    ...req,
    timeline: [
      ...req.timeline,
      {
        date: new Date().toISOString(), // lưu full ISO cho chuẩn
        status,
        user: currentUserName || "System",
        notes,
      },
    ],
  });

  /** Cập nhật 1 request theo id (helper) */
  const patchRequest = (
    id: string,
    mut: (req: ValuationRequest) => ValuationRequest
  ) => {
    setValuationRequests((prev) => prev.map((r) => (r.id === id ? mut(r) : r)));
  };

  /**
   * Đổi trạng thái (optimistic) + gọi BE
   * - RequestService: updateStatus
   * - ResponseService: updateStatusR + addTimeline
   */
  const updateRequestStatus = async (
    requestId: string,
    newStatus: ValuationWorkflowStatus,
    updates: Partial<ValuationRequest> = {},
    message = ""
  ) => {
    // 1) FE optimistic
    patchRequest(requestId, (req) => {
      const updated = {
        ...req,
        ...updates,
        status: newStatus,
      } as ValuationRequest;
      return pushTimeline(updated, newStatus, message);
    });

    // 2) BE — chạy song song, có try/catch để không crash UI
    try {
      // RequestService là nguồn sự thật về status
      await updateStatusReq(requestId, newStatus);

      // ResponseService: đồng bộ status + ghi timeline
      try {
        await updateStatusRes(requestId, newStatus);
      } catch (_) {
        /* optional */
      }

      try {
        await addTimelineRes(requestId, {
          step: "StatusChanged",
          note: `${message || ""} → ${newStatus}`,
        });
      } catch (_) {
        /* optional */
      }
    } catch (err) {
      // Nếu muốn: rollback UI ở đây. Mình bỏ qua để UI vẫn mượt.
      console.error("updateRequestStatus error:", err);
    }
  };

  /**
   * Gán cho tôi
   * - Nếu có currentUserId → gọi BE assign (RequestService)
   * - Luôn cập nhật FE + timeline
   */
  const handleAssignToMe = async (requestId: string) => {
    // 1) FE optimistic
    patchRequest(requestId, (req) =>
      pushTimeline(
        {
          ...req,
          assignedConsultant: currentUserName,
          assignee: currentUserId
            ? { id: currentUserId, name: currentUserName || "" }
            : req.assignee,
          assigneeId: currentUserId ?? req.assigneeId,
          assigneeName: currentUserName ?? req.assigneeName,
        },
        "consultant_assigned",
        "Assigned to consultant"
      )
    );

    // 2) BE
    if (currentUserId) {
      try {
        await assignCaseReq(requestId, currentUserId, currentUserName);
        try {
          await addTimelineRes(requestId, {
            step: "Assign",
            note: `AssigneeId=${currentUserId} (${currentUserName || ""})`,
          });
        } catch (_) {
          /* optional */
        }
      } catch (err) {
        console.error("assignCase error:", err);
      }
    }
  };

  const handleMarkAsContacted = async (requestId: string, notes?: string) => {
    await updateRequestStatus(
      requestId,
      "customer_contacted",
      { consultantNotes: notes },
      notes || "Customer contacted"
    );
  };

  const handleCreateReceipt = async (
    requestId: string,
    receiptNumber: string
  ) => {
    await updateRequestStatus(
      requestId,
      "receipt_created",
      { receiptNumber },
      `Receipt: ${receiptNumber}`
    );
  };

  const handleStartValuation = async (requestId: string) => {
    await updateRequestStatus(
      requestId,
      "valuation_in_progress",
      {
        assignedValuer: currentUserName,
        // nếu bạn dùng assignee chung cho valuer:
        assignee: currentUserId
          ? { id: currentUserId, name: currentUserName || "" }
          : undefined,
        assigneeId: currentUserId,
        assigneeName: currentUserName,
      },
      "Valuer started work"
    );
  };

  /**
   * Hoàn tất định giá
   * - FE: set valuationResults + timeline
   * - BE: ưu tiên ResponseService.completeValuationR; nếu bạn chỉ muốn RequestService: dùng completeCaseReq
   */
  const handleCompleteValuation = async (
    requestId: string,
    payload: {
      marketValue: number;
      insuranceValue: number;
      retailValue: number;
      condition: string;
      certificationDetails: string;
      photos?: string[];
      notes?: string;
    }
  ) => {
    // 1) FE optimistic
    patchRequest(requestId, (req) =>
      pushTimeline(
        {
          ...req,
          valuationResults: {
            marketValue: payload.marketValue,
            insuranceValue: payload.insuranceValue,
            retailValue: payload.retailValue,
            condition: payload.condition,
            certificationDetails: payload.certificationDetails,
            photos: payload.photos || [],
          },
          valuationNotes: payload.notes,
          status: "valuation_completed",
        },
        "valuation_completed",
        "Valuation completed"
      )
    );

    // 2) BE
    try {
      // ResponseService: chốt kết quả
      await completeValuationRes(requestId, {
        marketValue: payload.marketValue,
        insuranceValue: payload.insuranceValue,
        retailValue: payload.retailValue,
        condition: payload.condition,
        certificationDetails: payload.certificationDetails,
        notes: payload.notes,
      });

      // Đồng bộ status ở RequestService
      try {
        await updateStatusReq(requestId, "valuation_completed");
      } catch (_) {
        /* optional */
      }

      // Ghi timeline
      try {
        await addTimelineRes(requestId, {
          step: "Completed",
          note: "Valuation finalized",
        });
      } catch (_) {
        /* optional */
      }
    } catch (err) {
      console.error("complete valuation error:", err);
      // fallback: nếu bạn không dùng ResponseService, dùng RequestService
      try {
        await completeCaseReq(requestId, {
          marketValue: payload.marketValue,
          insuranceValue: payload.insuranceValue,
          retailValue: payload.retailValue,
          condition: payload.condition,
          certificationDetails: payload.certificationDetails,
          notes: payload.notes || "",
        });
      } catch (e2) {
        console.error("fallback completeCase error:", e2);
      }
    }
  };

  return {
    valuationRequests,
    setValuationRequests,

    // helpers
    updateRequestStatus,

    // actions
    handleAssignToMe,
    handleMarkAsContacted,
    handleCreateReceipt,
    handleStartValuation,
    handleCompleteValuation,
  };
};
