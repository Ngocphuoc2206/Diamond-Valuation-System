// src/pages/AdminTabs/ProductsTab.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ProductAPI,
  type Product as ApiProduct,
  type PagedResult,
  type ProductQuery,
} from "../../services/product";
import { useLanguage } from "../../context/LanguageContext";

type FormState = ApiProduct;

const emptyForm: FormState = {
  name: "",
  description: "",
  sku: "",
  category: "",
  price: 0,
  stock: 0,
  status: "Active",
  imageUrl: "",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ProductsTab: React.FC = () => {
  const { t } = useLanguage();

  // data
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters / sort / paging
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"" | "Active" | "Inactive" | "Archived">(
    ""
  );
  const [sort, setSort] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // modal form
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // archive/activate confirm
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);
  const [pendingNewStatus, setPendingNewStatus] = useState<
    "Active" | "Archived" | "Inactive" | null
  >(null);

  // load list
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // BE hiện trả List<Product>; ProductAPI.list xử lý client-side
        const res: PagedResult<ApiProduct> = await ProductAPI.list({
          page,
          pageSize,
          q,
          category,
          status: status || undefined,
          sort,
        } as ProductQuery);
        setItems(res.items); // giữ items trang hiện tại
      } catch (e: any) {
        setError(e?.message ?? "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, pageSize, q, category, status, sort]);

  // để fill select category
  const allCategories = useMemo(() => {
    const s = new Set<string>();
    items.forEach((p) => p.category && s.add(p.category));
    return Array.from(s);
  }, [items]);

  // thống kê
  const productStats = useMemo(() => {
    const total = items.length;
    const outOfStock = items.filter((x) => (x.stock ?? 0) === 0).length;
    const lowStock = items.filter(
      (x) => (x.stock ?? 0) > 0 && (x.stock ?? 0) <= 5
    ).length;
    const inStock = total - outOfStock - lowStock;
    return { total, inStock, lowStock, outOfStock };
  }, [items]);

  // open create / edit
  const openCreate = () => {
    setIsEdit(false);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: ApiProduct) => {
    setIsEdit(true);
    setForm({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      sku: p.sku,
      category: p.category ?? "",
      price: p.price ?? 0,
      stock: p.stock ?? 0,
      status: (p.status as any) || "Active",
      imageUrl: p.imageUrl ?? "",
      createdAt: p.createdAt,
    });
    setShowModal(true);
  };

  // save (create/update)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload: Partial<ApiProduct> = {
        name: form.name.trim(),
        description: form.description?.trim(),
        sku: form.sku.trim(),
        category: form.category?.trim(),
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        status: form.status || "Active",
        imageUrl: form.imageUrl?.trim() || null,
      };
      if (isEdit && form.id) {
        const updated = await ProductAPI.update(form.id, payload);
        setItems((prev) =>
          prev.map((x) => (x.id === updated.id ? updated : x))
        );
      } else {
        const created = await ProductAPI.create(payload);
        // thêm vào đầu danh sách hiện tại
        setItems((prev) => [created, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) {
      alert(e?.message ?? "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  // archive / activate
  const requestStatusChange = (
    id: string,
    to: "Active" | "Inactive" | "Archived"
  ) => {
    setPendingStatusId(id);
    setPendingNewStatus(to);
  };
  const confirmStatusChange = async () => {
    if (!pendingStatusId || !pendingNewStatus) return;
    try {
      setSubmitting(true);
      const target = items.find((x) => x.id === pendingStatusId);
      if (!target) return;
      const updated = await ProductAPI.update(pendingStatusId, {
        ...target,
        status: pendingNewStatus,
      });
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e: any) {
      alert(e?.message ?? "Update status failed");
    } finally {
      setSubmitting(false);
      setPendingStatusId(null);
      setPendingNewStatus(null);
    }
  };

  // delete (nếu muốn)
  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      setSubmitting(true);
      await ProductAPI.remove(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e: any) {
      alert(e?.message ?? "Delete failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-6"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-bold">
            {t("admin.productManagement")}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={openCreate}
              className="px-3 py-2 rounded-2xl bg-black text-white shadow"
            >
              + {t("common.add") || "Add New Product"}
            </button>
          </div>
        </div>

        {/* stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800">
              {t("admin.totalProduct")}
            </h4>
            <p className="text-2xl font-bold text-blue-900">
              {productStats.total}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800">{t("admin.inStock")}</h4>
            <p className="text-2xl font-bold text-green-900">
              {productStats.inStock}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800">
              {t("admin.lowStock")}
            </h4>
            <p className="text-2xl font-bold text-yellow-900">
              {productStats.lowStock}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-800">
              {t("admin.outOfStock")}
            </h4>
            <p className="text-2xl font-bold text-red-900">
              {productStats.outOfStock}
            </p>
          </div>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">
              {t("admin.allCategories") || "All Categories"}
            </option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">{t("admin.allStatuses") || "All Statuses"}</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Archived">Archived</option>
          </select>

          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("placeholder.searchProducts")}
            className="px-3 py-2 border rounded-md"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border rounded-md ml-auto"
          >
            <option value="createdAt_desc">
              {t("admin.sortNewest") || "Newest"}
            </option>
            <option value="createdAt_asc">
              {t("admin.sortOldest") || "Oldest"}
            </option>
            <option value="name_asc">
              {t("admin.sortNameAsc") || "Name A→Z"}
            </option>
            <option value="name_desc">
              {t("admin.sortNameDesc") || "Name Z→A"}
            </option>
            <option value="price_asc">
              {t("admin.sortPriceAsc") || "Price ↑"}
            </option>
            <option value="price_desc">
              {t("admin.sortPriceDesc") || "Price ↓"}
            </option>
            <option value="stock_desc">
              {t("admin.sortStockDesc") || "Stock ↓"}
            </option>
            <option value="stock_asc">
              {t("admin.sortStockAsc") || "Stock ↑"}
            </option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-2 border rounded-md"
          >
            {[5, 8, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.product") || "Product"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  SKU
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.category") || "Category"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.price") || "Price"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.stock") || "Stock"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.status") || "Status"}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  {t("admin.actions") || "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              )}
              {error && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && items.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center">
                    No products
                  </td>
                </tr>
              )}

              {items.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) =>
                            ((
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none")
                          }
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 grid place-items-center text-xs">
                          N/A
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-gray-500 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 font-bold">
                    ${Number(product.price ?? 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${
                        (product.stock ?? 0) === 0
                          ? "text-red-600"
                          : (product.stock ?? 0) <= 5
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "Archived"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(product)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t("common.edit") || "Edit"}
                      </button>

                      {product.status === "Active" ? (
                        <button
                          onClick={() =>
                            requestStatusChange(product.id!, "Archived")
                          }
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          {t("admin.archive") || "Archive"}
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            requestStatusChange(product.id!, "Active")
                          }
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          {t("admin.activate") || "Activate"}
                        </button>
                      )}

                      <button
                        onClick={() => remove(product.id!)}
                        className="text-gray-600 hover:text-black font-medium"
                      >
                        {t("common.delete") || "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="text-sm text-gray-600">
              {t("admin.items") || "Items"}: {items.length}
            </div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border disabled:opacity-50"
              >
                {t("common.prev") || "Prev"}
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-xl border"
              >
                {t("common.next") || "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal create/edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">
                {isEdit
                  ? t("admin.editProduct") || "Edit product"
                  : t("admin.newProduct") || "New product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 rounded-xl border"
              >
                {t("common.close") || "Close"}
              </button>
            </div>

            <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm">SKU</label>
                <input
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm">Description</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm">Category</label>
                <input
                  value={form.category ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm">Image URL</label>
                <input
                  value={form.imageUrl ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  className="px-3 py-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm">Stock</label>
                <input
                  type="number"
                  value={form.stock ?? 0}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                  className="px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm">Status</label>
                <select
                  value={form.status ?? "Active"}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as any })
                  }
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border"
                >
                  {t("common.cancel") || "Cancel"}
                </button>
                <button
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60"
                >
                  {isEdit
                    ? t("common.saveChanges") || "Save changes"
                    : t("common.create") || "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* confirm status change */}
      {pendingStatusId && pendingNewStatus && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">
              {t("admin.confirmStatusChange") || "Confirm status change"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t("admin.thisActionCannotBeUndone") ||
                "This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setPendingStatusId(null);
                  setPendingNewStatus(null);
                }}
                className="px-4 py-2 rounded-xl border"
              >
                {t("common.cancel") || "Cancel"}
              </button>
              <button
                disabled={submitting}
                onClick={confirmStatusChange}
                className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-60"
              >
                {t("common.confirm") || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsTab;
