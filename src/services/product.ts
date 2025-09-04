// src/services/product.ts
// Khớp với CatalogService (Product.Api) hiện tại:
//  - GET    /api/product
//  - GET    /api/product/{id}
//  - POST   /api/product
//  - PUT    /api/product/{id}
//  - DELETE /api/product/{id}

import { api } from "./apiClient"; // dùng sẵn axios instance & refresh token

export type Product = {
  id?: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  price: number;
  stock: number;
  // BE dùng "Active" | "Inactive" | "Archived" (chuỗi PascalCase)
  status?: "Active" | "Inactive" | "Archived";
  imageUrl?: string | null; // BE: ImageUrl (1 ảnh đại diện)
  createdAt?: string;
  // updatedAt hiện BE chưa trả; để optional cho tương lai
  updatedAt?: string;
};

export type ProductQuery = {
  page?: number; // 1-based
  pageSize?: number; // mặc định 10
  q?: string; // search tên/sku/desc
  category?: string;
  status?: "Active" | "Inactive" | "Archived";
  sort?: string; // "price_desc" | "createdAt_desc" | "name_asc" ...
};

export type PagedResult<T> = {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
};

// ===== Helpers (client-side filter/sort/paging vì BE hiện trả List<Product>) =====
function normalize(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    sku: p.sku,
    category: p.category,
    price: Number(p.price ?? 0),
    stock: Number(p.stock ?? 0),
    status: p.status ?? "Active",
    imageUrl: p.imageUrl ?? null,
    createdAt: p.createdAt,
  };
}

function clientProcess(
  list: Product[],
  { page = 1, pageSize = 10, q, category, status, sort }: ProductQuery
): PagedResult<Product> {
  let data = [...list];

  const term = (q ?? "").trim().toLowerCase();
  if (term) {
    data = data.filter((p) =>
      [p.name, p.description, p.sku, p.category, p.status, p.imageUrl]
        .map((x) => (x ?? "").toString().toLowerCase())
        .join(" ")
        .includes(term)
    );
  }
  if (category) data = data.filter((p) => p.category === category);
  if (status) data = data.filter((p) => p.status === status);

  if (sort) {
    const [field, dir] = sort.split("_"); // e.g. "price_desc"
    data.sort((a: any, b: any) => {
      const va = a?.[field];
      const vb = b?.[field];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;

      if (typeof va === "number" && typeof vb === "number") {
        return dir === "asc" ? va - vb : vb - va;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return dir === "asc" ? -1 : 1;
      if (sa > sb) return dir === "asc" ? 1 : -1;
      return 0;
    });
  } else {
    // mặc định: mới nhất trước (createdAt_desc nếu có), fallback theo name
    data.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return (a.name || "").localeCompare(b.name || "");
    });
  }

  const totalItems = data.length;
  const start = (page - 1) * pageSize;
  const items = data.slice(start, start + pageSize);

  return { items, totalItems, page, pageSize };
}

// ===== API khớp BE /api/product =====
export const ProductAPI = {
  async create(payload: Partial<Product>) {
    const body = {
      name: payload.name,
      description: payload.description ?? "",
      sku: payload.sku,
      category: payload.category ?? "",
      price: payload.price ?? 0,
      stock: payload.stock ?? 0,
      status: payload.status ?? "Active",
      imageUrl: payload.imageUrl ?? null,
    };
    // BE trả trực tiếp Product (không bọc ApiResponse)
    const { data } = await api.post<Product>("/api/product", body);
    return normalize(data);
  },

  async update(id: string, payload: Partial<Product>) {
    const body = {
      name: payload.name,
      description: payload.description,
      sku: payload.sku,
      category: payload.category,
      price: payload.price,
      stock: payload.stock,
      status: payload.status,
      imageUrl: payload.imageUrl ?? null,
    };
    const { data } = await api.put<Product>(`/api/product/${id}`, body);
    return normalize(data);
  },

  async remove(id: string) {
    // BE trả NoContent (204). Không cần đọc body.
    await api.delete(`/api/product/${id}`);
    return true;
  },

  async getById(id: string) {
    const { data } = await api.get<Product>(`/api/product/${id}`);
    return normalize(data);
  },

  async list(params: ProductQuery = {}): Promise<PagedResult<Product>> {
    // BE hiện không có search/paging server; gọi 1 lần và xử lý client-side
    const { data } = await api.get<Product[]>("/api/product");
    const normalized = (data ?? []).map(normalize);
    return clientProcess(normalized, params);
  },

  // TÙY CHỌN: chỉ dùng nếu bạn thêm endpoint upload ở BE:
  // [HttpPost("{id}/upload-image")]
  async uploadImage(id: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<{ imageUrl: string }>(
      `/api/product/${id}/upload-image`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },
};
