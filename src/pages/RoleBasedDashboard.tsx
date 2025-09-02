import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import CustomerDashboard from "./CustomerDashboard";
import DashboardPage from "./DashboardPage";

const RoleBasedDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const norm = (s?: string) =>
    (s ?? "").toLowerCase().replace(/\s+/g, "").replace(/[-_]/g, "");
  const role = (() => {
    const r = norm(user?.roles);
    if (r === "consultingstaff") return "consulting_staff";
    if (r === "valuationstaff") return "valuation_staff";
    return r;
  })();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Render appropriate dashboard based on user role
  switch (role) {
    case "admin":
      console.log("Rendering Admin Dashboard");
      return <AdminDashboard />;

    case "manager":
    case "consulting_staff":
    case "valuation_staff":
      return <StaffDashboard />;
    case "customer":
      console.log("Rendering Customer Dashboard");
      return <CustomerDashboard />;

    default:
      console.log("Rendering Default Dashboard Page");
      return <DashboardPage />;
  }
};

export default RoleBasedDashboard;
