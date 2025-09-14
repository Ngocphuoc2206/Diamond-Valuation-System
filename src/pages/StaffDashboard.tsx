import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { AnimatePresence } from "framer-motion";
import {
  getCaseDetail,
  type CaseDetail,
  progressOf,
  updateStatus,
  listValuationQueue,
  listPendingValuationCases,
  type CaseListItem,
  claimValuation,
  listUnassignedValuation,
  listAssignedToMeValuation,
} from "../services/valuation";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { Link } from "react-router-dom";
import {
  listUnassignedCases,
  listAssignedToMe,
  claimCase,
} from "../services/valuation";
import { toast } from "react-toastify";
import { createReceipt } from "../services/invoices";
import ReceiptModal from "./StaffDashBoard/components/Modals/ReceiptModal";
import { api } from "../services/apiClient";

// ==========================HELPER===================================
// Map tiến độ cho cả 2 kiểu status (FE cũ & BE mới)
const progressByStatus = (s?: string) => {
  switch ((s || "").toLowerCase()) {
    // FE cũ
    case "new_request":
      return 10;
    case "consultant_assigned":
      return 20;
    case "customer_contacted":
      return 30;
    case "receipt_created":
      return 40;
    case "valuation_assigned":
      return 50;
    case "valuation_in_progress":
      return 70;
    case "valuation_completed":
      return 80;
    case "consultant_review":
      return 90;
    case "results_sent":
      return 95;
    case "completed":
      return 100;
    // BE mới
    case "yeucau":
      return 10;
    case "lienhe":
      return 25;
    case "bienlai":
      return 40;
    case "dinhgia":
      return 65;
    case "ketqua":
      return 85;
    case "complete":
      return 100;
    default:
      return 10;
  }
};

type ActionItem = {
  key:
    | "view_timeline"
    | "send_to_valuation"
    | "start_valuation"
    | "finish_valuation"
    | "send_results"
    | "mark_complete";
  label: string;
  color: string;
};

const normalizeStatus = (s?: string): ValuationWorkflowStatus => {
  const k = (s || "").toLowerCase();
  switch (k) {
    case "yeucau":
      return "new_request";
    case "lienhe":
      return "customer_contacted";
    case "bienlai":
      return "receipt_created";
    case "dinhgia":
      return "valuation_in_progress";
    case "ketqua":
      return "valuation_completed";
    case "complete":
      return "completed";
    default:
      return (s as ValuationWorkflowStatus) || "new_request";
  }
};

const priorityRank = (p?: string) =>
  (({ urgent: 4, high: 3, normal: 2, low: 1 } as any)[p || "normal"] || 1);

// Nếu getStatusInfo của bạn không cover hết, dùng default
const defaultStatusInfo = (status?: string) => ({
  label: status || "Unknown",
  color: "bg-gray-100 text-gray-800",
  icon: null,
});

// Enhanced workflow states for complete valuation process
type ValuationWorkflowStatus =
  | "new_request" // Customer submits request
  | "consultant_assigned" // System assigns to consultant
  | "customer_contacted" // Consultant contacts customer
  | "receipt_created" // Consultant creates valuation receipt
  | "valuation_assigned" // Assigned to valuation staff
  | "valuation_in_progress" // Valuation staff working
  | "valuation_completed" // Valuation staff finished
  | "consultant_review" // Back to consultant for review
  | "results_sent" // Consultant sends results to customer
  | "completed" // Process complete
  | "on_hold" // Waiting for customer response
  | "cancelled"; // Process cancelled

interface ValuationRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  submittedDate: string;
  status: ValuationWorkflowStatus;
  priority: "low" | "normal" | "high" | "urgent";
  diamondType: string;
  caratWeight: string;
  estimatedValue: string;
  assignedConsultant?: string;
  assignedValuer?: string;
  notes: string;
  customerNotes?: string;
  consultantNotes?: string;
  valuationNotes?: string;
  receiptNumber?: string;
  valuationResults?: {
    marketValue: number;
    insuranceValue: number;
    retailValue: number;
    condition: string;
    certificationDetails: string;
    photos: string[];
  };
  communicationLog: {
    date: string;
    type: "email" | "phone" | "meeting" | "system";
    from: string;
    message: string;
  }[];
  timeline: {
    date: string;
    status: ValuationWorkflowStatus;
    user: string;
    notes?: string;
  }[];
}

