'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import AdminNav from '../../components/AdminNav';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data.messages || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', messageId })
      });

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    }
  };

  const handleToggleRead = async (messageId) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleRead', messageId })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, read: data.read } : msg
        ));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => ({ ...prev, read: data.read }));
        }
      }
    } catch (error) {
      console.error('Failed to toggle read status:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.read;
    if (filter === 'read') return msg.read;
    return true;
  });

  const unreadCount = messages.filter(msg => !msg.read).length;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-white dark:bg-[#0d0d0d] flex items-center justify-center">
          <div className="text-black/60 dark:text-white/60">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-[#0d0d0d]">
        <AdminNav />

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              Messages
            </h1>
            <p className="text-lg text-black/60 dark:text-white/60">
              View and manage contact form submissions
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'read'
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-black/5 dark:bg-white/5 text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
              }`}
            >
              Read ({messages.length - unreadCount})
            </button>
          </div>

          {/* Messages List */}
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-black/20 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-black/40 dark:text-white/40">
                {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`border rounded-xl p-6 transition-all cursor-pointer ${
                    !message.read
                      ? 'border-black/20 dark:border-white/20 bg-black/[0.02] dark:bg-white/[0.02]'
                      : 'border-black/10 dark:border-white/10'
                  } hover:border-black/30 dark:hover:border-white/30 hover:shadow-lg`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-black dark:text-white">
                          {message.name}
                        </h3>
                        {!message.read && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/60 dark:text-white/60">
                        <a href={`mailto:${message.email}`} className="hover:text-black dark:hover:text-white transition-colors">
                          {message.email}
                        </a>
                        {message.phone && (
                          <a href={`tel:${message.phone}`} className="hover:text-black dark:hover:text-white transition-colors">
                            {message.phone}
                          </a>
                        )}
                        <span>{formatDate(message.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(message.id);
                        }}
                        className="px-3 py-1 text-sm border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg hover:border-black/40 dark:hover:border-white/40 transition-colors"
                      >
                        {message.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="px-3 py-1 text-sm border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg hover:border-red-500/40 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-black/70 dark:text-white/70 line-clamp-2">
                    {message.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] p-4"
          onClick={() => setSelectedMessage(null)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-all hover:scale-110 flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                    {selectedMessage.name}
                  </h2>
                  <p className="text-black/50 dark:text-white/50 text-sm">
                    {formatDate(selectedMessage.timestamp)}
                  </p>
                </div>
                {!selectedMessage.read && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                    New
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-1">
                    Email
                  </label>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-lg text-black dark:text-white hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-1">
                      Phone
                    </label>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-lg text-black dark:text-white hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-black/60 dark:text-white/60 mb-2">
                    Message
                  </label>
                  <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg">
                    <p className="text-black dark:text-white whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors text-center"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => {
                    handleToggleRead(selectedMessage.id);
                  }}
                  className="px-6 py-3 border border-black/20 dark:border-white/20 text-black dark:text-white rounded-lg font-medium hover:border-black/40 dark:hover:border-white/40 transition-colors"
                >
                  {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-6 py-3 border border-red-500/20 text-red-500 dark:text-red-400 rounded-lg font-medium hover:border-red-500/40 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
