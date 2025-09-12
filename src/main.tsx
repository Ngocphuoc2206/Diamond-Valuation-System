// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";

// ✅ React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// (tuỳ chọn) Toast
// import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <AppRouter />
            {/* <Toaster position="top-right" /> */}
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
