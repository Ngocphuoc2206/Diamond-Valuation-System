import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { users as initialUsers } from '../data/mockData';

// Mock data for admin dashboard
const dashboardStats = {
  totalUsers: 1247,
  totalValuations: 892,
  pendingValuations: 34,
  totalRevenue: 2456789,
  monthlyRevenue: 234567,
  completedOrders: 156,
  pendingOrders: 23,
  customerRating: 4.8,
  avgTurnaroundTime: 4.2,
};

// Enhanced mock data for comprehensive functionality
const mockOrders = [
  {
    id: 'ORD-2024-0098',
    customer: 'Jane Smith',
    items: 2,
    total: 3450,
    status: 'delivered',
    date: '2024-01-15',
    email: 'jane.smith@email.com'
  },
  {
    id: 'ORD-2024-0097',
    customer: 'Michael Johnson',
    items: 1,
    total: 15999,
    status: 'shipped',
    date: '2024-01-14',
    email: 'michael.j@email.com'
  },
  {
    id: 'ORD-2024-0096',
    customer: 'Sarah Williams',
    items: 3,
    total: 8750,
    status: 'processing',
    date: '2024-01-13',
    email: 'sarah.w@email.com'
  }
];

const mockProducts = [
  {
    id: 'RING-2024-001',
    name: 'Classic Solitaire Ring',
    description: '2.5ct Round Brilliant',
    sku: 'RING-2024-001',
    category: 'Engagement Rings',
    price: 15999,
    stock: 5,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=40&h=40&fit=crop'
  },
  {
    id: 'NECK-2024-002', 
    name: 'Diamond Tennis Necklace',
    description: '5ct Total Weight',
    sku: 'NECK-2024-002',
    category: 'Necklaces',
    price: 12500,
    stock: 3,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=40&h=40&fit=crop'
  }
];

const mockValuations = [
  {
    id: 'VAL-2024-0123',
    customer: 'John Doe',
    type: 'Insurance Appraisal',
    status: 'in_progress',
    assignedTo: 'Dr. Emma Wilson',
    dueDate: '2024-01-20',
    priority: 'normal'
  },
  {
    id: 'VAL-2024-0124',
    customer: 'Lisa Chen',
    type: 'Market Valuation',
    status: 'pending',
    assignedTo: 'James Rodriguez',
    dueDate: '2024-01-22',
    priority: 'high'
  }
];

const mockStaff = [
  {
    id: 'STAFF-001',
    name: 'Dr. Emma Wilson',
    email: 'emma.wilson@company.com',
    role: 'valuation_staff',
    department: 'Appraisal',
    activeCases: 8,
    performance: 98.5,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=32&h=32&fit=crop&crop=face'
  },
  {
    id: 'STAFF-002',
    name: 'James Rodriguez',
    email: 'james.rodriguez@company.com',
    role: 'consulting_staff',
    department: 'Consultation',
    activeCases: 12,
    performance: 95.2,
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
  }
];

