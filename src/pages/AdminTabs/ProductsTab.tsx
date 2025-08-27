// src/pages/admin/tabs/ProductTab.tsx
// ============================
import React from "react";
import { motion as motion5 } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
}
interface ProductStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

interface ProductTabProps {
  t: (key: string) => string;
  products: Product[];
  productStats: ProductStats;
  handleProductAction: (action: string, productId?: string) => void;
}

const fadeInUp5 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const ProductTab: React.FC<ProductTabProps> = ({
  t,
  products,
  productStats,
  handleProductAction,
}) => (
  <motion5.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp5}
    className="space-y-6"
  >
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-bold">
          {t("admin.productManagement")}
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={() => handleProductAction("add")}
            className="btn btn-primary"
          >
            Add New Product
          </button>
        </div>
      </div>

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
          <h4 className="font-medium text-yellow-800">{t("admin.lowStock")}</h4>
          <p className="text-2xl font-bold text-yellow-900">
            {productStats.lowStock}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-800">{t("admin.outOfStock")}</h4>
          <p className="text-2xl font-bold text-red-900">
            {productStats.outOfStock}
          </p>
        </div>
      </div>

      <div className="flex space-x-3 mb-6">
        <select className="px-3 py-2 border rounded-md">
          <option>All Categories</option>
          <option>Rings</option>
          <option>Necklaces</option>
          <option>Earrings</option>
          <option>Bracelets</option>
        </select>
        <select className="px-3 py-2 border rounded-md">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
        <input
          type="search"
          placeholder={t("placeholder.searchProducts")}
          className="px-3 py-2 border rounded-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Product
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                SKU
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Category
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Price
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Stock
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt=""
                      className="w-10 h-10 rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-gray-500">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 font-bold">
                  ${product.price.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-bold ${
                      product.stock === 0
                        ? "text-red-600"
                        : product.stock <= 5
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs capitalize ${
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "archived"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleProductAction("edit", product.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    {product.status === "active" ? (
                      <button
                        onClick={() =>
                          handleProductAction("archive", product.id)
                        }
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleProductAction("activate", product.id)
                        }
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion5.div>
);

export default ProductTab;
