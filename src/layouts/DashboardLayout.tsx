import React, { useState } from "react";
import { Link, NavLink, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeftOnRectangleIcon,
  BellIcon,
  ShoppingBagIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";

type Role =
  | "customer"
  | "consulting_staff"
  | "valuation_staff"
  | "manager"
  | "admin";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { t, language, setLanguage } = useLanguage();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = (user?.roles ?? "").toLowerCase() as Role | "";
  const isCustomer = role === "customer";

  const notifications = [
    {
      id: 1,
      text: "New valuation request submitted",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: 2,
      text: "Your valuation certificate is ready",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      text: "Staff meeting scheduled for tomorrow",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 4,
      text: "New blog post published: Diamond Care Tips",
      time: "Yesterday",
      unread: false,
    },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-3 text-sm ${
      isActive
        ? "text-luxury-gold font-semibold"
        : "text-gray-800 hover:text-luxury-gold"
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ===== Top utility bar (navy) ===== */}
      <div className="w-full bg-luxury-navy text-white">
        <div className="container-custom h-9 flex items-center justify-between text-[13px]">
          <div className="opacity-90">{t("topbar.freeShipping")}</div>
          <div className="flex items-center gap-4 opacity-90">
            <Link to="/faq" className="hover:text-luxury-gold">
              {t("topbar.faq")}
            </Link>
            <Link to="/contact" className="hover:text-luxury-gold">
              {t("topbar.contact")}
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={
                  language === "en"
                    ? "text-luxury-gold"
                    : "hover:text-luxury-gold"
                }
                aria-pressed={language === "en"}
              >
                EN
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                className={
                  language === "vi"
                    ? "text-luxury-gold"
                    : "hover:text-luxury-gold"
                }
                aria-pressed={language === "vi"}
              >
                VI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main navbar (white) ===== */}
      <div className="w-full bg-white border-b">
        <div className="container-custom h-16 flex items-center">
          {/* Logo/brand (trái, sát lề giống MainLayout) */}
          <Link to="/" className="font-serif text-2xl">
            <span className="text-luxury-navy">
              {t("brand.tool") || "Công Cụ"}
            </span>{" "}
            <span className="text-luxury-gold">
              {t("brand.valuation") || "Định Giá"}
            </span>
          </Link>

          {/* Menu chính (ngay cạnh logo, vẫn căn trái) */}
          <nav className="hidden md:flex items-center ml-8">
            <NavLink to="/" className={navClass}>
              {t("nav.home")}
            </NavLink>

            {isCustomer && (
              <NavLink to="/shop" className={navClass}>
                {t("nav.shop")}
              </NavLink>
            )}
            {isCustomer && (
              <NavLink to="/valuation" className={navClass}>
                {t("nav.valuationTool")}
              </NavLink>
            )}
            {isCustomer && (
              <NavLink to="/knowledge" className={navClass}>
                {t("nav.diamondKnowledge")}
              </NavLink>
            )}

            <NavLink to="/contact" className={navClass}>
              {t("nav.contact")}
            </NavLink>
          </nav>

          {/* Actions bên phải (đẩy sang phải bằng ml-auto) */}
          <div className="ml-auto flex items-center gap-3">
            {/* Search */}
            <button
              title={t("common.search")}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
            </button>

            {/* Cart / chỉ hiển thị cho Customer */}
            {isCustomer && (
              <Link
                to="/cart"
                title={t("nav.cart")}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ShoppingBagIcon className="h-5 w-5 text-gray-700" />
              </Link>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title={t("common.notifications")}
              >
                <BellIcon className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-2 divide-y divide-gray-100">
                    <div className="flex justify-between items-center px-4 py-2">
                      <h3 className="text-sm font-medium text-gray-700">
                        Notifications
                      </h3>
                      <button className="text-xs text-luxury-gold hover:text-luxury-navy">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-gray-50 ${
                            n.unread ? "bg-blue-50" : ""
                          }`}
                        >
                          <p className="text-sm text-gray-800">{n.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2">
                      <Link
                        to="/dashboard/notifications"
                        className="text-sm text-luxury-gold hover:text-luxury-navy flex justify-center"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account / Dashboard */}
            {isCustomer && (
              <Link
                to="/dashboard"
                title={user?.name || t("nav.profile")}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <UserCircleIcon className="h-6 w-6 text-gray-700" />
              </Link>
            )}

            {/* Nút vào flow định giá */}
            {isCustomer && (
              <Link
                to="/dashboard/valuations"
                className="ml-1 inline-flex items-center rounded-md bg-luxury-navy px-4 py-2 text-sm font-semibold text-white hover:bg-luxury-gold hover:text-luxury-navy transition"
              >
                {t("nav.valuationTool")}
              </Link>
            )}

            {/* Sign out */}
            <button
              onClick={logout}
              className="ml-2 inline-flex items-center text-sm font-medium text-gray-700 hover:text-red-600"
              title={t("nav.signout")}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
              {t("nav.signout")}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Nội dung trang ===== */}
      <main className="flex-1">
        <div className="container-custom py-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
