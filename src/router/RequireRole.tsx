import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type RequireRoleProps = {
  children: React.ReactNode;
  allowed: string[]; // ví dụ: ["admin"] hoặc ["manager", "admin"]
};

const RequireRole: React.FC<RequireRoleProps> = ({ children, allowed }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const role = (user?.role ?? "").toLowerCase();
  if (!allowed.map((r) => r.toLowerCase()).includes(role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
