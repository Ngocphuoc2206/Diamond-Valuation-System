import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface CustomerValuationRequest {
  id: string;
  submittedDate: string;
  status: 'submitted' | 'consultant_assigned' | 'customer_contacted' | 'receipt_created' | 'valuation_assigned' | 'valuation_in_progress' | 'valuation_completed' | 'consultant_review' | 'results_sent' | 'customer_received' | 'completed';
  diamondType: string;
  caratWeight: string;
  estimatedValue?: string;
  actualValue?: string;
  consultantName?: string;
  lastUpdate: string;
  notes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  receiptNumber?: string;
  results?: {
    marketValue: number;
    insuranceValue: number;
    retailValue: number;
    certificationDetails: string;
    condition: string;
    report?: string;
  };
}

interface CustomerNotification {
  id: string;
  date: string;
  type: 'status_update' | 'message' | 'results_ready' | 'appointment';
  title: string;
  message: string;
  read: boolean;
  actionRequired?: boolean;
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState<CustomerValuationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNotification, setShowNotification] = useState('');

  // Mock data for customer valuation requests
  const [customerRequests, setCustomerRequests] = useState<CustomerValuationRequest[]>([
    {
      id: 'VAL-2024-0123',
      submittedDate: '2024-01-15',
      status: 'valuation_completed',
      diamondType: 'Round Brilliant Cut',
      caratWeight: '2.5ct',
      estimatedValue: '$15,000',
      actualValue: '$18,500',
      consultantName: 'Sarah Johnson',
      lastUpdate: '2024-01-22',
      notes: 'Insurance appraisal completed. Results ready for download.',
      priority: 'high',
      receiptNumber: 'RCP-2024-0123',
      results: {
        marketValue: 17500,
        insuranceValue: 18500,
        retailValue: 19800,
        certificationDetails: 'GIA Certified - Excellent Cut, VS1 Clarity, G Color',
        condition: 'Excellent',
        report: 'Professional valuation report with detailed analysis and certification verification.'
      }
    },
    {
      id: 'VAL-2024-0156',
      submittedDate: '2024-01-20',
      status: 'customer_contacted',
      diamondType: 'Emerald Cut',
      caratWeight: '3.2ct',
      estimatedValue: '$22,000',
      consultantName: 'Mike Chen',
      lastUpdate: '2024-01-21',
      notes: 'Consultant will contact you within 24 hours to schedule inspection.',
      priority: 'normal',
      receiptNumber: 'RCP-2024-0156'
    },
    {
      id: 'VAL-2024-0167',
      submittedDate: '2024-01-25',
      status: 'submitted',
      diamondType: 'Princess Cut',
      caratWeight: '1.8ct',
      estimatedValue: '$8,500',
      lastUpdate: '2024-01-25',
      notes: 'Request received. A consultant will be assigned shortly.',
      priority: 'normal'
    }
  ]);

  const [notifications, setNotifications] = useState<CustomerNotification[]>([
    {
      id: 'not-001',
      date: '2024-01-22',
      type: 'results_ready',
      title: 'Valuation Complete - VAL-2024-0123',
      message: 'Your diamond valuation is complete! Results are now available for download.',
      read: false,
      actionRequired: true
    },
    {
      id: 'not-002',
      date: '2024-01-21',
      type: 'status_update',
      title: 'Consultant Assigned - VAL-2024-0156',
      message: 'Mike Chen has been assigned as your consultant and will contact you within 24 hours.',
      read: true
    },
    {
      id: 'not-003',
      date: '2024-01-25',
      type: 'status_update',
      title: 'Request Received - VAL-2024-0167',
      message: 'We have received your valuation request and it is being processed.',
      read: true
    }
  ]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'consultant_assigned': return 'bg-purple-100 text-purple-800';
      case 'customer_contacted': return 'bg-indigo-100 text-indigo-800';
      case 'receipt_created': return 'bg-green-100 text-green-800';
      case 'valuation_assigned': return 'bg-yellow-100 text-yellow-800';
      case 'valuation_in_progress': return 'bg-orange-100 text-orange-800';
      case 'valuation_completed': return 'bg-emerald-100 text-emerald-800';
      case 'results_sent': return 'bg-teal-100 text-teal-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return 'Request Submitted';
      case 'consultant_assigned': return 'Consultant Assigned';
      case 'customer_contacted': return 'Consultant Contacted';
      case 'receipt_created': return 'Diamond Received';
      case 'valuation_assigned': return 'Valuation Assigned';
      case 'valuation_in_progress': return 'Valuation in Progress';
      case 'valuation_completed': return 'Valuation Complete';
      case 'results_sent': return 'Results Available';
      case 'completed': return 'Process Complete';
      default: return 'Unknown Status';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'normal': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressPercentage = (status: string) => {
    const statusProgress = {
      'submitted': 10,
      'consultant_assigned': 20,
      'customer_contacted': 30,
      'receipt_created': 40,
      'valuation_assigned': 50,
      'valuation_in_progress': 70,
      'valuation_completed': 85,
      'results_sent': 95,
      'completed': 100
    };
    return statusProgress[status as keyof typeof statusProgress] || 0;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'valuations', label: 'My Valuations', icon: '💎' },
    { id: 'notifications', label: `Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`, icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const notify = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {showNotification}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">Customer Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/valuation')}
                  className="btn btn-primary"
                >
                  New Valuation Request
                </button>
                <button 
                  onClick={() => navigate('/communication')}
                  className="btn btn-secondary"
                >
                  Messages
                </button>
                <div className="relative">
                  <span className="text-2xl">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-luxury-gold text-luxury-gold'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Requests</p>
                    <p className="text-2xl font-bold text-gray-900">{customerRequests.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {customerRequests.filter(r => !['completed', 'results_sent'].includes(r.status)).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {customerRequests.filter(r => ['completed', 'results_sent', 'valuation_completed'].includes(r.status)).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Value</p>
                    <p className="text-2xl font-bold text-luxury-gold">
                      ${customerRequests.reduce((sum, r) => sum + (parseFloat(r.actualValue?.replace(/[,$]/g, '') || r.estimatedValue?.replace(/[,$]/g, '') || '0')), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {customerRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">💎</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{request.diamondType} - {request.caratWeight}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Last updated: {request.lastUpdate}</p>
                        {request.notes && (
                          <p className="text-sm text-gray-500 mt-1">{request.notes}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsModalOpen(true);
                          }}
                          className="text-luxury-gold hover:text-luxury-navy text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* My Valuations Tab */}
        {activeTab === 'valuations' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Valuation Requests</h3>
                <button 
                  onClick={() => navigate('/valuation')}
                  className="btn btn-primary"
                >
                  New Request
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consultant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customerRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.id}</div>
                            <div className="text-sm text-gray-500">{request.diamondType} - {request.caratWeight}</div>
                            <div className="text-xs text-gray-400">Submitted: {request.submittedDate}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                          <div className={`text-xs mt-1 px-2 py-1 rounded ${getPriorityColor(request.priority)}`}>
                            {request.priority.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-luxury-gold h-2 rounded-full transition-all duration-500"
                              style={{ width: `${getProgressPercentage(request.status)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{getProgressPercentage(request.status)}% Complete</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.consultantName || 'Not Assigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.actualValue || request.estimatedValue || 'TBD'}
                          </div>
                          {request.actualValue && request.estimatedValue !== request.actualValue && (
                            <div className="text-xs text-gray-500">Est: {request.estimatedValue}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setIsModalOpen(true);
                            }}
                            className="text-luxury-gold hover:text-luxury-navy"
                          >
                            View
                          </button>
                          {request.status === 'valuation_completed' && (
                            <button
                              onClick={() => notify('Certificate downloaded successfully!')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-6 ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-400' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          {notification.actionRequired && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              Action Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Mark as Read
                          </button>
                        )}
                        {notification.type === 'results_ready' && (
                          <button
                            onClick={() => notify('Results viewed successfully!')}
                            className="btn btn-primary btn-sm"
                          >
                            View Results
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold">
                    <option>Email</option>
                    <option>Phone</option>
                    <option>Text Message</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <button 
                  onClick={() => notify('Profile updated successfully!')}
                  className="btn btn-primary"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Valuation Details Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Valuation Details - {selectedRequest.id}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Status and Progress */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Current Status</h4>
                  <div className="space-y-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusText(selectedRequest.status)}
                    </span>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-luxury-gold h-3 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(selectedRequest.status)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{getProgressPercentage(selectedRequest.status)}% Complete</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Request Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Submitted:</strong> {selectedRequest.submittedDate}</p>
                    <p><strong>Last Update:</strong> {selectedRequest.lastUpdate}</p>
                    <p><strong>Consultant:</strong> {selectedRequest.consultantName || 'Not assigned'}</p>
                    <p><strong>Receipt #:</strong> {selectedRequest.receiptNumber || 'Not generated'}</p>
                  </div>
                </div>
              </div>

              {/* Diamond Details */}
              <div>
                <h4 className="font-medium mb-3">Diamond Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <p><strong>Type:</strong> {selectedRequest.diamondType}</p>
                    <p><strong>Carat Weight:</strong> {selectedRequest.caratWeight}</p>
                    <p><strong>Priority:</strong> <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(selectedRequest.priority)}`}>{selectedRequest.priority.toUpperCase()}</span></p>
                  </div>
                </div>
              </div>

              {/* Valuation Results */}
              {selectedRequest.results && (
                <div>
                  <h4 className="font-medium mb-3">Valuation Results</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <p><strong>Market Value:</strong> ${selectedRequest.results.marketValue.toLocaleString()}</p>
                      <p><strong>Insurance Value:</strong> ${selectedRequest.results.insuranceValue.toLocaleString()}</p>
                      <p><strong>Retail Value:</strong> ${selectedRequest.results.retailValue.toLocaleString()}</p>
                      <p><strong>Condition:</strong> {selectedRequest.results.condition}</p>
                      <p className="md:col-span-2"><strong>Certification:</strong> {selectedRequest.results.certificationDetails}</p>
                    </div>
                    {selectedRequest.results.report && (
                      <div className="mt-4">
                        <p className="text-sm"><strong>Report:</strong> {selectedRequest.results.report}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedRequest.notes && (
                <div>
                  <h4 className="font-medium mb-3">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{selectedRequest.notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {selectedRequest.status === 'valuation_completed' && (
                  <>
                    <button 
                      onClick={() => {
                        notify('Certificate downloaded successfully!');
                        setIsModalOpen(false);
                      }}
                      className="btn btn-primary"
                    >
                      Download Certificate
                    </button>
                    <button 
                      onClick={() => {
                        notify('Report downloaded successfully!');
                        setIsModalOpen(false);
                      }}
                      className="btn btn-secondary"
                    >
                      Download Report
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
