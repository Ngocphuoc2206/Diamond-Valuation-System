import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { valuationRequests, products } from '../data/mockData';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Mock user data
  const userValuations = valuationRequests.slice(0, 3);
  const userOrders = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      items: 2,
      total: 15000,
      status: 'delivered'
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      items: 1,
      total: 8500,
      status: 'shipped'
    }
  ];

  const userFavorites = products.slice(0, 4);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'valuations', label: 'Valuations', icon: '💎' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-luxury-navy text-white py-12">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
                Welcome back, <span className="text-luxury-gold">{user?.name}</span>
              </h1>
              <p className="text-lg text-gray-300">
                Manage your account, orders, and valuations
              </p>
            </div>
            <div className="hidden md:block">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=100&h=100&fit=crop&crop=face'}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-4 border-luxury-gold"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-4 gap-8">
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
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
                <hr className="my-4" />
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-3 rounded-md text-red-600 hover:bg-red-50 flex items-center space-x-3"
                >
                  <span className="text-lg">🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-luxury-navy">{userOrders.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-full">
                        <span className="text-2xl">💎</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Valuations</p>
                        <p className="text-2xl font-bold text-luxury-navy">{userValuations.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <span className="text-2xl">❤️</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Favorites</p>
                        <p className="text-2xl font-bold text-luxury-navy">{userFavorites.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">📦</span>
                        <div>
                          <p className="font-medium">Order #{userOrders[0].id} delivered</p>
                          <p className="text-sm text-gray-600">January 15, 2024</p>
                        </div>
                      </div>
                      <span className="text-green-600 font-medium">Completed</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">💎</span>
                        <div>
                          <p className="font-medium">Valuation request submitted</p>
                          <p className="text-sm text-gray-600">January 12, 2024</p>
                        </div>
                      </div>
                      <span className="text-yellow-600 font-medium">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">👤</span>
                        <div>
                          <p className="font-medium">Profile updated</p>
                          <p className="text-sm text-gray-600">January 8, 2024</p>
                        </div>
                      </div>
                      <span className="text-gray-600 font-medium">Completed</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">Quick Actions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Link
                      to="/valuation"
                      className="flex items-center space-x-3 p-4 border border-luxury-gold rounded-lg hover:bg-luxury-gold hover:text-white transition-colors"
                    >
                      <span className="text-2xl">💎</span>
                      <div>
                        <p className="font-medium">New Valuation</p>
                        <p className="text-sm opacity-75">Get your diamond valued</p>
                      </div>
                    </Link>
                    <Link
                      to="/shop"
                      className="flex items-center space-x-3 p-4 border border-luxury-navy rounded-lg hover:bg-luxury-navy hover:text-white transition-colors"
                    >
                      <span className="text-2xl">🛍️</span>
                      <div>
                        <p className="font-medium">Browse Shop</p>
                        <p className="text-sm opacity-75">Explore our collection</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-serif font-bold mb-6">Order History</h3>
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold">Order #{order.id}</h4>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {order.items} item{order.items > 1 ? 's' : ''}
                        </span>
                        <span className="font-bold text-luxury-gold">
                          ${order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Valuations Tab */}
            {activeTab === 'valuations' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-bold">Valuation Requests</h3>
                  <Link to="/valuation" className="btn btn-primary">
                    New Valuation
                  </Link>
                </div>
                <div className="space-y-4">
                  {userValuations.map((valuation) => (
                    <div key={valuation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold">#{valuation.id}</h4>
                          <p className="text-sm text-gray-600">{valuation.createdAt}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          valuation.status === 'completed' ? 'bg-green-100 text-green-800' :
                          valuation.status === 'in_valuation' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {valuation.status.replace('_', ' ').charAt(0).toUpperCase() + valuation.status.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {valuation.diamondDetails.shape} diamond, {valuation.diamondDetails.caratWeight} carats
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-serif font-bold mb-6">Favorite Items</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {userFavorites.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-md mb-3"
                      />
                      <h4 className="font-bold mb-2">{product.name}</h4>
                      <p className="text-luxury-gold font-bold mb-3">
                        ${product.price.toLocaleString()}
                      </p>
                      <div className="flex space-x-2">
                        <Link
                          to={`/shop/product/${product.id}`}
                          className="btn btn-primary text-sm flex-1"
                        >
                          View
                        </Link>
                        <button className="btn btn-secondary text-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-serif font-bold mb-6">Profile Settings</h3>
                <form className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b1ac?w=100&h=100&fit=crop&crop=face'}
                      alt={user?.name}
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <button className="btn btn-secondary">Change Photo</button>
                      <p className="text-sm text-gray-600 mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Add phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button className="btn btn-primary">
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
