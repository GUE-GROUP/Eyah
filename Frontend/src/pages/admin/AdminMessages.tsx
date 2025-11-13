import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, Phone, Eye } from 'lucide-react';
import type { ContactMessage } from '../../types';

const AdminMessages: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Mock messages
    const mockMessages: ContactMessage[] = [
      {
        id: '1',
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        phone: '+234 912 855 5191',
        subject: 'Banquet Hall Inquiry',
        message: 'I would like to inquire about booking the banquet hall for a wedding reception in December.',
        status: 'unread',
        createdAt: '2025-11-13T09:30:00Z'
      },
      {
        id: '2',
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+234 816 333 2977',
        subject: 'Corporate Event',
        message: 'We are planning a corporate retreat and need accommodation for 50 people.',
        status: 'read',
        createdAt: '2025-11-12T14:20:00Z'
      },
    ];

    setMessages(mockMessages);
  }, [navigate]);

  const markAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status: 'read' as const } : msg
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-dark">Messages</h1>
              <p className="text-sm text-gray-600">Customer inquiries and messages</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-6 hover:bg-gray-50 transition-colors duration-150 ${
                  message.status === 'unread' ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-dark">{message.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(message.status)}`}>
                        {message.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-semibold mb-2">{message.subject}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {message.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {message.phone}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMessage(message);
                      markAsRead(message.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye size={20} className="text-gray-600" />
                  </button>
                </div>
                <p className="text-gray-700 line-clamp-2">{message.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          {messages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No messages found</p>
            </div>
          )}
        </div>
      </main>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedMessage(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-dark mb-6">{selectedMessage.subject}</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">From</p>
                <p className="font-semibold">{selectedMessage.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedMessage.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Message</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedMessage.message}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 rounded-lg">
                Reply
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-dark font-semibold py-3 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
