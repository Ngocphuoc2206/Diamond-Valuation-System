import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Enhanced workflow states for complete valuation process
type ValuationWorkflowStatus = 
  | 'new_request'           // Customer submits request
  | 'consultant_assigned'   // System assigns to consultant
  | 'customer_contacted'    // Consultant contacts customer
  | 'receipt_created'       // Consultant creates valuation receipt
  | 'valuation_assigned'    // Assigned to valuation staff
  | 'valuation_in_progress' // Valuation staff working
  | 'valuation_completed'   // Valuation staff finished
  | 'consultant_review'     // Back to consultant for review
  | 'results_sent'          // Consultant sends results to customer
  | 'completed'             // Process complete
  | 'on_hold'               // Waiting for customer response
  | 'cancelled';            // Process cancelled

interface ValuationRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  submittedDate: string;
  status: ValuationWorkflowStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  diamondType: string;
  caratWeight: string;
  estimatedValue: string;
  assignedConsultant?: string;
  assignedValuer?: string;
  notes: string;
  customerNotes?: string;
  consultantNotes?: string;
  valuationNotes?: string;
  receiptNumber?: string;
  valuationResults?: {
    marketValue: number;
    insuranceValue: number;
    retailValue: number;
    condition: string;
    certificationDetails: string;
    photos: string[];
  };
  communicationLog: {
    date: string;
    type: 'email' | 'phone' | 'meeting' | 'system';
    from: string;
    message: string;
  }[];
  timeline: {
    date: string;
    status: ValuationWorkflowStatus;
    user: string;
    notes?: string;
  }[];
}

