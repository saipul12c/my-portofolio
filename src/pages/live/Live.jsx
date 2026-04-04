import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { supabase } from '../../lib/supabaseClient';

const USER_ROLES = {
  SUPER_ADMIN: { level: 6, name: 'Super Admin', badge: '👑', color: 'from-purple-600 to-pink-600', canManage: true },
  ADMIN: { level: 5, name: 'Admin', badge: '🛡️', color: 'from-red-500 to-orange-500', canManage: true },
  MODERATOR: { level: 4, name: 'Moderator', badge: '⭐', color: 'from-blue-500 to-cyan-500', canManage: true },
  PREMIUM: { level: 3, name: 'Premium', badge: '💎', color: 'from-green-500 to-emerald-500', canManage: false },
  VERIFIED: { level: 2, name: 'Verified', badge: '✅', color: 'from-yellow-500 to-amber-500', canManage: false },
  USER: { level: 1, name: 'User', badge: '👤', color: 'from-gray-500 to-gray-700', canManage: false }
};

// Limit pengiriman pesan - HARUS SAMA DENGAN BACKEND
const MESSAGE_LIMITS = {
  USER: 5,        // 5 pesan/bulan
  VERIFIED: 10,   // 10 pesan/bulan
  PREMIUM: 50,    // 50 pesan/bulan
  MODERATOR: 100, // 100 pesan/bulan
  ADMIN: 500,     // 500 pesan/bulan
  SUPER_ADMIN: 9999 // Unlimited
};