const recentActivities = [
  { id: 1, type: 'valuation', message: 'New valuation request submitted by John Doe', time: '10 minutes ago', priority: 'high' },
  { id: 2, type: 'order', message: 'Order #ORD-2024-0156 completed and shipped', time: '25 minutes ago', priority: 'normal' },
  { id: 3, type: 'user', message: 'New customer registration: jane.smith@email.com', time: '1 hour ago', priority: 'low' },
  { id: 4, type: 'staff', message: 'Valuation staff Sarah completed 3 appraisals', time: '2 hours ago', priority: 'normal' },
  { id: 5, type: 'system', message: 'Pricing data synchronized from external API', time: '3 hours ago', priority: 'low' },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  
  // State management for all data
  const [users, setUsers] = useState(initialUsers);
  const [orders, setOrders] = useState(mockOrders);
  const [products, setProducts] = useState(mockProducts);
  const [valuations, setValuations] = useState(mockValuations);
  const [staff, setStaff] = useState(mockStaff);
  
  // UI state
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'user' | 'product' | 'valuation' | 'staff' | 'order' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [showSuccess, setShowSuccess] = useState('');

  // Notification system
  const showNotification = (message: string) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(''), 3000);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Enhanced CRUD operations with actual state updates
  const handleUserAction = (action: string, userId?: string) => {
    switch (action) {
      case 'add':
        setSelectedItem(null);
        setFormData({
          name: '',
          email: '',
          role: 'customer',
          password: '',
        });
        setModalType('user');
        setIsModalOpen(true);
        break;
      case 'edit':
        const userToEdit = users.find(u => u.id === userId);
        if (userToEdit) {
          setSelectedItem(userToEdit);
          setFormData({
            name: userToEdit.name,
            email: userToEdit.email,
            role: userToEdit.role,
            password: userToEdit.password,
          });
          setModalType('user');
          setIsModalOpen(true);
        }
        break;
      case 'suspend':
        if (confirm('Are you sure you want to suspend this user?')) {
          setUsers(prev => prev.map(u => 
            u.id === userId ? { ...u, status: 'suspended' } : u
          ));
          showNotification('User suspended successfully');
        }
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'active' } : u
        ));
        showNotification('User activated successfully');
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          showNotification('User deleted successfully');
        }
        break;
      case 'bulk_action':
        if (selectedUsers.length > 0) {
          const action = prompt('Enter action (suspend/activate/delete):');
          if (action === 'delete' && confirm(`Delete ${selectedUsers.length} users?`)) {
            setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
            setSelectedUsers([]);
            showNotification(`${selectedUsers.length} users deleted`);
          }
        }
        break;
    }
  };

  const handleProductAction = (action: string, productId?: string) => {
    switch (action) {
      case 'add':
        setSelectedItem(null);
        setFormData({
          name: '',
          description: '',
          sku: '',
          category: 'rings',
          price: 0,
          stock: 0,
          status: 'active'
        });
        setModalType('product');
        setIsModalOpen(true);
        break;
      case 'edit':
        const productToEdit = products.find(p => p.id === productId);
        if (productToEdit) {
          setSelectedItem(productToEdit);
          setFormData(productToEdit);
          setModalType('product');
          setIsModalOpen(true);
        }
        break;
      case 'archive':
        if (confirm('Are you sure you want to archive this product?')) {
          setProducts(prev => prev.map(p => 
            p.id === productId ? { ...p, status: 'archived' } : p
          ));
          showNotification('Product archived successfully');
        }
        break;
      case 'activate':
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, status: 'active' } : p
        ));
        showNotification('Product activated successfully');
        break;
    }
  };

  const handleValuationAction = (action: string, valuationId?: string) => {
    switch (action) {
      case 'add':
        setSelectedItem(null);
        setFormData({
          customer: '',
          type: 'Insurance Appraisal',
          assignedTo: '',
          priority: 'normal',
          dueDate: ''
        });
        setModalType('valuation');
        setIsModalOpen(true);
        break;
      case 'reassign':
        const valuationToReassign = valuations.find(v => v.id === valuationId);
        if (valuationToReassign) {
          setSelectedItem(valuationToReassign);
          setFormData({
            assignedTo: valuationToReassign.assignedTo,
            priority: valuationToReassign.priority,
            notes: ''
          });
          setModalType('valuation');
          setIsModalOpen(true);
        }
        break;
      case 'complete':
        if (confirm('Mark this valuation as completed?')) {
          setValuations(prev => prev.map(v => 
            v.id === valuationId ? { ...v, status: 'completed' } : v
          ));
          showNotification('Valuation marked as completed');
        }
        break;
      case 'cancel':
        if (confirm('Are you sure you want to cancel this valuation?')) {
          setValuations(prev => prev.map(v => 
            v.id === valuationId ? { ...v, status: 'cancelled' } : v
          ));
          showNotification('Valuation cancelled');
        }
        break;
    }
  };

  const handleOrderAction = (action: string, orderId?: string) => {
    switch (action) {
      case 'view':
        const order = orders.find(o => o.id === orderId);
        if (order) {
          alert(`Order Details:\nID: ${order.id}\nCustomer: ${order.customer}\nTotal: $${order.total}\nStatus: ${order.status}`);
        }
        break;
      case 'update_status':
        const newStatus = prompt('Enter new status (processing/shipped/delivered):');
        if (newStatus) {
          setOrders(prev => prev.map(o => 
            o.id === orderId ? { ...o, status: newStatus } : o
          ));
          showNotification('Order status updated');
        }
        break;
      case 'export':
        // Mock export functionality
        const csvData = orders.map(o => `${o.id},${o.customer},${o.total},${o.status}`).join('\n');
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'orders_export.csv';
        a.click();
        showNotification('Orders exported successfully');
        break;
    }
  };

  const handleStaffAction = (action: string, staffId?: string) => {
    switch (action) {
      case 'add':
        setSelectedItem(null);
        setFormData({
          name: '',
          email: '',
          role: 'consulting_staff',
          department: '',
          status: 'active'
        });
        setModalType('staff');
        setIsModalOpen(true);
        break;
      case 'view':
        const staffMember = staff.find(s => s.id === staffId);
        if (staffMember) {
          alert(`Staff Details:\nName: ${staffMember.name}\nRole: ${staffMember.role}\nActive Cases: ${staffMember.activeCases}\nPerformance: ${staffMember.performance}%`);
        }
        break;
      case 'schedule':
        showNotification('Staff scheduling feature would open here');
        break;
    }
  };

  // Form submission handlers
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'user') {
      if (selectedItem) {
        // Update existing user
        setUsers(prev => prev.map(u => 
          u.id === selectedItem.id 
            ? { ...u, ...formData, id: selectedItem.id }
            : u
        ));
        showNotification('User updated successfully');
      } else {
        // Create new user
        const newUser = {
          ...formData,
          id: `user_${Date.now()}`,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        };
        setUsers(prev => [...prev, newUser]);
        showNotification('User created successfully');
      }
    } else if (modalType === 'product') {
      if (selectedItem) {
        // Update existing product
        setProducts(prev => prev.map(p => 
          p.id === selectedItem.id 
            ? { ...p, ...formData, id: selectedItem.id }
            : p
        ));
        showNotification('Product updated successfully');
      } else {
        // Create new product
        const newProduct = {
          ...formData,
          id: `product_${Date.now()}`,
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=40&h=40&fit=crop'
        };
        setProducts(prev => [...prev, newProduct]);
        showNotification('Product created successfully');
      }
    } else if (modalType === 'valuation') {
      if (selectedItem) {
        // Update/reassign valuation
        setValuations(prev => prev.map(v => 
          v.id === selectedItem.id 
            ? { ...v, assignedTo: formData.assignedTo, priority: formData.priority }
            : v
        ));
        showNotification('Valuation reassigned successfully');
      } else {
        // Create new valuation
        const newValuation = {
          ...formData,
          id: `VAL-2024-${String(Date.now()).slice(-4)}`,
          status: 'pending'
        };
        setValuations(prev => [...prev, newValuation]);
        showNotification('Valuation request created');
      }
    } else if (modalType === 'staff') {
      if (selectedItem) {
        // Update existing staff
        setStaff(prev => prev.map(s => 
          s.id === selectedItem.id 
            ? { ...s, ...formData, id: selectedItem.id }
            : s
        ));
        showNotification('Staff updated successfully');
      } else {
        // Create new staff
        const newStaff = {
          ...formData,
          id: `STAFF-${String(Date.now()).slice(-3)}`,
          activeCases: 0,
          performance: 0,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        };
        setStaff(prev => [...prev, newStaff]);
        showNotification('Staff member added successfully');
      }
    }
    
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSettingsUpdate = (settings: any) => {
    // In a real app, this would make an API call
    console.log('Updating settings:', settings);
    showNotification('Settings updated successfully!');
  };

  // Filtered data based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesFilter = userFilter === 'all' || 
      (userFilter === 'customer' && user.role === 'customer') ||
      (userFilter === 'staff' && ['consulting_staff', 'valuation_staff', 'manager'].includes(user.role)) ||
      (userFilter === 'admin' && user.role === 'admin');
    
    const matchesSearch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Statistics calculations
  const userStats = {
    customers: users.filter(u => u.role === 'customer').length,
    consultingStaff: users.filter(u => u.role === 'consulting_staff').length,
    valuationStaff: users.filter(u => u.role === 'valuation_staff').length,
    managers: users.filter(u => u.role === 'manager').length,
  };

  const orderStats = {
    newOrders: orders.filter(o => o.status === 'new').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  const valuationStats = {
    pending: valuations.filter(v => v.status === 'pending').length,
    inProgress: valuations.filter(v => v.status === 'in_progress').length,
    completed: valuations.filter(v => v.status === 'completed').length,
    overdue: valuations.filter(v => v.status === 'overdue').length,
  };

  const productStats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    outOfStock: products.filter(p => p.stock === 0).length,
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">{t('admin.accessDenied')}</h1>
          <p className="text-gray-600 mb-6">{t('admin.noPermission')}</p>
          <Link to="/dashboard" className="btn btn-primary">
            {t('admin.backToDashboard')}
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: t('admin.overview'), icon: '📊' },
    { id: 'users', label: t('admin.userManagement'), icon: '👥' },
    { id: 'valuations', label: t('admin.valuations'), icon: '💎' },
    { id: 'orders', label: t('admin.orders'), icon: '📦' },
    { id: 'products', label: t('admin.products'), icon: '🛍️' },
    { id: 'staff', label: t('admin.staffManagement'), icon: '👨‍💼' },
    { id: 'analytics', label: t('admin.analytics'), icon: '📈' },
    { id: 'settings', label: t('admin.systemConfig'), icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {showSuccess}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-serif font-bold text-luxury-navy">
                {t('admin.title')} <span className="text-luxury-gold">{t('admin.titleHighlight')}</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {t('admin.description')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-luxury-gold bg-opacity-10 px-4 py-2 rounded-full">
                <span className="text-luxury-gold font-medium">Administrator</span>
              </div>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'}
                alt={user?.name}
                className="w-10 h-10 rounded-full border-2 border-luxury-gold"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center space-x-3 ${
                      activeTab === tab.id
                        ? 'bg-luxury-gold text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-8"
              >
                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t('admin.totalUsers')}</p>
                        <p className="text-3xl font-bold text-luxury-navy">{dashboardStats.totalUsers.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <span className="text-2xl">👥</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-green-600 text-sm font-medium">↗ +12% {t('admin.fromLastMonth')}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t('admin.totalValuations')}</p>
                        <p className="text-3xl font-bold text-luxury-navy">{dashboardStats.totalValuations.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <span className="text-2xl">💎</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-green-600 text-sm font-medium">↗ +8% {t('admin.fromLastMonth')}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t('admin.monthlyRevenue')}</p>
                        <p className="text-3xl font-bold text-luxury-navy">${dashboardStats.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <span className="text-2xl">💰</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-green-600 text-sm font-medium">↗ +15% {t('admin.fromLastMonth')}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{t('admin.customerRating')}</p>
                        <p className="text-3xl font-bold text-luxury-navy">{dashboardStats.customerRating}/5</p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-green-600 text-sm font-medium">↗ +0.2 {t('admin.fromLastMonth')}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">{t('admin.quickActions')}</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('users')}
                      className="flex items-center space-x-3 p-4 border border-luxury-navy rounded-lg hover:bg-luxury-navy hover:text-white transition-colors"
                    >
                      <span className="text-2xl">👥</span>
                      <div className="text-left">
                        <p className="font-medium">{t('admin.manageUsers')}</p>
                        <p className="text-sm opacity-75">{t('admin.viewEditAccounts')}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('valuations')}
                      className="flex items-center space-x-3 p-4 border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors"
                    >
                      <span className="text-2xl">💎</span>
                      <div className="text-left">
                        <p className="font-medium">{t('admin.valuationQueue')}</p>
                        <p className="text-sm opacity-75">{t('admin.monitorPending')}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="flex items-center space-x-3 p-4 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                    >
                      <span className="text-2xl">📈</span>
                      <div className="text-left">
                        <p className="font-medium">{t('admin.viewAnalytics')}</p>
                        <p className="text-sm opacity-75">{t('admin.businessInsights')}</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">{t('admin.systemActivities')}</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'valuation' ? 'bg-purple-100' :
                            activity.type === 'order' ? 'bg-blue-100' :
                            activity.type === 'user' ? 'bg-green-100' :
                            activity.type === 'staff' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            <span className="text-sm">
                              {activity.type === 'valuation' ? '💎' :
                               activity.type === 'order' ? '📦' :
                               activity.type === 'user' ? '👤' :
                               activity.type === 'staff' ? '👨‍💼' :
                               '⚙️'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{activity.message}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.priority === 'high' ? 'bg-red-100 text-red-800' :
                          activity.priority === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-bold">{t('admin.userManagement')}</h3>
                  <button className="btn btn-primary">{t('admin.addNewUser')}</button>
                </div>
                
                {/* User Statistics */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800">{t('admin.totalCustomers')}</h4>
                    <p className="text-2xl font-bold text-blue-900">{userStats.customers}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800">{t('admin.consultingStaff')}</h4>
                    <p className="text-2xl font-bold text-green-900">{userStats.consultingStaff}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800">{t('admin.valuationStaff')}</h4>
                    <p className="text-2xl font-bold text-purple-900">{userStats.valuationStaff}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800">{t('admin.managers')}</h4>
                    <p className="text-2xl font-bold text-yellow-900">{userStats.managers}</p>
                  </div>
                </div>

                {/* User Filters and Search */}
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                  <div className="flex space-x-3">
                    <select 
                      value={userFilter} 
                      onChange={(e) => setUserFilter(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="all">{t('admin.allUsers')}</option>
                      <option value="customer">{t('admin.customers')}</option>
                      <option value="staff">{t('admin.staff')}</option>
                      <option value="admin">{t('admin.admins')}</option>
                    </select>
                    <input
                      type="search"
                      placeholder={t('placeholder.searchUsers')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleUserAction('bulk_action')}
                      className="btn btn-secondary text-sm"
                      disabled={selectedUsers.length === 0}
                    >
                      {t('admin.bulkActions')} ({selectedUsers.length})
                    </button>
                    <button 
                      onClick={() => handleUserAction('add')}
                      className="btn btn-primary text-sm"
                    >
                      {t('admin.addNewUser')}
                    </button>
                  </div>
                </div>

                {/* User Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          <input 
                            type="checkbox" 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(filteredUsers.map(u => u.id));
                              } else {
                                setSelectedUsers([]);
                              }
                            }}
                            className="rounded"
                          />
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">{t('admin.user')}</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">{t('admin.role')}</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">{t('admin.status')}</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">{t('admin.lastActive')}</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3">
                            <input 
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                }
                              }}
                              className="rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <img src={user.avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=32&h=32&fit=crop&crop=face"} alt="" className="w-8 h-8 rounded-full" />
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'customer' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'admin' ? 'bg-red-100 text-red-800' :
                              user.role === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              (user as any).status === 'suspended' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {(user as any).status || 'Active'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">2 hours ago</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleUserAction('edit', user.id)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {t('admin.edit')}
                              </button>
                              {(user as any).status === 'suspended' ? (
                                <button 
                                  onClick={() => handleUserAction('activate', user.id)}
                                  className="text-green-600 hover:text-green-800 font-medium"
                                >
                                  {t('admin.activate')}
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleUserAction('suspend', user.id)}
                                  className="text-yellow-600 hover:text-yellow-800 font-medium"
                                >
                                  {t('admin.suspend')}
                                </button>
                              )}
                              {user.role !== 'admin' && (
                                <button 
                                  onClick={() => handleUserAction('delete', user.id)}
                                  className="text-red-600 hover:text-red-800 font-medium"
                                >
                                  {t('admin.delete')}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* System Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">{t('admin.systemConfig')}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">{t('admin.pricingManagement')}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">{t('admin.baseValuationFee')}</h5>
                          <input type="number" defaultValue="150" className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">{t('admin.insuranceAppraisalFee')}</h5>
                          <input type="number" defaultValue="400" className="w-full px-3 py-2 border rounded-md" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">{t('admin.turnaroundSettings')}</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">{t('admin.standardDays')}</h5>
                          <input type="number" defaultValue="5" className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">{t('admin.expressDays')}</h5>
                          <input type="number" defaultValue="2" className="w-full px-3 py-2 border rounded-md" />
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h5 className="font-medium mb-2">{t('admin.emergencyHours')}</h5>
                          <input type="number" defaultValue="24" className="w-full px-3 py-2 border rounded-md" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">{t('admin.emailNotifications')}</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="text-luxury-gold focus:ring-luxury-gold" />
                          <span className="ml-2">{t('admin.sendOrderConfirmations')}</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="text-luxury-gold focus:ring-luxury-gold" />
                          <span className="ml-2">{t('admin.sendValuationUpdates')}</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" defaultChecked className="text-luxury-gold focus:ring-luxury-gold" />
                          <span className="ml-2">{t('admin.sendMarketingEmails')}</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <button 
                        onClick={() => handleSettingsUpdate({ 
                          valuationFee: 150, 
                          insuranceFee: 400, 
                          standardTurnaround: 5 
                        })}
                        className="btn btn-primary"
                      >
                        {t('admin.saveSettings')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Valuations Management Tab */}
            {activeTab === 'valuations' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-bold">{t('admin.valuationmangement')}</h3>
                    <button 
                      onClick={() => handleValuationAction('add')}
                      className="btn btn-primary"
                    >
                      New Valuation Request
                    </button>
                  </div>

                  {/* Valuation Statistics */}
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800">{t('admin.valuationPending')}</h4>
                      <p className="text-2xl font-bold text-blue-900">{valuationStats.pending}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800">{t('admin.valuationInProgress')}</h4>
                      <p className="text-2xl font-bold text-yellow-900">{valuationStats.inProgress}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800">{t('admin.valuationCompleted')}</h4>
                      <p className="text-2xl font-bold text-green-900">{valuationStats.completed}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800">{t('admin.valuationOverdue')}</h4>
                      <p className="text-2xl font-bold text-red-900">{valuationStats.overdue}</p>
                    </div>
                  </div>

                  {/* Valuations Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">ID</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Customer</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Assigned To</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Due Date</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {valuations.map((valuation) => (
                          <tr key={valuation.id}>
                            <td className="px-4 py-3 font-medium">{valuation.id}</td>
                            <td className="px-4 py-3">{valuation.customer}</td>
                            <td className="px-4 py-3">{valuation.type}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                valuation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                valuation.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                valuation.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {valuation.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </td>
                            <td className="px-4 py-3">{valuation.assignedTo}</td>
                            <td className="px-4 py-3">{valuation.dueDate}</td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleValuationAction('reassign', valuation.id)}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={() => handleValuationAction('reassign', valuation.id)}
                                  className="text-green-600 hover:text-green-800 font-medium"
                                >
                                  Reassign
                                </button>
                                {valuation.status !== 'completed' && (
                                  <button 
                                    onClick={() => handleValuationAction('complete', valuation.id)}
                                    className="text-purple-600 hover:text-purple-800 font-medium"
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders Management Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-bold">{t('admin.ordermanager')}</h3>
                    <div className="flex space-x-3">
                      <select className="px-3 py-2 border rounded-md">
                        <option>All Orders</option>
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                      </select>
                      <button 
                        onClick={() => handleOrderAction('export')}
                        className="btn btn-secondary"
                      >
                        Export
                      </button>
                    </div>
                  </div>

                  {/* Order Statistics */}
                  <div className="grid md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800">{t('admin.neworders')}</h4>
                      <p className="text-2xl font-bold text-blue-900">{orderStats.newOrders}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800">{t('admin.processing')}</h4>
                      <p className="text-2xl font-bold text-yellow-900">{orderStats.processing}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800">{t('admin.shipped')}</h4>
                      <p className="text-2xl font-bold text-purple-900">{orderStats.shipped}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800">{t('admin.delivered')}</h4>
                      <p className="text-2xl font-bold text-green-900">{orderStats.delivered}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800">{t('admin.totalrevenue')}</h4>
                      <p className="text-2xl font-bold text-gray-900">${(orderStats.totalRevenue / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Order ID</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Customer</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Items</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Total</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-4 py-3 font-medium">{order.id}</td>
                            <td className="px-4 py-3">{order.customer}</td>
                            <td className="px-4 py-3">{order.items} items</td>
                            <td className="px-4 py-3 font-bold">${order.total.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">{order.date}</td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleOrderAction('view', order.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={() => handleOrderAction('update_status', order.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  Update
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Products Management Tab */}
            {activeTab === 'products' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-bold">{t('admin.productManagement')}</h3>
                    <div className="flex space-x-3">
                      {/* <button className="btn btn-secondary">Import Products</button> */}
                      <button 
                        onClick={() => handleProductAction('add')}
                        className="btn btn-primary"
                      >
                        Add New Product
                      </button>
                    </div>
                  </div>

                  {/* Product Statistics */}
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800">{t('admin.totalProduct')}</h4>
                      <p className="text-2xl font-bold text-blue-900">{productStats.total}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800">{t('admin.inStock')}</h4>
                      <p className="text-2xl font-bold text-green-900">{productStats.inStock}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800">{t('admin.lowStock')}</h4>
                      <p className="text-2xl font-bold text-yellow-900">{productStats.lowStock}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-red-800">{t('admin.outOfStock')}</h4>
                      <p className="text-2xl font-bold text-red-900">{productStats.outOfStock}</p>
                    </div>
                  </div>

                  {/* Product Filters */}
                  <div className="flex space-x-3 mb-6">
                    <select className="px-3 py-2 border rounded-md">
                      <option>All Categories</option>
                      <option>Rings</option>
                      <option>Necklaces</option>
                      <option>Earrings</option>
                      <option>Bracelets</option>
                    </select>
                    <select className="px-3 py-2 border rounded-md">
                      <option>All Statuses</option>
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Archived</option>
                    </select>
                    <input type="search" placeholder={t('placeholder.searchProducts')} className="px-3 py-2 border rounded-md" />
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Product</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">SKU</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Price</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Stock</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <img src={product.image} alt="" className="w-10 h-10 rounded" />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-gray-500">{product.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">{product.sku}</td>
                            <td className="px-4 py-3">{product.category}</td>
                            <td className="px-4 py-3 font-bold">${product.price.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <span className={`font-bold ${
                                product.stock === 0 ? 'text-red-600' :
                                product.stock <= 5 ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                                {product.stock}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                                product.status === 'active' ? 'bg-green-100 text-green-800' :
                                product.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {product.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleProductAction('edit', product.id)}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  Edit
                                </button>
                                {product.status === 'active' ? (
                                  <button 
                                    onClick={() => handleProductAction('archive', product.id)}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                  >
                                    Archive
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleProductAction('activate', product.id)}
                                    className="text-green-600 hover:text-green-800 font-medium"
                                  >
                                    Activate
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Staff Management Tab */}
            {activeTab === 'staff' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-bold">{t('admin.staffManagement')}</h3>
                    <button 
                      onClick={() => handleStaffAction('add')}
                      className="btn btn-primary"
                    >
                      {t('admin.addNewStaff')}
                    </button>
                  </div>

                  {/* Staff Statistics */}
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800">{t('admin.consultingStaff')}</h4>
                      <p className="text-2xl font-bold text-blue-900">{staff.filter(s => s.role === 'consulting_staff').length}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-800">{t('admin.valuationStaff')}</h4>
                      <p className="text-2xl font-bold text-purple-900">{staff.filter(s => s.role === 'valuation_staff').length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800">{t('admin.managers')}</h4>
                      <p className="text-2xl font-bold text-green-900">{staff.filter(s => s.role === 'manager').length}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800">{t('admin.totalStaff')}</h4>
                      <p className="text-2xl font-bold text-yellow-900">{staff.length}</p>
                    </div>
                  </div>

                  {/* Performance Overview */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Top Performers This Month</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Dr. Emma Wilson</span>
                          <span className="font-bold text-green-600">98.5%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>James Rodriguez</span>
                          <span className="font-bold text-green-600">95.2%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Sarah Johnson</span>
                          <span className="font-bold text-green-600">94.8%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Workload Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Consulting Team</span>
                          <span className="font-bold">78 active cases</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Valuation Team</span>
                          <span className="font-bold">45 active cases</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Average Load</span>
                          <span className="font-bold">5.2 cases/staff</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Staff Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Staff Member</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Role</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Department</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Active Cases</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Performance</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {staff.map((staffMember) => (
                          <tr key={staffMember.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-3">
                                <img src={staffMember.avatar} alt="" className="w-8 h-8 rounded-full" />
                                <div>
                                  <p className="font-medium">{staffMember.name}</p>
                                  <p className="text-gray-500">{staffMember.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                staffMember.role === 'valuation_staff' ? 'bg-purple-100 text-purple-800' :
                                staffMember.role === 'consulting_staff' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {staffMember.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </td>
                            <td className="px-4 py-3">{staffMember.department}</td>
                            <td className="px-4 py-3 font-bold">{staffMember.activeCases}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <span className="text-green-600 font-bold">{staffMember.performance}%</span>
                                {staffMember.performance >= 95 && <span className="ml-2 text-yellow-600">⭐</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                staffMember.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {staffMember.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleStaffAction('view', staffMember.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  View
                                </button>
                                <button 
                                  onClick={() => handleStaffAction('schedule', staffMember.id)}
                                  className="text-yellow-600 hover:text-yellow-800"
                                >
                                  Schedule
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">{t('admin.businessAnalytics')}</h3>
                  
                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                      <h4 className="font-medium opacity-90">{t('admin.monthlyRevenu')}</h4>
                      <p className="text-3xl font-bold">$342,890</p>
                      <p className="text-sm opacity-75">↗ +12.5% from last month</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                      <h4 className="font-medium opacity-90">{t('admin.newCustomers')}</h4>
                      <p className="text-3xl font-bold">284</p>
                      <p className="text-sm opacity-75">↗ +8.3% from last month</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                      <h4 className="font-medium opacity-90">{t('admin.conversionRate')}</h4>
                      <p className="text-3xl font-bold">18.2%</p>
                      <p className="text-sm opacity-75">↗ +2.1% from last month</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
                      <h4 className="font-medium opacity-90">{t('admin.avgOrderValue')}</h4>
                      <p className="text-3xl font-bold">$1,847</p>
                      <p className="text-sm opacity-75">↗ +5.7% from last month</p>
                    </div>
                  </div>

                  {/* Charts and Graphs */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-4">{t('admin.revenuTrend')} </h4>
                      <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                        <p className="text-gray-500">{t('placeholder.revenueChart')}</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-4">{t('admin.customerAcquisition')}</h4>
                      <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                        <p className="text-gray-500">{t('placeholder.customerChart')}</p>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-4">{t('admin.productPerformance')}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>{t('admin.engagementRings')}</span>
                          <span className="font-bold">45%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-luxury-gold h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('admin.necklaces')}</span>
                          <span className="font-bold">28%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-luxury-gold h-2 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('admin.earrings')}</span>
                          <span className="font-bold">18%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-luxury-gold h-2 rounded-full" style={{ width: '18%' }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-4">{t('admin.serviceUsage')}</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>{t('admin.valuationServices')}</span>
                          <span className="font-bold text-blue-600">342 requests</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('admin.consultationCalls')}</span>
                          <span className="font-bold text-green-600">156 calls</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('admin.onlineStoreOrders')}</span>
                          <span className="font-bold text-purple-600">89 orders</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Add more tabs as needed... */}
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Operations */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {modalType === 'user' && (selectedItem ? 'Edit User' : 'Add New User')}
                {modalType === 'product' && (selectedItem ? 'Edit Product' : 'Add New Product')}
                {modalType === 'valuation' && 'Reassign Valuation'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {modalType === 'user' && (
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select 
                      name="role"
                      value={formData.role || 'customer'}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    >
                      <option value="customer">Customer</option>
                      <option value="consulting_staff">Consulting Staff</option>
                      <option value="valuation_staff">Valuation Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  {!selectedItem && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input 
                        type="password" 
                        name="password"
                        value={formData.password || ''}
                        onChange={handleInputChange}
                        className="mt-1 w-full px-3 py-2 border rounded-md" 
                        required 
                      />
                    </div>
                  )}
                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="btn btn-primary flex-1">
                      {selectedItem ? 'Update' : 'Create'} User
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {modalType === 'product' && (
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input 
                      type="text" 
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                    <input 
                      type="text" 
                      name="sku"
                      value={formData.sku || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select 
                      name="category"
                      value={formData.category || 'rings'}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    >
                      <option value="rings">Rings</option>
                      <option value="necklaces">Necklaces</option>
                      <option value="earrings">Earrings</option>
                      <option value="bracelets">Bracelets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input 
                      type="number" 
                      name="stock"
                      value={formData.stock || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="btn btn-primary flex-1">
                      {selectedItem ? 'Update' : 'Create'} Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {modalType === 'valuation' && (
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  {!selectedItem && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input 
                          type="text" 
                          name="customer"
                          value={formData.customer || ''}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border rounded-md" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Valuation Type</label>
                        <select 
                          name="type"
                          value={formData.type || 'Insurance Appraisal'}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border rounded-md"
                        >
                          <option value="Insurance Appraisal">Insurance Appraisal</option>
                          <option value="Market Valuation">Market Valuation</option>
                          <option value="Estate Valuation">Estate Valuation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input 
                          type="date" 
                          name="dueDate"
                          value={formData.dueDate || ''}
                          onChange={handleInputChange}
                          className="mt-1 w-full px-3 py-2 border rounded-md" 
                          required 
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assign To Staff</label>
                    <select 
                      name="assignedTo"
                      value={formData.assignedTo || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Select Staff Member</option>
                      <option value="Dr. Emma Wilson">Dr. Emma Wilson (Valuation)</option>
                      <option value="James Rodriguez">James Rodriguez (Valuation)</option>
                      <option value="Sarah Johnson">Sarah Johnson (Consulting)</option>
                      <option value="Mike Chen">Mike Chen (Consulting)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select 
                      name="priority"
                      value={formData.priority || 'normal'}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea 
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="btn btn-primary flex-1">
                      {selectedItem ? 'Reassign' : 'Create'} Valuation
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}

            {modalType === 'staff' && (
              <form onSubmit={handleFormSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select 
                      name="role"
                      value={formData.role || 'consulting_staff'}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    >
                      <option value="consulting_staff">Consulting Staff</option>
                      <option value="valuation_staff">Valuation Staff</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input 
                      type="text" 
                      name="department"
                      value={formData.department || ''}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border rounded-md" 
                      required 
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button type="submit" className="btn btn-primary flex-1">
                      {selectedItem ? 'Update' : 'Add'} Staff
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
