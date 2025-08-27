export interface Product {
  id: string; // Guid hoặc string
  name: string;
  price: number;
  sku: string;
  description: string;
  category: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  diamondDetails: {
    shape?: string;
    caratWeight: number;
    color: string;
    clarity: string;
    cut: string;
  };
}
