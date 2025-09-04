// src/pages/ShopPage.tsx
import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import type { Product } from "../types/product";
import { getProducts } from "../services/catalog";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShopPage: React.FC = () => {
  const navigate = useNavigate();
  const { add: addCartItem } = useCart();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  // --- state dữ liệu từ BE ---
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- state filter/sort ---
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  // Đặt max mặc định rất lớn để không lỡ lọc mất SP giá cao
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    Number.MAX_SAFE_INTEGER,
  ]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const raw = await getProducts();
        const list = (raw as any)?.data ?? raw ?? [];
        const arr = Array.isArray(list) ? list : [];
        setItems(arr);

        // Tự động điều chỉnh trần giá theo dữ liệu
        const maxPrice = Math.max(
          0,
          ...arr.map((p: any) => Number(p?.price ?? 0))
        );
        if (isFinite(maxPrice) && maxPrice > 0) {
          const rounded = Math.ceil(maxPrice / 1000) * 1000;
          setPriceRange(([min]) => [
            Math.max(0, min),
            Math.max(rounded, 10_000),
          ]);
        }
      } catch (e: any) {
        setItems([]);
        setError(e?.message ?? "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>(
      items.map((p: any) => (p?.category ? String(p.category) : "Others"))
    );
    return ["all", ...Array.from(set)];
  }, [items]);

  const filteredProducts = useMemo(() => {
    let filtered = items.filter((product: any) => {
      const category = product?.category ? String(product.category) : "Others";
      const price = Number(product?.price ?? 0);

      // Nếu API không có inStock/stock => coi như còn hàng
      const inStock =
        product?.inStock ??
        (product?.stock != null ? Number(product.stock) > 0 : true);

      const matchesCategory =
        selectedCategory === "all" || category === selectedCategory;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesCategory && matchesPrice && !!inStock;
    });

    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort(
          (a: any, b: any) => (a?.price ?? 0) - (b?.price ?? 0)
        );
        break;
      case "price-high":
        filtered = [...filtered].sort(
          (a: any, b: any) => (b?.price ?? 0) - (a?.price ?? 0)
        );
        break;
      case "name":
        filtered = [...filtered].sort((a, b) =>
          String(a?.name ?? "").localeCompare(String(b?.name ?? ""))
        );
        break;
      case "featured":
      default:
        filtered = [...filtered].sort(
          (a: any, b: any) => (b?.featured ? 1 : 0) - (a?.featured ? 1 : 0)
        );
        break;
    }
    return filtered;
  }, [items, selectedCategory, sortBy, priceRange]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  // Lấy ảnh: hỗ trợ imageUrl (string) hoặc images (string[]/string)
  const pickImage = (p: any): string => {
    if (Array.isArray(p?.images)) return p.images[0] ?? "";
    if (typeof p?.images === "string") return p.images;
    if (Array.isArray(p?.imageUrl)) return p.imageUrl[0] ?? "";
    if (typeof p?.imageUrl === "string") return p.imageUrl;
    return "";
  };

  const addToCartCore = async (product: any) => {
    if (!isAuthenticated) {
      toast.warning("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
      return false;
    }
    const imageUrl = pickImage(product);
    const unitPrice = Number(product?.price ?? 0);
    const sku = product?.sku ?? String(product?.id ?? "");

    if (!sku) {
      toast.error("Sản phẩm thiếu SKU. Vui lòng liên hệ hỗ trợ.");
      return false;
    }

    await addCartItem({
      sku,
      quantity: 1,
      unitPrice,
      name: product?.name,
      imageUrl,
    });
    toast.success(`Đã thêm "${product?.name}" vào giỏ hàng!`);
    return true;
  };

  // Thêm giỏ hàng (không tạo payment ở đây)
  const handleAddToCart = async (product: any) => {
    try {
      await addToCartCore(product);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || e?.message || "Thêm vào giỏ hàng thất bại"
      );
    }
  };

  // Mua ngay: thêm giỏ hàng xong chuyển tới Checkout
  const handleBuyNow = async (product: any) => {
    try {
      const ok = await addToCartCore(product);
      if (ok) navigate("/checkout");
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || e?.message || "Không thể mua ngay"
      );
    }
  };

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">
        {error}
        <div className="mt-2 text-sm text-gray-600">
          Hãy kiểm tra API catalog và cấu hình VITE_API_BASE_URL.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-luxury-navy text-white py-16 md:py-20">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              {t("shop.title")}{" "}
              <span className="text-luxury-gold">
                {t("shop.titleHighlight")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              {t("shop.description")}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:w-1/4"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-6">{t("shop.filters")}</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t("shop.category")}</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-luxury-gold focus:ring-luxury-gold"
                      />
                      <span className="ml-2 text-sm">
                        {category === "all" ? t("shop.allProducts") : category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t("shop.priceRange")}</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          Math.max(0, Number(e.target.value) || 0),
                          priceRange[1],
                        ])
                      }
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={Number.isFinite(priceRange[1]) ? priceRange[1] : 0}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          Math.max(0, Number(e.target.value) || 0),
                        ])
                      }
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    ${priceRange[0].toLocaleString()} - $
                    {(Number.isFinite(priceRange[1])
                      ? priceRange[1]
                      : 0
                    ).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quick Price Filters */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t("shop.quickFilters")}</h4>
                <div className="space-y-2">
                  {[
                    { label: t("shop.under5k"), range: [0, 5_000] },
                    { label: t("shop.5to10k"), range: [5_000, 10_000] },
                    { label: t("shop.10to20k"), range: [10_000, 20_000] },
                    {
                      label: t("shop.over20k"),
                      range: [20_000, 1_000_000_000],
                    },
                  ].map((filter) => (
                    <button
                      key={filter.label}
                      type="button"
                      onClick={() =>
                        setPriceRange(filter.range as [number, number])
                      }
                      className="text-left text-sm text-luxury-gold hover:text-luxury-navy w-full"
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Sort and Results Header */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
            >
              <div>
                <h2 className="text-2xl font-serif font-bold mb-2">
                  {selectedCategory === "all"
                    ? t("shop.allProducts")
                    : selectedCategory}
                </h2>
                <p className="text-gray-600">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                >
                  <option value="featured">{t("shop.featured")}</option>
                  <option value="price-low">{t("shop.priceLowHigh")}</option>
                  <option value="price-high">{t("shop.priceHighLow")}</option>
                  <option value="name">{t("shop.nameAZ")}</option>
                </select>
              </div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product: any) => {
                const img = pickImage(product);
                return (
                  <motion.div
                    key={product?.id ?? product?.sku}
                    variants={fadeInUp}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={img}
                        alt={product?.name}
                        className="w-full h-64 object-cover"
                      />
                      {product?.featured && (
                        <span className="absolute top-4 left-4 bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                          {t("shop.featured")}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2">
                        {product?.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product?.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-luxury-navy">
                          ${Number(product?.price ?? 0).toLocaleString()}
                        </span>
                        <div className="flex space-x-2">
                          <Link
                            to={`/shop/product/${product?.id}`}
                            className="px-4 py-2 border border-luxury-navy text-luxury-navy rounded-md hover:bg-luxury-navy hover:text-white transition-colors text-sm"
                          >
                            {t("shop.view")}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            className="px-4 py-2 bg-luxury-gold text-white rounded-md hover:bg-opacity-90 transition-colors text-sm"
                          >
                            {t("shop.addToCart")}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBuyNow(product)}
                            className="px-4 py-2 bg-luxury-navy text-white rounded-md hover:bg-opacity-90 transition-colors text-sm"
                          >
                            {t("shop.buyNow") || "Mua ngay"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">💎</div>
                <h3 className="text-xl font-bold mb-2">
                  {t("shop.noProducts")}
                </h3>
                <p className="text-gray-600 mb-6">{t("shop.noProductsDesc")}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSortBy("featured");
                    // reset về “vô hạn” để không lọc mất dữ liệu
                    setPriceRange([0, Number.MAX_SAFE_INTEGER]);
                  }}
                  className="btn btn-primary"
                >
                  {t("shop.resetFilters")}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-luxury-navy text-white">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              {t("shop.needHelp")}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t("shop.needHelpDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/valuation" className="btn btn-gold text-lg px-8 py-4">
                {t("shop.getValuation")}
              </Link>
              <Link
                to="/contact"
                className="btn btn-secondary text-lg px-8 py-4"
              >
                {t("shop.contactExpert")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default ShopPage;
