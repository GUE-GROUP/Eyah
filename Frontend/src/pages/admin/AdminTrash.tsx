import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import type { ContactMessage } from '../../types';
import { getTrashedMessages, restoreMessageFromTrash, permanentlyDeleteMessage } from '../../lib/supabase';
import { useToast } from '../../components/ToastContainer';

const AdminTrash: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadTrashedMessages();
  }, [navigate]);

  const loadTrashedMessages = async () => {
    console.group('🗑️ Loading Trashed Messages');
    setLoading(true);
    try {
      const data = await getTrashedMessages();
      console.log('✅ Trashed messages loaded:', data?.length || 0);
      setMessages(data || []);
      
      // Show info if trash feature not available
      if (data && data.length === 0) {
        console.log('ℹ️ Trash is empty or feature not enabled');
      }
    } catch (error: any) {
      console.error('❌ Error loading trashed messages:', error);
      toast.error('Failed to load trashed messages');
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  const handleRestore = async (messageId: string) => {
    try {
      await restoreMessageFromTrash(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message restored successfully');
    } catch (error: any) {
      console.error('❌ Error restoring message:', error);
      toast.error('Failed to restore message');
    }
  };

  const handlePermanentDelete = async (messageId: string) => {
    if (!confirm('Permanently delete this message? This action cannot be undone!')) {
      return;
    }

    try {
      await permanentlyDeleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message permanently deleted');
    } catch (error: any) {
      console.error('❌ Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleEmptyTrash = async () => {
    if (!confirm(`Permanently delete all ${messages.length} messages? This action cannot be undone!`)) {
      return;
    }

    try {
      for (const message of messages) {
        await permanentlyDeleteMessage(message.id);
      }
      setMessages([]);
      toast.success('Trash emptied successfully');
    } catch (error: any) {
      console.error('❌ Error emptying trash:', error);
      toast.error('Failed to empty trash');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/messages')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
                  <Trash2 size={28} className="text-red-500" />
                  Trash
                </h1>
                <p className="text-sm text-gray-600">Deleted messages</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleEmptyTrash}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold"
              >
                Empty Trash
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-yellow-800">Messages in Trash</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Messages here can be restored or permanently deleted. Permanent deletion cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <Trash2 className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg font-semibold">Trash is empty</p>
              <p className="text-gray-500 text-sm mt-2">Deleted messages will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-dark mb-2">{message.name}</h3>
                      <p className="text-sm text-gray-600 font-semibold mb-2">{message.subject}</p>
                      <p className="text-sm text-gray-500">{message.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRestore(message.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold flex items-center gap-2"
                        title="Restore message"
                      >
                        <RotateCcw size={18} />
                        Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(message.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-semibold flex items-center gap-2"
                        title="Delete permanently"
                      >
                        <Trash2 size={18} />
                        Delete Forever
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 line-clamp-2">{message.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Deleted: {message.deleted_at ? new Date(message.deleted_at).toLocaleString() : new Date(message.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminTrash;
