// src/AppRouter.tsx
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Providers đặt ở App.tsx hoặc main.tsx (không đặt ở router)
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./router/ProtectedRoute";
import PublicOnlyRoute from "./router/PublicOnlyRoute";
import RequireRole from "./router/RequireRole";

// ----- Lazy pages (giữ giống App.tsx hiện tại) -----
const HomePage = lazy(() => import("./pages/HomePage"));
const ValuationTool = lazy(() => import("./pages/ValuationTool"));
const KnowledgePage = lazy(() => import("./pages/KnowledgePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const RoleBasedDashboard = lazy(() => import("./pages/RoleBasedDashboard"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ValuationResults = lazy(() => import("./pages/ValuationResults"));
const CustomerCommunication = lazy(
  () => import("./pages/CustomerCommunication")
);

// Các trang hệ thống (bạn có thể thay bằng trang của bạn nếu đã có)
const Forbidden = lazy(() => import("./pages/system/Forbidden")); // 403
const NotFound = lazy(() => import("./pages/system/NotFound")); // 404

// ----- Loading fallback -----
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-luxury-gold" />
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Redirect root -> / (home) */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* Auth (chỉ hiển thị khi chưa đăng nhập) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />

          {/* Public routes bọc bởi MainLayout */}
          <Route
            element={
              <MainLayout>
                <Outlet />
              </MainLayout>
            }
          >
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/valuation" element={<ValuationTool />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/valuation-results" element={<ValuationResults />} />
            <Route path="/communication" element={<CustomerCommunication />} />
          </Route>

          {/* Dashboard (cần đăng nhập) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Outlet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            {/* Trang tổng/role-based entry (mọi role đăng nhập đều vào được) */}
            <Route index element={<RoleBasedDashboard />} />

            {/* Ví dụ các route con có phân quyền:
                - products, analytics: manager + admin
                - users, content: admin
               Bạn có thể thêm/thay theo nhu cầu. */}
            <Route
              path="products"
              element={
                <RequireRole allowed={["manager", "admin"]}>
                  {/* Bạn có thể thay bằng page thật nếu đã có */}
                  <div className="p-6">Products (manager/admin)</div>
                </RequireRole>
              }
            />
            <Route
              path="analytics"
              element={
                <RequireRole allowed={["manager", "admin"]}>
                  <div className="p-6">Analytics (manager/admin)</div>
                </RequireRole>
              }
            />
            <Route
              path="users"
              element={
                <RequireRole allowed={["admin"]}>
                  <div className="p-6">Users (admin)</div>
                </RequireRole>
              }
            />
            <Route
              path="content"
              element={
                <RequireRole allowed={["admin"]}>
                  <div className="p-6">Content (admin)</div>
                </RequireRole>
              }
            />
            <Route
              path="settings"
              element={
                // mọi role đã login đều có thể vào (không bọc RequireRole)
                <div className="p-6">Settings</div>
              }
            />
          </Route>

          {/* System routes */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
