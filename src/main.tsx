// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <AppRouter />
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