function Live() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [messageStats, setMessageStats] = useState({ sent: 0, remaining: 5 });
  const [userAchievements, setUserAchievements] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'online', 'offline'

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const lastSentRef = useRef(0);
  const fetchControllerRef = useRef(null);
  const navigate = useNavigate();
  const pollingIntervalRef = useRef(null);
  const lastScrollY = useRef(0);

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    // Header selalu ditampilkan
    lastScrollY.current = currentScrollY;
  };

  // Check user status in Database
  const checkUserStatus = useCallback(async () => {
    try {
      const savedRaw = localStorage.getItem('local_user');
      if (!savedRaw) {
        navigate('/Live-Discussion/login');
        return;
      }

      let savedParsed;
      try {
        savedParsed = JSON.parse(savedRaw);
        if (!savedParsed || !savedParsed.email) {
          throw new Error('Invalid user data');
        }
      } catch (_e) {
        console.error('Local user corrupted:', _e);
        localStorage.removeItem('local_user');
        navigate('/Live-Discussion/login');
        return;
      }

      // Cek user di database Supabase
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', savedParsed.email);

        if (data && data.length > 0) {
          const userRecord = data[0];
          const userStatus = userRecord.status?.toLowerCase();

          if (userStatus === 'active' || userStatus === 'aktif') {
            const userRole = userRecord.role?.toUpperCase() || 'USER';
            const roleConfig = USER_ROLES[userRole] || USER_ROLES.USER;

            const userData = {
              id: userRecord.id || savedParsed.id,
              username: userRecord.nama || savedParsed.username,
              email: userRecord.email,
              role: userRole,
              roleName: roleConfig.name,
              roleLevel: roleConfig.level,
              roleBadge: roleConfig.badge,
              roleColor: roleConfig.color,
              messageCount: parseInt(userRecord.message_count) || 0,
              lastReset: userRecord.last_reset || new Date().toISOString().split('T')[0],
              joinDate: userRecord.tanggal_daftar || savedParsed.tanggal_daftar
            };

            setUser(userData);

            // Update localStorage dengan data terbaru
            localStorage.setItem('local_user', JSON.stringify(userData));

            // Cek dan reset message count jika bulan baru
            await checkAndResetMessageCount(userRecord);

            // Load user achievements
            await loadUserAchievements(userRecord.email);
          } else {
            setError('Akun Anda dinonaktifkan. Silakan hubungi administrator.');
            setTimeout(() => {
              localStorage.removeItem('local_user');
              navigate('/Live-Discussion/login');
            }, 3000);
          }
        } else {
          setError('Akun tidak ditemukan. Silakan login kembali.');
          setTimeout(() => {
            localStorage.removeItem('local_user');
            navigate('/Live-Discussion/login');
          }, 3000);
        }
      } catch (fetchErr) {
        console.warn('Could not verify user status:', fetchErr);
        setError('Gagal memverifikasi akun. Silakan login kembali.');
      }
    } catch (err) {
      console.error('Error checking user status:', err);
      setError('Gagal memverifikasi akun. Silakan login kembali.');
    }
  }, [navigate]);

  // Cek dan reset message count jika bulan baru
  const checkAndResetMessageCount = useCallback(async (userRecord) => {
    const today = new Date();
    const currentMonth = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0');
    const lastReset = userRecord.last_reset || '';

    if (!lastReset.startsWith(currentMonth)) {
      try {
        await supabase
          .from('users')
          .update({
            message_count: 0,
            last_reset: today.toISOString().split('T')[0]
          })
          .eq('id', userRecord.id);

        if (user) {
          setUser(prev => ({
            ...prev,
            messageCount: 0,
            lastReset: today.toISOString().split('T')[0]
          }));
        }
      } catch (err) {
        console.error('Error resetting message count:', err);
      }
    }
  }, [user]);

  // Load user achievements
  const loadUserAchievements = useCallback(async (email) => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('email', email);

      if (data && data.length > 0) {
        setUserAchievements(data);
      }
    } catch (err) {
      console.log('Catatan: Tabel achievements belum dibuat di database.');
    }
  }, []);

  // Fetch messages from Database
  const fetchMessagesFromDatabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages(data);

        // Update message stats
        if (user) {
          const limit = MESSAGE_LIMITS[user.role] || 5;
          const remaining = Math.max(0, limit - user.messageCount);
          setMessageStats({ sent: user.messageCount, remaining });
        }
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Gagal memuat pesan. Silakan refresh halaman.');
    }
  }, [user]);

  // Setup Realtime Subscription and Presence
  const setupRealtime = useCallback(() => {
    // 1. Setup subscription for messages
    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => {
          const existingIndex = prev.findIndex(m => 
            (m.id === payload.new.id) || 
            (m.timestamp === payload.new.timestamp && m.email === payload.new.email)
          );

          if (existingIndex !== -1) {
            // Update pesan optimistik dengan data asli dari DB (terutama ID-nya)
            const updated = [...prev];
            updated[existingIndex] = payload.new;
            return updated;
          }
          return [payload.new, ...prev.slice(0, 99)];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => prev.map(m => (m.id === payload.new.id || (m.timestamp === payload.new.timestamp && m.email === payload.new.email) ? payload.new : m)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnectionStatus('online');
        if (status === 'CLOSED') setConnectionStatus('offline');
        if (status === 'CHANNEL_ERROR') setConnectionStatus('offline');
      });

    // 2. Setup subscription for presence (Online Users)
    let presenceChannel = null;
    if (user) {
      presenceChannel = supabase.channel('online-users');

      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const newState = presenceChannel.presenceState();
          // newState format: { "uuid-1": [{ username: "A", ... }], "uuid-2": ... }
          const activeUsers = {};
          Object.keys(newState).forEach(key => {
            if (newState[key] && newState[key][0]) {
              // Simpan data user berdasarkan email atau id
              const userData = newState[key][0];
              activeUsers[userData.email] = userData;
            }
          });
          setOnlineUsers(activeUsers);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await presenceChannel.track({
              email: user.email,
              username: user.username,
              role: user.role,
              onlineAt: new Date().toISOString(),
            });
          }
        });
    }

    return () => {
      supabase.removeChannel(messageSubscription);
      if (presenceChannel) supabase.removeChannel(presenceChannel);
    };
  }, [user]);

  // Load initial data
  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        await checkUserStatus();
        await fetchMessagesFromDatabase();
      } catch (err) {
        console.error('Error in initial load:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();

    // Fallback polling: Fetch messages every 30 seconds in case Realtime fails
    pollingIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMessagesFromDatabase();
      }
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [checkUserStatus, fetchMessagesFromDatabase]);

  // Setup Realtime Subscription
  useEffect(() => {
    const cleanup = setupRealtime();
    return () => {
      cleanup();
    };
  }, [setupRealtime]);

  // Auto scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Click outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom
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

  // Handle emoji click
  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  };

  // Handle reply
  const handleReply = (message) => {
    setReplyTo(message);
    messageInputRef.current?.focus();
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyTo(null);
  };

  // Send message to Database
  const sendMessageToDatabase = async (messageData) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select();

      if (error) throw error;
      return { data: data[0], error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // Update user message count
  const updateUserMessageCount = async (userId, newCount) => {
    try {
      await supabase
        .from('users')
        .update({ message_count: newCount })
        .eq('id', userId);
    } catch (err) {
      console.error('Error updating message count:', err);
    }
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    // Rate limit
    if (Date.now() - lastSentRef.current < 1500) {
      setError('Tunggu sebentar sebelum mengirim pesan lagi.');
      return;
    }

    // Check message limit
    const limit = MESSAGE_LIMITS[user.role] || 5;
    if (user.messageCount >= limit) {
      setError(`Anda telah mencapai limit ${limit} pesan/bulan.`);
      return;
    }

    lastSentRef.current = Date.now();
    const messageContent = newMessage.trim();
    setNewMessage('');
    setSending(true);
    setError('');
    setSuccess('');

    try {
      const messageData = {
        user_id: user.id,
        username: user.username,
        email: user.email,
        content: messageContent,
        role: user.role,
        reply_to: replyTo ? JSON.stringify({
          id: replyTo.id || replyTo.timestamp,
          username: replyTo.username,
          content: replyTo.content.substring(0, 50) + (replyTo.content.length > 50 ? '...' : '')
        }) : '',
        created_at: new Date().toISOString(),
        timestamp: new Date().getTime(),
        status: 'sending' // Optimistic flag
      };

      // 1. Optimistic Update (Show message instantly)
      setMessages(prev => [messageData, ...prev.slice(0, 99)]);
      setReplyTo(null);
      setNewMessage('');

      // 2. Send to DB
      const { data: savedData, error: sendError } = await sendMessageToDatabase(messageData);

      if (sendError) {
        // Rollback on error
        setMessages(prev => prev.filter(m => m.timestamp !== messageData.timestamp));
        setNewMessage(messageContent);
        throw new Error('Gagal mengirim pesan');
      }

      // 3. Update local state with real data from DB (ID is now present)
      if (savedData) {
        setMessages(prev => prev.map(m => m.timestamp === messageData.timestamp ? savedData : m));
      }

      // Update message count
      const newCount = user.messageCount + 1;
      await updateUserMessageCount(user.id, newCount);

      setUser(prev => ({
        ...prev,
        messageCount: newCount
      }));

      setSuccess('Pesan terkirim!');
      setTimeout(() => setSuccess(''), 3000);
      messageInputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSending(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('local_user');
    navigate('/Live-Discussion/login');
  };

  // Navigate to profile
  const goToProfile = () => {
    navigate('/Live-Discussion/profile');
  };

  // Navigate to dashboard (for admins)
  const goToDashboard = () => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      navigate('/Live-Discussion/dashboard');
    }
  };

  // Format timestamp
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

  // Get role badge
  const getRoleBadge = (role) => {
    const roleConfig = USER_ROLES[role] || USER_ROLES.USER;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${roleConfig.color} text-white`}>
        {roleConfig.badge} {roleConfig.name}
      </span>
    );
  };

  // Parse reply data
  const parseReplyData = (replyString) => {
    try {
      return JSON.parse(replyString);
    } catch {
      return null;
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    try {
      const { error } = await supabase.from('messages').delete().eq('id', messageId);
      if (error) throw error;
      setSuccess('Pesan berhasil dihapus');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Gagal menghapus pesan.');
    }
  };

  // Start edit message
  const startEditMessage = (message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
    messageInputRef.current?.focus();
  };

  // Save edited message
  const handleSaveEdit = async () => {
    if (!newMessage.trim() || !editingMessage) return;
    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .update({ content: newMessage.trim(), is_edited: true })
        .eq('id', editingMessage.id);

      if (error) throw error;
      setSuccess('Pesan diperbarui');
      setEditingMessage(null);
      setNewMessage('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating message:', err);
      setError('Gagal mengedit pesan.');
    } finally {
      setSending(false);
    }
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setNewMessage('');
  };

  // Copy message content
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Teks disalin!');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Helper untuk mem-parsing Markdown ringan dan mention pengguna
  // **bold**, *italic*, dan @username
  const renderMessageContent = (content) => {
    if (!content) return null;

    // Pecah berdasarkan regex untuk menangkap marker (**, *, @) dengan teks didalamnya
    // Regex logic:
    // **...** -> bold
    // *...* -> italic
    // @username -> mention
    const parts = content.split(/(\*\*.*?\*\*|\*[^*]+\*|@\w+)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      } else if (part.startsWith('@') && part.length > 1) {
        // Cek apakah username tersebut yang sedang login atau bukan
        const isSelfMention = user && part.slice(1).toLowerCase() === user.username.toLowerCase();
        return (
          <span key={i} className={`font-semibold cursor-pointer px-1 rounded ${isSelfMention ? 'bg-amber-500/30 text-amber-200' : 'text-blue-300 hover:underline'}`}>
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Loading state
  if (loading) {
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
    <div className={`h-screen w-full bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] relative overflow-hidden flex flex-col transition-all duration-300 ${showHeader ? 'pt-[76px] sm:pt-[88px]' : 'pt-0'}`}>
      {/* Animated Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 md:w-96 h-72 md:h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-purple-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] right-[30%] w-72 md:w-96 h-72 md:h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Header */}
      <header className={`absolute top-0 left-0 right-0 bg-gradient-to-r from-[#0f172a]/90 to-[#1e293b]/90 backdrop-blur-xl text-white shadow-lg border-b border-cyan-500/20 z-50 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                Chat Realtime
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-cyan-300/80">
                  {user ? `Halo, ${user.username}` : ''}
                </p>
                {/* Indikator Jumlah Online */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${connectionStatus === 'online' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  <span className="text-xs font-medium" style={{ color: connectionStatus === 'online' ? '#4ade80' : connectionStatus === 'connecting' ? '#fbbf24' : '#ef4444' }}>
                    {connectionStatus === 'online' ? `${Object.keys(onlineUsers).length} Online` : connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Message Limit Indicator */}
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <span className="text-xs text-blue-300">
                  Pesan: {user.messageCount}/{MESSAGE_LIMITS[user.role] || 5}
                </span>
              </div>
            )}

            {/* Role Badge */}
            {user && (
              <div className="flex">
                {getRoleBadge(user.role)}
              </div>
            )}

            {/* Admin Dashboard Button */}
            {user && (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') && (
              <button
                onClick={goToDashboard}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none transition shadow-lg"
              >
                Dashboard
              </button>
            )}

            {/* Profile Button */}
            <button
              onClick={goToProfile}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none transition shadow-lg"
            >
              Profile
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none transition shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col relative z-10">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-300 text-sm">{success}</span>
            </div>
          </div>
        )}

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

        {/* Reply Preview */}
        {replyTo && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-300 font-medium">Membalas {replyTo.username}</p>
                <p className="text-sm text-blue-200/70 truncate">{replyTo.content}</p>
              </div>
              <button
                onClick={cancelReply}
                className="text-blue-400 hover:text-blue-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 min-h-0 flex flex-col bg-white/[0.03] backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden border border-white/10">
          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-3 sm:p-5 bg-transparent custom-scrollbar"
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
                  const replyData = message.reply_to ? parseReplyData(message.reply_to) : null;

                  return (
                    <div
                      key={message.timestamp || index}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-md lg:max-w-lg ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        {showAvatar && !isOwnMessage && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => navigate(`/Live-Discussion/profile/${message.email}`)}>
                              <span className="text-white text-sm font-bold">
                                {message.username?.[0]?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <span className="text-xs text-cyan-300/70 truncate max-w-[80px]">
                              {message.username}
                            </span>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl px-3.5 py-2 shadow-lg min-w-[120px] transition-opacity duration-300 ${message.status === 'sending' ? 'opacity-70' : 'opacity-100'} ${isOwnMessage
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none'
                            : 'bg-white/10 backdrop-blur-lg text-white border border-white/20 rounded-bl-none'
                            }`}
                        >
                          {/* Reply Preview */}
                          {replyData && (
                            <div className={`mb-2 p-2 rounded-lg ${isOwnMessage ? 'bg-cyan-400/30' : 'bg-gray-700/50'} border-l-4 ${isOwnMessage ? 'border-cyan-300' : 'border-gray-500'}`}>
                              <p className="text-xs font-semibold truncate">{replyData.username}</p>
                              <p className="text-xs opacity-75 truncate">{replyData.content}</p>
                            </div>
                          )}

                          {/* Role Badge */}
                          {!isOwnMessage && message.role && message.role !== 'USER' && (
                            <div className="mb-1">
                              {getRoleBadge(message.role)}
                            </div>
                          )}

                          {/* Message Content */}
                          <div className="text-sm leading-relaxed break-words whitespace-pre-wrap mb-2">
                            {renderMessageContent(message.content)}
                            {message.is_edited && (
                              <span className="text-[10px] text-gray-400/80 italic ml-2">(edited)</span>
                            )}
                          </div>

                          {/* Message Footer */}
                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${isOwnMessage ? 'text-cyan-200/70' : 'text-gray-400'}`}>
                              {formatTime(message.created_at || message.timestamp)}
                            </span>

                            {/* Message Actions */}
                            <div className="flex items-center gap-2">
                              {/* Opsi Extra: Copy, Edit, Delete */}
                              <div className="group relative">
                                <button className="text-xs text-gray-400 hover:text-white p-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                  </svg>
                                </button>
                                <div className="absolute bottom-full right-0 mb-1 hidden group-hover:flex flex-col bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10 w-24">
                                  <button onClick={() => copyToClipboard(message.content)} className="text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 w-full transition-colors">
                                    Copy
                                  </button>
                                  {(isOwnMessage || (user && ['SUPER_ADMIN', 'ADMIN'].includes(user.role))) && (
                                    <>
                                      {isOwnMessage && (
                                        <button onClick={() => startEditMessage(message)} className="text-left px-3 py-2 text-xs text-blue-300 hover:bg-gray-700 w-full transition-colors">
                                          Edit
                                        </button>
                                      )}
                                      <button onClick={() => handleDeleteMessage(message.id)} className="text-left px-3 py-2 text-xs text-red-400 hover:bg-gray-700 w-full transition-colors">
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Reply Button */}
                              {!isOwnMessage && (
                                <button
                                  onClick={() => handleReply(message)}
                                  className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                                  </svg>
                                  Balas
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Edit Alert */}
          {editingMessage && (
            <div className="bg-blue-900/40 border-t border-b border-blue-500/30 p-3 px-4 sm:px-6 flex justify-between items-center">
              <div>
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Mode Edit</span>
                <p className="text-sm text-gray-300 truncate mt-0.5">Memperbarui pesan yang terkirim</p>
              </div>
              <button onClick={cancelEdit} className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-white/10 p-4 sm:p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 relative">

            {/* Markdown Helper Label */}
            <div className="absolute -top-6 right-6 text-[10px] text-gray-500 hidden sm:flex gap-3">
              <span><strong className="text-gray-400">**teks**</strong> bold</span>
              <span><em className="text-gray-400">*teks*</em> italic</span>
              <span><span className="text-blue-400">@user</span> mention</span>
            </div>

            <form onSubmit={editingMessage ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleSendMessage} className="flex gap-3">
              {/* Emoji Picker Button */}
              <div className="relative flex-shrink-0" ref={emojiPickerRef}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all transform active:scale-95 shadow-sm"
                  title="Pilih Emoji"
                >
                  <span className="text-xl">😀</span>
                </button>

                {/* Emoji Picker - Penyesuaian agar responsif di HP */}
                {showEmojiPicker && (
                  <div className="absolute bottom-16 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                    <div className="hidden sm:block">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width={300}
                        height={400}
                        theme="dark"
                      />
                    </div>
                    {/* Size selector lebih kecil khusus untuk HP */}
                    <div className="sm:hidden block">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width={260}
                        height={350}
                        theme="dark"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                <label htmlFor="message-input" className="sr-only">Message content</label>
                <textarea
                  id="message-input"
                  name="message-input"
                  ref={messageInputRef}
                  value={newMessage}
                  onChange={(e) => {
                    const v = e.target.value.slice(0, 500);
                    setNewMessage(v);
                    handleTyping();
                  }}
                  onInput={(e) => {
                    try {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    } catch (err) { }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      editingMessage ? handleSaveEdit() : handleSendMessage(e);
                    }
                  }}
                  placeholder="Ketik pesan... (Enter untuk kirim, Shift+Enter untuk baris baru)"
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
                disabled={sending || !newMessage.trim() || (!editingMessage && user && user.messageCount >= (MESSAGE_LIMITS[user.role] || 5))}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${sending || !newMessage.trim() || (!editingMessage && user && user.messageCount >= (MESSAGE_LIMITS[user.role] || 5))
                  ? 'bg-gray-600/50 cursor-not-allowed'
                  : editingMessage
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transform hover:-translate-y-0.5'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-0.5'
                  } text-white`}
              >
                {sending ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75" />
                    </svg>
                    <span className="hidden sm:inline">{editingMessage ? 'Menyimpan...' : 'Mengirim...'}</span>
                  </>
                ) : (
                  <>
                    {editingMessage ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    )}
                    <span className="hidden sm:inline">{editingMessage ? 'Simpan' : 'Kirim'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Message Limit Info */}
            {user && (
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-2 w-full">
                <div className="text-cyan-300/70 font-medium bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 w-fit">
                  Batas Pesan: {user.messageCount} / {MESSAGE_LIMITS[user.role] || 5}
                </div>
                <div className="text-gray-400 font-medium">
                  {user.roleName} • {user.roleBadge}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Live;