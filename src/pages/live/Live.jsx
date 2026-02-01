import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// SheetDB URL dari environment variables
const SHEETDB_AKUN_URL = import.meta.env.VITE_SHEETDB_URL_AKUN;
const SHEETDB_MESSAGE_URL = import.meta.env.VITE_SHEETDB_URL_MASSAGE;

function Live() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const lastSentRef = useRef(0);
  const fetchControllerRef = useRef(null);
  const navigate = useNavigate();
  const pollingIntervalRef = useRef(null);

  // Check user status in SheetDB
  const checkUserStatus = useCallback(async () => {
    try {
      // Ambil user dari localStorage (mendukung key lama 'userSession')
      const savedRaw = localStorage.getItem('sheetdb_user') || localStorage.getItem('userSession');
      if (!savedRaw) {
        navigate('/Live-Discussion/login');
        return;
      }

      let savedParsed;
      try {
        savedParsed = JSON.parse(savedRaw);
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('sheetdb_user');
        navigate('/Live-Discussion/login');
        return;
      }

      // Normalisasi nama properti ke `username` untuk konsistensi
      const userData = {
        id: savedParsed.id || savedParsed.email,
        username: savedParsed.username || savedParsed.nama || savedParsed.name || 'User',
        email: savedParsed.email
      };
      
      // Verifikasi user di database SheetDB
      // Gunakan AbortController untuk menghindari request tertinggal
      const controller = new AbortController();
      const signal = controller.signal;
      try {
        const response = await fetch(`${SHEETDB_AKUN_URL}/search?email=${encodeURIComponent(userData.email)}`, { signal });
        const data = await response.json();

        if (data && data.length > 0) {
          const userRecord = data[0];
          const userStatus = userRecord.status?.toLowerCase();
          // Check status akun
          if (userStatus === 'active' || userStatus === 'aktif') {
            setUser({
              ...userData,
              id: userRecord.id || userData.id,
              username: userRecord.nama || userRecord.username || userData.username,
              email: userRecord.email
            });
          } else {
            setError('Akun Anda dinonaktifkan. Silakan hubungi administrator.');
            setTimeout(() => {
              localStorage.removeItem('sheetdb_user');
              navigate('/Live-Discussion/login');
            }, 3000);
          }
        } else {
          // User data valid dari localStorage, lanjutkan
          setUser(userData);
        }
      } catch (fetchErr) {
        if (fetchErr.name !== 'AbortError') {
          console.warn('Could not verify user status, using cached data:', fetchErr);
          // Lanjutkan dengan data yang disimpan jika verifikasi gagal
          setUser(userData);
        }
      }
    } catch (err) {
      console.error('Error checking user status:', err);
      setError('Gagal memverifikasi akun. Silakan login kembali.');
      setTimeout(() => {
        localStorage.removeItem('sheetdb_user');
        navigate('/Live-Discussion/login');
      }, 3000);
    }
  }, [navigate]);

  // Fetch messages from SheetDB
  const fetchMessagesFromSheetDB = useCallback(async () => {
    try {
      // Abort previous fetch if any
      if (fetchControllerRef.current) {
        try { fetchControllerRef.current.abort(); } catch (e) {}
      }
      const controller = new AbortController();
      fetchControllerRef.current = controller;
      const response = await fetch(SHEETDB_MESSAGE_URL, { signal: controller.signal });
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Sort messages by created_at descending (newest first)
        const sortedMessages = data.sort((a, b) => 
          new Date(b.created_at || b.timestamp) - new Date(a.created_at || a.timestamp)
        );
        setMessages(sortedMessages.slice(0, 100)); // Limit to 100 messages
      } else {
        setMessages([]);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error fetching messages:', err);
      setError('Gagal memuat pesan. Silakan refresh halaman.');
    }
  }, []);

  // Setup polling for new messages
  const setupPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      fetchMessagesFromSheetDB();
    }, 3000); // Poll every 3 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (fetchControllerRef.current) {
        try { fetchControllerRef.current.abort(); } catch (e) {}
      }
    };
  }, [fetchMessagesFromSheetDB]);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    await checkUserStatus();
    await fetchMessagesFromSheetDB();
    setLoading(false);
  }, [checkUserStatus, fetchMessagesFromSheetDB]);

  // Check user and load messages on mount
  useEffect(() => {
    loadInitialData();
    const cleanup = setupPolling();
    
    return () => {
      cleanup();
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [loadInitialData, setupPolling]);

  // Auto scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1000);
    }
  }, [isTyping]);

  // Send message to SheetDB
  const sendMessageToSheetDB = async (messageData) => {
    try {
      const response = await fetch(SHEETDB_MESSAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [messageData] }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      return { data: result, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;
    // rate limit: 1.5s
    if (Date.now() - lastSentRef.current < 1500) {
      setError('Tunggu sebentar sebelum mengirim pesan lagi.');
      return;
    }
    lastSentRef.current = Date.now();

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);
    setError('');

    try {
      const messageData = {
        user_id: user.id,
        username: user.username,
        email: user.email,
        content: messageContent,
        created_at: new Date().toISOString(),
        timestamp: new Date().getTime()
      };

      const { error: sendError } = await sendMessageToSheetDB(messageData);

      if (sendError) {
        console.error('Error sending message:', sendError);
        setError('Gagal mengirim pesan. Silakan coba lagi.');
        setNewMessage(messageContent);
        return;
      }

      // Add message to local state immediately for better UX
      setMessages(prev => [messageData, ...prev.slice(0, 99)]);
      
      // Focus back to input
      messageInputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Terjadi kesalahan saat mengirim pesan.');
      setNewMessage(messageContent);
    } finally {
      setSending(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('sheetdb_user');
    navigate('/Live-Discussion/login');
  };

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    const date = timestamp ? new Date(timestamp) : new Date();
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (hours > 0) {
      return `${hours} jam lalu`;
    } else if (minutes > 0) {
      return `${minutes} menit lalu`;
    } else if (seconds > 10) {
      return `${seconds} detik lalu`;
    } else {
      return 'Baru saja';
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Show loading state
  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-cyan-300 text-lg">Memuat pesan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0f172a]/95 to-[#1e293b]/95 backdrop-blur-lg text-white shadow-lg border-b border-cyan-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                Chat Realtime
              </h1>
              <p className="text-sm text-cyan-300/80">
                {user ? `Halo, ${user.username}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300 font-medium">Online</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition transform hover:-translate-y-0.5 shadow-lg"
            >
              <span className="hidden sm:inline">Logout</span>
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-300 text-sm">{error}</span>
              <button 
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="h-[calc(100vh-280px)] sm:h-[500px] overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-gray-900/50 to-gray-800/50 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <p className="text-cyan-300/70 text-lg mb-2">Belum ada pesan</p>
                <p className="text-cyan-300/50 text-sm">Mulai percakapan dengan mengirim pesan pertama!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isOwnMessage = message.email === user?.email;
                  const showAvatar = index === 0 || messages[index - 1].email !== message.email;

                  return (
                    <div
                      key={message.timestamp || index}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-md lg:max-w-lg ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        {showAvatar && !isOwnMessage && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-white text-sm font-bold">
                              {message.username?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-lg ${
                            isOwnMessage
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none'
                              : 'bg-white/10 backdrop-blur-lg text-white border border-white/20 rounded-bl-none'
                          }`}
                        >
                          {/* Username and Time */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold ${isOwnMessage ? 'text-cyan-100' : 'text-cyan-300'}`}>
                              {isOwnMessage ? 'Anda' : (message.username || 'User')}
                            </span>
                            <span className={`text-xs ${isOwnMessage ? 'text-cyan-200/70' : 'text-gray-400'}`}>
                              {formatTime(message.created_at || message.timestamp)}
                            </span>
                          </div>
                          
                          {/* Message Content */}
                          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-4 sm:p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => {
                      const v = e.target.value.slice(0, 500);
                      setNewMessage(v);
                      handleTyping();
                    }}
                    onInput={(e) => {
                      // autosize textarea, limit to 120px
                      try {
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      } catch (err) {}
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  placeholder="Ketik pesan... (Enter untuk kirim)"
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none custom-scrollbar"
                  disabled={sending}
                  rows="1"
                  style={{ maxHeight: '120px' }}
                />
                <div className="absolute right-3 bottom-3 text-cyan-300/50 text-xs">
                  {newMessage.length}/500
                </div>
              </div>
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  sending || !newMessage.trim()
                    ? 'bg-gray-600/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-0.5'
                } text-white`}
              >
                {sending ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                    </svg>
                    <span className="hidden sm:inline">Mengirim...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    <span className="hidden sm:inline">Kirim</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-lg rounded-full border border-white/10">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-cyan-300/80">
              {messages.length} pesan • Live dengan SheetDB
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Live;