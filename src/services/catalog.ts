// src/services/catalog.ts
import { api } from "./apiClient";
import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/api/product");
  console.log("Fetched products:", data);
  return data; // vì BE trả trực tiếp List<Product>
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/api/product/${id}`);
  return data; // vì BE trả trực tiếp Product
}
