import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Mail, Lock, User, AlertCircle, CheckCircle, Send, Plus, Smile, MessageCircle, LogOut, LayoutDashboard, UserCircle, Copy, Edit2, Trash2, Reply, ArrowLeft, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import EmojiPicker from 'emoji-picker-react';
import GuestCTA from './components/GuestCTA';
import { useAchievements, ACHIEVEMENTS } from './hooks/useAchievements';
import { ProfileEditor } from './components/ProfileEditor';
import { MentionInput } from './components/MentionInput';
import { NotificationCenter, MentionNotifications } from './components/NotificationCenter';
import { useMentions } from './hooks/useMentions';
import { ReactionPicker, MessageReactions } from './components/ReactionPicker';
import { MemberSidebar } from './components/MemberSidebar';
import { Paperclip, Image as ImageIcon, Users as UsersIcon, AlertTriangle, Bell, Sun, Moon, Monitor, ShieldAlert } from 'lucide-react';
import { containsProfanity } from './utils/profanityFilter';

const USER_ROLES = {
  SUPER_ADMIN: { level: 10, name: 'Super Admin', badge: '👑', color: 'from-purple-600 to-pink-600', canManage: true },
  ADMIN: { level: 8, name: 'Admin', badge: '🛡️', color: 'from-red-500 to-orange-500', canManage: true },
  MODERATOR: { level: 5, name: 'Moderator', badge: '⭐', color: 'from-blue-500 to-cyan-500', canManage: true },
  PREMIUM: { level: 3, name: 'Premium', badge: '💎', color: 'from-green-500 to-emerald-500', canManage: false },
  VERIFIED: { level: 2, name: 'Verified', badge: '✅', color: 'from-yellow-500 to-amber-500', canManage: false },
  USER: { level: 1, name: 'User', badge: '👤', color: 'from-gray-500 to-gray-700', canManage: false }
};

// System Config State (Fase Sinkronisasi & Security)
const INITIAL_CONFIG = {
  message_limits: {
    SUPER_ADMIN: 999999,
    ADMIN: 500,
    MODERATOR: 100,
    PREMIUM: 50,
    VERIFIED: 25,
    USER: 5
  },
  maintenance_mode: false
};

