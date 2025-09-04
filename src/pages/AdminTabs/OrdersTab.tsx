// src/pages/AdminTabs/OrdersTab.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  searchOrders,
  getOrder,
  updateOrderStatus,
  type OrderSearchQuery,
  type OrderDetail,
  type OrderStatus,
  type OrderSummary,
  statusLabel,
} from "../../services/order";
import { getUserById } from "../../services/auth"; // hoặc ../../services/user nếu hàm nằm ở đó

const statusOptions: OrderStatus[] = [
  "Pending",
  "AwaitingPayment",
  "Paid",
  "Cancelled",
  "Fulfilled",
];

const Badge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
  const color =
    status === "Pending"
      ? "bg-yellow-100 text-yellow-800"
      : status === "AwaitingPayment"
      ? "bg-orange-100 text-orange-800"
      : status === "Paid"
      ? "bg-green-100 text-green-800"
      : status === "Cancelled"
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";
  return <span className={`${base} ${color}`}>{statusLabel(status)}</span>;
};

// cache nhẹ để tránh gọi trùng
const userCache: Record<number, { name: string; email?: string }> = {};

const OrdersTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [total, setTotal] = useState(0);

  const [query, setQuery] = useState<OrderSearchQuery>({
    page: 1,
    pageSize: 10,
    status: "",
    q: "",
  });

  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // tên khách hàng map theo customerId
  const [nameMap, setNameMap] = useState<typeof userCache>({});

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / (query.pageSize || 10))),
    [total, query.pageSize]
  );

  const pickDisplayName = (u: any): string | undefined =>
    u?.fullName ??
    u?.name ??
    ([u?.firstName, u?.lastName].filter(Boolean).join(" ") || undefined);

  const hydrateNames = async (list: OrderSummary[]) => {
    const ids = Array.from(
      new Set(
        list
          .map((o) => o.customerId)
          .filter((x): x is number => typeof x === "number" && x > 0)
      )
    );
    const missing = ids.filter((id) => !userCache[id]);
    if (!missing.length) {
      setNameMap({ ...userCache });
      return;
    }
    for (const id of missing) {
      try {
        const user = await getUserById(id);
        const u = (user as any)?.data ?? user;
        const name = pickDisplayName(u) ?? `#${id}`;
        userCache[id] = { name, email: u?.email };
      } catch {
        userCache[id] = { name: `#${id}` };
      }
    }
    setNameMap({ ...userCache });
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchOrders(query);
      setOrders(data.items);
      setTotal(data.total);
      await hydrateNames(data.items);
    } catch (e: any) {
      const status = e?.response?.status ?? e?.status;
      // ✅ Nếu BE trả 404 coi như không có đơn hàng
      if (status === 404) {
        setOrders([]);
        setTotal(0);
        setError(null); // không hiển thị lỗi
      } else {
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Không tải được danh sách đơn hàng"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.page,
    query.pageSize,
    query.status,
    query.q,
    query.dateFrom,
    query.dateTo,
  ]);

  const openDetail = async (orderNo: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const d = await getOrder(orderNo);
      setDetail(d);
    } catch (e: any) {
      const status = e?.response?.status ?? e?.status;
      setError(
        status === 404
          ? "Đơn hàng không tồn tại hoặc đã bị xóa."
          : e?.response?.data?.message ||
              e?.message ||
              "Không tải được chi tiết đơn hàng"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const changeStatus = async (orderNo: string, status: OrderStatus) => {
    setSaving(true);
    setError(null);
    try {
      await updateOrderStatus(orderNo, status);
      setOrders((prev) =>
        prev.map((o) => (o.orderNo === orderNo ? { ...o, status } : o))
      );
      setDetail((d) => (d && d.orderNo === orderNo ? { ...d, status } : d));
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Cập nhật trạng thái thất bại"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Quản lý đơn hàng</h2>
        <div className="flex gap-2">
          <input
            value={query.q || ""}
            onChange={(e) =>
              setQuery((q) => ({ ...q, page: 1, q: e.target.value }))
            }
            placeholder="Tìm theo mã đơn..."
            className="border rounded px-3 py-2"
          />
          <select
            value={query.status || ""}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                page: 1,
                status: (e.target.value || "") as any,
              }))
            }
            className="border rounded px-3 py-2"
          >
            <option value="">Tất cả trạng thái</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
          <button
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => setQuery((q) => ({ ...q, page: 1 }))}
            title="Làm mới"
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Bảng */}
      <div className="bg-white rounded-xl shadow">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Mã đơn</th>
                <th className="px-3 py-2">Khách hàng</th>
                <th className="px-3 py-2">Tổng</th>
                <th className="px-3 py-2">Trạng thái</th>
                <th className="px-3 py-2">Ngày tạo</th>
                <th className="px-3 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-3 py-8 text-center" colSpan={7}>
                    Đang tải...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-8 text-center text-gray-600"
                    colSpan={7}
                  >
                    Chưa có đơn hàng
                  </td>
                </tr>
              ) : (
                orders.map((o, idx) => (
                  <tr key={o.orderNo} className="border-t">
                    <td className="px-3 py-2">
                      {(query.page! - 1) * (query.pageSize || 10) + idx + 1}
                    </td>
                    <td className="px-3 py-2 font-mono">{o.orderNo}</td>
                    <td className="px-3 py-2">
                      {o.customerName ??
                        (o.customerId
                          ? nameMap[o.customerId]?.name
                          : undefined) ??
                        "—"}
                    </td>
                    <td className="px-3 py-2">
                      {Number(o.totalAmount).toLocaleString()} đ
                    </td>
                    <td className="px-3 py-2">
                      <Badge status={o.status} />
                    </td>
                    <td className="px-3 py-2">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 border rounded hover:bg-gray-50"
                          onClick={() => openDetail(o.orderNo)}
                        >
                          Xem
                        </button>
                        <select
                          className="px-2 py-1 border rounded"
                          value={o.status}
                          onChange={(e) =>
                            changeStatus(
                              o.orderNo,
                              e.target.value as OrderStatus
                            )
                          }
                          disabled={saving}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>
                              {statusLabel(s)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex items-center justify-between px-3 py-2 border-t bg-gray-50">
          <div>
            Tổng: <b>{total}</b> đơn
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={(query.page || 1) <= 1}
              onClick={() =>
                setQuery((q) => ({ ...q, page: (q.page || 1) - 1 }))
              }
            >
              Trước
            </button>
            <span>
              Trang {query.page} / {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={(query.page || 1) >= totalPages}
              onClick={() =>
                setQuery((q) => ({ ...q, page: (q.page || 1) + 1 }))
              }
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Drawer chi tiết */}
      {detail && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-end z-50">
          <div className="w-full max-w-xl bg-white h-full p-4 overflow-auto shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Đơn {detail.orderNo}</h3>
              <button
                className="px-2 py-1 border rounded"
                onClick={() => setDetail(null)}
              >
                Đóng
              </button>
            </div>
            {detailLoading ? (
              <div>Đang tải chi tiết...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Trạng thái:</span>{" "}
                    <Badge status={detail.status} />
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày tạo:</span>{" "}
                    {detail.createdAt
                      ? new Date(detail.createdAt).toLocaleString()
                      : "—"}
                  </div>
                  <div>
                    <span className="text-gray-500">Khách hàng:</span>{" "}
                    {detail.customerName ??
                      ((detail as any).customerId
                        ? nameMap[(detail as any).customerId]?.name
                        : "—")}
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>{" "}
                    {detail.customerEmail ?? "—"}
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="font-medium mb-2">Sản phẩm</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-1 text-left">SKU</th>
                        <th className="px-2 py-1 text-left">Tên</th>
                        <th className="px-2 py-1 text-right">SL</th>
                        <th className="px-2 py-1 text-right">Đơn giá</th>
                        <th className="px-2 py-1 text-right">Tạm tính</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.items.map((it, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-2 py-1 font-mono">
                            {it.sku || "—"}
                          </td>
                          <td className="px-2 py-1">{it.name || "—"}</td>
                          <td className="px-2 py-1 text-right">
                            {it.quantity}
                          </td>
                          <td className="px-2 py-1 text-right">
                            {Number(it.unitPrice).toLocaleString()} đ
                          </td>
                          <td className="px-2 py-1 text-right">
                            {Number(it.lineTotal).toLocaleString()} đ
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-right text-sm">
                  <div>
                    <span className="text-gray-500">Tổng tiền:</span>{" "}
                    <b>{Number(detail.totalAmount).toLocaleString()} đ</b>
                  </div>
                </div>
              </>
            )}
            {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
          </div>
        </div>
      )}

      {/* chỉ hiển thị lỗi “thật”, không hiển thị khi 404 danh sách rỗng */}
      {error && <div className="mt-3 text-red-600">{error}</div>}
    </div>
  );
};

export default OrdersTab;
