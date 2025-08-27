// services/product.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:9000";
// nếu dùng API Gateway thì baseURL -> http://localhost:9000 (đúng routes YARP)

const http = axios.create({
  baseURL,
  withCredentials: false,
});

// Nếu bạn cần token:
// http.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export type Product = {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category?: string;
  price: number;
  stock: number;
  status?: "active" | "draft" | "archived";
  image?: string | null; // link ảnh
  imageUrl?: string | null; // nếu BE trả trường này
  createdAt?: string;
  updatedAt?: string;
};

export type ProductQuery = {
  page?: number; // 1-based
  pageSize?: number; // default 10/20
  q?: string; // search
  category?: string;
  status?: string; // active/draft/archived
  sort?: string; // ví dụ: price_desc, createdAt_desc, name_asc...
};

export type PagedResult<T> = {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
};

export const ProductAPI = {
  async create(payload: Partial<Product>) {
    // map chuẩn request của BE (CreateProductRequest)
    // chỉ gửi field cần thiết
    const body = {
      name: payload.name,
      description: payload.description ?? "",
      sku: payload.sku,
      category: payload.category ?? "",
      price: payload.price ?? 0,
      stock: payload.stock ?? 0,
      status: payload.status ?? "active",
      imageUrl: payload.imageUrl ?? payload.image ?? null,
    };
    const { data } = await http.post("/api/products", body);
    return data; // kỳ vọng ApiResponse<Product>
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
      imageUrl: payload.imageUrl ?? payload.image ?? null,
    };
    const { data } = await http.put(`/api/products/${id}`, body);
    return data; // ApiResponse<Product>
  },

  async remove(id: string) {
    const { data } = await http.delete(`/api/products/${id}`);
    return data; // ApiResponse<boolean>
  },

  async getById(id: string) {
    const { data } = await http.get(`/api/products/${id}`);
    return data; // ApiResponse<Product>
  },

  async list(params: ProductQuery = {}): Promise<PagedResult<Product>> {
    // BE của bạn có 2 biến thể: /api/products và /api/products/search
    // dùng /api/products/search nếu có tham số lọc để an toàn
    const { page = 1, pageSize = 10, q, category, status, sort } = params;
    const useSearch = q || category || status || sort;
    const url = useSearch ? "/api/products/search" : "/api/products";

    const { data } = await http.get(url, {
      params: { page, pageSize, q, category, status, sort },
    });

    // Chuẩn hoá về PagedResult
    // Nếu BE dùng ApiResponse<Data>, trong đó Data = { items, totalItems, ... } thì unwrap:
    const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res;
    const payload = unwrap(data);

    // fallback nếu BE trả mảng thuần
    if (Array.isArray(payload)) {
      return {
        items: payload,
        totalItems: payload.length,
        page,
        pageSize,
      };
    }
    return payload as PagedResult<Product>;
  },

  async uploadImage(id: string, file: File) {
    const form = new FormData();
    form.append("file", file);
    const { data } = await http.post(`/api/products/${id}/upload-image`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data; // ApiResponse<{ imageUrl: string }>
  },
};