function Live() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [showBadWordAlert, setShowBadWordAlert] = useState(false);
  const [success, setSuccess] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [messageStats, setMessageStats] = useState({ sent: 0, remaining: 5 });
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [showHeader, setShowHeader] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'online', 'offline'

  // Hook Achievement Internal
  const { userAchievements, loadAchievements, unlockAchievement } = useAchievements();

  const [typingUsers, setTypingUsers] = useState({}); // { email: { username, timestamp } }
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // New Integration States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editForm, setEditForm] = useState({ nama: '', bio: '' });
  const [mentions, setMentions] = useState([]);
  const [unreadMentions, setUnreadMentions] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [systemConfig, setSystemConfig] = useState(INITIAL_CONFIG);

  // Reaction & Media States
  const [reactions, setReactions] = useState({}); // { messageId: [ {emoji, user_id} ] }
  const [activeReactionPicker, setActiveReactionPicker] = useState(null); // messageId
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef(null);

  // Sidebar & Moderation States
  const [showMembers, setShowMembers] = useState(false);
  const [allProfiles, setAllProfiles] = useState([]);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const lastSentRef = useRef(0);
  const fetchControllerRef = useRef(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const navigate = useNavigate();
  const pollingIntervalRef = useRef(null);
  const lastScrollY = useRef(0);

  // Header state
  const [scrolled, setScrolled] = useState(false);

  // Sync Live CS context with Chatbot settings
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saipul_settings') || '{}');
      const originalContext = saved.settingsContext;
      
      // Set context to live-cs
      localStorage.setItem('saipul_settings', JSON.stringify({
        ...saved,
        settingsContext: 'live-cs'
      }));
      
      // Dispatch event to notify Chatbot components
      window.dispatchEvent(new CustomEvent('saipul_settings_updated', { 
        detail: { key: 'settingsContext', value: 'live-cs' } 
      }));

      return () => {
        // Restore original context on unmount
        const current = JSON.parse(localStorage.getItem('saipul_settings') || '{}');
        localStorage.setItem('saipul_settings', JSON.stringify({
          ...current,
          settingsContext: originalContext || null
        }));
        window.dispatchEvent(new CustomEvent('saipul_settings_updated', { 
          detail: { key: 'settingsContext', value: originalContext || null } 
        }));
      };
    } catch (e) {
      console.warn('Failed to sync Live CS context', e);
    }
  }, []);
  const [theme, setTheme] = useState(localStorage.getItem('saipul_theme') || 'default');

  // Sync theme
  useEffect(() => {
    localStorage.setItem('saipul_theme', theme);
  }, [theme]);
  
  // Handle scroll for header effect
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    
    const onScroll = () => setScrolled(el.scrollTop > 20);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Check user status in Database (Security Enhanced)
  const checkUserStatus = useCallback(async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        setUser(null);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      // Handle banned or deactivated account (ONLY if profile data is available)
      if (data) {
        const userStatus = data.status?.toLowerCase();
        if (userStatus === 'nonaktif' || userStatus === 'banned') {
          setError('Akun Anda dinonaktifkan atau diblokir.');
          setTimeout(() => {
            supabase.auth.signOut();
            setUser(null);
          }, 3000);
          return;
        }
      }

      const userRole = (data?.role || 'USER').toUpperCase();
      const roleConfig = USER_ROLES[userRole] || USER_ROLES.USER;

      // Use Database Data IF available, else fallback to Auth User Metadata
      const userData = {
         id: authUser.id,
         username: data?.nama || authUser.user_metadata?.nama || authUser.email.split('@')[0],
         email: authUser.email, 
         role: userRole,
         roleName: roleConfig.name,
         roleLevel: roleConfig.level,
         roleBadge: roleConfig.badge,
         roleColor: roleConfig.color,
         messageCount: parseInt(data?.message_count) || 0,
         lastReset: data?.last_reset || new Date().toISOString().split('T')[0],
         joinDate: data?.tanggal_daftar || authUser.created_at,
         muteUntil: data?.mute_until,
         isShadowbanned: data?.is_shadowbanned || false,
         banReason: data?.ban_reason,
         muteReason: data?.mute_reason
      };

      setUser(userData);
      localStorage.setItem('local_user', JSON.stringify(userData));
      
      if (data?.id) {
        await loadAchievements(data.id);
        await fetchMentions(data.id);
      }
    } catch (err) {
      console.error('Error checking user status:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadAchievements]);


  // Fetch messages from Database
  const fetchMessagesFromDatabase = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50); // Fetch 50 at a time for better performance

      if (error) throw error;

      if (data) {
        setMessages(data);
        setHasMore(data.length === 50);
        
        // Fetch reactions for these messages
        fetchReactionsForMessages(data.map(m => m.id));

        // Update message stats
        if (user) {
          const limit = systemConfig.message_limits[user.role] || 5;
          const remaining = Math.max(0, limit - user.messageCount);
          setMessageStats({ sent: user.messageCount, remaining });
        }
        
        // Fetch all profiles for member sidebar
        fetchAllProfiles();
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Gagal memuat pesan. Silakan refresh halaman.');
    }
  }, [user]);

  // Load more messages (Cursor-based pagination with Tie-Breaker)
  const loadMoreMessages = useCallback(async () => {
    if (fetchingMore || !hasMore || messages.length === 0) return;

    setFetchingMore(true);
    try {
      const oldestMessage = messages[messages.length - 1];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        // Cursor logic: lt timestamp OR (eq timestamp AND lt id)
        .or(`timestamp.lt.${oldestMessage.timestamp},and(timestamp.eq.${oldestMessage.timestamp},id.lt.${oldestMessage.id})`)
        .order('timestamp', { ascending: false })
        .order('id', { ascending: false }) // Secondary sort
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages(prev => [...prev, ...data]);
        setHasMore(data.length === 50);
        
        // Fetch reactions for new messages
        fetchReactionsForMessages(data.map(m => m.id));
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
    } finally {
      setFetchingMore(false);
    }
  }, [fetchingMore, hasMore, messages]);

  // Setup Realtime Subscription and Presence
  const setupRealtime = useCallback(() => {
    // 1. Setup subscription for messages
    let messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => {
          const existingIndex = prev.findIndex(m => 
            (m.id === payload.new.id) || 
            (payload.new.correlation_id && m.correlation_id === payload.new.correlation_id)
          );

          if (existingIndex !== -1) {
            // Update pesan optimistik dengan data asli dari DB (terutama ID-nya)
            const updated = [...prev];
            updated[existingIndex] = payload.new;
            return updated;
          }
          return [payload.new, ...prev];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => prev.map(m => (m.id === payload.new.id || (payload.new.correlation_id && m.correlation_id === payload.new.correlation_id) ? payload.new : m)));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, payload => {
        setMessages(prev => prev.filter(m => m.id !== payload.old.id));
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (!user || payload.id !== user.id) {
          setTypingUsers(prev => ({
            ...prev,
            [payload.id]: { username: payload.username, timestamp: Date.now() }
          }));
        }
      });

    if (user?.id) {
      messageSubscription = messageSubscription.on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'mentions', 
        filter: `target_id=eq.${user.id}` 
      }, async (payload) => {
        // Fetch message content for notification
        const { data: msgData } = await supabase
          .from('messages')
          .select('content, username')
          .eq('id', payload.new.message_id)
          .single();

        if (msgData) {
          const newMention = {
            fromUser: msgData.username,
            messagePreview: msgData.content,
            time: new Date().toLocaleTimeString(),
            timestamp: Date.now()
          };
          setMentions(prev => [newMention, ...prev]);
          setUnreadMentions(prev => prev + 1);
        }
      });
    }

    messageSubscription.subscribe((status) => {
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, payload => {
          setReactions(prev => {
            const msgId = payload.new?.message_id || payload.old?.message_id;
            if (!msgId) return prev;
            
            const currentReactions = prev[msgId] || [];
            if (payload.eventType === 'INSERT') {
              return { ...prev, [msgId]: [...currentReactions, payload.new] };
            }
            if (payload.eventType === 'DELETE') {
              return { ...prev, [msgId]: currentReactions.filter(r => r.id !== payload.old.id) };
            }
            return prev;
          });
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
    let isMounted = true;
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
        setConnectionStatus('offline'); // Mungkin koneksi lambat
      }
    }, 5000); // 5 detik safety timeout

    const initData = async () => {
      try {
        setLoading(true);
        await checkUserStatus();
        await fetchMessagesFromDatabase();
      } catch (err) {
        console.error('Error in initial load:', err);
      } finally {
        if (isMounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      }
    };
    initData();

    // Fallback polling: Fetch messages every 30 seconds in case Realtime fails
    pollingIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMessagesFromDatabase();
      }
    }, 30000);

    fetchSystemConfig();

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [checkUserStatus, fetchMessagesFromDatabase]);

  // Fetch Dynamic System Config
  const fetchSystemConfig = async () => {
    try {
      const { data, error } = await supabase.from('system_config').select('*');
      if (error) throw error;
      
      const configObj = { ...INITIAL_CONFIG };
      data.forEach(item => {
        configObj[item.key] = item.value;
      });
      setSystemConfig(configObj);
    } catch (err) {
      console.warn('System config fetch failed, using defaults');
    }
  };

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

  // Handle typing indicator broadcast
  const handleTyping = useCallback(() => {
    if (!user) return;
    
    if (!isTyping) {
      setIsTyping(true);
      // Broadcast signal to others
      supabase.channel('public:messages').send({
        type: 'broadcast',
        event: 'typing',
        payload: { id: user.id, username: user.username }
      });
      
      setTimeout(() => setIsTyping(false), 2000);
    }
  }, [isTyping, user]);

  // Handle scroll detection for Scroll to Bottom FAB & Infinite Scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // 1. Show "Scroll to Bottom" button if we are scrolled up
    const isUp = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollToBottom(isUp);

    // 2. Infinite Scroll: Fetch more when reaching the TOP (scrollTop near 0)
    // We use a small threshold like 100px
    if (scrollTop < 100 && !fetchingMore && hasMore) {
      loadMoreMessages();
    }
  };

  // Cleanup effect for stale typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => {
        const filtered = {};
        let changed = false;
        Object.entries(prev).forEach(([id, data]) => {
          if (now - data.timestamp < 3000) {
            filtered[id] = data;
          } else {
            changed = true;
          }
        });
        return changed ? filtered : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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


  // Handle send message
  const handleSendMessage = async (e, mediaUrl = null) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !mediaUrl) || !user || sending) return;

    // Maintenance Check (Admin Bypass level Logic)
    if (systemConfig.maintenance_mode && !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      setError('Sistem sedang dalam pemeliharaan (Maintenance Mode). Chat dinonaktifkan sementara.');
      return;
    }

    // Rate limit (Frontend Cooldown - Sycned with DB 2s)
    if (Date.now() - lastSentRef.current < 2000) {
      setError('Tenang! Mohon tunggu 2 detik antar pesan.');
      return;
    }

    // Check message limit (Dynamic)
    const limit = systemConfig.message_limits[user.role] || 5;
    if (user.messageCount >= limit) {
      setError(`Limit tercapai (${user.messageCount}/${limit}). Upgrade akun untuk mengirim lebih banyak pesan.`);
      return;
    }

    // Moderation Checks
    if (user.muteUntil && new Date(user.muteUntil) > new Date()) {
      setError(`Muted: Anda sedang di-mute sampai ${new Date(user.muteUntil).toLocaleString()}.`);
      return;
    }

    lastSentRef.current = Date.now();
    const messageContent = newMessage.trim();
    if (!messageContent && !mediaUrl) return;
    
    setNewMessage('');
    setSending(true);
    setError('');
    setSuccess('');

    // 1. Profanity Filter (Premium Auto-Mod)
    if (containsProfanity(messageContent)) {
      setError('Pesan Anda mengandung kata-kata yang tidak diperbolehkan. Mohon jaga kesopanan.');
      setSending(false);
      return;
    }

    const correlationId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const messageData = {
        user_id: user.id,
        username: user.username,
        content: messageContent,
        role: user.role,
        reply_to: replyTo ? {
          id: replyTo.id || replyTo.timestamp,
          username: replyTo.username,
          content: replyTo.content.substring(0, 50) + (replyTo.content.length > 50 ? '...' : '')
        } : null,
        media_url: mediaUrl,
        correlation_id: correlationId,
        created_at: new Date().toISOString(),
        timestamp: new Date().getTime(),
        status: 'sending' 
      };

      // 1. Optimistic Update (Show message instantly)
      setMessages(prev => [messageData, ...prev.slice(0, 99)]);
      setReplyTo(null);
      setNewMessage('');

      // 2. Send to DB
      const { data: savedData, error: sendError } = await sendMessageToDatabase({
        ...messageData,
        status: 'sent' 
      });

      if (sendError) {
        // Rollback & Show Exact DB Error (Anti-Spam, Cooldown, etc)
        setMessages(prev => prev.filter(m => m.correlation_id !== correlationId));
        setNewMessage(messageContent);
        setError(sendError.message || 'Gagal mengirim pesan');
        throw sendError;
      }

      // 3. Update local state with real data
      if (savedData) {
        setMessages(prev => prev.map(m => m.correlation_id === correlationId ? savedData : m));
      }

      // 4. Update message count lokal (DB Trigger akan menghitung di backend)
      const newCount = user.messageCount + 1;
      setUser(prev => ({ ...prev, messageCount: newCount }));

      // 5. Achievement Check: Handled by Backend DB Trigger
      // We just need to refresh achievements locally if count is special
      if ([1, 10, 50, 100].includes(newCount)) {
        setTimeout(() => loadAchievements(user.id), 2000);
      }

      setSuccess('Pesan terkirim!');
      setTimeout(() => setSuccess(''), 3000);

      // 6. Mentions are now handled automatically by the Database Trigger
      // (Simplified frontend logic for better security and performance)

      messageInputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSending(false);
    }
  };

  // Handle logout/login
  const handleAuthAction = () => {
    if (user) {
      localStorage.removeItem('local_user');
      navigate('/Live-Discussion/login');
    } else {
      navigate('/Live-Discussion/login');
    }
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

  // Handle Profile Save
  const handleSaveProfile = async (formData) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('users')
        .update({
          nama: formData.nama,
          bio: formData.bio
        })
        .eq('id', user.id);

      if (error) {
        if (error.code === '23505') {
          alert('Nama ini sudah digunakan oleh pengguna lain. Silakan pilih nama lain.');
        } else {
          throw error;
        }
        return false;
      }
      
      // Update local state
      setUser(prev => ({ ...prev, username: formData.nama, bio: formData.bio }));
      alert('Profil berhasil diperbarui!');
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Gagal memperbarui profil: ' + err.message);
      return false;
    }
  };

  const openProfileEditor = (targetUser = user) => {
    setProfileData(targetUser);
    setEditForm({
      nama: targetUser.username || targetUser.nama || '',
      bio: targetUser.bio || ''
    });
    setShowProfileModal(true);
  };

  const fetchAllProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username', { ascending: true });

      if (error) throw error;
      setAllProfiles(data);
    } catch (err) {
      console.error('Error fetching all profiles:', err);
    }
  };

  const fetchMentions = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('mentions')
        .select('*, message:messages(content, username)')
        .eq('target_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formatted = data.map(m => ({
        fromUser: m.message.username,
        messagePreview: m.message.content,
        time: new Date(m.created_at).toLocaleTimeString(),
        timestamp: new Date(m.created_at).getTime()
      }));
      
      setMentions(formatted);
      setUnreadMentions(formatted.length);
    } catch (err) {
      console.error('Error fetching mentions:', err);
    }
  };

  const handleReportMessage = async (message) => {
    if (!user) return;
    
    // Check if user confirmed? Let's just do it for now
    if (!window.confirm('Laporkan pesan ini karena melanggar aturan?')) return;

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          message_id: message.id,
          reporter_id: user.id,
          reason: 'MANUAL_REPORT'
        });

      if (error) throw error;
      setSuccess('Pesan telah dilaporkan ke moderator.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error reporting message:', err);
      setError('Gagal melaporkan pesan.');
    }
  };
  
  const handleSumbitAppeal = async () => {
    if (!appealReason.trim() || !user) return;
    setIsSubmittingAppeal(true);
    try {
      const { error } = await supabase
        .from('appeals')
        .insert({
          user_id: user.id,
          reason: appealReason.trim()
        });
        
      if (error) throw error;
      setSuccess('Banding berhasil dikirim. Mohon tunggu evaluasi Moderator.');
      setShowAppealModal(false);
      setAppealReason('');
    } catch (err) {
      console.error('Error submitting appeal:', err);
      setError('Gagal mengirim banding. Coba lagi nanti.');
    } finally {
      setIsSubmittingAppeal(false);
    }
  };

  // Reactions Logic
  const fetchReactionsForMessages = async (messageIds) => {
    if (!messageIds.length) return;
    try {
      const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .in('message_id', messageIds);

      if (error) throw error;
      
      const grouped = data.reduce((acc, curr) => {
        acc[curr.message_id] = acc[curr.message_id] || [];
        acc[curr.message_id].push(curr);
        return acc;
      }, {});
      
      setReactions(prev => ({ ...prev, ...grouped }));
    } catch (err) {
      console.error('Error fetching reactions:', err);
    }
  };

  const toggleReaction = async (messageId, emoji) => {
    if (!user) return;
    
    const existing = (reactions[messageId] || []).find(
      r => r.emoji === emoji && r.user_id === user.id
    );

    try {
      if (existing) {
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id);
      } else {
        await supabase
          .from('reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            emoji: emoji
          });
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
    }
  };

  // Media Upload Logic
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diperbolehkan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5MB');
      return;
    }

    setUploadingMedia(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('live_discussion_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('live_discussion_media')
        .getPublicUrl(filePath);

      // Send image URL as a message
      await handleSendMessage(null, data.publicUrl);
      setSuccess('Gambar berhasil diunggah!');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Gagal mengunggah gambar.');
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Parse reply data - Supabase JSONB is already an object
  const parseReplyData = (replyData) => {
    if (!replyData) return null;
    if (typeof replyData === 'object') return replyData;
    try {
      return JSON.parse(replyData);
    } catch {
      return null;
    }
  };

  // Delete message
  const handleDeleteMessage = async (message) => {
    const messageId = typeof message === 'object' ? message.id : message;
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    
    try {
      // 1. If has media, delete from storage
      if (typeof message === 'object' && message.media_url) {
        try {
          const path = message.media_url.split('/public/live_discussion_media/')[1];
          if (path) {
            await supabase.storage.from('live_discussion_media').remove([path]);
          }
        } catch (storageErr) {
          console.warn('Could not cleanup storage asset:', storageErr);
        }
      }

      // 2. Delete from DB
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
      <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"
        />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6 mx-auto"></div>
          <p className="text-cyan-400 font-bold tracking-widest uppercase text-xs">Menghubungkan ke Diskusi...</p>
        </div>
      </div>
    );
  }

  // Punishment Screen (Banned User)
  if (user && user.banReason) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-50" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/[0.02] backdrop-blur-3xl border border-red-500/20 p-10 rounded-[3rem] text-center relative z-10 shadow-2xl"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Akses Terputus</h2>
          <p className="text-red-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-6">Status: Permanent Restriction</p>
          
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mb-8 text-left">
            <span className="text-[10px] font-black uppercase text-white/20 italic block mb-2">Reason for Closure:</span>
            <p className="text-sm text-white/80 leading-relaxed italic">"{user.banReason || 'Pelanggaran standar komunitas yang berat.'}"</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setShowAppealModal(true)}
              className="w-full py-4 bg-white text-[#020617] rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Ajukan Banding
            </button>
            <button 
              onClick={handleAuthAction}
              className="w-full py-4 bg-white/5 border border-white/10 text-white/60 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
            >
              Keluar dari Sistem
            </button>
          </div>
        </motion.div>

        {/* Appeal Modal */}
        <AnimatePresence>
          {showAppealModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl overflow-hidden"
              >
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Sirkuit Banding</h3>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Ajukan alasan kenapa restriksi Anda harus dicabut</p>
                
                <textarea 
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  placeholder="Ceritakan alasan Anda..."
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 transition-all mb-6 resize-none"
                />

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowAppealModal(false)}
                    className="flex-1 py-4 bg-white/5 rounded-2xl font-black text-xs uppercase tracking-widest text-white/40 hover:text-white"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={handleSumbitAppeal}
                    disabled={isSubmittingAppeal || !appealReason.trim()}
                    className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-600/20 disabled:opacity-20"
                  >
                    {isSubmittingAppeal ? 'Mengirim...' : 'Kirim Banding'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`theme-${theme} h-[100dvh] w-full bg-[var(--theme-bg)] text-[var(--theme-text)] relative overflow-hidden flex flex-col font-sans selection:bg-[var(--theme-accent)] selection:text-[var(--theme-bg)]`}>
      {/* Immersive Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 120, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px]"
        />
      </div>

      {/* Modern Floating Header (Integrated into Flex Flow) */}
      <div className="z-50 p-2 sm:p-4 w-full">
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`max-w-6xl mx-auto w-full transition-all duration-500 rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] backdrop-blur-2xl py-4 px-4 sm:px-8 shadow-xl`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-bold text-[var(--theme-text)] tracking-tight leading-tight">Sinyal Live</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'online' ? 'bg-[var(--theme-accent)] animate-pulse shadow-[0_0_10px_var(--theme-accent)]' : 'bg-red-500'}`} />
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[var(--theme-text-muted)]">
                    {Object.keys(onlineUsers).length} <span className="hidden sm:inline">Signals</span> Online
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Online Users Avatar Stack */}
              <div className="hidden lg:flex items-center -space-x-3">
                {Object.values(onlineUsers).slice(0, 4).map((u, i) => (
                  <motion.div 
                    key={u.email || i}
                    initial={{ scale: 0, x: 10 }}
                    animate={{ scale: 1, x: 0 }}
                    className="w-8 h-8 rounded-full border-2 border-[#020617] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-black text-white ring-2 ring-white/5" 
                    title={u.username}
                  >
                    {u.username?.[0]?.toUpperCase()}
                  </motion.div>
                ))}
                {Object.keys(onlineUsers).length > 4 && (
                  <div className="w-8 h-8 rounded-full border-2 border-[var(--theme-bg)] bg-[var(--theme-surface)] backdrop-blur-md flex items-center justify-center text-[9px] font-black text-[var(--theme-text-muted)] ring-1 ring-[var(--theme-border)] uppercase">
                    +{Object.keys(onlineUsers).length - 4}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {user && (
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-xs font-black text-[var(--theme-text)] italic uppercase tracking-tighter">{user.username}</span>
                    <div className="flex items-center gap-1 opacity-70">
                      {getRoleBadge(user.role)}
                    </div>
                  </div>
                )}
                
                <div className="hidden sm:flex items-center gap-1.5 p-1.5 bg-[var(--theme-surface)] rounded-2xl border border-[var(--theme-border)] backdrop-blur-xl">
                  {/* Theme Switcher */}
                  <button 
                    onClick={() => setTheme(prev => prev === 'default' ? 'light' : prev === 'light' ? 'dark' : 'default')}
                    className="p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                    title={`Tema: ${theme}`}
                  >
                     {theme === 'default' ? <Monitor className="w-5 h-5" /> : theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </button>

                  {user && (
                    <div className="flex items-center gap-2 pr-2 border-r border-[var(--theme-border)] mr-2">
                       <button 
                          onClick={() => setShowMembers(true)}
                          className="p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                          title="Lihat Anggota"
                       >
                          <UsersIcon className="w-5 h-5" />
                       </button>
                       <NotificationCenter 
                          unreadCount={unreadMentions} 
                          onOpen={() => {
                            setShowNotifications(true);
                            setUnreadMentions(0);
                          }} 
                       />
                    </div>
                  )}

                  {user && ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(user.role) && (
                    <button onClick={goToDashboard} className="p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-accent)] hover:scale-110" title="Dashboard">
                      <LayoutDashboard className="w-5 h-5" />
                    </button>
                  )}
                  
                  {user && (
                    <button onClick={() => openProfileEditor(user)} className="p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl transition-all text-[var(--theme-accent)] hover:scale-110" title="Edit Profile">
                      <UserCircle className="w-5 h-5" />
                    </button>
                  )}

                  <button 
                    onClick={handleAuthAction}
                    className="flex items-center gap-2 pl-4 pr-5 py-2.5 bg-[var(--theme-surface)] hover:bg-[var(--theme-surface-hover)] rounded-2xl transition-all border border-[var(--theme-border)] text-xs font-black uppercase tracking-widest text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]"
                  >
                    <LogOut className="w-4 h-4" />
                    {user ? 'Exit' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col pt-2 sm:pt-4 pb-24 sm:pb-8 px-2 sm:px-6 relative z-10 overflow-hidden">
        {/* Alerts Container */}
        <div className="fixed top-20 sm:top-24 right-4 z-[60] flex flex-col gap-2 max-w-xs pointer-events-none">
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-auto p-4 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-2xl flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-xs font-bold text-green-200">{success}</span>
              </motion.div>
            )}
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-auto p-4 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-red-200">{error}</span>
                </div>
                <button onClick={() => setError('')} className="text-red-300 hover:text-white transition-colors">
                  <Plus className="w-4 h-4 rotate-45" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>



        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-white/[0.01] backdrop-blur-[30px] rounded-[3rem] border border-white/5 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          {/* Scrollable Message List */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar scroll-smooth"
            style={{ overflowAnchor: 'auto' }}
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <MessageCircle className="w-20 h-20 mb-4" />
                <p className="text-lg font-medium tracking-tight">Belum ada diskusi</p>
                <p className="text-sm">Jadilah yang pertama untuk memulai!</p>
              </div>
            ) : (
              <div className="flex flex-col justify-start gap-6 min-h-full">
                <AnimatePresence initial={false}>
                  {/* Typing Indicator Bubble */}
                  {Object.values(typingUsers).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start mb-4 h-10 items-center overflow-hidden"
                    >
                      <div className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-2xl px-4 py-2 flex items-center gap-3">
                        <div className="flex gap-1">
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-cyan-400 rounded-full"/>
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-cyan-400 rounded-full"/>
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-cyan-400 rounded-full"/>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">
                          {Object.values(typingUsers).length === 1 
                            ? `${Object.values(typingUsers)[0].username} sedang mengetik...` 
                            : `${Object.values(typingUsers).length} orang sedang mengetik...`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                  
                  {[...messages].reverse().map((message, index) => {
                    // Logic Kanan-Kiri Dinamis
                    const isOwnMessage = message.user_id === user?.id;
                    const isStaff = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(message.role);
                    
                    // Ketentuan User: Jika Guests, Admin di Kanan. Jika Login, Me di Kanan.
                    const alignRight = user ? isOwnMessage : isStaff;
                    const replyData = message.reply_to || null;
                    
                    return (
                      <motion.div
                        key={message.id || message.timestamp}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex w-full ${alignRight ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`group flex flex-col max-w-[85%] sm:max-w-md ${alignRight ? 'items-end' : 'items-start'}`}>
                          {/* Sender Info (Only for others OR if alignLeft) */}
                          {!alignRight && (
                            <div className="flex items-center gap-2 mb-2 ml-2">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-[10px] font-black text-white">
                                {message.username?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-[11px] font-bold text-white/40 tracking-wider uppercase">
                                {message.username} • {message.role}
                              </span>
                            </div>
                          )}

                          {/* Sender Info for Admin on the Right (Optional/Guest mode) */}
                          {alignRight && !isOwnMessage && (
                            <div className="flex items-center gap-2 mb-2 mr-2">
                               <span className="text-[11px] font-bold text-white/40 tracking-wider uppercase">
                                {message.username} • {message.role}
                              </span>
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-black text-white">
                                {message.username?.[0]?.toUpperCase()}
                              </div>
                            </div>
                          )}

                          {/* Bubble Container */}
                          <div className="relative group/bubble flex items-center gap-3">
                            {/* Actions Overlay (Hidden by default, shown on hover, visible on touch) */}
                            {isOwnMessage && user && (
                              <div className="opacity-100 sm:opacity-0 sm:group-hover/bubble:opacity-100 transition-opacity flex flex-wrap sm:flex-nowrap gap-1 mr-2 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/5 order-last sm:order-first mt-2 sm:mt-0">
                                <button onClick={() => copyToClipboard(message.content)} className="p-2 sm:p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors" title="Copy"><Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5"/></button>
                                <button onClick={() => startEditMessage(message)} className="p-2 sm:p-1.5 hover:bg-white/10 rounded-lg text-cyan-400/80 hover:text-cyan-400 transition-colors" title="Edit"><Edit2 className="w-4 h-4 sm:w-3.5 sm:h-3.5"/></button>
                                <button onClick={() => handleDeleteMessage(message.id)} className="p-2 sm:p-1.5 hover:bg-red-500/20 rounded-lg text-red-400/80 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5"/></button>
                              </div>
                            )}

                            {/* Actual Bubble */}
                            <div className="relative group/bubble-content">
                              <div className={`px-6 py-4 rounded-[2.5rem] shadow-2xl transition-all duration-300 ${
                                alignRight 
                                  ? 'bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white rounded-tr-none border border-white/10 shadow-[0_0_20_rgba(6,182,212,0.15)]' 
                                  : `bg-gradient-to-br ${USER_ROLES[message.role || 'USER']?.color || 'from-slate-800 to-slate-900'} backdrop-blur-3xl border border-white/10 text-white shadow-lg rounded-tl-none`
                                }`}>
                                  {/* Role Indicator for Others (even if alignRight for guests) */}
                                  {!isOwnMessage && (
                                    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/10">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-white/90">
                                        {USER_ROLES[message.role || 'USER']?.badge} {USER_ROLES[message.role || 'USER']?.name}
                                      </span>
                                    </div>
                                  )}
                                {/* Media Display */}
                                {message.media_url && (
                                  <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 bg-black/20">
                                    <img 
                                      src={message.media_url} 
                                      alt="Shared media" 
                                      className="w-full h-auto max-h-[300px] object-contain cursor-pointer"
                                      onClick={() => window.open(message.media_url, '_blank')}
                                    />
                                  </div>
                                )}
                                {/* Reply Context */}
                              {replyData && (
                                <div className={`mb-3 p-3 rounded-2xl border-l-4 text-xs ${
                                  alignRight ? 'bg-black/20 border-white/30 text-white/70' : 'bg-white/5 border-cyan-500/50 text-white/50'
                                }`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Reply className="w-3 h-3" />
                                    <span className="font-black uppercase tracking-tighter">{replyData.username}</span>
                                  </div>
                                  <p className="italic line-clamp-1">{replyData.content}</p>
                                </div>
                              )}
                              
                              <div className="text-sm sm:text-base leading-relaxed break-words">
                                {renderMessageContent(message.content)}
                                {message.is_edited && <span className="text-[10px] italic opacity-40 ml-2">(edited)</span>}
                              </div>
                              
                              <div className={`mt-2 flex items-center gap-2 text-[10px] font-bold tracking-tighter uppercase ${alignRight ? 'text-white/40' : 'text-white/20'}`}>
                                {formatTime(message.timestamp || message.created_at)}
                                {message.status === 'sending' && <div className="w-2 h-2 border border-white/40 border-t-white rounded-full animate-spin" />}
                              </div>

                              {/* Reactions Display */}
                              <MessageReactions 
                                reactions={reactions[message.id]} 
                                onReact={(emoji) => toggleReaction(message.id, emoji)}
                                currentUser={user}
                              />
                            </div>

                            {/* Reaction Trigger Button (Floating on hover) */}
                            {user && (
                              <div className={`absolute -bottom-2 ${isOwnMessage ? '-left-2' : '-right-2'} opacity-0 group-hover/bubble-content:opacity-100 transition-opacity z-10`}>
                                <button 
                                  onClick={() => setActiveReactionPicker(message.id)}
                                  className="p-1.5 bg-[#1e293b] border border-white/10 rounded-full text-white/40 hover:text-white hover:scale-110 shadow-lg"
                                >
                                  <Smile className="w-3.5 h-3.5" />
                                </button>
                                <ReactionPicker 
                                  isOpen={activeReactionPicker === message.id}
                                  onClose={() => setActiveReactionPicker(null)}
                                  onSelect={(emoji) => toggleReaction(message.id, emoji)}
                                />
                              </div>
                            )}
                          </div>

                            {/* Actions Overlay for Others */}
                            {!isOwnMessage && user && (
                              <div className="opacity-100 sm:opacity-0 sm:group-hover/bubble:opacity-100 transition-opacity flex flex-wrap sm:flex-nowrap gap-1 ml-2 bg-white/5 backdrop-blur-md rounded-xl p-1 border border-white/5 order-last sm:order-none mt-2 sm:mt-0">
                                <button onClick={() => handleReply(message)} className="p-2 sm:p-1.5 hover:bg-[var(--theme-surface-hover)] rounded-lg text-[var(--theme-accent)] hover:text-[var(--theme-text)] transition-colors" title="Reply"><Reply className="w-4 h-4 sm:w-3.5 sm:h-3.5"/></button>
                                <button onClick={() => copyToClipboard(message.content)} className="p-2 sm:p-1.5 hover:bg-[var(--theme-surface-hover)] rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors" title="Copy"><Copy className="w-4 h-4 sm:w-3.5 sm:h-3.5"/></button>
                                <button onClick={() => handleReportMessage(message)} className="p-2 sm:p-1.5 hover:bg-orange-500/20 rounded-lg text-orange-400/80 hover:text-orange-400 transition-colors" title="Report"><AlertTriangle className="w-4 h-4 sm:w-3.5 sm:h-3.5"/></button>
                                {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                                  <button onClick={() => handleDeleteMessage(message.id)} className="p-2 sm:p-1.5 hover:bg-red-500/20 rounded-lg text-red-400/80 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5"/></button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Interaction Bar Container or Guest CTA (Stabilized Height) */}
          {user && (
            <div className="p-6 bg-black/20 border-t border-white/5 backdrop-blur-xl relative min-h-[140px] sm:min-h-[120px] flex items-center justify-center">
              {/* Scroll to Bottom FAB */}
            <AnimatePresence>
              {showScrollToBottom && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  onClick={scrollToBottom}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 p-4 bg-cyan-500 rounded-full text-white shadow-2xl shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-all z-20 group"
                >
                  <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Return to signals</div>
                </motion.button>
              )}
            </AnimatePresence>

            {user ? (
              (user.muteUntil && new Date(user.muteUntil) > new Date()) ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-orange-500/10 border border-orange-500/20 rounded-[2rem] text-center"
                >
                  <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">Sesi Terbatas</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">
                    Sinyal Anda dihentikan sementara hingga {new Date(user.muteUntil).toLocaleString()}
                  </p>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 inline-block text-left max-w-md mx-auto">
                     <span className="text-[9px] font-black uppercase text-white/20 italic block mb-1">Alasan Moderator:</span>
                     <p className="text-xs text-orange-200/70 italic">"{user.muteReason || 'Peringatan standar komunitas.'}"</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Reply / Edit Context Bar */}
                  <AnimatePresence>
                    {(replyTo || editingMessage) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mb-4"
                      >
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-3xl border border-white/10">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${editingMessage ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                              {editingMessage ? <Edit2 className="w-4 h-4" /> : <Reply className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                                {editingMessage ? 'Mengubah Pesan' : `Membalas ${replyTo.username}`}
                              </p>
                              <p className="text-sm text-white/70 line-clamp-1 italic">
                                {editingMessage ? editingMessage.content : replyTo.content}
                              </p>
                            </div>
                          </div>
                          <button onClick={editingMessage ? cancelEdit : cancelReply} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40">
                            <Plus className="w-5 h-5 rotate-45" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                   {/* Input Form */}
                   <form onSubmit={editingMessage ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto w-full">
                     <div className="flex flex-col gap-2 relative">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingMedia}
                          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors text-white/30 hover:text-white flex items-center justify-center"
                        >
                          {uploadingMedia ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Paperclip className="w-5 h-5" />}
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileSelect}
                        />
                     </div>

                                <div className="relative group/input flex-1">
                      {systemConfig.maintenance_mode && !['SUPER_ADMIN', 'ADMIN'].includes(user.role) ? (
                        <div className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-8 py-5 flex items-center justify-center gap-3 backdrop-blur-xl">
                          <Lock className="w-4 h-4 text-white/30" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Papan Sinyal Dikunci Sementara</span>
                        </div>
                      ) : (
                        <>
                          <div className="absolute left-4 bottom-3 z-10" ref={emojiPickerRef}>
                            <button 
                              type="button" 
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/30 hover:text-white"
                            >
                              <Smile className="w-6 h-6" />
                            </button>
                            {showEmojiPicker && (
                              <div className="absolute bottom-16 left-0 z-50">
                                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" width={300} height={400} />
                              </div>
                            )}
                          </div>

                          <MentionInput
                            value={newMessage}
                            onChange={(v) => {
                              setNewMessage(v);
                              handleTyping();
                            }}
                            onMention={(u) => {
                              console.log('Mentioned user:', u);
                            }}
                          />
                        </>
                      )}

                      <div className={`absolute right-6 bottom-4 text-[10px] font-black tracking-tighter ${newMessage.length > 500 ? 'text-red-500' : 'text-white/20'}`}>
                        {newMessage.length}/500
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={sending || (!newMessage.trim() && !systemConfig.maintenance_mode) || 
                                (!editingMessage && user && user.messageCount >= (systemConfig.message_limits[user.role] || 5)) ||
                                (systemConfig.maintenance_mode && !['SUPER_ADMIN', 'ADMIN'].includes(user.role))}
                      className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                        sending || !newMessage.trim() || (systemConfig.maintenance_mode && !['SUPER_ADMIN', 'ADMIN'].includes(user.role))
                          ? 'bg-white/[0.05] text-white/20' 
                          : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 text-white shadow-cyan-500/30'
                      }`}
                    >
                      {sending ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : systemConfig.maintenance_mode && !['SUPER_ADMIN', 'ADMIN'].includes(user.role) ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <Send className="w-6 h-6" />
                      )}
                    </motion.button>
                  </form>

                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3"
                      >
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                        <span className="text-[10px] font-black uppercase text-red-200/70 tracking-widest">{error}</span>
                        <button onClick={() => setError('')} className="ml-auto text-white/20 hover:text-white"><X className="w-4 h-4" /></button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-4 flex justify-between items-center px-6">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Limit Pesan</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(user?.messageCount / (MESSAGE_LIMITS[user?.role] || 5)) * 100}%` }}
                              className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                            />
                          </div>
                          <span className="text-[10px] font-black text-cyan-400">{user?.messageCount}/{MESSAGE_LIMITS[user?.role] || 5}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-tighter text-white/20">
                      Pencet Shift + Enter untuk ganti baris
                    </div>
                  </div>
                </>
              )
            ) : null}
            </div>
          )}
        </div>

        {/* Guest CTA moved outside the chat container */}
        {!user && (
          <div className="mt-6 mb-10">
            <GuestCTA />
          </div>
        )}
      </main>

  {/* Mobile Bottom Navigation */}
  <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[var(--theme-surface)] backdrop-blur-3xl border-t border-[var(--theme-border)] px-6 py-3 flex justify-between items-center pb-[max(0.75rem,env(safe-area-inset-bottom))]">
    <button onClick={() => setShowMembers(true)} className="flex flex-col items-center gap-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors">
      <UsersIcon className="w-6 h-6" />
      <span className="text-[9px] font-black uppercase">Anggota</span>
    </button>
    <button onClick={() => { setShowNotifications(true); setUnreadMentions(0); }} className="relative flex flex-col items-center gap-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors">
      <div className="relative">
        <Bell className="w-6 h-6" />
        {unreadMentions > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[var(--theme-bg)]" />}
      </div>
      <span className="text-[9px] font-black uppercase">Notif</span>
    </button>
    
    <button 
      onClick={() => setTheme(prev => prev === 'default' ? 'light' : prev === 'light' ? 'dark' : 'default')}
      className="flex flex-col items-center gap-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
    >
      {theme === 'default' ? <Monitor className="w-6 h-6" /> : theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
      <span className="text-[9px] font-black uppercase">Tema</span>
    </button>
    
    {user && ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(user.role) && (
      <button onClick={goToDashboard} className="flex flex-col items-center gap-1 text-[var(--theme-accent)] group">
        <div className="p-1.5 bg-[var(--theme-accent)]/10 rounded-xl group-hover:bg-[var(--theme-accent)]/20 transition-colors">
          <LayoutDashboard className="w-5 h-5" />
        </div>
      </button>
    )}
    
    <button onClick={() => user ? openProfileEditor(user) : handleAuthAction()} className="flex flex-col items-center gap-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors">
      <UserCircle className="w-6 h-6" />
      <span className="text-[9px] font-black uppercase">{user ? 'Profil' : 'Login'}</span>
    </button>
  </div>

  {/* Profile Modal */}
  <AnimatePresence>
    {showProfileModal && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#0f172a] border border-white/10 rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6">
            <button onClick={() => setShowProfileModal(false)} className="text-white/40 hover:text-white">
              <Plus className="w-6 h-6 rotate-45" />
            </button>
          </div>

          <div className="text-white">
             <ProfileEditor 
                profile={profileData}
                currentUser={user}
                isEditing={isEditingProfile}
                setIsEditing={setIsEditingProfile}
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleSaveProfile}
                loading={sending}
             />
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Member Sidebar */}
  <MemberSidebar 
    isOpen={showMembers}
    onClose={() => setShowMembers(false)}
    onlineUsers={Object.values(onlineUsers)}
    allProfiles={allProfiles}
    currentUser={user}
  />

  {/* Mention Notifications Overlay */}
  <MentionNotifications 
    mentions={mentions} 
    onDismiss={(idx) => setMentions(prev => prev.filter((_, i) => i !== idx))} 
  />
</div>
  );
}

export default Live;
