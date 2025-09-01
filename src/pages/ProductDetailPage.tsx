// src/pages/ProductDetailPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import type { Product } from "../types/product";
import { getProductById, getProducts } from "../services/catalog";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ❌ Bỏ import service thanh toán — tạo payment ở /checkout, không ở PDP
// import { createPayment } from "../services/payment";

const ProductDetailPage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ chỉ cần addCartItem (không cần getTotalPrice, cartKey)
  const { add: addCartItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState<string | null>(null);

  const pickImage = (p: any): string => {
    if (Array.isArray(p?.images)) return p.images[0] ?? "";
    if (typeof p?.images === "string") return p.images;
    if (Array.isArray(p?.imageUrl)) return p.imageUrl[0] ?? "";
    if (typeof p?.imageUrl === "string") return p.imageUrl;
    return "";
  };

  // Load chi tiết + related
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const raw = await getProductById(id);
        const p = (raw as any)?.data ?? raw;
        setProduct(p as Product);
        setSelectedImageIndex(0);

        const rawList = await getProducts();
        const list = ((rawList as any)?.data ?? rawList ?? []) as Product[];
        const cate = (p as any)?.category ?? "Others";
        const sameCate = list.filter(
          (x: any) => x?.id !== p?.id && (x?.category ?? "Others") === cate
        );
        setRelated(
          (sameCate.length
            ? sameCate
            : list.filter((x: any) => x?.id !== p?.id)
          ).slice(0, 4)
        );
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Xử lý images
  const images: string[] = useMemo(() => {
    if (!product) return [];
    const p: any = product;
    if (Array.isArray(p?.images)) return p.images;
    if (typeof p?.images === "string") return [p.images];
    if (Array.isArray(p?.imageUrl)) return p.imageUrl;
    if (typeof p?.imageUrl === "string") return [p.imageUrl];
    return [];
  }, [product]);

  const inStock = useMemo(() => {
    if (!product) return false;
    const anyProd: any = product;
    if (typeof anyProd.inStock === "boolean") return anyProd.inStock;
    if (anyProd.stock != null) return Number(anyProd.stock) > 0;
    return true;
  }, [product]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // core add-to-cart logic dùng chung
  const addToCartCore = async () => {
    if (!isAuthenticated) {
      toast.warning("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
      return false;
    }
    if (!product) return false;

    const price = Number((product as any)?.price ?? 0);
    const imageUrl = images[0] || pickImage(product);
    const sku = (product as any)?.sku ?? String((product as any)?.id ?? "");

    if (!sku) {
      setErr("Product is missing SKU. Please contact support.");
      return false;
    }
    if (quantity < 1) {
      setErr("Quantity must be at least 1.");
      return false;
    }

    await addCartItem({
      sku,
      quantity,
      unitPrice: price,
      name: product.name,
      imageUrl,
    });

    setAddedMsg(t("product.addedToCart") ?? "Added to cart!");
    setTimeout(() => setAddedMsg(null), 2500);
    return true;
  };

  // Thêm giỏ hàng (không tạo payment, không redirect)
  const handleAddToCart = async () => {
    try {
      setAdding(true);
      setErr(null);
      await addToCartCore();
    } catch (e: any) {
      setErr(
        e?.response?.data?.message || e?.message || "Failed to add to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  // Mua ngay: thêm giỏ hàng xong đi tới Checkout
  const handleBuyNow = async () => {
    try {
      setAdding(true);
      setErr(null);
      const ok = await addToCartCore();
      if (ok) navigate("/checkout");
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Không thể mua ngay");
    } finally {
      setAdding(false);
    }
  };

  // --- UI trạng thái ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }
  if (err) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">{err}</p>
          <Link to="/shop" className="btn btn-primary">
            {t("product.backToShop")}
          </Link>
        </div>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("product.notFound")}
          </h1>
          <p className="text-gray-600 mb-8">{t("product.notFoundDesc")}</p>
          <Link to="/shop" className="btn btn-primary">
            {t("product.backToShop")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-luxury-navy">
              {t("product.breadcrumbHome")}
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/shop" className="text-gray-500 hover:text-luxury-navy">
              {t("product.breadcrumbShop")}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-luxury-navy font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-4"
          >
            <div className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
              {images[0] ? (
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-luxury-gold"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-8"
          >
            <div>
              {(product as any).featured && (
                <span className="inline-block bg-luxury-gold text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Featured
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-navy mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-luxury-gold">
                  ${Number((product as any)?.price ?? 0).toLocaleString()}
                </span>
                <span
                  className={`font-medium ${
                    inStock ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {(product as any).diamondDetails && (
              <div>
                <h3 className="text-lg font-bold mb-4">
                  Diamond Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Shape",
                      value: (product as any).diamondDetails.shape,
                    },
                    {
                      label: "Carat Weight",
                      value: (product as any).diamondDetails.caratWeight,
                    },
                    {
                      label: "Color",
                      value: (product as any).diamondDetails.color,
                    },
                    {
                      label: "Clarity",
                      value: (product as any).diamondDetails.clarity,
                    },
                    {
                      label: "Cut",
                      value: (product as any).diamondDetails.cut,
                    },
                    {
                      label: "Polish",
                      value: (product as any).diamondDetails.polish,
                    },
                  ]
                    .filter((spec) => spec.value)
                    .map((spec) => (
                      <div
                        key={spec.label}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <dt className="text-sm font-medium text-gray-500">
                          {spec.label}
                        </dt>
                        <dd className="text-lg font-bold text-luxury-navy">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      Total: $
                      {(
                        Number((product as any)?.price ?? 0) * quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {addedMsg && (
                  <div className="text-green-600 text-sm">{addedMsg}</div>
                )}
                {err && !addedMsg && (
                  <div className="text-red-600 text-sm">{err}</div>
                )}

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!inStock || adding}
                    className="btn btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adding
                      ? "Adding..."
                      : inStock
                      ? t("product.addToCart")
                      : "Out of Stock"}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="btn btn-secondary w-full text-lg py-4"
                  >
                    {t("product.buyNow")}
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-100 p-6 rounded-lg">
              <h4 className="font-bold mb-4">{t("product.guarantees")}</h4>
              <div className="space-y-3">
                {[
                  { icon: "🔒", text: t("product.certifiedAuthentic") },
                  { icon: "🚚", text: t("product.freeShipping") },
                  { icon: "↩️", text: t("product.thirtyDayReturn") },
                  { icon: "🛡️", text: t("product.lifetimeWarranty") },
                  { icon: "📋", text: t("product.certifiedAuthentic") },
                ].map((guarantee, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-lg">{guarantee.icon}</span>
                    <span className="text-sm">{guarantee.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-3">
                {t("product.needHelp")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="btn btn-secondary text-sm px-6 py-2"
                >
                  {t("product.contactExpert")}
                </Link>
                <Link
                  to="/valuation"
                  className="btn btn-gold text-sm px-6 py-2"
                >
                  {t("product.getValuation")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mt-16"
          >
            <h2 className="text-3xl font-serif font-bold text-center mb-12">
              You May Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rp: any) => (
                <Link
                  key={rp?.id}
                  to={`/shop/product/${rp?.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={pickImage(rp)}
                    alt={rp?.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">{rp?.name}</h3>
                    <p className="text-luxury-gold font-bold">
                      ${Number(rp?.price ?? 0).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Nếu app có ToastContainer ở layout thì có thể bỏ cái dưới */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default ProductDetailPage;
