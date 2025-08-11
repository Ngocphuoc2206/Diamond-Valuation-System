import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import CustomerDashboard from './CustomerDashboard';
import DashboardPage from './DashboardPage';

const RoleBasedDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    
    case 'consulting_staff':
    case 'valuation_staff':
    case 'manager':
      return <StaffDashboard />;
    
    case 'customer':
      return <CustomerDashboard />;
    
    default:
      return <DashboardPage />;
  }
};

export default RoleBasedDashboard;
