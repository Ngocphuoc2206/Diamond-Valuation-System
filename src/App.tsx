import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ValuationTool = lazy(() => import('./pages/ValuationTool'));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage')); // 👈 thêm
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const RoleBasedDashboard = lazy(() => import('./pages/RoleBasedDashboard'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const ValuationResults = lazy(() => import('./pages/ValuationResults'));
const CustomerCommunication = lazy(() => import('./pages/CustomerCommunication'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-luxury-gold"></div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Auth routes (không dùng MainLayout) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Main routes (dùng MainLayout) */}
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <HomePage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <MainLayout>
                      <ShopPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/shop/product/:id"
                  element={
                    <MainLayout>
                      <ProductDetailPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <MainLayout>
                      <CartPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <MainLayout>
                      <CheckoutPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/order-success" // 👈 route trang đặt hàng thành công
                  element={
                    <MainLayout>
                      <OrderSuccessPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/valuation"
                  element={
                    <MainLayout>
                      <ValuationTool />
                    </MainLayout>
                  }
                />
                <Route
                  path="/knowledge"
                  element={
                    <MainLayout>
                      <KnowledgePage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <MainLayout>
                      <RoleBasedDashboard />
                    </MainLayout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <MainLayout>
                      <ContactPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/faq"
                  element={
                    <MainLayout>
                      <FAQPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/valuation-results"
                  element={
                    <MainLayout>
                      <ValuationResults />
                    </MainLayout>
                  }
                />
                <Route
                  path="/communication"
                  element={
                    <MainLayout>
                      <CustomerCommunication />
                    </MainLayout>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
