// src/AppRouter.tsx
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import ProtectedRoute from "./router/ProtectedRoute";
import PublicOnlyRoute from "./router/PublicOnlyRoute";
import RequireRole from "./router/RequireRole";

// ----- Lazy pages -----
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

// Payment return & order success
const PaymentReturnPage = lazy(() => import("./pages/PaymentReturnPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));

// System pages
const Forbidden = lazy(() => import("./pages/system/Forbidden"));
const NotFound = lazy(() => import("./pages/system/NotFound"));

// Dashboards
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const StaffDashboard = lazy(() => import("./pages/StaffDashboard"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));

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
          {/* Home */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route
            path="/payment/return"
            element={
              <MainLayout>
                <PaymentReturnPage />
              </MainLayout>
            }
          />
          <Route
            path="/order/success"
            element={
              <MainLayout>
                <OrderSuccessPage />
              </MainLayout>
            }
          />

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

          {/* Public routes bọc bởi MainLayout (nhánh có Outlet) */}
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
            <Route index element={<RoleBasedDashboard />} />

            {/* Admin */}
            <Route
              path="admin"
              element={
                <RequireRole allowed={["admin", "manager"]}>
                  <Outlet />
                </RequireRole>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route
                path="products"
                element={<div className="p-6">Products (manager/admin)</div>}
              />
              <Route
                path="analytics"
                element={<div className="p-6">Analytics (manager/admin)</div>}
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
            </Route>

            {/* Staff */}
            <Route
              path="staff"
              element={
                <RequireRole
                  allowed={["consulting_staff", "valuation_staff", "manager"]}
                >
                  <Outlet />
                </RequireRole>
              }
            >
              <Route index element={<StaffDashboard />} />
            </Route>

            {/* Customer */}
            <Route
              path="customer"
              element={
                <RequireRole allowed={["customer"]}>
                  <Outlet />
                </RequireRole>
              }
            >
              <Route index element={<CustomerDashboard />} />
            </Route>

            {/* Settings */}
            <Route
              path="settings"
              element={<div className="p-6">Settings</div>}
            />
          </Route>

          {/* System */}
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
