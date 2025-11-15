import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Mail, Phone, Eye, Send, Loader2, Trash2, AlertTriangle, X } from 'lucide-react';
import type { ContactMessage } from '../../types';
import { getContactMessages, updateMessageStatus, moveMessageToTrash, supabase } from '../../lib/supabase';
import { useToast } from '../../components/ToastContainer';

const AdminMessages: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; messageId: string | null; messageName: string }>({ show: false, messageId: null, messageName: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadMessages();
  }, [navigate, filterStatus]);

  const loadMessages = async () => {
    console.group('📨 Loading Messages');
    setLoading(true);
    try {
      const data = await getContactMessages(filterStatus);
      console.log('✅ Messages loaded:', data?.length || 0);
      setMessages(data || []);
    } catch (error: any) {
      console.error('❌ Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await updateMessageStatus(messageId, 'read');
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' as const } : msg
        )
      );
    } catch (error: any) {
      console.error('❌ Error marking as read:', error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setSendingReply(true);
    console.group('📧 Sending Reply');
    console.log('To:', selectedMessage.email);
    console.log('Subject:', `Re: ${selectedMessage.subject}`);

    try {
      // Send reply email via Resend
      const { error } = await supabase.functions.invoke('send-email-resend', {
        body: {
          type: 'contact_form_reply',
          to: selectedMessage.email,
          data: {
            recipientName: selectedMessage.name,
            originalSubject: selectedMessage.subject,
            originalMessage: selectedMessage.message,
            replyMessage: replyText
          }
        }
      });

      if (error) {
        console.error('❌ Error:', error);
        throw error;
      }

      console.log('✅ Reply sent successfully');

      // Update message status to 'responded'
      await updateMessageStatus(selectedMessage.id, 'responded');
      
      // Update local state
      setMessages(prev =>
        prev.map(msg =>
          msg.id === selectedMessage.id ? { ...msg, status: 'responded' as const } : msg
        )
      );

      toast.success('Reply sent successfully!');
      setReplyText('');
      setSelectedMessage(null);
      console.groupEnd();
    } catch (error: any) {
      console.error('❌ Failed to send reply:', error);
      toast.error('Failed to send reply. Please try again.');
      console.groupEnd();
    } finally {
      setSendingReply(false);
    }
  };

  const showDeleteConfirm = (messageId: string, messageName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteConfirm({ show: true, messageId, messageName });
  };

  const handleDeleteMessage = async () => {
    if (!deleteConfirm.messageId) return;

    try {
      await moveMessageToTrash(deleteConfirm.messageId);
      setMessages(prev => prev.filter(msg => msg.id !== deleteConfirm.messageId));
      toast.success('Message deleted successfully');
      setDeleteConfirm({ show: false, messageId: null, messageName: '' });
    } catch (error: any) {
      console.error('❌ Error deleting message:', error);
      toast.error('Failed to delete message. Please try again.');
    }
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
          <div className="flex items-center justify-between">
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
            <button
              onClick={() => navigate('/admin/trash')}
              className="px-4 py-2 bg-gray-200 text-dark rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold flex items-center gap-2"
            >
              <Trash2 size={18} />
              Trash
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === 'all' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Messages
            </button>
            <button
              onClick={() => setFilterStatus('unread')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterStatus('read')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === 'read' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setFilterStatus('responded')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === 'responded' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Responded
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : (
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMessage(message);
                        markAsRead(message.id);
                      }}
                      className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors duration-200 font-semibold flex items-center gap-2"
                    >
                      <Eye size={18} />
                      View
                    </button>
                    <button
                      onClick={(e) => showDeleteConfirm(message.id, message.name, e)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold flex items-center gap-2"
                      title="Move to trash"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 line-clamp-2">{message.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
            ))}
            </div>
          )}

          {!loading && messages.length === 0 && (
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark">{selectedMessage.subject}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedMessage.status)}`}>
                {selectedMessage.status.toUpperCase()}
              </span>
            </div>
            
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
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{new Date(selectedMessage.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Message</p>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>

            {/* Reply Section */}
            <div className="border-t pt-6">
              <h3 className="font-bold text-dark mb-3">Send Reply</h3>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Reply will be sent to: {selectedMessage.email}
              </p>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSendReply}
                disabled={sendingReply || !replyText.trim()}
                className="flex-1 bg-accent hover:bg-accent-dark text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingReply ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Reply
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSelectedMessage(null);
                  setReplyText('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-dark font-semibold py-3 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-dark mb-2">Move to Trash?</h3>
                <p className="text-gray-600">
                  Are you sure you want to move the message from <strong>{deleteConfirm.messageName}</strong> to trash? 
                  You can restore it later from the trash page.
                </p>
              </div>
              <button
                onClick={() => setDeleteConfirm({ show: false, messageId: null, messageName: '' })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, messageId: null, messageName: '' })}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-dark font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMessage}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
