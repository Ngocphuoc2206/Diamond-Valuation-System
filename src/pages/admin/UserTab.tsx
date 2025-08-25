// src/pages/admin/UsersTab.tsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAPI } from "../../services/user";

// ---- Kiểu tối thiểu (đồng bộ với service của bạn) ----
type RoleDto = { id?: number; name: string };
type UserDto = {
  id: number;
  userName: string;
  email: string;
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  roles?: RoleDto[];
  createdAt?: string;
  isAnonymous?: boolean;
};

type PagedEnvelope<T> = {
  data?: T | T[] | { items?: T[] };
  pagination?: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  success?: boolean;
  message?: string;
};

// ---- Helper parse payload linh hoạt theo nhiều kiểu envelope ----
function normalizeUsersPayload(resData: any, page: number, size: number) {
  const payload: PagedEnvelope<UserDto> = resData ?? {};
  let items: UserDto[] = [];

  if (Array.isArray(payload?.data)) {
    items = payload.data as UserDto[];
  } else if (Array.isArray((payload?.data as any)?.items)) {
    items = (payload.data as any).items as UserDto[];
  } else if (Array.isArray((payload as any)?.items)) {
    // một số API trả thẳng { items, pagination }
    items = (payload as any).items as UserDto[];
  } else if (Array.isArray((payload as any)?.data?.data)) {
    // trường hợp lồng sâu data.data
    items = (payload as any).data.data as UserDto[];
  } else {
    items = [];
  }

  const pagination = payload.pagination ??
    (payload as any)?.data?.pagination ?? {
      page,
      size,
      total: items.length,
      totalPages: 1,
    };

  return { items, pagination };
}

export default function UsersTab() {
  const qc = useQueryClient();

  // ---- UI state ----
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>(""); // Admin | Staff | Customer | ""

  // banner thông báo đơn giản (không cần lib)
  const [banner, setBanner] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // chọn user để gán role
  const [selectedUser, setSelectedUser] = React.useState<UserDto | null>(null);
  const [roleToAssign, setRoleToAssign] = React.useState("");

  // ---- Query danh sách ----
  const usersQuery = useQuery({
    queryKey: ["users", { page, size, roleFilter, search }],
    queryFn: async () => {
      // Nếu UserAPI.list hiện chỉ nhận (page, size) thì bạn có thể
      // đổi UserAPI.list(page, size, roleFilter) hoặc thêm query param search ở BE.
      const res = await (UserAPI as any).list(
        page,
        size,
        roleFilter || undefined,
        search || undefined
      );
      return normalizeUsersPayload(res.data, page, size);
    },
    keepPreviousData: true,
    staleTime: 60_000,
  });

  const items = usersQuery.data?.items ?? [];
  const pagination = usersQuery.data?.pagination;

  // ---- Mutation gán vai trò ----
  const assignRole = useMutation({
    mutationFn: async (p: { userId: number; role: string }) => {
      // tùy service: /user/assign-role { userId, role }
      return UserAPI.assignRole(p);
    },
    onSuccess: () => {
      setBanner({ type: "success", text: "Đã gán vai trò thành công." });
      setSelectedUser(null);
      setRoleToAssign("");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      setBanner({
        type: "error",
        text: "Gán vai trò thất bại. Vui lòng thử lại.",
      });
    },
  });

  // ---- Lọc/tìm kiếm phía client (nếu BE chưa hỗ trợ search) ----
  const filteredItems = React.useMemo(() => {
    let list = items;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.userName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.fullName?.toLowerCase().includes(q)
      );
    }
    if (roleFilter) {
      list = list.filter((u) =>
        (u.roles ?? []).some(
          (r) => r.name?.toLowerCase() === roleFilter.toLowerCase()
        )
      );
    }
    return list;
  }, [items, search, roleFilter]);

  return (
    <div className="space-y-4">
      {/* Banner thông báo */}
      {banner && (
        <div
          className={`rounded-md p-3 text-sm ${
            banner.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <span>{banner.text}</span>
            <button
              className="opacity-70 hover:opacity-100"
              onClick={() => setBanner(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="border rounded px-3 py-2 text-sm"
            placeholder="Tìm (email, username, họ tên)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="border rounded px-3 py-2 text-sm"
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Customer">Customer</option>
          </select>
          <select
            className="border rounded px-3 py-2 text-sm"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / trang
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bảng */}
      <div className="bg-white rounded-2xl shadow p-4">
        {usersQuery.isLoading ? (
          <div>Đang tải...</div>
        ) : usersQuery.isError ? (
          <div className="text-red-600">Lỗi tải danh sách người dùng.</div>
        ) : filteredItems.length === 0 ? (
          <div>Không có người dùng.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-2">ID</th>
                  <th className="py-2 px-2">Username</th>
                  <th className="py-2 px-2">Email</th>
                  <th className="py-2 px-2">Họ tên</th>
                  <th className="py-2 px-2">Vai trò</th>
                  <th className="py-2 px-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((u) => (
                  <tr key={u.id} className="border-b align-top">
                    <td className="py-2 px-2">{u.id}</td>
                    <td className="py-2 px-2">{u.userName}</td>
                    <td className="py-2 px-2">{u.email}</td>
                    <td className="py-2 px-2">{u.fullName ?? "-"}</td>
                    <td className="py-2 px-2">
                      {u.roles?.length
                        ? u.roles.map((r) => r.name).join(", ")
                        : "—"}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        className="px-3 py-1 rounded border hover:bg-gray-50"
                        onClick={() => setSelectedUser(u)}
                      >
                        Gán vai trò
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang cơ bản */}
            <div className="flex items-center justify-between mt-4">
              <button
                className="px-3 py-1 rounded border disabled:opacity-50"
                disabled={page <= 1 || usersQuery.isFetching}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Trước
              </button>
              <div className="text-sm">
                Trang {page}
                {pagination?.total ? (
                  <span className="opacity-70">
                    {" "}
                    • Tổng {pagination.total} người dùng
                  </span>
                ) : null}
                {usersQuery.isFetching && (
                  <span className="ml-2 opacity-70">Đang tải…</span>
                )}
              </div>
              <button
                className="px-3 py-1 rounded border disabled:opacity-50"
                disabled={
                  usersQuery.isFetching ||
                  (pagination && page >= (pagination.totalPages ?? page))
                }
                onClick={() => setPage((p) => p + 1)}
              >
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal gán vai trò */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 space-y-4">
            <div className="text-lg font-semibold">Gán vai trò</div>
            <div className="text-sm opacity-80">
              Người dùng: {selectedUser.userName}
            </div>

            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Nhập vai trò (Admin, Staff, Customer...)"
              value={roleToAssign}
              onChange={(e) => setRoleToAssign(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded border"
                onClick={() => {
                  setSelectedUser(null);
                  setRoleToAssign("");
                }}
              >
                Hủy
              </button>
              <button
                className="px-3 py-1 rounded bg-black text-white disabled:opacity-50"
                disabled={!roleToAssign || assignRole.isLoading}
                onClick={() =>
                  assignRole.mutate({
                    userId: selectedUser.id,
                    role: roleToAssign,
                  })
                }
              >
                {assignRole.isLoading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