// Mock comprehensive valuation requests with full workflow
const mockValuationRequests: ValuationRequest[] = [
  {
    id: 'VAL-2024-0123',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '+1-555-0123',
    submittedDate: '2024-01-15',
    status: 'new_request',
    priority: 'high',
    diamondType: 'Round Brilliant Cut',
    caratWeight: '2.5',
    estimatedValue: '$15,000',
    notes: 'Customer mentioned insurance claim urgency. Inherited diamond from grandmother.',
    customerNotes: 'This is my grandmother\'s engagement ring. I need it appraised for insurance purposes.',
    communicationLog: [
      {
        date: '2024-01-15',
        type: 'system',
        from: 'System',
        message: 'Valuation request submitted by customer'
      }
    ],
    timeline: [
      {
        date: '2024-01-15',
        status: 'new_request',
        user: 'John Doe',
        notes: 'Initial request submitted'
      }
    ]
  },
  {
    id: 'VAL-2024-0124',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@email.com',
    customerPhone: '+1-555-0124',
    submittedDate: '2024-01-16',
    status: 'customer_contacted',
    priority: 'normal',
    diamondType: 'Princess Cut',
    caratWeight: '1.8',
    estimatedValue: '$8,500',
    assignedConsultant: 'Sarah Johnson',
    notes: 'Standard appraisal request for engagement ring purchase',
    customerNotes: 'Recently purchased, need official valuation for insurance.',
    consultantNotes: 'Customer contacted via phone. Appointment scheduled for diamond inspection.',
    communicationLog: [
      {
        date: '2024-01-16',
        type: 'system',
        from: 'System',
        message: 'Valuation request submitted by customer'
      },
      {
        date: '2024-01-16',
        type: 'phone',
        from: 'Sarah Johnson',
        message: 'Initial contact made. Customer very responsive, appointment scheduled for Jan 18th.'
      }
    ],
    timeline: [
      {
        date: '2024-01-16',
        status: 'new_request',
        user: 'Jane Smith',
        notes: 'Initial request submitted'
      },
      {
        date: '2024-01-16',
        status: 'consultant_assigned',
        user: 'System',
        notes: 'Assigned to Sarah Johnson'
      },
      {
        date: '2024-01-16',
        status: 'customer_contacted',
        user: 'Sarah Johnson',
        notes: 'Customer contacted successfully, appointment scheduled'
      }
    ]
  },
  {
    id: 'VAL-2024-0125',
    customerName: 'Robert Wilson',
    customerEmail: 'robert.w@email.com',
    customerPhone: '+1-555-0125',
    submittedDate: '2024-01-14',
    status: 'valuation_in_progress',
    priority: 'normal',
    diamondType: 'Emerald Cut',
    caratWeight: '3.2',
    estimatedValue: '$22,000',
    assignedConsultant: 'Mike Chen',
    assignedValuer: 'Dr. Emma Wilson',
    receiptNumber: 'RCP-2024-0125',
    notes: 'Complex vintage piece requiring expert analysis',
    customerNotes: 'Family heirloom from 1950s, very sentimental value.',
    consultantNotes: 'Receipt created, diamond received and secured. Customer very knowledgeable about piece history.',
    valuationNotes: 'Exceptional vintage cut with unique characteristics. Requires careful analysis of period cutting techniques.',
    communicationLog: [
      {
        date: '2024-01-14',
        type: 'system',
        from: 'System',
        message: 'Valuation request submitted by customer'
      },
      {
        date: '2024-01-14',
        type: 'email',
        from: 'Mike Chen',
        message: 'Initial contact email sent with process overview'
      },
      {
        date: '2024-01-15',
        type: 'meeting',
        from: 'Mike Chen',
        message: 'In-person consultation completed. Diamond received and receipt issued.'
      },
      {
        date: '2024-01-16',
        type: 'system',
        from: 'Dr. Emma Wilson',
        message: 'Valuation process initiated. Initial examination completed.'
      }
    ],
    timeline: [
      {
        date: '2024-01-14',
        status: 'new_request',
        user: 'Robert Wilson',
        notes: 'Initial request submitted'
      },
      {
        date: '2024-01-14',
        status: 'consultant_assigned',
        user: 'System',
        notes: 'Assigned to Mike Chen'
      },
      {
        date: '2024-01-14',
        status: 'customer_contacted',
        user: 'Mike Chen',
        notes: 'Customer contacted via email'
      },
      {
        date: '2024-01-15',
        status: 'receipt_created',
        user: 'Mike Chen',
        notes: 'Diamond received, receipt RCP-2024-0125 created'
      },
      {
        date: '2024-01-15',
        status: 'valuation_assigned',
        user: 'System',
        notes: 'Assigned to Dr. Emma Wilson for valuation'
      },
      {
        date: '2024-01-16',
        status: 'valuation_in_progress',
        user: 'Dr. Emma Wilson',
        notes: 'Valuation process initiated'
      }
    ]
  }
];

