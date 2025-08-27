import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Nếu đã đăng nhập thì chuyển hướng
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // gọi BE qua AuthContext
      await login(formData.email, formData.password, formData.rememberMe);
      // điều hướng về trang trước đó (nếu có) hoặc dashboard
      const to =
        location?.state?.from?.pathname &&
        typeof location.state.from.pathname === "string"
          ? location.state.from.pathname
          : "/dashboard";
      navigate(to, { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t("errors.network") ||
        "Login failed. Please check your credentials and try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="max-w-md w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif font-bold text-luxury-navy">
              Diamond<span className="text-luxury-gold">Valley</span>
            </h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t("auth.welcomeBack")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("auth.loginDescription")}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {t("auth.or")}{" "}
            <Link
              to="/register"
              className="font-medium text-luxury-gold hover:text-luxury-navy"
            >
              {t("auth.dontHaveAccount")}
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-8">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("auth.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  placeholder={t("placeholder.email")}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("auth.password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  placeholder={t("placeholder.password")}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {t("auth.rememberMe")}
                  </span>
                </label>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-luxury-gold hover:text-luxury-navy"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>{t("auth.signingIn")}</span>
                  </div>
                ) : (
                  t("auth.signIn")
                )}
              </button>
            </div>
          </div>

          {/* Demo credentials giữ nguyên (tuỳ bạn có muốn xoá không) */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-3">
              Demo Credentials for Testing:
            </h4>
            <div className="space-y-2 text-sm text-blue-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">👤 Customer:</p>
                  <p className="font-mono text-xs">customer@diamond.com</p>
                  <p className="font-mono text-xs">customer123</p>
                </div>
                <div>
                  <p className="font-medium">🏢 Admin:</p>
                  <p className="font-mono text-xs">admin@diamond.com</p>
                  <p className="font-mono text-xs">admin123</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="font-medium">📞 Consulting Staff:</p>
                  <p className="font-mono text-xs">consulting@diamond.com</p>
                  <p className="font-mono text-xs">consulting123</p>
                </div>
                <div>
                  <p className="font-medium"> 💎 Valuation Staff:</p>
                  <p className="font-mono text-xs">valuation@diamond.com</p>
                  <p className="font-mono text-xs">valuation123</p>
                </div>
              </div>
              <div className="pt-2">
                <div>
                  <p className="font-medium">👥 Manager:</p>
                  <p className="font-mono text-xs">
                    manager@diamond.com / manager123
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Login UI (chưa nối OAuth) */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {/* Google */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {/* Facebook */}
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