// Mock data for staff dashboard
const staffStats = {
  assignedTasks: 12,
  completedToday: 8,
  pendingApprovals: 3,
  averageRating: 4.9,
  totalCompleted: 234,
  monthlyTarget: 50,
  monthlyCompleted: 38,
};

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("tasks");
  const [loading, setLoading] = useState(false);
  const [loadingQueue, setLoadingQueue] = useState(false);

  //Finish
  const [finishingId, setFinishingId] = useState<string | null>(null);

  const [valuationRequests, setValuationRequests] = useState<
    ValuationRequest[]
  >([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksPage, setTasksPage] = useState(1);
  const [tasksPageSize, setTasksPageSize] = useState(10);
  const [tasksTotal, setTasksTotal] = useState(0);

  //Calc
  // ---- Staff KPI (dynamic, thay cho số mock) ----
  const [stats, setStats] = useState({
    assignedTasks: 0,
    completedToday: 0,
    pendingApprovals: 0,
    totalCompleted: 0,
    // vẫn giữ các số "tháng này" từ mock để hiển thị progress bar
    monthlyTarget: staffStats.monthlyTarget,
    monthlyCompleted: staffStats.monthlyCompleted,
    averageRating: staffStats.averageRating,
  });

  // Chuẩn hoá & tính KPI
  const recalcStats = (items: any[], totalFromServer?: number) => {
    // assigned = tổng nhiệm vụ “của tôi”
    const assignedTasks = Number.isFinite(totalFromServer as any)
      ? (totalFromServer as number)
      : items.length;

    const today = new Date().toISOString().slice(0, 10);

    const asNorm = (s?: string) => normalizeStatus(s);

    const completedToday = items.filter((x) => {
      const st = asNorm(x?.status);
      if (st !== "completed" && st !== "valuation_completed") return false;
      const d = (x?.updatedAt || x?.completedAt || x?.createdAt || "").slice(
        0,
        10
      );
      return d === today;
    }).length;

    const pendingApprovals = items.filter((x) => {
      const st = asNorm(x?.status);
      // với Valuation staff: chờ consultant duyệt → mình đếm "valuation_completed"
      // với Consulting staff: chờ duyệt/gửi kết quả → mình đếm "consultant_review"
      return isValuationStaff
        ? st === "valuation_completed"
        : st === "consultant_review";
    }).length;

    const totalCompleted = items.filter(
      (x) => asNorm(x?.status) === "completed"
    ).length;

    setStats((p) => ({
      ...p,
      assignedTasks,
      completedToday,
      pendingApprovals,
      totalCompleted,
    }));
  };

  // Right detail drawer state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  //Valuation
  const [pendingValuations, setPendingValuations] = useState<CaseListItem[]>(
    []
  );
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);
  const pageSize = 10;

  //
  // thêm helper ở trên (cùng file)
  const safeValuerId = () => {
    // nếu BE dùng int staffId thì ưu tiên staffId, fallback Number(user.id)
    const raw = (user as any)?.staffId ?? (user as any)?.id;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };

  // Contact Customer
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactTarget, setContactTarget] = useState<any>(null);
  const [contactForm, setContactForm] = useState({
    method: "phone" as "phone" | "email" | "meeting",
    when: new Date().toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm
    notes: "",
  });

  const [openReceipt, setOpenReceipt] = useState(false);
  const [receiptCase, setReceiptCase] = useState<any>(null);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const onClickCreateReceipt = (req: any) => {
    setSelectedCase(req);
    setOpenReceipt(true);
  };

  const loadValuationQueue = async () => {
    setLoadingQueue(true);
    try {
      // Gộp: assigned-to-me + unassigned, đã lọc status = DinhGia
      const items = await listValuationQueue(); // đã FE-map sẵn
      console.log("Valuation: ", items);
      setValuationRequests(items);
    } finally {
      setLoadingQueue(false);
    }
  };

  // Trong component StaffDashboard
  const [workingId, setWorkingId] = useState<string | null>(null);

  function computeActions(req: any): ActionItem[] {
    const actions: ActionItem[] = [];
    const s = normalizeStatus(req?.status);

    if (isConsultingStaff) {
      if (s === "receipt_created") {
        actions.push({
          key: "send_to_valuation",
          label: t("staff.sendToValuation") ?? "Gửi Sang Định Giá",
          color: "bg-purple-600 text-white hover:bg-purple-700",
        });
      }
      if (s === "valuation_completed") {
        actions.push({
          key: "mark_complete",
          label: t("staff.markComplete") ?? "Đóng Hồ Sơ",
          color: "bg-gray-800 text-white hover:bg-gray-900",
        });
      }
    }

    if (isValuationStaff) {
      if (s === "receipt_created") {
        actions.push({
          key: "start_valuation",
          label: t("staff.startValuation") ?? "Bắt Đầu Định Giá",
          color: "bg-indigo-600 text-white hover:bg-indigo-700",
        });
      }
      if (s === "valuation_in_progress") {
        actions.push({
          key: "finish_valuation",
          label: t("staff.finishValuation") ?? "Hoàn Tất Định Giá",
          color: "bg-emerald-600 text-white hover:bg-emerald-700",
        });
      }
      if (s === "valuation_completed") {
        actions.push({
          key: "send_results",
          label: t("staff.sendResults") ?? "Gửi Kết Quả",
          color: "bg-cyan-600 text-white hover:bg-cyan-700",
        });
      }
      actions.push({
        key: "mark_complete",
        label: t("staff.markComplete") ?? "Hoàn tất",
        color: "bg-gray-800 text-white hover:bg-gray-900",
      });
    }

    actions.push({
      key: "view_timeline",
      label: t("staff.viewTimeline") ?? "View Timeline",
      color: "bg-gray-100 hover:bg-gray-200",
    });

    return actions;
  }

  const openCreateReceipt = (requestId: string) => {
    const req =
      selectedRequest?.id === requestId
        ? selectedRequest
        : (valuationRequests ?? []).find((x: any) => x.id === requestId);
    if (!req) return;
    setReceiptCase(req);
    setOpenReceipt(true);
  };

  async function reloadMyTasks(opts?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }) {
    const page = opts?.page ?? tasksPage;
    const pageSize = opts?.pageSize ?? tasksPageSize;
    const status = opts?.status;

    setTasksLoading(true);
    try {
      const res = await listAssignedToMe({ page, pageSize, status });
      // res.items từ BE: { id, status, progress, assigneeName, estimatedValue, createdAt }
      const mapped = (res.items || []).map((x: any) => {
        const st = normalizeStatus(x.status);
        return {
          id: x.id,
          status: st,
          progress:
            typeof x.progress === "number" ? x.progress : progressOf(st),
          assigneeName: x.assigneeName ?? null,
          estimatedValue: x.estimatedValue ?? null,
          createdAt: x.createdAt,
          updatedAt: x.updatedAt ?? null,

          // Các field UI đang dùng ở tab "tasks" (fallback nếu BE chưa trả)
          priority: "normal", // tạm thời, khi BE có priority thì map lại
          notes: "",
          timeline: [],
          contact: null,
          diamond: null,
        };
      });

      setValuationRequests(mapped);
      recalcStats(mapped, res.total);
      setTasksPage(page);
      setTasksPageSize(pageSize);
      setTasksTotal(res.total ?? mapped.length);
    } catch (err) {
      console.error("reloadMyTasks failed:", err);
      // TODO: nếu bạn có toast, bật ở đây
      // toast.error(t("common.loadFailed") ?? "Tải danh sách nhiệm vụ thất bại");
    } finally {
      setTasksLoading(false);
    }
  }

  function openContactModal(req: any) {
    setContactTarget(req);
    setContactForm({
      method: "phone",
      when: new Date().toISOString().slice(0, 16),
      notes: "",
    });
    setIsContactOpen(true);
  }

  function closeContactModal() {
    setIsContactOpen(false);
    setContactTarget(null);
  }

  const GUID_RE =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  const toNum = (v: any, def = 0) => {
    if (v === null || v === undefined) return def;
    const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
    return Number.isFinite(n) ? n : def;
  };

  async function handleCreateReceipt(
    req: any,
    form: {
      receiptDate: string;
      appraiserId: string;
      estimatedValue: number;
      notes?: string;
      customerId?: string;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      customerAddress?: string;
    }
  ) {
    try {
      setLoading(true);
      // map Diamond từ case
      const d = req?.diamond ?? {};
      const shapeCut = d.type ?? d.shape ?? req?.diamondType ?? "Unknown";
      const caratWeight = toNum(
        d.carat ?? req?.caratWeight ?? req?.diamond?.Carat,
        0
      );
      if (caratWeight <= 0) {
        toast.error("Carat phải > 0.");
        return;
      }

      // map Bill To từ form (đã prefill bằng case)
      const payload = {
        receiptDate: form.receiptDate,
        appraiserId: user?.id || 0,
        estimatedValue: toNum(form.estimatedValue ?? req?.estimatedValue, 0),
        diamond: {
          shapeCut,
          caratWeight,
          colorGrade: d.color ?? undefined,
          clarityGrade: d.clarity ?? undefined,
          cutGrade: d.cut ?? undefined,
        },
        notes: form?.notes || req?.notes || undefined,

        // Bill To + linkage
        caseId: req?.id,
        customerId:
          form?.customerId != null ? String(form?.customerId) : undefined,
        customerName: form?.customerName || undefined,
        customerEmail: form?.customerEmail || undefined,
        customerPhone: form?.customerPhone || undefined,
        customerAddress: form?.customerAddress || undefined,
      };

      const created = await createReceipt(payload);

      // đổi status case sang bước tiếp theo (ví dụ "BienLai")
      // đổi status case sang bước tiếp theo (ví dụ "BienLai")
      try {
        await updateStatus(req.id, "BienLai");
        // await sendToValuation(req.id);

        // nạp lại dữ liệu case từ BE
        const fresh = await getCaseDetail(req.id);

        // cập nhật danh sách hiện tại trong UI
        setValuationRequests((prev) =>
          prev.map((r) =>
            r.id === req.id
              ? { ...r, status: "receipt_created", progress: 40 }
              : r
          )
        );
      } catch {
        notify("Đổi trạng thái hồ sơ thất bại (biên nhận vẫn đã tạo).");
      }

      toast.success(`Đã tạo biên nhận #${created.receiptNo}`);
    } catch (e: any) {
      const prob = e?.response?.data; // ValidationProblemDetails
      const errs = prob?.errors as Record<string, string[]> | undefined;
      if (errs) {
        // gom lỗi cho dễ đọc
        const lines = Object.entries(errs).map(
          ([k, v]) => `${k}: ${v.join("; ")}`
        );
        console.error("Validation errors:\n" + lines.join("\n"));
        toast.error(lines.join(" | "));
      } else {
        console.error(prob);
        toast.error(prob?.title || "Bad Request (400)");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSendToValuation(caseId: string) {
    try {
      setWorkingId(caseId);
      await updateStatus(caseId, "valuation_assigned"); // map -> "DinhGia"
      setValuationRequests((prev) =>
        prev.map((r) =>
          r.id === caseId
            ? { ...r, status: "valuation_in_progress", progress: 65 }
            : r
        )
      );
      await reloadMyTasks();
    } finally {
      setWorkingId(null);
    }
  }

  async function submitContact() {
    if (!contactTarget) return;
    try {
      // Gọi BE đổi trạng thái → LienHe
      await updateStatus(contactTarget.id, "customer_contacted");

      // Cập nhật lại ngay trên UI
      setValuationRequests((prev) =>
        prev.map((r) =>
          r.id === contactTarget.id
            ? {
                ...r,
                status: "customer_contacted",
                progress: progressByStatus("customer_contacted"),
                timeline: [
                  ...(Array.isArray(r.timeline) ? r.timeline : []),
                  {
                    date: new Date().toISOString(),
                    status: "customer_contacted",
                    user: user?.name || "Current User",
                    notes: `Contact via ${contactForm.method}`,
                  },
                ],
                communicationLog: [
                  ...(Array.isArray(r.communicationLog)
                    ? r.communicationLog
                    : []),
                  {
                    date: new Date().toISOString(),
                    type: contactForm.method as any,
                    from: user?.name || "Current User",
                    message: contactForm.notes || "Contacted customer",
                  },
                ],
              }
            : r
        )
      );
      notify("Đã cập nhật trạng thái: Đã liên hệ khách hàng");
      closeContactModal();
    } catch (e) {
      notify("Cập nhật trạng thái thất bại");
    }
  }

  const openCaseDetail = (id: string) => {
    setSelectedCaseId(id);
    setDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    setIsDetailOpen(true);

    getCaseDetail(id)
      .then((d) => setDetail(d))
      .catch((err: any) => {
        const msg = err?.response?.data ?? err?.message ?? "Failed to load";
        setDetailError(typeof msg === "string" ? msg : JSON.stringify(msg));
      })
      .finally(() => setDetailLoading(false));
  };

  const closeCaseDetail = () => {
    setIsDetailOpen(false);
    setSelectedCaseId(null);
    setDetail(null);
    setDetailError(null);
  };

  const [selectedValuation, setSelectedValuation] =
    useState<ValuationRequest | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<ValuationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "contact" | "receipt" | "valuation" | "results" | "timeline" | null
  >(null);
  const [showNotification, setShowNotification] = useState("");

  // Notification system
  const notify = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(""), 3000);
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        // ----- TAB: Nhiệm vụ của tôi -----
        if (activeTab === "tasks") {
          if (isValuationStaff) {
            const res = await listAssignedToMeValuation({ page: 1, pageSize });
            console.log("ValuationStaff: ", res);
            if (!ignore) setValuationRequests(res.items);
            recalcStats(res.items, res.total);
            return;
          }
          const res = await listAssignedToMe({ page: 1, pageSize });
          if (!ignore) setValuationRequests(res.items);
          recalcStats(res.items, res.total);
          return;
        }

        // ----- TAB: Hàng đợi công việc (Queue) -----
        if (activeTab === "queue") {
          if (isConsultingStaff) {
            // Consultant xem queue các case chưa có AssigneeId
            const res = await listUnassignedCases({ page: 1, pageSize });
            if (!ignore) setValuationRequests(res.items);
            return;
          }
          if (isValuationStaff) {
            // Valuation Staff xem queue các case đã có AssigneeId nhưng chưa có ValuationId
            const { items, totalPages } = await listUnassignedValuation({
              page: pendingPage,
              pageSize,
            });
            if (!ignore) {
              setValuationRequests(items);
              setPendingValuations(items);
              setPendingTotalPages(totalPages);
            }
            return;
          }
        }

        // ----- TAB: Thẩm Định (nếu bạn muốn tách riêng) -----
        if (activeTab === "valuations" && isValuationStaff) {
          const { items, totalPages } = await listAssignedToMeValuation({
            page: pendingPage,
            pageSize,
          });
          if (!ignore) {
            setPendingValuations(items);
            setPendingTotalPages(totalPages);
          }
        }
      } catch (e) {
        console.error(e);
        // toast lỗi nếu cần
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [activeTab, pendingPage]);

  // Handler functions for workflow actions
  const handleAssignToMe = async (requestId: string) => {
    try {
      if (isValuationStaff) {
        await claimValuation(requestId);
      } else {
        // consultant
        await claimCase(requestId);
      }
      notify("Nhận case thành công!");
      // Refresh danh sách theo vai trò + tab hiện tại
      if (activeTab === "queue") {
        if (isValuationStaff) {
          const { items, totalPages } = await listUnassignedValuation({
            page: 1,
            pageSize: 10,
          });
          setPendingValuations(items);
          setPendingTotalPages(totalPages);
          reloadMyTasks();
        } else {
          const res = await listUnassignedCases({ page: 1, pageSize: 10 });
          setValuationRequests(res.items);
          reloadMyTasks();
        }
      } else {
        const res = await listAssignedToMe({ page: 1, pageSize: 10 });
        setValuationRequests(res.items);
        reloadMyTasks;
      }
    } catch (e: any) {
      if (e?.response?.status === 409)
        notify("Case đã có người khác nhận trước.");
      else notify("Nhận case thất bại.");
    }
  };

  // Handle Finish Valuation
  const handleFinishValuation = async (item: any) => {
    try {
      // Lấy dữ liệu tối thiểu để tính
      const carat = Number(item.carat ?? item.spec?.carat ?? 0);
      const currency = "USD";

      // Thu thập giá: bạn có thể thay bằng modal form
      const totalStr = window.prompt(
        "Nhập Total Price (USD):",
        item.estimatedValue ?? ""
      );
      if (!totalStr) return;
      const totalPrice = Number(totalStr);
      if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
        alert("Giá không hợp lệ");
        return;
      }
      const pricePerCarat =
        carat > 0 ? +(totalPrice / carat).toFixed(2) : totalPrice;

      setFinishingId(item.id);

      //Gọi BE: POST /api/results (ValuationResponseService)
      // { caseId, requestId?, certificateNo?, pricePerCarat, totalPrice, currency, algorithmVersion, valuatedAt, customerName? }
      const payload = {
        caseId: item.id,
        requestId: item.requestId ?? undefined,
        certificateNo: item.certificateNo ?? undefined,
        pricePerCarat,
        totalPrice,
        currency,
        algorithmVersion: "1.0.0",
        valuatedAt: new Date().toISOString(),
        customerName: item.fullName ?? item.contactName ?? undefined,
      };

      await api.post("/api/results", payload);
      try {
        await updateStatus(item.id, "valuation_completed");
        await reloadMyTasks();
      } catch {}
      setValuationRequests((prev) =>
        (prev || []).map((r: any) =>
          r.id === item.id
            ? {
                ...r,
                estimatedValue: totalPrice,
                status: "valuation_completed", // FE của bạn map ra "Kết Quả"
                progress: progressByStatus("valuation_completed"), // ép progress = 85
                _justUpdated: true,
              }
            : r
        )
      );

      // Toast
      notify?.("Đã gửi kết quả định giá!");
    } catch (e: any) {
      console.error(e);
      notify?.("Gửi kết quả thất bại.");
    } finally {
      setFinishingId(null);
    }
  };

  const handleCompleteCase = async (item: any) => {
    try {
      // Gọi BE đổi trạng thái

      await api.post(`/api/results/${item.id}/complete`, {
        totalPrice: item?.estimatedValue ?? 0,
        currency: "USD",
        notes: "Test",
        customerName: item?.contact?.fullName ?? "—",
        email: item?.contact?.email ?? "—",
      });
      await updateStatus(item.id, "complete"); // hoặc api.put(`/api/cases/${item.id}/status`, { status: "Complete" })

      // 2) Cập nhật UI lạc quan
      setValuationRequests((prev) =>
        (prev || []).map((r: any) =>
          r.id === item.id
            ? { ...r, status: "complete", progress: 100, _justUpdated: true }
            : r
        )
      );

      notify?.("Đã hoàn tất hồ sơ & gửi kết quả cho khách!");
    } catch (e: any) {
      console.error(e);
      notify?.("Hoàn tất hồ sơ thất bại");
    }
  };

  const handleMarkAsContacted = (requestId: string) => {
    setValuationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "customer_contacted" as ValuationWorkflowStatus,
              timeline: [
                ...request.timeline,
                {
                  date: new Date().toISOString().split("T")[0],
                  status: "customer_contacted" as ValuationWorkflowStatus,
                  user: user?.name || "Current User",
                  notes: "Customer contacted successfully",
                },
              ],
              communicationLog: [
                ...request.communicationLog,
                {
                  date: new Date().toISOString().split("T")[0],
                  type: "phone" as const,
                  from: user?.name || "Current User",
                  message:
                    "Customer contacted and informed about valuation process",
                },
              ],
            }
          : request
      )
    );
    notify("Customer contact status updated!");
  };
  //     requestId.split("-")[2]
  //   }`;
  //   setValuationRequests((prev) =>
  //     prev.map((request) =>
  //       request.id === requestId
  //         ? {
  //             ...request,
  //             status: "receipt_created" as ValuationWorkflowStatus,
  //             receiptNumber,
  //             timeline: [
  //               ...request.timeline,
  //               {
  //                 date: new Date().toISOString().split("T")[0],
  //                 status: "receipt_created" as ValuationWorkflowStatus,
  //                 user: user?.name || "Current User",
  //                 notes: `Receipt created: ${receiptNumber}`,
  //               },
  //             ],
  //             communicationLog: [
  //               ...request.communicationLog,
  //               {
  //                 date: new Date().toISOString().split("T")[0],
  //                 type: "system" as const,
  //                 from: "System",
  //                 message: `Valuation receipt ${receiptNumber} created and diamond received`,
  //               },
  //             ],
  //           }
  //         : request
  //     )
  //   );
  //   notify(`Receipt ${receiptNumber} created successfully!`);
  // };

  const handleStartValuation = (requestId: string) => {
    setValuationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "valuation_in_progress" as ValuationWorkflowStatus,
              progress: progressByStatus("valuation_in_progress"),
              assignedValuer: user?.name || "Current User",
              timeline: [
                ...request.timeline,
                {
                  date: new Date().toISOString().split("T")[0],
                  status: "valuation_in_progress" as ValuationWorkflowStatus,
                  user: user?.name || "Current User",
                  notes: "Valuation process started",
                },
              ],
              communicationLog: [
                ...request.communicationLog,
                {
                  date: new Date().toISOString().split("T")[0],
                  type: "system" as const,
                  from: "System",
                  message: `Valuation assigned to ${
                    user?.name || "Current User"
                  } and process initiated`,
                },
              ],
            }
          : request
      )
    );
    notify("Valuation process started!");
  };

  const handleCompleteValuation = (requestId: string) => {
    setValuationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: "valuation_completed" as ValuationWorkflowStatus,
              progress: progressByStatus("valuation_completed"),
              timeline: [
                ...request.timeline,
                {
                  date: new Date().toISOString().split("T")[0],
                  status: "valuation_completed" as ValuationWorkflowStatus,
                  user: user?.name || "Current User",
                  notes: "Valuation completed and ready for consultant review",
                },
              ],
              communicationLog: [
                ...request.communicationLog,
                {
                  date: new Date().toISOString().split("T")[0],
                  type: "system" as const,
                  from: "System",
                  message: "Valuation completed and sent for consultant review",
                },
              ],
            }
          : request
      )
    );
    notify("Valuation completed successfully!");
  };

  // Workflow action handlers
  const handleWorkflowAction = async (requestId: string, action: string) => {
    const request = valuationRequests.find((r) => r.id === requestId);
    if (!request) return;

    let newStatus: ValuationWorkflowStatus = request.status;
    let newAssignment: Partial<ValuationRequest> = {};
    let notificationMessage = "";

    switch (action) {
      case "assign_consultant":
        if (request.status === "new_request") {
          newStatus = "consultant_assigned";
          newAssignment.assignedConsultant = user?.name;
          notificationMessage = "Request assigned to you as consultant";
        }
        break;

      case "contact_customer":
        if (request.status === "consultant_assigned") {
          setSelectedValuation(request);
          setModalType("contact");
          setIsModalOpen(true);
          return;
        }
        break;

      case "create_receipt":
        if (request.status === "customer_contacted") {
          setSelectedValuation(request);
          setModalType("receipt");
          setIsModalOpen(true);
          return;
        }
        break;

      case "assign_valuation":
        if (request.status === "receipt_created") {
          newStatus = "valuation_assigned";
          // In real app, this would show staff selection modal
          newAssignment.assignedValuer = "Dr. Emma Wilson";
          notificationMessage = "Request assigned to valuation staff";
        }
        break;

      case "start_valuation":
        if (request.status === "valuation_assigned") {
          await updateStatus(requestId, "valuation_in_progress");
          newStatus = "valuation_in_progress";
          notificationMessage = "Valuation process started";
        }
        break;

      case "complete_valuation":
        if (request.status === "valuation_in_progress") {
          setSelectedValuation(request);
          setModalType("valuation");
          setIsModalOpen(true);
          return;
        }
        break;

      case "review_results":
        if (request.status === "valuation_completed") {
          newStatus = "consultant_review";
          notificationMessage = "Results ready for consultant review";
        }
        break;

      case "send_results":
        if (request.status === "consultant_review") {
          setSelectedValuation(request);
          setModalType("results");
          setIsModalOpen(true);
          return;
        }
        break;
      case "mark_complete":
        if (
          request.status === "valuation_completed" ||
          request.status === "results_sent" ||
          request.status === "consultant_review"
        ) {
          await updateStatus(requestId, "completed");
          newStatus = "completed";
          notificationMessage = "Case closed";
        }
        break;
    }

    if (newStatus !== request.status) {
      updateRequestStatus(
        requestId,
        newStatus,
        newAssignment,
        notificationMessage
      );
    }
  };

  const updateRequestStatus = (
    requestId: string,
    newStatus: ValuationWorkflowStatus,
    updates: Partial<ValuationRequest> = {},
    message: string = ""
  ) => {
    setValuationRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updatedRequest = {
            ...req,
            ...updates,
            status: newStatus,
            timeline: [
              ...req.timeline,
              {
                date: new Date().toISOString().split("T")[0],
                status: newStatus,
                user: user?.name || "System",
                notes: message,
              },
            ],
          };
          return updatedRequest;
        }
        return req;
      })
    );

    if (message) notify(message);
  };

  // Get status display info
  const getStatusInfo = (status: ValuationWorkflowStatus) => {
    const statusMap = {
      new_request: {
        label: t("staff.status.newRequest"),
        color: "bg-blue-100 text-blue-800",
        icon: "🆕",
      },
      consultant_assigned: {
        label: t("staff.status.consultantAssigned"),
        color: "bg-purple-100 text-purple-800",
        icon: "👤",
      },
      customer_contacted: {
        label: t("staff.status.customerContacted"),
        color: "bg-green-100 text-green-800",
        icon: "📞",
      },
      receipt_created: {
        label: t("staff.status.receiptCreated"),
        color: "bg-yellow-100 text-yellow-800",
        icon: "📋",
      },
      valuation_assigned: {
        label: t("staff.status.valuationAssigned"),
        color: "bg-indigo-100 text-indigo-800",
        icon: "💎",
      },
      valuation_in_progress: {
        label: t("staff.status.valuationInProgress"),
        color: "bg-orange-100 text-orange-800",
        icon: "🔍",
      },
      valuation_completed: {
        label: t("staff.status.valuationCompleted"),
        color: "bg-green-100 text-green-800",
        icon: "✅",
      },
      consultant_review: {
        label: t("staff.status.consultantReview"),
        color: "bg-purple-100 text-purple-800",
        icon: "👁️",
      },
      results_sent: {
        label: t("staff.status.resultsSent"),
        color: "bg-blue-100 text-blue-800",
        icon: "📧",
      },
      completed: {
        label: t("staff.status.completed"),
        color: "bg-green-100 text-green-800",
        icon: "🎉",
      },
      on_hold: {
        label: t("staff.status.onHold"),
        color: "bg-gray-100 text-gray-800",
        icon: "⏸️",
      },
      cancelled: {
        label: t("staff.status.cancelled"),
        color: "bg-red-100 text-red-800",
        icon: "❌",
      },
    };
    return statusMap[status] || statusMap["new_request"];
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Check if user is staff
  if (
    !user ||
    !["consulting_staff", "valuation_staff", "manager"].includes(user.roles)
  ) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            {t("staff.accessDenied")}
          </h1>
          <p className="text-gray-600 mb-6">{t("staff.noPermission")}</p>
          <Link to="/dashboard" className="btn btn-primary">
            {t("staff.goToDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  const isConsultingStaff = user.roles === "consulting_staff";
  const isValuationStaff = user.roles === "valuation_staff";
  const isManager = user.roles === "manager";

  const tabs = [
    { id: "tasks", label: t("staff.myTasks"), icon: "📋" },
    { id: "queue", label: t("staff.workQueue"), icon: "⏳" },
    ...(isConsultingStaff
      ? [{ id: "customers", label: t("staff.customerContact"), icon: "📞" }]
      : []),
    ...(isValuationStaff
      ? [{ id: "valuations", label: t("staff.appraisals"), icon: "💎" }]
      : []),
    ...(isManager
      ? [{ id: "team", label: t("staff.teamManagement"), icon: "👥" }]
      : []),
    { id: "reports", label: t("staff.myReports"), icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {showNotification}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-serif font-bold text-luxury-navy">
                {t("staff.dashboard")}
              </h1>
              <p className="text-gray-600 mt-1">
                {isConsultingStaff &&
                  "Customer consultation and communication management"}
                {isValuationStaff && "Diamond appraisal and valuation workflow"}
                {isManager && "Team oversight and workflow management"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`px-4 py-2 rounded-full ${
                  isConsultingStaff
                    ? "bg-blue-100 text-blue-800"
                    : isValuationStaff
                    ? "bg-purple-100 text-purple-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <span className="font-medium">
                  {isConsultingStaff && "Consulting Staff"}
                  {isValuationStaff && "Valuation Staff"}
                  {isManager && "Manager"}
                </span>
              </div>
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
                }
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-luxury-gold"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? "bg-luxury-gold text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Performance Summary */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-bold mb-4">{t("staff.thisMonth")}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t("staff.completed")}
                    </span>
                    <span className="font-bold">{stats.completedToday}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-luxury-gold h-2 rounded-full"
                      style={{
                        width: `${
                          (staffStats.monthlyCompleted /
                            staffStats.monthlyTarget) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      {t("staff.rating")}
                    </span>
                    <span className="font-bold text-yellow-600">
                      ⭐ {staffStats.averageRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* My Tasks Tab */}
            {activeTab === "tasks" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                {/* Task Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  {/* Assigned tasks */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {t("staff.assignedTasks")}
                        </p>
                        <p className="text-3xl font-bold text-luxury-navy">
                          {stats.assignedTasks ?? 0}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <span className="text-2xl">📋</span>
                      </div>
                    </div>
                  </div>

                  {/* Completed today */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {t("staff.completedToday")}
                        </p>
                        <p className="text-3xl font-bold text-luxury-navy">
                          {stats.completedToday ?? 0}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>

                  {/* Pending review */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {t("staff.pendingReview")}
                        </p>
                        <p className="text-3xl font-bold text-luxury-navy">
                          {stats.pendingApprovals ?? 0}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <span className="text-2xl">⏳</span>
                      </div>
                    </div>
                  </div>

                  {/* Total completed */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {t("staff.totalCompleted")}
                        </p>
                        <p className="text-3xl font-bold text-luxury-navy">
                          {stats.totalCompleted ?? 0}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <span className="text-2xl">🏆</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Valuations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">
                    {t("staff.myValuationWorkflow")}
                  </h3>
                  <div className="space-y-4">
                    {(valuationRequests ?? []).map((request: any) => {
                      // ====== SAFE FALLBACKS ======
                      const status = request?.status ?? "YeuCau";
                      const statusInfo =
                        typeof getStatusInfo === "function"
                          ? getStatusInfo(status) || defaultStatusInfo(status)
                          : defaultStatusInfo(status);

                      const timeline: any[] = Array.isArray(request?.timeline)
                        ? request.timeline
                        : [];
                      const lastUpdated =
                        request?.updatedAt ??
                        (timeline.length > 0
                          ? timeline[timeline.length - 1]?.date
                          : undefined) ??
                        request?.createdAt ??
                        "-";

                      const priority = request?.priority ?? "normal";
                      const progress =
                        Number.isFinite(request?.progress) &&
                        request?.progress !== null
                          ? Number(request.progress)
                          : progressByStatus(status);

                      // Thông tin liên hệ + kim cương (BE mới không có -> fallback từ contact/diamond)
                      const customerName =
                        request?.customerName ??
                        request?.contact?.fullName ??
                        "—";
                      const customerEmail =
                        request?.customerEmail ??
                        request?.contact?.email ??
                        "—";
                      const customerPhone =
                        request?.customerPhone ??
                        request?.contact?.phone ??
                        "—";
                      const submittedDate =
                        request?.submittedDate ?? request?.createdAt ?? "—";

                      const diamondType =
                        request?.diamondType ??
                        request?.diamond?.Origin ??
                        request?.diamond?.type ??
                        "—";
                      const caratWeight =
                        request?.caratWeight ??
                        request?.diamond?.Carat ??
                        request?.diamond?.carat ??
                        "—";

                      const estValue = request?.estimatedValue ?? "—";
                      const receiptNumber = request?.receiptNumber;

                      // Người phụ trách (BE mới: assigneeName)
                      const assignedConsultant =
                        request?.assignedConsultant ??
                        request?.assigneeName ??
                        null;
                      const assignedValuer = request?.assignedValuer ?? null;

                      const latestNotes =
                        request?.valuationNotes ??
                        request?.consultantNotes ??
                        request?.notes;

                      // Actions có thể undefined
                      // const actions = (getAvailableActions?.(request) ??
                      //   []) as Array<{
                      //   action: string;
                      //   label: string;
                      //   color: string;
                      // }>;
                      const actions = computeActions(request);
                      const statusNorm = normalizeStatus(status);
                      const canContact = statusNorm === "new_request"; // chỉ khi mới nhận yêu cầu
                      const canCreateReceipt =
                        statusNorm === "customer_contacted" &&
                        !request?.receiptNumber;
                      console.log(request);
                      const queueList = isValuationStaff
                        ? pendingValuations
                        : valuationRequests;

                      return (
                        <div
                          key={request.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-bold text-luxury-navy">
                                {request.id}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.color}`}
                              >
                                <span>{statusInfo.icon}</span>
                                <span>{statusInfo.label}</span>
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  priority === "urgent"
                                    ? "bg-red-100 text-red-800"
                                    : priority === "high"
                                    ? "bg-orange-100 text-orange-800"
                                    : priority === "normal"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {priority} priority
                              </span>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={() => openCaseDetail(request.id)}
                                className="btn bg-luxury-navy text-white text-sm"
                              >
                                {t("common.viewDetail") ?? "View Details"}
                              </button>

                              {/* Liên hệ khách hàng (chỉ khi YeuCau) */}
                              {canContact && (
                                <button
                                  onClick={() =>
                                    openContactModal({
                                      id: request.id,
                                      fullName: customerName,
                                      email: customerEmail,
                                      phone: customerPhone,
                                      status: statusNorm,
                                    })
                                  }
                                  className="btn bg-green-600 text-white text-sm"
                                >
                                  {t("staff.contactCustomer") ??
                                    "Contact Customer"}
                                </button>
                              )}

                              {/* Tạo phiếu nhận (chỉ khi LienHe & chưa có receipt) */}
                              {canCreateReceipt && (
                                <button
                                  onClick={() => {
                                    setSelectedCase(request);
                                    setOpenReceipt(true);
                                  }}
                                  disabled={loading}
                                  className={`btn bg-emerald-600 text-white text-sm ${
                                    loading
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  {loading
                                    ? "Đang tạo..."
                                    : t("staff.createReceipt") ??
                                      "Tạo Phiếu Nhận"}
                                </button>
                              )}
                              {(actions || []).map((action: ActionItem) => (
                                <button
                                  key={action.key}
                                  onClick={() => {
                                    if (action.key === "view_timeline") {
                                      setSelectedValuation(request);
                                      setModalType("timeline");
                                      setIsModalOpen(true);
                                    } else if (
                                      action.key === "send_to_valuation"
                                    ) {
                                      handleSendToValuation(request.id);
                                    } else if (
                                      action.key === "finish_valuation"
                                    ) {
                                      handleFinishValuation(request);
                                    } else if (action.key === "mark_complete") {
                                      handleCompleteCase(request);
                                    } else {
                                      handleWorkflowAction(
                                        request.id,
                                        action.key
                                      );
                                    }
                                  }}
                                  className={`btn ${action.color} text-sm`}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                            <ReceiptModal
                              isOpen={openReceipt}
                              request={selectedCase}
                              defaultAppraiserId={(user as any)?.id}
                              onCancel={() => {
                                setOpenReceipt(false);
                                setSelectedCase(null);
                              }}
                              onSubmit={async (form: any) => {
                                await handleCreateReceipt(selectedCase, form);
                                setOpenReceipt(false);
                                setSelectedCase(null);
                              }}
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>
                                <span className="font-medium">
                                  {t("staff.customer")}:
                                </span>{" "}
                                {customerName}
                              </p>
                              <p>
                                <span className="font-medium">
                                  {t("staff.email")}:
                                </span>{" "}
                                {customerEmail}
                              </p>
                              <p>
                                <span className="font-medium">
                                  {t("staff.phone")}:
                                </span>{" "}
                                {customerPhone}
                              </p>
                              <p>
                                <span className="font-medium">
                                  {t("staff.submitted")}:
                                </span>{" "}
                                {submittedDate}
                              </p>
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">
                                  {t("staff.type")}:
                                </span>{" "}
                                {diamondType}
                              </p>
                              <p>
                                <span className="font-medium">
                                  {t("staff.carat")}:
                                </span>{" "}
                                {caratWeight}ct
                              </p>
                              <p>
                                <span className="font-medium">
                                  {t("staff.estValue")}:
                                </span>{" "}
                                {estValue}
                              </p>
                              {receiptNumber && (
                                <p>
                                  <span className="font-medium">
                                    {t("staff.receipt")}:
                                  </span>{" "}
                                  {receiptNumber}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Workflow Progress Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                              <span>{t("staff.request")}</span>
                              <span>{t("staff.contact")}</span>
                              <span>{t("staff.receipt")}</span>
                              <span>{t("staff.valuation")}</span>
                              <span>{t("staff.results")}</span>
                              <span>{t("staff.complete")}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-luxury-gold h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Current Assignment */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm">
                              {assignedConsultant && (
                                <span className="text-blue-600">
                                  👤 Consultant: {assignedConsultant}
                                </span>
                              )}
                              {assignedValuer && (
                                <span className="text-purple-600 ml-4">
                                  💎 Valuer: {assignedValuer}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Last updated: {lastUpdated}
                            </div>
                          </div>

                          {/* Latest Notes */}
                          {latestNotes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm">
                                <span className="font-medium">
                                  {t("staff.latestNotes")}:
                                </span>{" "}
                                {latestNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Work Queue Tab */}
            {activeTab === "queue" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                {/* Queue Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">
                    {t("staff.workQueue")}
                  </h3>

                  <div className="grid md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-600">
                            Urgent
                          </p>
                          <p className="text-2xl font-bold text-red-900">
                            {
                              (valuationRequests ?? []).filter(
                                (r) => (r?.priority ?? "normal") === "urgent"
                              ).length
                            }
                          </p>
                        </div>
                        <span className="text-2xl">🚨</span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">
                            High Priority
                          </p>
                          <p className="text-2xl font-bold text-orange-900">
                            {
                              (valuationRequests ?? []).filter(
                                (r) => (r?.priority ?? "normal") === "high"
                              ).length
                            }
                          </p>
                        </div>
                        <span className="text-2xl">🔥</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-600">
                            Normal
                          </p>
                          <p className="text-2xl font-bold text-yellow-900">
                            {
                              (valuationRequests ?? []).filter(
                                (r) => (r?.priority ?? "normal") === "normal"
                              ).length
                            }
                          </p>
                        </div>
                        <span className="text-2xl">📋</span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Low Priority
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {
                              (valuationRequests ?? []).filter(
                                (r) => (r?.priority ?? "normal") === "low"
                              ).length
                            }
                          </p>
                        </div>
                        <span className="text-2xl">📝</span>
                      </div>
                    </div>
                  </div>

                  {/* Queue Filters (giữ nguyên UI – chưa áp dụng filter thực tế) */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold">
                      <option>All Statuses</option>
                      <option>New Requests</option>
                      <option>In Progress</option>
                      <option>Pending Review</option>
                      <option>On Hold</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold">
                      <option>All Priorities</option>
                      <option>Urgent</option>
                      <option>High</option>
                      <option>Normal</option>
                      <option>Low</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold">
                      <option>All Types</option>
                      <option>Insurance Appraisal</option>
                      <option>Market Valuation</option>
                      <option>Certification</option>
                      <option>Damage Assessment</option>
                    </select>
                  </div>

                  {/* Work Queue List */}
                  <div className="space-y-4">
                    {(valuationRequests ?? [])
                      // Lọc theo vai trò bằng status đã chuẩn hoá
                      .filter((req: any) => {
                        const s = normalizeStatus(req?.status);
                        if (isConsultingStaff) {
                          return [
                            "new_request",
                            "consultant_assigned",
                            "customer_contacted",
                            "consultant_review",
                            "results_sent",
                          ].includes(s);
                        }
                        if (isValuationStaff) {
                          return [
                            "valuation_assigned",
                            "valuation_in_progress",
                            "valuation_completed",
                          ].includes(s);
                        }
                        return true;
                      })
                      // Sắp xếp theo priority + ngày
                      .sort((a: any, b: any) => {
                        const pr =
                          priorityRank(b?.priority) - priorityRank(a?.priority);
                        if (pr !== 0) return pr;
                        const da = new Date(
                          a?.submittedDate ?? a?.createdAt ?? 0
                        ).getTime();
                        const db = new Date(
                          b?.submittedDate ?? b?.createdAt ?? 0
                        ).getTime();
                        return da - db;
                      })
                      .map((request: any) => {
                        const statusNorm = normalizeStatus(request?.status);
                        const canContact = statusNorm === "new_request"; // chỉ khi mới nhận yêu cầu
                        const canCreateReceipt =
                          statusNorm === "customer_contacted" &&
                          !request?.receiptNumber;
                        const statusColors: any = {
                          new_request: "bg-blue-100 text-blue-800",
                          consultant_assigned: "bg-indigo-100 text-indigo-800",
                          customer_contacted: "bg-green-100 text-green-800",
                          receipt_created: "bg-teal-100 text-teal-800",
                          valuation_assigned: "bg-purple-100 text-purple-800",
                          valuation_in_progress:
                            "bg-yellow-100 text-yellow-800",
                          valuation_completed:
                            "bg-emerald-100 text-emerald-800",
                          consultant_review: "bg-orange-100 text-orange-800",
                          results_sent: "bg-cyan-100 text-cyan-800",
                          completed: "bg-gray-100 text-gray-800",
                          on_hold: "bg-red-100 text-red-800",
                          cancelled: "bg-red-200 text-red-900",
                        };
                        const priorityColors: any = {
                          urgent: "bg-red-500 text-white",
                          high: "bg-orange-500 text-white",
                          normal: "bg-blue-500 text-white",
                          low: "bg-gray-500 text-white",
                        };

                        const customerName =
                          request?.customerName ??
                          request?.contact?.fullName ??
                          "—";
                        const customerPhone =
                          request?.customerPhone ??
                          request?.contact?.phone ??
                          "—";
                        const diamondType =
                          request?.diamondType ?? request?.diamond?.type ?? "—";
                        const caratWeight =
                          request?.caratWeight ??
                          request?.diamond?.carat ??
                          "—";
                        const estValue = request?.estimatedValue ?? "—";
                        const submittedISO =
                          request?.submittedDate ?? request?.createdAt ?? "";
                        const submittedLbl = submittedISO
                          ? new Date(submittedISO).toLocaleDateString()
                          : "—";

                        const timeline: any[] = Array.isArray(request?.timeline)
                          ? request.timeline
                          : [];

                        return (
                          <div
                            key={request.id}
                            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-bold text-lg">
                                    {request.id}
                                  </h4>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      priorityColors[
                                        request?.priority ?? "normal"
                                      ]
                                    }`}
                                  >
                                    {(
                                      request?.priority ?? "normal"
                                    ).toUpperCase()}
                                  </span>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[statusNorm]}`}
                                  >
                                    {(() => {
                                      const m: any = {
                                        new_request: t(
                                          "staff.status.newRequest"
                                        ),
                                        consultant_assigned: t(
                                          "staff.status.consultantAssigned"
                                        ),
                                        customer_contacted: t(
                                          "staff.status.customerContacted"
                                        ),
                                        receipt_created: t(
                                          "staff.status.receiptCreated"
                                        ),
                                        valuation_assigned: t(
                                          "staff.status.valuationAssigned"
                                        ),
                                        valuation_in_progress: t(
                                          "staff.status.valuationInProgress"
                                        ),
                                        valuation_completed: t(
                                          "staff.status.valuationCompleted"
                                        ),
                                        consultant_review: t(
                                          "staff.status.consultantReview"
                                        ),
                                        results_sent: t(
                                          "staff.status.resultsSent"
                                        ),
                                        completed: t("staff.status.completed"),
                                        on_hold: t("staff.status.onHold"),
                                        cancelled: t("staff.status.cancelled"),
                                      };
                                      return m[statusNorm] ?? statusNorm;
                                    })()}
                                  </span>
                                </div>

                                <p className="text-gray-600 mb-2">
                                  <span className="font-medium">
                                    {customerName}
                                  </span>{" "}
                                  • {customerPhone}
                                </p>
                                <p className="text-sm text-gray-500 mb-3">
                                  {diamondType} • {caratWeight} carats • Est.{" "}
                                  {estValue}
                                </p>
                                {request?.notes && (
                                  <p className="text-sm text-gray-700">
                                    {request.notes}
                                  </p>
                                )}
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-gray-500 mb-2">
                                  Submitted
                                </p>
                                <p className="font-medium">{submittedLbl}</p>
                                <div className="mt-3 space-x-2">
                                  <button
                                    onClick={() => openCaseDetail(request.id)}
                                    className="px-4 py-2 bg-luxury-gold text-white rounded hover:bg-opacity-80 transition-colors text-sm"
                                  >
                                    {t("common.viewDetail") ?? "View Details"}
                                  </button>

                                  {(isConsultingStaff || isValuationStaff) && (
                                    <button
                                      onClick={() =>
                                        handleAssignToMe(request.id)
                                      }
                                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    >
                                      Nhận case
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Timeline Preview (safe) */}
                            {timeline.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span>Last update:</span>
                                  <span className="font-medium">
                                    {timeline[timeline.length - 1]?.date} -{" "}
                                    {timeline[timeline.length - 1]?.notes}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Empty State */}
                  {(valuationRequests ?? []).filter((req: any) => {
                    const s = normalizeStatus(req?.status);
                    if (isConsultingStaff) {
                      return [
                        "new_request",
                        "consultant_assigned",
                        "customer_contacted",
                        "consultant_review",
                        "results_sent",
                      ].includes(s);
                    }
                    if (isValuationStaff) {
                      return [
                        "valuation_assigned",
                        "valuation_in_progress",
                        "valuation_completed",
                      ].includes(s);
                    }
                    return true;
                  }).length === 0 && (
                    <div className="text-center py-12">
                      <span className="text-6xl mb-4 block">📭</span>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No items in queue
                      </h3>
                      <p className="text-gray-500">
                        All caught up! New requests will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Customer Contact Tab (Consulting Staff Only) - Enhanced */}
            {activeTab === "customers" && isConsultingStaff && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                {/* Communication Dashboard */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">
                    {t("staff.customerCommunicationCenter")}
                  </h3>

                  <div className="grid lg:grid-cols-4 gap-6 mb-6">
                    {/* Today's Stats */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            Calls Today
                          </p>
                          <p className="text-2xl font-bold text-blue-900">12</p>
                        </div>
                        <span className="text-2xl">📞</span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">
                            Emails Sent
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            28
                          </p>
                        </div>
                        <span className="text-2xl">📧</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-600">
                            Appointments
                          </p>
                          <p className="text-2xl font-bold text-yellow-900">
                            6
                          </p>
                        </div>
                        <span className="text-2xl">📅</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">
                            Follow-ups
                          </p>
                          <p className="text-2xl font-bold text-purple-900">
                            4
                          </p>
                        </div>
                        <span className="text-2xl">🔄</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Communication Tools */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-bold mb-4">
                    Professional Communication Tools
                  </h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">📧</span>
                        <h5 className="font-medium">Email Templates</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {t("staff.quickResponseTemplates")}
                      </p>
                      <div className="space-y-2">
                        <button className="w-full text-left px-3 py-2 border rounded text-sm hover:bg-gray-50">
                          📝 Initial Contact Template
                        </button>
                        <button className="w-full text-left px-3 py-2 border rounded text-sm hover:bg-gray-50">
                          📋 Appointment Confirmation
                        </button>
                        <button className="w-full text-left px-3 py-2 border rounded text-sm hover:bg-gray-50">
                          ✅ Valuation Complete
                        </button>
                        <button className="w-full text-left px-3 py-2 border rounded text-sm hover:bg-gray-50">
                          🔄 Follow-up Reminder
                        </button>
                      </div>
                      <button className="btn btn-primary text-sm w-full mt-3">
                        {t("staff.manageTemplates")}
                      </button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">📞</span>
                        <h5 className="font-medium">Call Management</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {t("staff.trackCustomerCalls")}
                      </p>
                      <div className="space-y-2">
                        <div className="p-2 bg-green-50 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span>John Doe - 10:30 AM</span>
                            <span className="text-green-600">✓</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Duration: 15 min
                          </p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded text-sm">
                          <div className="flex justify-between items-center">
                            <span>Jane Smith - 2:15 PM</span>
                            <span className="text-blue-600">📝</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Callback scheduled
                          </p>
                        </div>
                      </div>
                      <button className="btn btn-secondary text-sm w-full mt-3">
                        View Call History
                      </button>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">📅</span>
                        <h5 className="font-medium">Appointment System</h5>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {t("staff.scheduleConsultations")}
                      </p>
                      <div className="space-y-2">
                        <div className="p-2 bg-yellow-50 rounded text-sm">
                          <div className="font-medium">Today - 3:00 PM</div>
                          <p className="text-xs">
                            Robert Wilson - Consultation
                          </p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded text-sm">
                          <div className="font-medium">Tomorrow - 10:00 AM</div>
                          <p className="text-xs">Maria Garcia - Pickup</p>
                        </div>
                      </div>
                      <button className="btn btn-secondary text-sm w-full mt-3">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Customer Relationship Management */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-bold mb-4">
                    Customer Relationship Management
                  </h4>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">
                        Active Customer Interactions
                      </h5>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                                className="w-10 h-10 rounded-full"
                                alt="Customer"
                              />
                              <div>
                                <h6 className="font-medium">John Doe</h6>
                                <p className="text-sm text-gray-600">
                                  VAL-2024-0123
                                </p>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                              Urgent
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p>
                              <strong>Last Contact:</strong> Today, 2:30 PM
                            </p>
                            <p>
                              <strong>Status:</strong> Waiting for diamond
                              delivery
                            </p>
                            <p>
                              <strong>Next Action:</strong> Follow-up call
                              tomorrow
                            </p>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <button className="btn btn-primary text-xs">
                              Call
                            </button>
                            <button className="btn btn-secondary text-xs">
                              Email
                            </button>
                            <button className="btn btn-secondary text-xs">
                              Notes
                            </button>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <img
                                src="https://images.unsplash.com/photo-1494790108755-2616b332a5c0?w=40&h=40&fit=crop&crop=face"
                                className="w-10 h-10 rounded-full"
                                alt="Customer"
                              />
                              <div>
                                <h6 className="font-medium">Jane Smith</h6>
                                <p className="text-sm text-gray-600">
                                  VAL-2024-0124
                                </p>
                              </div>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              On Track
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <p>
                              <strong>Last Contact:</strong> Yesterday, 11:00 AM
                            </p>
                            <p>
                              <strong>Status:</strong> Appointment confirmed
                            </p>
                            <p>
                              <strong>Next Action:</strong> Consultation meeting
                              Jan 18
                            </p>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <button className="btn btn-primary text-xs">
                              Call
                            </button>
                            <button className="btn btn-secondary text-xs">
                              Email
                            </button>
                            <button className="btn btn-secondary text-xs">
                              Notes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-3">
                        Service Package Management
                      </h5>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-4">
                          <h6 className="font-medium mb-2">
                            Standard Valuation Package
                          </h6>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>• Professional appraisal certificate</p>
                            <p>• Digital photo documentation</p>
                            <p>• Market value assessment</p>
                            <p>• Insurance replacement value</p>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-luxury-gold">
                              $150
                            </span>
                            <span className="text-sm text-gray-600">
                              3-5 business days
                            </span>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h6 className="font-medium mb-2">Premium Package</h6>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>• Everything in Standard</p>
                            <p>• 360° photography</p>
                            <p>• Detailed inclusion mapping</p>
                            <p>• Investment grade analysis</p>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-luxury-gold">
                              $250
                            </span>
                            <span className="text-sm text-gray-600">
                              1-2 business days
                            </span>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h6 className="font-medium mb-2">Express Service</h6>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>• Rush processing</p>
                            <p>• Same-day preliminary report</p>
                            <p>• Priority scheduling</p>
                            <p>• Personal consultation</p>
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-bold text-luxury-gold">
                              $350
                            </span>
                            <span className="text-sm text-gray-600">
                              Same day
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Follow-up Management */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-bold mb-4">
                    {t("staff.pendingCustomerFollowups")}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-bold">!</span>
                        </div>
                        <div>
                          <h6 className="font-medium">
                            John Doe - VAL-2024-0123
                          </h6>
                          <p className="text-sm text-gray-600">
                            {t("staff.waitingDeliveryConfirmation")}
                          </p>
                          <p className="text-xs text-red-600">
                            Overdue by 2 days
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-primary text-sm">
                          Call Now
                        </button>
                        <button className="btn btn-secondary text-sm">
                          Send Reminder
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-yellow-600">📋</span>
                        </div>
                        <div>
                          <h6 className="font-medium">
                            Maria Garcia - VAL-2024-0119
                          </h6>
                          <p className="text-sm text-gray-600">
                            {t("staff.followUpDocumentation")}
                          </p>
                          <p className="text-xs text-yellow-600">Due today</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-primary text-sm">
                          Contact
                        </button>
                        <button className="btn btn-secondary text-sm">
                          Schedule
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600">💎</span>
                        </div>
                        <div>
                          <h6 className="font-medium">
                            Robert Wilson - VAL-2024-0125
                          </h6>
                          <p className="text-sm text-gray-600">
                            Results ready for review
                          </p>
                          <p className="text-xs text-blue-600">Ready to send</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-gold text-sm">
                          Send Results
                        </button>
                        <button className="btn btn-secondary text-sm">
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Communication Panel */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="font-bold mb-4">Quick Communication</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Send Quick Message</h5>
                      <div className="space-y-3">
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Select Customer</option>
                          <option>John Doe - VAL-2024-0123</option>
                          <option>Jane Smith - VAL-2024-0124</option>
                          <option>Robert Wilson - VAL-2024-0125</option>
                        </select>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Select Template</option>
                          <option>Appointment Reminder</option>
                          <option>Status Update</option>
                          <option>Document Request</option>
                          <option>Results Ready</option>
                        </select>
                        <textarea
                          rows={4}
                          placeholder="Type your message here..."
                          className="w-full px-3 py-2 border rounded-md"
                        ></textarea>
                        <div className="flex space-x-2">
                          <button className="btn btn-primary">
                            Send Email
                          </button>
                          <button className="btn btn-secondary">
                            Save Draft
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-3">Communication Log</h5>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        <div className="p-3 bg-blue-50 rounded text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">
                              Email to John Doe
                            </span>
                            <span className="text-xs text-gray-600">
                              2:30 PM
                            </span>
                          </div>
                          <p className="text-gray-600">
                            Appointment confirmation sent
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">
                              Call with Jane Smith
                            </span>
                            <span className="text-xs text-gray-600">
                              11:45 AM
                            </span>
                          </div>
                          <p className="text-gray-600">
                            Discussed valuation timeline - 15 min
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded text-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">
                              SMS to Robert Wilson
                            </span>
                            <span className="text-xs text-gray-600">
                              10:20 AM
                            </span>
                          </div>
                          <p className="text-gray-600">
                            Results ready for pickup reminder
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appraisals Tab (Valuation Staff Only) - Enhanced */}
            {activeTab === "valuations" && isValuationStaff && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                {/* PENDING VALUATION LIST */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Cases chờ định giá</h3>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-1 border rounded"
                        disabled={pendingPage <= 1}
                        onClick={() =>
                          setPendingPage((p) => Math.max(1, p - 1))
                        }
                      >
                        ‹ Prev
                      </button>
                      <span className="text-sm">
                        Page {pendingPage}/{pendingTotalPages}
                      </span>
                      <button
                        className="px-3 py-1 border rounded"
                        disabled={pendingPage >= pendingTotalPages}
                        onClick={() =>
                          setPendingPage((p) =>
                            Math.min(pendingTotalPages, p + 1)
                          )
                        }
                      >
                        Next ›
                      </button>
                    </div>
                  </div>

                  {pendingValuations.length === 0 ? (
                    <p className="text-gray-500">Không có case nào.</p>
                  ) : (
                    <ul className="divide-y">
                      {pendingValuations.map((item) => (
                        <li
                          key={item.id}
                          className="py-4 flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <div className="font-medium">
                              {item.contact?.fullName ?? "—"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.diamond?.shape ?? "—"} •{" "}
                              {item.diamond?.carat ?? "—"} ct •{" "}
                              {item.diamond?.color ?? "—"} /{" "}
                              {item.diamond?.clarity ?? "—"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(item.createdAt).toLocaleString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              to={`/staff/cases/${item.id}`}
                              className="px-3 py-1 border rounded text-sm"
                            >
                              Xem
                            </Link>

                            {/* Nhận case để định giá */}
                            {isValuationStaff && (
                              <button
                                className="px-3 py-1 bg-black text-white rounded text-sm"
                                onClick={() => handleAssignToMe(item.id)}
                              >
                                Nhận case
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}

            {/* Team Management Tab (Manager Only) */}
            {activeTab === "team" && isManager && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">
                    {t("staff.teamPerformanceOverview")}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">
                        {t("staff.consultingStaffPerformance")}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <p className="text-sm text-gray-600">
                              28 contacts this month
                            </p>
                          </div>
                          <span className="text-green-600 font-bold">92%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Mike Chen</p>
                            <p className="text-sm text-gray-600">
                              31 contacts this month
                            </p>
                          </div>
                          <span className="text-green-600 font-bold">88%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">
                        {t("staff.valuationStaffPerformance")}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Dr. Emma Wilson</p>
                            <p className="text-sm text-gray-600">
                              15 appraisals this month
                            </p>
                          </div>
                          <span className="text-green-600 font-bold">95%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">James Rodriguez</p>
                            <p className="text-sm text-gray-600">
                              18 appraisals this month
                            </p>
                          </div>
                          <span className="text-green-600 font-bold">91%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">
                    {t("staff.workflowManagement")}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button className="p-4 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                      <span className="text-2xl block mb-2">📋</span>
                      <span className="font-medium">Assign Tasks</span>
                    </button>
                    <button className="p-4 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors">
                      <span className="text-2xl block mb-2">📊</span>
                      <span className="font-medium">View Reports</span>
                    </button>
                    <button className="p-4 border border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
                      <span className="text-2xl block mb-2">⚙️</span>
                      <span className="font-medium">Settings</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reports Tab */}
            {activeTab === "reports" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-serif font-bold mb-6">
                  {t("staff.myPerformanceReports")}
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Monthly Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tasks Completed:</span>
                        <span className="font-bold">38/50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Rating:</span>
                        <span className="font-bold text-yellow-600">
                          ⭐ 4.9
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-bold">2.3 hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Quality Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Accuracy Rate:</span>
                        <span className="font-bold text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction:</span>
                        <span className="font-bold text-green-600">4.8/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revision Rate:</span>
                        <span className="font-bold text-green-600">1.2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="btn btn-primary">
                    {t("staff.downloadFullReport")}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal System for Workflow Actions */}
      {isModalOpen && selectedValuation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {modalType === "contact" && "Customer Contact & Communication"}
                {modalType === "receipt" && "Create Valuation Receipt"}
                {modalType === "valuation" && "Complete Diamond Valuation"}
                {modalType === "results" && "Send Results to Customer"}
                {modalType === "timeline" &&
                  `Workflow Timeline - ${selectedValuation.id}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Customer Contact Modal */}
            {modalType === "contact" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Name:</strong> {selectedValuation.customerName}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedValuation.customerEmail}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedValuation.customerPhone}
                      </p>
                      <p>
                        <strong>Request:</strong>{" "}
                        {selectedValuation.diamondType} -{" "}
                        {selectedValuation.caratWeight}ct
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Customer Notes</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">
                      {selectedValuation.customerNotes}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Contact Method</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-3 border rounded-lg hover:bg-blue-50 flex flex-col items-center">
                      <span className="text-2xl mb-1">📧</span>
                      <span className="text-sm">Email</span>
                    </button>
                    <button className="p-3 border rounded-lg hover:bg-green-50 flex flex-col items-center">
                      <span className="text-2xl mb-1">📞</span>
                      <span className="text-sm">Phone</span>
                    </button>
                    <button className="p-3 border rounded-lg hover:bg-purple-50 flex flex-col items-center">
                      <span className="text-2xl mb-1">🤝</span>
                      <span className="text-sm">In-Person</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                    placeholder={t("placeholder.contactOutcome")}
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      updateRequestStatus(
                        selectedValuation.id,
                        "customer_contacted",
                        {
                          consultantNotes: "Customer contacted successfully",
                        },
                        "Customer contact completed"
                      );
                      setIsModalOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Receipt Creation Modal */}
            {modalType === "receipt" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Diamond Information</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        defaultValue={selectedValuation.diamondType}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t("placeholder.diamondType")}
                      />
                      <input
                        type="text"
                        defaultValue={selectedValuation.caratWeight}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t("placeholder.caratWeight")}
                      />
                      <input
                        type="text"
                        placeholder={t("placeholder.colorGrade")}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      <input
                        type="text"
                        placeholder={t("placeholder.clarityGrade")}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      <input
                        type="text"
                        placeholder={t("placeholder.cutGrade")}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Receipt Details</h4>
                    <div className="space-y-3">
                      <input
                        type="text"
                        defaultValue={`RCP-2024-${
                          selectedValuation.id.split("-")[2]
                        }`}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t("placeholder.receiptNumber")}
                      />
                      <input
                        type="date"
                        defaultValue={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      <select className="w-full px-3 py-2 border rounded-md">
                        <option>Dr. Emma Wilson</option>
                        <option>James Rodriguez</option>
                        <option>Sarah Chen</option>
                      </select>
                      <input
                        type="text"
                        defaultValue={selectedValuation.estimatedValue}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder={t("placeholder.estimatedValue")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions / Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    placeholder={t("placeholder.handlingInstructions")}
                  ></textarea>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Important:</strong> Ensure diamond is properly
                    secured and receipt is given to customer before proceeding
                    to valuation stage.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const receiptNumber = `RCP-2024-${
                        selectedValuation.id.split("-")[2]
                      }`;
                      updateRequestStatus(
                        selectedValuation.id,
                        "receipt_created",
                        {
                          receiptNumber,
                          consultantNotes: `Receipt ${receiptNumber} created. Diamond received and secured.`,
                        },
                        "Valuation receipt created successfully"
                      );
                      setIsModalOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Create Receipt
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <div className="fixed inset-0 z-[60] bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-transparent rounded-full" />
              </div>
            )}

            {/* Valuation Completion Modal */}
            {modalType === "valuation" && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Valuation Results</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Market Value ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder={t("placeholder.marketValue")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Insurance Value ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder={t("placeholder.insuranceValue")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Retail Value ($)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder={t("placeholder.retailValue")}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Condition
                        </label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Excellent</option>
                          <option>Very Good</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Certification & Photos</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Certification Details
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-md"
                          rows={3}
                          placeholder={t("placeholder.certificationDetails")}
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Photo Upload
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <span className="text-gray-500">
                            Click to upload photos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Valuation Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                    placeholder={t("placeholder.detailedAnalysis")}
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      updateRequestStatus(
                        selectedValuation.id,
                        "valuation_completed",
                        {
                          valuationNotes:
                            "Professional valuation completed with detailed analysis",
                          valuationResults: {
                            marketValue: 22000,
                            insuranceValue: 25000,
                            retailValue: 28000,
                            condition: "Excellent",
                            certificationDetails:
                              "Complete analysis with documentation",
                            photos: [],
                          },
                        },
                        "Diamond valuation completed"
                      );
                      setIsModalOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Complete Valuation
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Save Draft
                  </button>
                </div>
              </div>
            )}

            {/* Results Sending Modal */}
            {modalType === "results" && (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">
                    Valuation Complete
                  </h4>
                  <p className="text-sm text-green-700">
                    The diamond valuation has been completed and is ready to
                    send to the customer.
                  </p>
                </div>

                {selectedValuation.valuationResults && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Valuation Summary</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Market Value:</strong> $
                          {selectedValuation.valuationResults.marketValue?.toLocaleString()}
                        </p>
                        <p>
                          <strong>Insurance Value:</strong> $
                          {selectedValuation.valuationResults.insuranceValue?.toLocaleString()}
                        </p>
                        <p>
                          <strong>Retail Value:</strong> $
                          {selectedValuation.valuationResults.retailValue?.toLocaleString()}
                        </p>
                        <p>
                          <strong>Condition:</strong>{" "}
                          {selectedValuation.valuationResults.condition}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Communication Method</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="method"
                            defaultChecked
                            className="mr-2"
                          />
                          <span>Email with PDF report</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="method" className="mr-2" />
                          <span>Phone call + Email</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="method" className="mr-2" />
                          <span>In-person meeting</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("staff.messageToCustomer")}
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                    defaultValue={`${t("staff.emailTemplate")} ${
                      selectedValuation.customerName
                    },

${t("staff.emailBody")}

${t("staff.emailClosing")},
${user?.name}`}
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      updateRequestStatus(
                        selectedValuation.id,
                        "results_sent",
                        {
                          consultantNotes:
                            "Results and valuation report sent to customer via email",
                        },
                        "Valuation results sent to customer"
                      );
                      setIsModalOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Send Results
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Timeline Modal */}
            {modalType === "timeline" && (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto">
                  {selectedValuation.timeline.map((event, index) => {
                    const statusInfo = getStatusInfo(event.status);
                    return (
                      <div
                        key={index}
                        className="flex items-start space-x-3 pb-4"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{statusInfo.label}</h4>
                            <span className="text-xs text-gray-500">
                              {event.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            by {event.user}
                          </p>
                          {event.notes && (
                            <p className="text-sm text-gray-700 mt-1">
                              {event.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {isContactOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeContactModal}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Liên hệ khách hàng</h3>
                <button
                  onClick={closeContactModal}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm mb-1">Hình thức</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={contactForm.method}
                    onChange={(e) =>
                      setContactForm((s) => ({
                        ...s,
                        method: e.target.value as any,
                      }))
                    }
                  >
                    <option value="phone">📞 Gọi điện</option>
                    <option value="email">📧 Email</option>
                    <option value="meeting">📅 Hẹn gặp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Thời điểm</label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded px-3 py-2"
                    value={contactForm.when}
                    onChange={(e) =>
                      setContactForm((s) => ({ ...s, when: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Ghi chú</label>
                  <textarea
                    rows={3}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Nội dung trao đổi / ghi chú cuộc gọi…"
                    value={contactForm.notes}
                    onChange={(e) =>
                      setContactForm((s) => ({ ...s, notes: e.target.value }))
                    }
                  />
                </div>

                {contactTarget?.contact && (
                  <div className="text-sm bg-gray-50 p-3 rounded">
                    <div>
                      <b>Khách hàng:</b> {contactTarget.contact.fullName}
                    </div>
                    <div>
                      <b>Điện thoại:</b> {contactTarget.contact.phone}
                    </div>
                    <div>
                      <b>Email:</b> {contactTarget.contact.email}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <a
                        className="btn btn-secondary text-xs"
                        href={`tel:${contactTarget.contact.phone}`}
                      >
                        Gọi ngay
                      </a>
                      <a
                        className="btn btn-secondary text-xs"
                        href={`mailto:${contactTarget.contact.email}`}
                      >
                        Gửi email
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button onClick={submitContact} className="btn btn-primary">
                    Lưu & đổi trạng thái
                  </button>
                  <button
                    onClick={closeContactModal}
                    className="btn btn-secondary"
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail Request */}
      <AnimatePresence>
        {isDetailOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCaseDetail}
            />

            {/* Right Drawer */}
            <motion.aside
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {t("staff.caseDetail") ?? "Case Detail"}
                </h3>
                <button
                  onClick={closeCaseDetail}
                  className="p-2 rounded hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-4 overflow-y-auto h-full">
                {/* Loading skeleton */}
                {detailLoading && (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-2 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-200 rounded w-5/6" />
                    <div className="h-2 bg-gray-200 rounded w-2/3" />
                  </div>
                )}

                {/* Error */}
                {detailError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded">
                    {detailError}
                  </div>
                )}

                {/* Content */}
                {detail && (
                  <div className="space-y-6">
                    {/* Chips */}
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100">
                        #{detail.id}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                        {normalizeStatus(detail.status)}
                      </span>
                      {detail.consultantName && (
                        <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                          👤 {detail.consultantName}
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>
                          {detail.progress ?? progressOf(detail.status)}%
                        </span>
                        <span>
                          {t("staff.submitted") ?? "Submitted"}:&nbsp;
                          {new Date(detail.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div
                          className="bg-luxury-gold h-2 rounded"
                          style={{
                            width: `${
                              detail.progress ?? progressOf(detail.status)
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Contact */}
                    {detail.contact && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">
                          {t("staff.customer") ?? "Customer"}
                        </h4>
                        <div className="text-sm grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-500">
                              {t("staff.name") ?? "Name"}:
                            </span>{" "}
                            {detail.contact.fullName}
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {t("staff.phone") ?? "Phone"}:
                            </span>{" "}
                            {detail.contact.phone}
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>{" "}
                            {detail.contact.email}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Diamond */}
                    {detail.diamond && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">
                          {t("staff.diamond") ?? "Diamond"}
                        </h4>
                        <div className="text-sm grid grid-cols-2 gap-2">
                          <div>Shape: {detail.diamond.shape}</div>
                          <div>Carat: {detail.diamond.carat}</div>
                          <div>Color: {detail.diamond.color}</div>
                          <div>Clarity: {detail.diamond.clarity}</div>
                          <div>Cut: {detail.diamond.cut}</div>
                          <div>Fluor: {detail.diamond.fluorescence}</div>
                        </div>
                      </div>
                    )}

                    {/* Results (nếu có) */}
                    {(detail.marketValue ??
                      detail.retailValue ??
                      detail.insuranceValue) && (
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">
                          {t("staff.results") ?? "Results"}
                        </h4>
                        <div className="text-sm grid grid-cols-3 gap-2">
                          <div>Market: {detail.marketValue ?? "-"}</div>
                          <div>Retail: {detail.retailValue ?? "-"}</div>
                          <div>Insurance: {detail.insuranceValue ?? "-"}</div>
                        </div>
                      </div>
                    )}

                    {/* (Tuỳ chọn) Action buttons theo role/status */}
                    {/* Ví dụ:
              <div className="flex gap-2">
                {isConsultingStaff && normalizeStatus(detail.status) === "YeuCau" && (
                  <button className="btn bg-blue-600 text-white">Assign to Me</button>
                )}
              </div>
              */}
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Detailed View Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900">
                    Request Details - {selectedRequest.id}
                  </h2>
                  <p className="text-gray-600">
                    {selectedRequest.customerName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Role-based Interface */}
              {isConsultingStaff ? (
                <ConsultingStaffDetailView
                  request={selectedRequest}
                  onAssignToMe={handleAssignToMe}
                  onMarkAsContacted={handleMarkAsContacted}
                  onCreateReceipt={openCreateReceipt}
                />
              ) : isValuationStaff ? (
                <ValuationStaffDetailView
                  request={selectedRequest}
                  onStartValuation={handleStartValuation}
                  onCompleteValuation={handleCompleteValuation}
                />
              ) : (
                <GeneralDetailView request={selectedRequest} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            {showNotification}
          </div>
        </div>
      )}
    </div>
  );
};

// Consulting Staff Detail View Component
interface ConsultingStaffDetailViewProps {
  request: ValuationRequest;
  onAssignToMe: (requestId: string) => void;
  onMarkAsContacted: (requestId: string) => void;
  onCreateReceipt: (requestId: string) => void;
}

const ConsultingStaffDetailView: React.FC<ConsultingStaffDetailViewProps> = ({
  request,
  onAssignToMe,
  onMarkAsContacted,
  onCreateReceipt,
}) => {
  const { t } = useLanguage();
  const [activeDetailTab, setActiveDetailTab] = useState<
    "overview" | "customer" | "communication" | "actions"
  >("overview");
  const [contactOutcome, setContactOutcome] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const canAssignToSelf = request.status === "new_request";
  const canContactCustomer = [
    "consultant_assigned",
    "customer_contacted",
  ].includes(request.status);
  const canCreateReceipt = request.status === "customer_contacted";
  const canReviewResults = request.status === "valuation_completed";
  const canSendResults = request.status === "consultant_review";

  return (
    <div className="space-y-6">
      {/* Status and Priority Header */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                getStatusInfo(request.status).color
              }`}
            >
              {t(`staff.status.${request.status.replace(/_/g, "")}` as any)}
            </span>
            <span
              className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                request.priority === "urgent"
                  ? "bg-red-100 text-red-800"
                  : request.priority === "high"
                  ? "bg-orange-100 text-orange-800"
                  : request.priority === "normal"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {request.priority.toUpperCase()} PRIORITY
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Submitted</p>
            <p className="font-medium">
              {new Date(request.submittedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {(["overview", "customer", "communication", "actions"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveDetailTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeDetailTab === tab
                    ? "border-luxury-gold text-luxury-gold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeDetailTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Diamond Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{request.diamondType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carat Weight:</span>
                  <span className="font-medium">
                    {request.caratWeight} carats
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Value:</span>
                  <span className="font-medium">{request.estimatedValue}</span>
                </div>
                {request.receiptNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt Number:</span>
                    <span className="font-medium">{request.receiptNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Assignment Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultant:</span>
                  <span className="font-medium">
                    {request.assignedConsultant || "Not assigned"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valuer:</span>
                  <span className="font-medium">
                    {request.assignedValuer || "Not assigned"}
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-lg">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm">{request.notes}</p>
                {request.customerNotes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">
                      Customer Notes:
                    </p>
                    <p className="text-sm italic">{request.customerNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeDetailTab === "customer" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{request.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{request.customerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{request.customerPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    📞 Call Customer
                  </button>
                  <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    📧 Send Email
                  </button>
                  <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    📅 Schedule Appointment
                  </button>
                </div>
              </div>
            </div>

            {request.customerNotes && (
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Customer's Request Details
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm">{request.customerNotes}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeDetailTab === "communication" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Communication History</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {request.communicationLog.map((log, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-200 pl-4 py-2"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{log.from}</span>
                    <span className="text-xs text-gray-500">{log.date}</span>
                  </div>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                      log.type === "email"
                        ? "bg-blue-100 text-blue-800"
                        : log.type === "phone"
                        ? "bg-green-100 text-green-800"
                        : log.type === "meeting"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {log.type.toUpperCase()}
                  </span>
                  <p className="text-sm text-gray-700">{log.message}</p>
                </div>
              ))}
            </div>

            {/* Add New Communication */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Record Communication</h4>
              <textarea
                value={contactOutcome}
                onChange={(e) => setContactOutcome(e.target.value)}
                placeholder="Enter communication details..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                rows={3}
              />
              <div className="flex space-x-3 mt-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Log Email
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                  Log Phone Call
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                  Log Meeting
                </button>
              </div>
            </div>
          </div>
        )}

        {activeDetailTab === "actions" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Available Actions</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Status Actions</h4>

                {canAssignToSelf && (
                  <button
                    onClick={() => onAssignToMe(request.id)}
                    className="w-full p-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-2">👤</span>
                      <span className="font-medium">Assign to Me</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Take responsibility for this request
                      </p>
                    </div>
                  </button>
                )}

                {canContactCustomer && (
                  <button
                    onClick={() => onMarkAsContacted(request.id)}
                    className="w-full p-4 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-2">📞</span>
                      <span className="font-medium">Mark as Contacted</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Update status after customer contact
                      </p>
                    </div>
                  </button>
                )}

                {canCreateReceipt && (
                  <button
                    onClick={() => onCreateReceipt(request.id)}
                    className="w-full p-4 border-2 border-dashed border-yellow-300 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-2">📄</span>
                      <span className="font-medium">Create Receipt</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Generate valuation receipt
                      </p>
                    </div>
                  </button>
                )}

                {canReviewResults && (
                  <button className="w-full p-4 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                    <div className="text-center">
                      <span className="text-2xl block mb-2">🔍</span>
                      <span className="font-medium">Review Results</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Review valuation results
                      </p>
                    </div>
                  </button>
                )}

                {canSendResults && (
                  <button className="w-full p-4 border-2 border-dashed border-luxury-gold text-luxury-gold rounded-lg hover:bg-yellow-50 transition-colors">
                    <div className="text-center">
                      <span className="text-2xl block mb-2">📤</span>
                      <span className="font-medium">Send Results</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Send final results to customer
                      </p>
                    </div>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Additional Notes</h4>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Add consultant notes..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  rows={5}
                />
                <button className="w-full p-3 bg-luxury-gold text-white rounded-lg hover:bg-opacity-80 transition-colors">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Valuation Staff Detail View Component
interface ValuationStaffDetailViewProps {
  request: ValuationRequest;
  onStartValuation: (requestId: string) => void;
  onCompleteValuation: (requestId: string) => void;
}

const ValuationStaffDetailView: React.FC<ValuationStaffDetailViewProps> = ({
  request,
  onStartValuation,
  onCompleteValuation,
}) => {
  const { t } = useLanguage();
  const [activeDetailTab, setActiveDetailTab] = useState<
    "overview" | "valuation" | "results" | "actions"
  >("overview");
  const [valuationData, setValuationData] = useState({
    marketValue: request.valuationResults?.marketValue || "",
    insuranceValue: request.valuationResults?.insuranceValue || "",
    retailValue: request.valuationResults?.retailValue || "",
    condition: request.valuationResults?.condition || "",
    certificationDetails: request.valuationResults?.certificationDetails || "",
    detailedAnalysis: "",
    recommendations: "",
  });

  const canStartValuation = request.status === "valuation_assigned";
  const canUpdateProgress = request.status === "valuation_in_progress";
  const canCompleteValuation = request.status === "valuation_in_progress";

  return (
    <div className="space-y-6">
      {/* Status and Priority Header */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                getStatusInfo(request.status).color
              }`}
            >
              {t(`staff.status.${request.status.replace(/_/g, "")}` as any)}
            </span>
            <span
              className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                request.priority === "urgent"
                  ? "bg-red-100 text-red-800"
                  : request.priority === "high"
                  ? "bg-orange-100 text-orange-800"
                  : request.priority === "normal"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {request.priority.toUpperCase()} PRIORITY
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Receipt</p>
            <p className="font-medium">{request.receiptNumber || "Pending"}</p>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {(["overview", "valuation", "results", "actions"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveDetailTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeDetailTab === tab
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeDetailTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Diamond Specifications</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{request.diamondType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carat Weight:</span>
                  <span className="font-medium">
                    {request.caratWeight} carats
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Estimate:</span>
                  <span className="font-medium">{request.estimatedValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt Number:</span>
                  <span className="font-medium">{request.receiptNumber}</span>
                </div>
              </div>

              <h3 className="font-semibold text-lg">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{request.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultant:</span>
                  <span className="font-medium">
                    {request.assignedConsultant}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Special Instructions</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm">{request.notes}</p>
                {request.consultantNotes && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-600 mb-1">
                      Consultant Notes:
                    </p>
                    <p className="text-sm">{request.consultantNotes}</p>
                  </div>
                )}
              </div>

              {request.customerNotes && (
                <div>
                  <h3 className="font-semibold text-lg">
                    Customer's Background
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm italic">{request.customerNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeDetailTab === "valuation" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Valuation Workspace</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Value Assessment</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Market Value ($)
                    </label>
                    <input
                      type="number"
                      value={valuationData.marketValue}
                      onChange={(e) =>
                        setValuationData((prev) => ({
                          ...prev,
                          marketValue: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter market value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Value ($)
                    </label>
                    <input
                      type="number"
                      value={valuationData.insuranceValue}
                      onChange={(e) =>
                        setValuationData((prev) => ({
                          ...prev,
                          insuranceValue: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter insurance value"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retail Value ($)
                    </label>
                    <input
                      type="number"
                      value={valuationData.retailValue}
                      onChange={(e) =>
                        setValuationData((prev) => ({
                          ...prev,
                          retailValue: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Enter retail value"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Condition & Quality</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Condition
                  </label>
                  <select
                    value={valuationData.condition}
                    onChange={(e) =>
                      setValuationData((prev) => ({
                        ...prev,
                        condition: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="">Select condition</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Very Good">Very Good</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Details
                  </label>
                  <textarea
                    value={valuationData.certificationDetails}
                    onChange={(e) =>
                      setValuationData((prev) => ({
                        ...prev,
                        certificationDetails: e.target.value,
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    rows={3}
                    placeholder="Enter certification and grading details..."
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">
                Detailed Professional Analysis
              </h4>
              <textarea
                value={valuationData.detailedAnalysis}
                onChange={(e) =>
                  setValuationData((prev) => ({
                    ...prev,
                    detailedAnalysis: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                rows={4}
                placeholder="Provide detailed analysis of the diamond's characteristics, quality factors, and valuation methodology..."
              />
            </div>

            <div>
              <h4 className="font-medium mb-3">Recommendations</h4>
              <textarea
                value={valuationData.recommendations}
                onChange={(e) =>
                  setValuationData((prev) => ({
                    ...prev,
                    recommendations: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                rows={3}
                placeholder="Provide recommendations for insurance, care, or other considerations..."
              />
            </div>
          </div>
        )}

        {activeDetailTab === "results" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Valuation Results Summary</h3>

            {request.valuationResults ||
            (valuationData.marketValue && valuationData.insuranceValue) ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h4 className="font-medium text-green-800">Market Value</h4>
                  <p className="text-2xl font-bold text-green-900">
                    $
                    {(
                      request.valuationResults?.marketValue ||
                      valuationData.marketValue
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h4 className="font-medium text-blue-800">Insurance Value</h4>
                  <p className="text-2xl font-bold text-blue-900">
                    $
                    {(
                      request.valuationResults?.insuranceValue ||
                      valuationData.insuranceValue
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <h4 className="font-medium text-purple-800">Retail Value</h4>
                  <p className="text-2xl font-bold text-purple-900">
                    $
                    {(
                      request.valuationResults?.retailValue ||
                      valuationData.retailValue
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <span className="text-4xl block mb-2">💎</span>
                <p className="text-gray-600">No valuation results yet</p>
                <p className="text-sm text-gray-500">
                  Complete the valuation to see results here
                </p>
              </div>
            )}

            {(request.valuationResults?.condition ||
              valuationData.condition) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Quality Assessment</h4>
                <p className="text-lg">
                  <span className="font-medium">Condition: </span>
                  {request.valuationResults?.condition ||
                    valuationData.condition}
                </p>
              </div>
            )}

            {(request.valuationResults?.certificationDetails ||
              valuationData.certificationDetails) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Certification Details</h4>
                <p className="text-sm">
                  {request.valuationResults?.certificationDetails ||
                    valuationData.certificationDetails}
                </p>
              </div>
            )}

            {valuationData.detailedAnalysis && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Professional Analysis</h4>
                <p className="text-sm">{valuationData.detailedAnalysis}</p>
              </div>
            )}
          </div>
        )}

        {activeDetailTab === "actions" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Valuation Actions</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Workflow Actions</h4>

                {canStartValuation && (
                  <button
                    onClick={() => onStartValuation(request.id)}
                    className="w-full p-4 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-2">🔬</span>
                      <span className="font-medium">Start Valuation</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Begin detailed analysis
                      </p>
                    </div>
                  </button>
                )}

                {canUpdateProgress && (
                  <button className="w-full p-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <div className="text-center">
                      <span className="text-2xl block mb-2">⏱️</span>
                      <span className="font-medium">Update Progress</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Log current progress
                      </p>
                    </div>
                  </button>
                )}

                {canCompleteValuation && (
                  <button
                    onClick={() => onCompleteValuation(request.id)}
                    className="w-full p-4 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <div className="text-center">
                      <span className="text-2xl block mb-2">✅</span>
                      <span className="font-medium">Complete Valuation</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Submit final results
                      </p>
                    </div>
                  </button>
                )}

                <button className="w-full p-4 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                  <div className="text-center">
                    <span className="text-2xl block mb-2">⏸️</span>
                    <span className="font-medium">Put on Hold</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Pause for additional information
                    </p>
                  </div>
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Save Progress</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    Save your current valuation progress
                  </p>
                  <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Save Valuation Data
                  </button>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">
                    Quality Checklist
                  </h5>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Physical examination completed</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Measurements verified</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Clarity assessment done</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Color grading completed</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Cut quality analyzed</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>Market research conducted</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// General Detail View (for other staff types)
const GeneralDetailView: React.FC<{ request: ValuationRequest }> = ({
  request,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Request Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">{request.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  getStatusInfo(request.status).color
                }`}
              >
                {t(`staff.status.${request.status.replace(/_/g, "")}` as any)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Priority:</span>
              <span className="font-medium">{request.priority}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Submitted:</span>
              <span className="font-medium">
                {new Date(request.submittedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Diamond Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium">{request.diamondType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Carat Weight:</span>
              <span className="font-medium">{request.caratWeight} carats</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Value:</span>
              <span className="font-medium">{request.estimatedValue}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-4">Request Notes</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm">{request.notes}</p>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status information
function getStatusInfo(status: ValuationWorkflowStatus) {
  const statusMap = {
    new_request: {
      color: "bg-blue-100 text-blue-800",
      icon: "📝",
      label: "New Request",
    },
    consultant_assigned: {
      color: "bg-yellow-100 text-yellow-800",
      icon: "👤",
      label: "Consultant Assigned",
    },
    customer_contacted: {
      color: "bg-green-100 text-green-800",
      icon: "📞",
      label: "Customer Contacted",
    },
    receipt_created: {
      color: "bg-purple-100 text-purple-800",
      icon: "📄",
      label: "Receipt Created",
    },
    valuation_assigned: {
      color: "bg-indigo-100 text-indigo-800",
      icon: "🔬",
      label: "Valuation Assigned",
    },
    valuation_in_progress: {
      color: "bg-orange-100 text-orange-800",
      icon: "⏳",
      label: "Valuation in Progress",
    },
    valuation_completed: {
      color: "bg-teal-100 text-teal-800",
      icon: "✅",
      label: "Valuation Completed",
    },
    consultant_review: {
      color: "bg-cyan-100 text-cyan-800",
      icon: "🔍",
      label: "Consultant Review",
    },
    results_sent: {
      color: "bg-pink-100 text-pink-800",
      icon: "📤",
      label: "Results Sent",
    },
    completed: {
      color: "bg-green-100 text-green-800",
      icon: "🎉",
      label: "Completed",
    },
    on_hold: {
      color: "bg-gray-100 text-gray-800",
      icon: "⏸️",
      label: "On Hold",
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: "❌",
      label: "Cancelled",
    },
  };

  return (
    statusMap[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: "❓",
      label: "Unknown",
    }
  );
}

export default StaffDashboard;
