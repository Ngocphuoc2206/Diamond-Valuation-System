import { useEffect, useMemo, useRef, useState } from "react";
import { getMyCases } from "../../../services/valuation";
import type { ValuationRequest } from "../types";
import { mapCaseListItemToValuationRequest } from "../utils/status";

type TabId =
  | "tasks"
  | "queue"
  | "customers"
  | "valuations"
  | "team"
  | "reports";

type TabDef = { id: TabId; label: string; icon: string };

export const useTabs = (role: string, t: (k: string) => string) => {
  const isConsulting = role === "consulting_staff";
  const isValuation = role === "valuation_staff";
  const isManager = role === "manager";

  // ==== state cho dữ liệu case ====
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ValuationRequest[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  // refreshKey để chủ động reload từ ngoài
  const [refreshKey, setRefreshKey] = useState(0);

  // tránh setState khi đã unmount
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  async function load(p = 1, ps = pageSize) {
    setLoading(true);
    setError(null);
    try {
      console.log("Calling getMyCases...", p, ps);
      const res = await getMyCases(p, ps);
      console.log("getMyCases result:", res);
      const mapped = res.items.map(mapCaseListItemToValuationRequest);
      if (!alive.current) return;
      setItems(mapped);
      setTotal(res.total);
      setPage(res.page);
    } catch (e: any) {
      if (!alive.current) return;
      setError(e?.message || "Failed to load cases");
      console.error("getMyCases error:", e?.response || e);
    } finally {
      if (alive.current) setLoading(false);
    }
  }

  // load lần đầu + khi đổi role (nếu gateway lọc theo role) + khi refreshKey đổi
  useEffect(() => {
    load(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, pageSize, refreshKey]);

  // ==== tabs theo role ====
  const tabs: TabDef[] = useMemo(
    () => [
      { id: "tasks", label: t("staff.myTasks"), icon: "📋" },
      { id: "queue", label: t("staff.workQueue"), icon: "⏳" },
      ...(isConsulting
        ? [
            {
              id: "customers",
              label: t("staff.customerContact"),
              icon: "📞",
            } as const,
          ]
        : []),
      ...(isValuation
        ? [
            {
              id: "valuations",
              label: t("staff.appraisals"),
              icon: "💎",
            } as const,
          ]
        : []),
      ...(isManager
        ? [
            {
              id: "team",
              label: t("staff.teamManagement"),
              icon: "👥",
            } as const,
          ]
        : []),
      { id: "reports", label: t("staff.myReports"), icon: "📊" },
    ],
    [isConsulting, isValuation, isManager, t]
  );

  return {
    // tabs
    tabs,

    // dữ liệu
    loading,
    error,
    items,
    page,
    pageSize,
    total,

    // hành động
    setPage,
    setPageSize,
    reload: () => load(page, pageSize),
    goTo: (p: number) => load(p, pageSize),
    refresh: () => setRefreshKey((k) => k + 1),
  };
};
