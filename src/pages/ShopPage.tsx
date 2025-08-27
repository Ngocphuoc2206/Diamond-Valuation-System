import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import type { Product } from "../types/product";
import { getProducts } from "../services/catalog";

const ShopPage: React.FC = () => {
  const { addToCart } = useCart();
  const { t } = useLanguage();

  // --- state dữ liệu từ BE ---
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- state filter/sort ---
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProducts();
        setItems(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((p) => p.category || "Others"));
    return ["all", ...Array.from(set)];
  }, [items]);

  const filteredProducts = useMemo(() => {
    let filtered = items.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (product.category || "Others") === selectedCategory;
      const matchesPrice =
        (product.price ?? 0) >= priceRange[0] &&
        (product.price ?? 0) <= priceRange[1];
      const inStock =
        typeof (product as any).inStock === "boolean"
          ? (product as any).inStock
          : (product.stock ?? 0) > 0;
      return matchesCategory && matchesPrice && inStock;
    });

    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort(
          (a, b) => (a.price ?? 0) - (b.price ?? 0)
        );
        break;
      case "price-high":
        filtered = [...filtered].sort(
          (a, b) => (b.price ?? 0) - (a.price ?? 0)
        );
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        filtered = [...filtered].sort(
          (a, b) =>
            ((b as any).featured ? 1 : 0) - ((a as any).featured ? 1 : 0)
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

  // ✅ Map đúng payload theo CartContext server-backed
  const handleAddToCart = async (product: Product) => {
    const imageUrl = product.images?.[0] ?? product.images ?? "";
    const unitPrice = product.price ?? 0; // <-- ĐỔI price -> unitPrice
    const sku = product.sku ?? String(product.id); // fallback nếu đang dùng id làm sku

    if (!sku) {
      console.warn("Missing SKU for product", product);
      return;
    }

    await addToCart({
      sku,
      quantity: 1,
      unitPrice, //
      name: product.name,
      imageUrl,
    });
  };

  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

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
                          parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value) || 50000,
                        ])
                      }
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    ${priceRange[0].toLocaleString()} - $
                    {priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Quick Price Filters */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">{t("shop.quickFilters")}</h4>
                <div className="space-y-2">
                  {[
                    { label: t("shop.under5k"), range: [0, 5000] },
                    { label: t("shop.5to10k"), range: [5000, 10000] },
                    { label: t("shop.10to20k"), range: [10000, 20000] },
                    { label: t("shop.over20k"), range: [20000, 50000] },
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
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={product.images?.[0] ?? product.images ?? ""}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    {(product as any).featured && (
                      <span className="absolute top-4 left-4 bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                        {t("shop.featured")}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif font-bold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {(product as any).diamondDetails && (
                      <div className="mb-4 text-xs text-gray-600">
                        <div className="grid grid-cols-2 gap-1">
                          <span>
                            {t("shop.shape")}:{" "}
                            {(product as any).diamondDetails.shape}
                          </span>
                          <span>
                            {t("shop.carat")}:{" "}
                            {(product as any).diamondDetails.caratWeight}
                          </span>
                          <span>
                            {t("shop.color")}:{" "}
                            {(product as any).diamondDetails.color}
                          </span>
                          <span>
                            {t("shop.clarity")}:{" "}
                            {(product as any).diamondDetails.clarity}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-luxury-navy">
                        ${(product.price ?? 0).toLocaleString()}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/shop/product/${product.id}`}
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
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                    setPriceRange([0, 50000]);
                    setSortBy("featured");
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
    </div>
  );
};

export default ShopPage;
