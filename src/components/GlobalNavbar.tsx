import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ShoppingBagIcon,
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

type Props = {
  // Nếu muốn, bạn có thể truyền endpoint cho nút Định Giá
  valuationHref?: string;
};

const GlobalNavbar: React.FC<Props> = ({ valuationHref = "/valuation" }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const nav = [
    { to: "/", label: "Trang Chủ" },
    { to: "/shop", label: "Cửa Hàng" },
    { to: "/valuation", label: "Công Cụ Định Giá" },
    { to: "/knowledge", label: "Kiến Thức Kim Cương" },
    { to: "/contact", label: "Liên Hệ" },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-3 text-sm ${
      isActive
        ? "text-luxury-gold font-semibold"
        : "text-gray-800 hover:text-luxury-gold"
    }`;

  return (
    <nav className="w-full">
      {/* Top utility bar */}
      <div className="w-full bg-luxury-navy text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9 text-[13px]">
          <div className="opacity-90">
            Miễn phí vận chuyển cho đơn hàng trên $1000
          </div>
          <div className="flex items-center gap-4 opacity-90">
            <Link to="/faq" className="hover:text-luxury-gold">
              Câu Hỏi
            </Link>
            <Link to="/contact" className="hover:text-luxury-gold">
              Liên Hệ
            </Link>
            <div className="flex items-center gap-2">
              <button className="hover:text-luxury-gold">EN</button>
              <span>|</span>
              <button className="hover:text-luxury-gold">VI</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="w-full bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-serif text-2xl">
            <span className="text-luxury-navy">Công Cụ</span>{" "}
            <span className="text-luxury-gold">Định Giá</span>
          </Link>

          {/* Main links */}
          <div className="hidden md:flex items-center">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className={linkClass}>
                {n.label}
              </NavLink>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <button
              title="Tìm kiếm"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
            </button>

            <Link
              to="/cart"
              title="Giỏ hàng"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingBagIcon className="h-5 w-5 text-gray-700" />
            </Link>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                title={user?.name || "Tài khoản"}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <UserCircleIcon className="h-6 w-6 text-gray-700" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm text-gray-700 hover:text-luxury-gold"
              >
                Đăng nhập
              </Link>
            )}

            <Link
              to={valuationHref}
              className="ml-1 inline-flex items-center rounded-md bg-luxury-navy px-4 py-2 text-sm font-semibold text-white hover:bg-luxury-gold hover:text-luxury-navy transition"
            >
              Định Giá
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlobalNavbar;
