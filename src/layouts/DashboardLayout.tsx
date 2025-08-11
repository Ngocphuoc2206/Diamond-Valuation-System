import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

type NavItem = {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  allowedRoles: string[];
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, allowedRoles: ['customer', 'consulting_staff', 'valuation_staff', 'manager', 'admin'] },
  { name: 'Valuation Requests', href: '/dashboard/valuations', icon: ClipboardDocumentListIcon, allowedRoles: ['customer', 'consulting_staff', 'valuation_staff', 'manager', 'admin'] },
  { name: 'Products', href: '/dashboard/products', icon: ShoppingBagIcon, allowedRoles: ['manager', 'admin'] },
  { name: 'Content', href: '/dashboard/content', icon: NewspaperIcon, allowedRoles: ['admin'] },
  { name: 'Users', href: '/dashboard/users', icon: UserGroupIcon, allowedRoles: ['admin'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, allowedRoles: ['manager', 'admin'] },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, allowedRoles: ['customer', 'consulting_staff', 'valuation_staff', 'manager', 'admin'] },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Filter navigation items based on user role
  const filteredNav = navigation.filter(item => 
    user && item.allowedRoles.includes(user.role)
  );
  
  // Check if the current route is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Mock notifications
  const notifications = [
    { id: 1, text: 'New valuation request submitted', time: '5 minutes ago', unread: true },
    { id: 2, text: 'Your valuation certificate is ready', time: '1 hour ago', unread: true },
    { id: 3, text: 'Staff meeting scheduled for tomorrow', time: '3 hours ago', unread: false },
    { id: 4, text: 'New blog post published: Diamond Care Tips', time: 'Yesterday', unread: false },
  ];

  // Get role-specific title
  const getRoleTitle = () => {
    if (!user) return '';
    
    switch (user.role) {
      case 'customer':
        return 'Customer Portal';
      case 'consulting_staff':
        return 'Consulting Staff Portal';
      case 'valuation_staff':
        return 'Valuation Staff Portal';
      case 'manager':
        return 'Management Portal';
      case 'admin':
        return 'Administration Portal';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex w-full flex-col max-w-xs bg-luxury-navy">
            <div className="flex justify-between items-center h-16 px-4 bg-gray-900">
              <span className="font-serif text-xl font-bold text-white">
                Diamond <span className="text-luxury-gold">Dashboard</span>
              </span>
              <button
                type="button"
                className="text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-4">
              <nav className="space-y-1">
                {filteredNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.href)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isActive(item.href) ? 'text-luxury-gold' : 'text-gray-400 group-hover:text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t border-gray-700 p-4">
              <div className="flex items-center">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-3 flex items-center text-sm text-gray-400 hover:text-white w-full"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-luxury-navy">
        <div className="flex justify-center items-center h-16 bg-gray-900">
          <span className="font-serif text-xl font-bold text-white">
            Diamond <span className="text-luxury-gold">Dashboard</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <nav className="space-y-1">
            {filteredNav.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 ${
                    isActive(item.href) ? 'text-luxury-gold' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full"
              />
            )}
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-3 flex items-center text-sm text-gray-400 hover:text-white w-full"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            Sign out
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <h1 className="ml-3 lg:ml-0 text-xl font-medium text-gray-900">{getRoleTitle()}</h1>
            </div>
            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative mr-4">
                <button
                  type="button"
                  className="flex rounded-full bg-white text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-luxury-gold text-[10px] font-medium text-white">
                    2
                  </span>
                </button>
                
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-2 divide-y divide-gray-100">
                      <div className="flex justify-between items-center px-4 py-2">
                        <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                        <button className="text-xs text-luxury-gold hover:text-luxury-navy">
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}
                          >
                            <p className="text-sm text-gray-800">{notification.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2">
                        <Link 
                          to="/dashboard/notifications" 
                          className="text-sm text-luxury-gold hover:text-luxury-navy flex justify-center"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Back to main site */}
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-luxury-gold">
                <HomeIcon className="h-5 w-5 mr-1" />
                Main Site
              </Link>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