// Mock data for staff dashboard
const staffStats = {
  assignedTasks: 12,
  completedToday: 8,
  pendingApprovals: 3,
  averageRating: 4.9,
  totalCompleted: 234,
  monthlyTarget: 50,
  monthlyCompleted: 38,
};

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');
  const [valuationRequests, setValuationRequests] = useState<ValuationRequest[]>(mockValuationRequests);
  const [selectedValuation, setSelectedValuation] = useState<ValuationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'contact' | 'receipt' | 'valuation' | 'results' | 'timeline' | null>(null);
  const [showNotification, setShowNotification] = useState('');

  // Notification system
  const notify = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  // Get requests based on user role and current workflow status
  const getMyRequests = () => {
    const userRole = user?.role;
    const userName = user?.name;
    
    return valuationRequests.filter(req => {
      if (userRole === 'consulting_staff') {
        return req.assignedConsultant === userName || 
               ['new_request', 'consultant_assigned', 'customer_contacted', 'receipt_created', 'consultant_review', 'results_sent'].includes(req.status);
      } else if (userRole === 'valuation_staff') {
        return req.assignedValuer === userName || 
               ['valuation_assigned', 'valuation_in_progress', 'valuation_completed'].includes(req.status);
      } else if (userRole === 'manager') {
        return true; // Managers see all requests
      }
      return false;
    });
  };

  // Workflow action handlers
  const handleWorkflowAction = (requestId: string, action: string) => {
    const request = valuationRequests.find(r => r.id === requestId);
    if (!request) return;

    let newStatus: ValuationWorkflowStatus = request.status;
    let newAssignment: Partial<ValuationRequest> = {};
    let notificationMessage = '';

    switch (action) {
      case 'assign_consultant':
        if (request.status === 'new_request') {
          newStatus = 'consultant_assigned';
          newAssignment.assignedConsultant = user?.name;
          notificationMessage = 'Request assigned to you as consultant';
        }
        break;
      
      case 'contact_customer':
        if (request.status === 'consultant_assigned') {
          setSelectedValuation(request);
          setModalType('contact');
          setIsModalOpen(true);
          return;
        }
        break;
      
      case 'create_receipt':
        if (request.status === 'customer_contacted') {
          setSelectedValuation(request);
          setModalType('receipt');
          setIsModalOpen(true);
          return;
        }
        break;
      
      case 'assign_valuation':
        if (request.status === 'receipt_created') {
          newStatus = 'valuation_assigned';
          // In real app, this would show staff selection modal
          newAssignment.assignedValuer = 'Dr. Emma Wilson';
          notificationMessage = 'Request assigned to valuation staff';
        }
        break;
      
      case 'start_valuation':
        if (request.status === 'valuation_assigned') {
          newStatus = 'valuation_in_progress';
          notificationMessage = 'Valuation process started';
        }
        break;
      
      case 'complete_valuation':
        if (request.status === 'valuation_in_progress') {
          setSelectedValuation(request);
          setModalType('valuation');
          setIsModalOpen(true);
          return;
        }
        break;
      
      case 'review_results':
        if (request.status === 'valuation_completed') {
          newStatus = 'consultant_review';
          notificationMessage = 'Results ready for consultant review';
        }
        break;
      
      case 'send_results':
        if (request.status === 'consultant_review') {
          setSelectedValuation(request);
          setModalType('results');
          setIsModalOpen(true);
          return;
        }
        break;
    }

    if (newStatus !== request.status) {
      updateRequestStatus(requestId, newStatus, newAssignment, notificationMessage);
    }
  };

  const updateRequestStatus = (
    requestId: string, 
    newStatus: ValuationWorkflowStatus, 
    updates: Partial<ValuationRequest> = {},
    message: string = ''
  ) => {
    setValuationRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedRequest = {
          ...req,
          ...updates,
          status: newStatus,
          timeline: [
            ...req.timeline,
            {
              date: new Date().toISOString().split('T')[0],
              status: newStatus,
              user: user?.name || 'System',
              notes: message
            }
          ]
        };
        return updatedRequest;
      }
      return req;
    }));
    
    if (message) notify(message);
  };

  // Get status display info
  const getStatusInfo = (status: ValuationWorkflowStatus) => {
    const statusMap = {
      'new_request': { label: 'New Request', color: 'bg-blue-100 text-blue-800', icon: '🆕' },
      'consultant_assigned': { label: 'Consultant Assigned', color: 'bg-purple-100 text-purple-800', icon: '👤' },
      'customer_contacted': { label: 'Customer Contacted', color: 'bg-green-100 text-green-800', icon: '📞' },
      'receipt_created': { label: 'Receipt Created', color: 'bg-yellow-100 text-yellow-800', icon: '📋' },
      'valuation_assigned': { label: 'Valuation Assigned', color: 'bg-indigo-100 text-indigo-800', icon: '💎' },
      'valuation_in_progress': { label: 'In Valuation', color: 'bg-orange-100 text-orange-800', icon: '🔍' },
      'valuation_completed': { label: 'Valuation Complete', color: 'bg-green-100 text-green-800', icon: '✅' },
      'consultant_review': { label: 'Consultant Review', color: 'bg-purple-100 text-purple-800', icon: '👁️' },
      'results_sent': { label: 'Results Sent', color: 'bg-blue-100 text-blue-800', icon: '📧' },
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: '🎉' },
      'on_hold': { label: 'On Hold', color: 'bg-gray-100 text-gray-800', icon: '⏸️' },
      'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: '❌' }
    };
    return statusMap[status] || statusMap['new_request'];
  };

  // Get next available actions based on current status and user role
  const getAvailableActions = (request: ValuationRequest) => {
    const userRole = user?.role;
    const actions = [];

    if (userRole === 'consulting_staff') {
      switch (request.status) {
        case 'new_request':
          actions.push({ action: 'assign_consultant', label: 'Take Request', color: 'btn-primary' });
          break;
        case 'consultant_assigned':
          actions.push({ action: 'contact_customer', label: 'Contact Customer', color: 'btn-primary' });
          break;
        case 'customer_contacted':
          actions.push({ action: 'create_receipt', label: 'Create Receipt', color: 'btn-gold' });
          break;
        case 'receipt_created':
          actions.push({ action: 'assign_valuation', label: 'Assign to Valuer', color: 'btn-primary' });
          break;
        case 'consultant_review':
          actions.push({ action: 'send_results', label: 'Send Results', color: 'btn-primary' });
          break;
      }
    } else if (userRole === 'valuation_staff') {
      switch (request.status) {
        case 'valuation_assigned':
          actions.push({ action: 'start_valuation', label: 'Start Valuation', color: 'btn-primary' });
          break;
        case 'valuation_in_progress':
          actions.push({ action: 'complete_valuation', label: 'Complete Valuation', color: 'btn-gold' });
          break;
      }
    }

    // Common actions for all roles
    actions.push({ action: 'view_timeline', label: 'View Timeline', color: 'btn-secondary' });
    
    return actions;
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Check if user is staff
  if (!user || !['consulting_staff', 'valuation_staff', 'manager'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isConsultingStaff = user.role === 'consulting_staff';
  const isValuationStaff = user.role === 'valuation_staff';
  const isManager = user.role === 'manager';

  const tabs = [
    { id: 'tasks', label: 'My Tasks', icon: '📋' },
    { id: 'queue', label: 'Work Queue', icon: '⏳' },
    ...(isConsultingStaff ? [{ id: 'customers', label: 'Customer Contact', icon: '📞' }] : []),
    ...(isValuationStaff ? [{ id: 'valuations', label: 'Appraisals', icon: '💎' }] : []),
    ...(isManager ? [{ id: 'team', label: 'Team Management', icon: '👥' }] : []),
    { id: 'reports', label: 'My Reports', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {showNotification}
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
                Staff <span className="text-luxury-gold">Dashboard</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {isConsultingStaff && 'Customer consultation and communication management'}
                {isValuationStaff && 'Diamond appraisal and valuation workflow'}
                {isManager && 'Team oversight and workflow management'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full ${
                isConsultingStaff ? 'bg-blue-100 text-blue-800' :
                isValuationStaff ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                <span className="font-medium">
                  {isConsultingStaff && 'Consulting Staff'}
                  {isValuationStaff && 'Valuation Staff'}
                  {isManager && 'Manager'}
                </span>
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

              {/* Performance Summary */}
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-bold mb-4">This Month</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-bold">{staffStats.monthlyCompleted}/{staffStats.monthlyTarget}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-luxury-gold h-2 rounded-full" 
                      style={{ width: `${(staffStats.monthlyCompleted / staffStats.monthlyTarget) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <span className="font-bold text-yellow-600">⭐ {staffStats.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            {/* My Tasks Tab */}
            {activeTab === 'tasks' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                {/* Task Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Assigned Tasks</p>
                        <p className="text-3xl font-bold text-luxury-navy">{staffStats.assignedTasks}</p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <span className="text-2xl">📋</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed Today</p>
                        <p className="text-3xl font-bold text-luxury-navy">{staffStats.completedToday}</p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Review</p>
                        <p className="text-3xl font-bold text-luxury-navy">{staffStats.pendingApprovals}</p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <span className="text-2xl">⏳</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Completed</p>
                        <p className="text-3xl font-bold text-luxury-navy">{staffStats.totalCompleted}</p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <span className="text-2xl">🏆</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Valuations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">My Valuation Workflow</h3>
                  <div className="space-y-4">
                    {getMyRequests().map((request) => {
                      const statusInfo = getStatusInfo(request.status);
                      const actions = getAvailableActions(request);
                      
                      return (
                        <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-bold text-luxury-navy">{request.id}</h4>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.color}`}>
                                <span>{statusInfo.icon}</span>
                                <span>{statusInfo.label}</span>
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                request.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                request.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                request.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {request.priority} priority
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              {actions.map((action, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (action.action === 'view_timeline') {
                                      setSelectedValuation(request);
                                      setModalType('timeline');
                                      setIsModalOpen(true);
                                    } else {
                                      handleWorkflowAction(request.id, action.action);
                                    }
                                  }}
                                  className={`btn ${action.color} text-sm`}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><span className="font-medium">Customer:</span> {request.customerName}</p>
                              <p><span className="font-medium">Email:</span> {request.customerEmail}</p>
                              <p><span className="font-medium">Phone:</span> {request.customerPhone}</p>
                              <p><span className="font-medium">Submitted:</span> {request.submittedDate}</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Type:</span> {request.diamondType}</p>
                              <p><span className="font-medium">Carat:</span> {request.caratWeight}ct</p>
                              <p><span className="font-medium">Est. Value:</span> {request.estimatedValue}</p>
                              {request.receiptNumber && (
                                <p><span className="font-medium">Receipt:</span> {request.receiptNumber}</p>
                              )}
                            </div>
                          </div>

                          {/* Workflow Progress Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                              <span>Request</span>
                              <span>Contact</span>
                              <span>Receipt</span>
                              <span>Valuation</span>
                              <span>Results</span>
                              <span>Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-luxury-gold h-2 rounded-full transition-all duration-300" 
                                style={{ 
                                  width: `${
                                    request.status === 'new_request' ? 10 :
                                    request.status === 'consultant_assigned' ? 20 :
                                    request.status === 'customer_contacted' ? 30 :
                                    request.status === 'receipt_created' ? 40 :
                                    request.status === 'valuation_assigned' ? 50 :
                                    request.status === 'valuation_in_progress' ? 70 :
                                    request.status === 'valuation_completed' ? 80 :
                                    request.status === 'consultant_review' ? 90 :
                                    request.status === 'results_sent' ? 95 :
                                    request.status === 'completed' ? 100 : 10
                                  }%` 
                                }}
                              ></div>
                            </div>
                          </div>

                          {/* Current Assignment */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-sm">
                              {request.assignedConsultant && (
                                <span className="text-blue-600">👤 Consultant: {request.assignedConsultant}</span>
                              )}
                              {request.assignedValuer && (
                                <span className="text-purple-600 ml-4">💎 Valuer: {request.assignedValuer}</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Last updated: {request.timeline[request.timeline.length - 1]?.date}
                            </div>
                          </div>

                          {/* Latest Notes */}
                          {(request.consultantNotes || request.valuationNotes) && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm">
                                <span className="font-medium">Latest Notes:</span> 
                                {request.valuationNotes || request.consultantNotes || request.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Customer Contact Tab (Consulting Staff Only) */}
            {activeTab === 'customers' && isConsultingStaff && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-serif font-bold mb-6">Customer Communication Center</h3>
                
                <div className="space-y-6">
                  {/* Communication Tools */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">📧 Email Templates</h4>
                      <p className="text-sm text-gray-600 mb-3">Quick response templates</p>
                      <button className="btn btn-secondary text-sm w-full">Manage Templates</button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">📞 Call Log</h4>
                      <p className="text-sm text-gray-600 mb-3">Track customer calls</p>
                      <button className="btn btn-secondary text-sm w-full">View Call History</button>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">📅 Appointments</h4>
                      <p className="text-sm text-gray-600 mb-3">Schedule consultations</p>
                      <button className="btn btn-secondary text-sm w-full">Book Appointment</button>
                    </div>
                  </div>

                  {/* Customer Follow-ups */}
                  <div>
                    <h4 className="font-medium mb-4">Pending Customer Follow-ups</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">John Doe - VAL-2024-0123</p>
                          <p className="text-sm text-gray-600">Waiting for diamond delivery confirmation</p>
                        </div>
                        <button className="btn btn-primary text-sm">Contact</button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Maria Garcia - VAL-2024-0119</p>
                          <p className="text-sm text-gray-600">Follow up on additional documentation</p>
                        </div>
                        <button className="btn btn-primary text-sm">Contact</button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appraisals Tab (Valuation Staff Only) */}
            {activeTab === 'valuations' && isValuationStaff && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-serif font-bold mb-6">Diamond Appraisal Workstation</h3>
                
                <div className="space-y-6">
                  {/* Appraisal Tools */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <span className="text-2xl block mb-2">💎</span>
                      <h4 className="font-medium">Diamond Calculator</h4>
                      <button className="btn btn-secondary text-sm mt-2">Open Tool</button>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <span className="text-2xl block mb-2">📊</span>
                      <h4 className="font-medium">Price Database</h4>
                      <button className="btn btn-secondary text-sm mt-2">Access DB</button>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <span className="text-2xl block mb-2">📋</span>
                      <h4 className="font-medium">Report Templates</h4>
                      <button className="btn btn-secondary text-sm mt-2">View Templates</button>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <span className="text-2xl block mb-2">📸</span>
                      <h4 className="font-medium">Photo Gallery</h4>
                      <button className="btn btn-secondary text-sm mt-2">Upload Photos</button>
                    </div>
                  </div>

                  {/* Current Appraisal */}
                  <div className="border rounded-lg p-6">
                    <h4 className="font-medium mb-4">Current Appraisal: VAL-2024-0125</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium mb-2">Diamond Specifications</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Shape:</span>
                            <span>Emerald Cut</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Carat Weight:</span>
                            <span>3.2ct</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Color Grade:</span>
                            <span>H</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clarity Grade:</span>
                            <span>VS1</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Valuation Details</h5>
                        <div className="space-y-2">
                          <input type="number" placeholder="Market Value ($)" className="w-full px-3 py-2 border rounded" />
                          <input type="number" placeholder="Insurance Value ($)" className="w-full px-3 py-2 border rounded" />
                          <textarea placeholder="Notes and observations..." className="w-full px-3 py-2 border rounded" rows={3}></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button className="btn btn-primary">Save Progress</button>
                      <button className="btn btn-gold">Complete Appraisal</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Team Management Tab (Manager Only) */}
            {activeTab === 'team' && isManager && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6"
              >
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">Team Performance Overview</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Consulting Staff Performance</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <p className="text-sm text-gray-600">28 contacts this month</p>
                          </div>
                          <span className="text-green-600 font-bold">92%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Mike Chen</p>
                            <p className="text-sm text-gray-600">31 contacts this month</p>
                          </div>
                          <span className="text-green-600 font-bold">88%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Valuation Staff Performance</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Dr. Emma Wilson</p>
                            <p className="text-sm text-gray-600">15 appraisals this month</p>
                          </div>
                          <span className="text-green-600 font-bold">95%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">James Rodriguez</p>
                            <p className="text-sm text-gray-600">18 appraisals this month</p>
                          </div>
                          <span className="text-green-600 font-bold">91%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-serif font-bold mb-6">Workflow Management</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button className="p-4 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                      <span className="text-2xl block mb-2">📋</span>
                      <span className="font-medium">Assign Tasks</span>
                    </button>
                    <button className="p-4 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors">
                      <span className="text-2xl block mb-2">📊</span>
                      <span className="font-medium">View Reports</span>
                    </button>
                    <button className="p-4 border border-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
                      <span className="text-2xl block mb-2">⚙️</span>
                      <span className="font-medium">Settings</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-xl font-serif font-bold mb-6">My Performance Reports</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Monthly Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Tasks Completed:</span>
                        <span className="font-bold">38/50</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Rating:</span>
                        <span className="font-bold text-yellow-600">⭐ 4.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-bold">2.3 hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Quality Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Accuracy Rate:</span>
                        <span className="font-bold text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Satisfaction:</span>
                        <span className="font-bold text-green-600">4.8/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revision Rate:</span>
                        <span className="font-bold text-green-600">1.2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="btn btn-primary">Download Full Report</button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal System for Workflow Actions */}
      {isModalOpen && selectedValuation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {modalType === 'contact' && 'Customer Contact & Communication'}
                {modalType === 'receipt' && 'Create Valuation Receipt'}
                {modalType === 'valuation' && 'Complete Diamond Valuation'}
                {modalType === 'results' && 'Send Results to Customer'}
                {modalType === 'timeline' && `Workflow Timeline - ${selectedValuation.id}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Customer Contact Modal */}
            {modalType === 'contact' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedValuation.customerName}</p>
                      <p><strong>Email:</strong> {selectedValuation.customerEmail}</p>
                      <p><strong>Phone:</strong> {selectedValuation.customerPhone}</p>
                      <p><strong>Request:</strong> {selectedValuation.diamondType} - {selectedValuation.caratWeight}ct</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Customer Notes</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedValuation.customerNotes}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Contact Method</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button className="p-3 border rounded-lg hover:bg-blue-50 flex flex-col items-center">
                      <span className="text-2xl mb-1">📧</span>
                      <span className="text-sm">Email</span>
                    </button>
                    <button className="p-3 border rounded-lg hover:bg-green-50 flex flex-col items-center">
                      <span className="text-2xl mb-1">📞</span>
                      <span className="text-sm">Phone</span>
                    </button>
                    <button className="p-3 border rounded-lg hover:bg-purple-50 flex flex-col items-center">
                      <span className="text-2xl mb-1">🤝</span>
                      <span className="text-sm">In-Person</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Notes</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md" 
                    rows={4}
                    placeholder="Record the outcome of your customer contact..."
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      updateRequestStatus(selectedValuation.id, 'customer_contacted', {
                        consultantNotes: 'Customer contacted successfully'
                      }, 'Customer contact completed');
                      setIsModalOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Mark as Contacted
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Receipt Creation Modal */}
            {modalType === 'receipt' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Diamond Information</h4>
                    <div className="space-y-3">
                      <input type="text" defaultValue={selectedValuation.diamondType} className="w-full px-3 py-2 border rounded-md" placeholder="Diamond Type" />
                      <input type="text" defaultValue={selectedValuation.caratWeight} className="w-full px-3 py-2 border rounded-md" placeholder="Carat Weight" />
                      <input type="text" placeholder="Color Grade" className="w-full px-3 py-2 border rounded-md" />
                      <input type="text" placeholder="Clarity Grade" className="w-full px-3 py-2 border rounded-md" />
                      <input type="text" placeholder="Cut Grade" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Receipt Details</h4>
                    <div className="space-y-3">
                      <input 
                        type="text" 
                        defaultValue={`RCP-2024-${selectedValuation.id.split('-')[2]}`}
                        className="w-full px-3 py-2 border rounded-md" 
                        placeholder="Receipt Number" 
                      />
                      <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border rounded-md" />
                      <select className="w-full px-3 py-2 border rounded-md">
                        <option>Dr. Emma Wilson</option>
                        <option>James Rodriguez</option>
                        <option>Sarah Chen</option>
                      </select>
                      <input type="text" defaultValue={selectedValuation.estimatedValue} className="w-full px-3 py-2 border rounded-md" placeholder="Estimated Value" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions / Notes</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md" 
                    rows={3}
                    placeholder="Any special handling instructions or notes for the valuation staff..."
                  ></textarea>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm"><strong>Important:</strong> Ensure diamond is properly secured and receipt is given to customer before proceeding to valuation stage.</p>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      const receiptNumber = `RCP-2024-${selectedValuation.id.split('-')[2]}`;
                      updateRequestStatus(selectedValuation.id, 'receipt_created', {
                        receiptNumber,
                        consultantNotes: `Receipt ${receiptNumber} created. Diamond received and secured.`
                      }, 'Valuation receipt created successfully');
                      setIsModalOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Create Receipt
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Valuation Completion Modal */}
            {modalType === 'valuation' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Valuation Results</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Market Value ($)</label>
                        <input type="number" className="w-full px-3 py-2 border rounded-md" placeholder="Market Value" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Insurance Value ($)</label>
                        <input type="number" className="w-full px-3 py-2 border rounded-md" placeholder="Insurance Value" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Retail Value ($)</label>
                        <input type="number" className="w-full px-3 py-2 border rounded-md" placeholder="Retail Value" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Condition</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option>Excellent</option>
                          <option>Very Good</option>
                          <option>Good</option>
                          <option>Fair</option>
                          <option>Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Certification & Photos</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Certification Details</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded-md" 
                          rows={3}
                          placeholder="GIA/AGS certification number, details..."
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Photo Upload</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <span className="text-gray-500">Click to upload photos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Valuation Notes</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md" 
                    rows={4}
                    placeholder="Detailed analysis, observations, methodology used..."
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      updateRequestStatus(selectedValuation.id, 'valuation_completed', {
                        valuationNotes: 'Professional valuation completed with detailed analysis',
                        valuationResults: {
                          marketValue: 22000,
                          insuranceValue: 25000,
                          retailValue: 28000,
                          condition: 'Excellent',
                          certificationDetails: 'Complete analysis with documentation',
                          photos: []
                        }
                      }, 'Diamond valuation completed');
                      setIsModalOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Complete Valuation
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Save Draft
                  </button>
                </div>
              </div>
            )}

            {/* Results Sending Modal */}
            {modalType === 'results' && (
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Valuation Complete</h4>
                  <p className="text-sm text-green-700">The diamond valuation has been completed and is ready to send to the customer.</p>
                </div>

                {selectedValuation.valuationResults && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Valuation Summary</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Market Value:</strong> ${selectedValuation.valuationResults.marketValue?.toLocaleString()}</p>
                        <p><strong>Insurance Value:</strong> ${selectedValuation.valuationResults.insuranceValue?.toLocaleString()}</p>
                        <p><strong>Retail Value:</strong> ${selectedValuation.valuationResults.retailValue?.toLocaleString()}</p>
                        <p><strong>Condition:</strong> {selectedValuation.valuationResults.condition}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Communication Method</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="radio" name="method" defaultChecked className="mr-2" />
                          <span>Email with PDF report</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="method" className="mr-2" />
                          <span>Phone call + Email</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="method" className="mr-2" />
                          <span>In-person meeting</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message to Customer</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md" 
                    rows={4}
                    defaultValue={`Dear ${selectedValuation.customerName},

We have completed the professional valuation of your diamond. Please find the detailed report attached.

Best regards,
${user?.name}`}
                  ></textarea>
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => {
                      updateRequestStatus(selectedValuation.id, 'results_sent', {
                        consultantNotes: 'Results and valuation report sent to customer via email'
                      }, 'Valuation results sent to customer');
                      setIsModalOpen(false);
                    }}
                    className="btn btn-primary"
                  >
                    Send Results
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Timeline Modal */}
            {modalType === 'timeline' && (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto">
                  {selectedValuation.timeline.map((event, index) => {
                    const statusInfo = getStatusInfo(event.status);
                    return (
                      <div key={index} className="flex items-start space-x-3 pb-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${statusInfo.color}`}>
                          {statusInfo.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{statusInfo.label}</h4>
                            <span className="text-xs text-gray-500">{event.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">by {event.user}</p>
                          {event.notes && (
                            <p className="text-sm text-gray-700 mt-1">{event.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t pt-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
