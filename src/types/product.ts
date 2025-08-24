export interface Product {
  id: string; // Guid hoặc string
  name: string;
  description?: string;
  sku?: string;
  category?: string; // nếu BE trả categoryId -> đổi thành number | string
  price: number;
  stock?: number;
  imageUrl?: string | null;
  images?: string[]; // nếu bạn muốn gallery
  createdAt?: string; // ISO
}
