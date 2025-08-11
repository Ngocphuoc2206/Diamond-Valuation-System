import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface CustomerMessage {
  id: string;
  date: string;
  type: 'customer' | 'consultant' | 'system';
  from: string;
  subject: string;
  message: string;
  read: boolean;
  requestId?: string;
  attachments?: string[];
}

const CustomerCommunication: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: '',
    requestId: ''
  });

  // Mock customer messages
  const [messages, setMessages] = useState<CustomerMessage[]>([
    {
      id: 'msg-001',
      date: '2024-01-22',
      type: 'consultant',
      from: 'Sarah Johnson',
      subject: 'Valuation Complete - VAL-2024-0123',
      message: 'Dear John, Your diamond valuation is now complete. The results show an insurance value of $18,500. Please find the detailed report attached. If you have any questions, please don\'t hesitate to contact me.',
      read: false,
      requestId: 'VAL-2024-0123',
      attachments: ['valuation_report_VAL-2024-0123.pdf', 'certificate_VAL-2024-0123.pdf']
    },
    {
      id: 'msg-002',
      date: '2024-01-21',
      type: 'system',
      from: 'System',
      subject: 'Valuation Status Update - VAL-2024-0156',
      message: 'Your valuation request VAL-2024-0156 has been assigned to consultant Mike Chen. You will be contacted within 24 hours to schedule an inspection.',
      read: true,
      requestId: 'VAL-2024-0156'
    },
    {
      id: 'msg-003',
      date: '2024-01-20',
      type: 'consultant',
      from: 'Mike Chen',
      subject: 'Schedule Appointment - VAL-2024-0156',
      message: 'Hello! I\'ve been assigned as your consultant for the emerald cut diamond valuation. Could we schedule a time this week for the inspection? I have availability Tuesday through Friday between 9 AM and 4 PM.',
      read: true,
      requestId: 'VAL-2024-0156'
    }
  ]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const sendMessage = () => {
    if (!newMessage.subject || !newMessage.message) return;

    const message: CustomerMessage = {
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'customer',
      from: user?.name || 'You',
      subject: newMessage.subject,
      message: newMessage.message,
      read: true,
      requestId: newMessage.requestId || undefined
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage({ subject: '', message: '', requestId: '' });
    setIsComposing(false);
    alert('Message sent successfully!');
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">Communication Center</h1>
                <p className="text-gray-600">Stay connected with our team</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsComposing(true)}
                  className="btn btn-primary"
                >
                  ✉️ New Message
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
              {[
                { id: 'messages', label: `Messages ${unreadCount > 0 ? `(${unreadCount})` : ''}`, icon: '💬' },
                { id: 'history', label: 'Communication History', icon: '📋' }
              ].map((tab) => (
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

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm">
              <div className="divide-y divide-gray-200">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer ${!message.read ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.read) markAsRead(message.id);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${!message.read ? 'text-blue-900' : 'text-gray-900'}`}>
                            {message.subject}
                          </h4>
                          {!message.read && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                          )}
                          {message.type === 'consultant' && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">From Consultant</span>
                          )}
                          {message.type === 'system' && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">System</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">From: {message.from}</p>
                        <p className="text-gray-700 line-clamp-2">{message.message}</p>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-gray-500">{message.date}</p>
                          {message.requestId && (
                            <span className="text-xs text-gray-500">Request: {message.requestId}</span>
                          )}
                          {message.attachments && message.attachments.length > 0 && (
                            <span className="text-xs text-gray-500">📎 {message.attachments.length} attachment(s)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Communication History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Communication Timeline</h3>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={message.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        message.type === 'consultant' ? 'bg-green-100 text-green-600' :
                        message.type === 'system' ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {message.type === 'consultant' ? '👨‍💼' : 
                         message.type === 'system' ? '🤖' : '👤'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{message.subject}</h4>
                        <span className="text-xs text-gray-500">{message.date}</span>
                      </div>
                      <p className="text-sm text-gray-600">From: {message.from}</p>
                      <p className="text-sm text-gray-700 mt-1">{message.message}</p>
                      {message.requestId && (
                        <p className="text-xs text-gray-500 mt-1">Related to: {message.requestId}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">From: {selectedMessage.from}</p>
                  <p className="text-sm text-gray-500">{selectedMessage.date}</p>
                </div>
                {selectedMessage.requestId && (
                  <p className="text-sm text-gray-600">Related Request: {selectedMessage.requestId}</p>
                )}
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{selectedMessage.message}</p>
              </div>

              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Attachments:</h4>
                  <div className="space-y-2">
                    {selectedMessage.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-blue-600">📎</span>
                        <button 
                          onClick={() => alert(`Downloading ${attachment}`)}
                          className="text-blue-600 hover:underline"
                        >
                          {attachment}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button 
                  onClick={() => {
                    setNewMessage({
                      subject: `Re: ${selectedMessage.subject}`,
                      message: '',
                      requestId: selectedMessage.requestId || ''
                    });
                    setSelectedMessage(null);
                    setIsComposing(true);
                  }}
                  className="btn btn-primary"
                >
                  Reply
                </button>
                <button 
                  onClick={() => setSelectedMessage(null)}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose Message Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Compose Message</h3>
              <button
                onClick={() => setIsComposing(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request ID (Optional)</label>
                <input 
                  type="text"
                  value={newMessage.requestId}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, requestId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  placeholder="VAL-2024-XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input 
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  value={newMessage.message}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.subject || !newMessage.message}
                  className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
                <button 
                  onClick={() => setIsComposing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCommunication;
