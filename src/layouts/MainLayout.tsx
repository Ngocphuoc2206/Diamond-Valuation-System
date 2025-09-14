import React, { useState, useMemo, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

/** GIỮ LẠI: mapping key cho i18n, KHÔNG render trực tiếp nếu không phải customer */
const navigation = [
  { name: "nav.home", href: "/", key: "home" },
  { name: "nav.shop", href: "/shop", key: "shop", customerOnly: true },
  {
    name: "nav.valuationTool",
    href: "/valuation",
    key: "valuation",
    customerOnly: true,
  },
  {
    name: "nav.diamondKnowledge",
    href: "/knowledge",
    key: "knowledge",
    customerOnly: true,
  },
  { name: "nav.contact", href: "/contact", key: "contact" },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const itemsCount = useMemo(
    () => items.reduce((sum, it) => sum + (it.quantity ?? 0), 0),
    [items]
  );

  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ---- NEW: xác định role & isCustomer y như DashboardLayout ----
  const roleString = (() => {
    // hỗ trợ cả user.role (string) lẫn user.roles (string|array)
    const raw = (user as any)?.role ?? (user as any)?.roles ?? "";
    if (Array.isArray(raw)) return String(raw[0] ?? "").toLowerCase();
    return String(raw ?? "").toLowerCase();
  })();
  const isCustomer = roleString === "customer";

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    setSearchOpen(false);
    setSearchQuery("");
  };

  // style NavLink khi active
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium py-2 px-1 border-b-2 transition-colors ${
      isActive
        ? "text-luxury-gold border-luxury-gold"
        : "text-gray-700 hover:text-luxury-gold border-transparent"
    }`;

  // ---- NEW: lọc navigation theo isCustomer (giống DashboardLayout) ----
  const visibleNav = useMemo(
    () => navigation.filter((item) => !item.customerOnly || isCustomer),
    [isCustomer]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ===== Header (sticky) ===== */}
      <header className="sticky top-0 relative z-[10000] bg-white pointer-events-auto">
        {/* Top bar */}
        <div className="bg-luxury-navy text-white">
          <div className="container-custom h-9 flex items-center justify-between text-[13px]">
            <span className="opacity-90">{t("topbar.freeShipping")}</span>
            <div className="flex items-center gap-4 opacity-90">
              <Link to="/faq" className="hover:text-luxury-gold transition">
                {t("topbar.faq")}
              </Link>
              <Link to="/contact" className="hover:text-luxury-gold transition">
                {t("topbar.contact")}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`hover:text-luxury-gold transition ${
                    language === "en" ? "text-luxury-gold" : ""
                  }`}
                >
                  EN
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setLanguage("vi")}
                  className={`hover:text-luxury-gold transition ${
                    language === "vi" ? "text-luxury-gold" : ""
                  }`}
                >
                  VI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main navbar */}
        <div className="bg-white border-b">
          <div className="container-custom">
            <div className="flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  type="button"
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">{t("common.openMenu")}</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Logo + Desktop nav */}
              <div className="lg:flex lg:items-center lg:gap-12">
                <Link to="/" className="flex">
                  <span className="font-serif text-2xl font-bold text-luxury-navy">
                    {t("valuation.title")}{" "}
                    <span className="text-luxury-gold">
                      {t("valuation.titleHighlight")}
                    </span>
                  </span>
                </Link>

                <nav className="hidden lg:flex lg:gap-x-8">
                  {visibleNav.map((item) => (
                    <NavLink key={item.key} to={item.href} className={navClass}>
                      {t(item.name)}
                    </NavLink>
                  ))}
                </nav>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                {/* Search */}
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-luxury-gold transition-colors"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <span className="sr-only">{t("common.search")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>

                {/* Cart -> CHỈ customer */}
                {isCustomer && (
                  <Link
                    to="/cart"
                    className="relative p-2 text-gray-500 hover:text-luxury-gold transition-colors"
                  >
                    <span className="sr-only">{t("nav.cart")}</span>
                    <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
                    {itemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-medium text-white">
                        {itemsCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Account */}
                {isAuthenticated ? (
                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-luxury-gold"
                    >
                      <span className="mr-1">
                        {user?.name ||
                          (user as any)?.fullName ||
                          user?.email ||
                          t("nav.profile")}
                      </span>
                      <UserIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t("nav.dashboard")}
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t("nav.profile")}
                        </Link>
                        <button
                          type="button"
                          onClick={logout}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t("nav.signout")}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-luxury-gold"
                  >
                    {t("nav.signin")}
                  </Link>
                )}

                {/* Valuation CTA -> CHỈ customer (giống DashboardLayout) */}
                {isCustomer && (
                  <Link
                    to="/valuation"
                    className="hidden md:block btn btn-primary"
                  >
                    {t("nav.getValuation")}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-full bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl font-bold text-luxury-navy">
                  {t("valuation.title")}{" "}
                  <span className="text-luxury-gold">
                    {t("valuation.titleHighlight")}
                  </span>
                </span>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">{t("common.close")}</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {visibleNav.map((item) => (
                      <Link
                        key={item.key}
                        to={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t(item.name)}
                      </Link>
                    ))}
                  </div>

                  <div className="py-6">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t("nav.dashboard")}
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 w-full text-left"
                        >
                          {t("nav.signout")}
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t("nav.signin")}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search overlay */}
        {searchOpen && (
          <div className="absolute inset-0 z-50 flex items-start justify-center pt-16 px-4 sm:px-6 md:pt-24 bg-white/95">
            <div className="w-full max-w-2xl">
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-500 hover:text-luxury-gold"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("search.placeholder")}
                  className="w-full py-3 px-4 border-b-2 border-luxury-navy focus:border-luxury-gold bg-transparent focus:outline-none text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full flex items-center px-4 text-gray-500 hover:text-luxury-gold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </form>

              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  {t("search.popularSearches")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    onClick={() => setSearchQuery(t("search.certification"))}
                  >
                    {t("search.certification")}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    onClick={() => setSearchQuery(t("search.4cs"))}
                  >
                    {t("search.4cs")}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    onClick={() => setSearchQuery(t("search.process"))}
                  >
                    {t("search.process")}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                    onClick={() => setSearchQuery(t("search.care"))}
                  >
                    {t("search.care")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ===== Main content ===== */}
      <main className="flex-1 relative z-0">{children}</main>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-900 text-white"></footer>
    </div>
  );
};

export default MainLayout;
