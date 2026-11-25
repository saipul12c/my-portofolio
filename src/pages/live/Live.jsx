import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, Plus, MessageCircle, ArrowDown, X, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import GuestCTA from './components/GuestCTA';
import { useAchievements } from './hooks/useAchievements';
import { ProfileEditor } from './components/ProfileEditor';
import { MentionNotifications } from './components/NotificationCenter';
import { MemberSidebar } from './components/MemberSidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatInputArea } from './components/ChatInputArea';
import { AppealModal } from './components/AppealModal';
import { ChannelBar } from './components/ChannelBar';
import { MessageSearchModal } from './components/MessageSearchModal';
import { AISummarizerModal } from './components/AISummarizerModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { PollModal } from './components/PollModal';
import { isAiMentioned, extractAiQuery, generateAiRoomReply } from './utils/saipulRoomIntegration';
import { MessageItem } from './components/MessageItem';
import { ImageLightbox } from './components/ImageLightbox';
import { 
  playSendSound, 
  playReceiveSound, 
  playMentionSound, 
  isSoundEnabled, 
  setSoundEnabled 
} from './utils/soundEffects';
import { compressImageToWebP } from './utils/imageCompressor';
import { getCachedMessages, setCachedMessages } from './utils/cacheManager';
import { setDiscussionRoomData } from '../../utils/ai/knowledgeBase';
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

// Pure date label helper for date dividers (Zero re-creation overhead)
const getMessageDateLabel = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(typeof dateVal === 'string' && /^\d+$/.test(dateVal) ? Number(dateVal) : dateVal);
  if (isNaN(date.getTime())) return '';
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  if (isToday) return 'Hari Ini';
  if (isYesterday) return 'Kemarin';
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

function Live() {
  const [messages, setMessages] = useState(() => getCachedMessages('umum'));
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'online', 'offline'

  // Hook Achievement Internal
  const { loadAchievements } = useAchievements();

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

  // Channel, Search, AI & Community Features States
  const [activeChannel, setActiveChannel] = useState('umum');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSummarizerModal, setShowSummarizerModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [soundEnabled, setSoundState] = useState(() => isSoundEnabled());
  const [lightboxMedia, setLightboxMedia] = useState({ isOpen: false, url: '' });

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundState(next);
    setSoundEnabled(next);
  };

  // Sync cache with current messages
  useEffect(() => {
    if (messages.length > 0) {
      setCachedMessages(activeChannel, messages);
      setDiscussionRoomData(messages);
    }
  }, [messages, activeChannel]);

  // Slowmode Cooldown Timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Global Keyboard Shortcut: Ctrl+F / Ctrl+K for Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'k')) {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter messages by channel & calculate counts
  const channelCounts = React.useMemo(() => {
    const counts = {};
    messages.forEach(m => {
      const ch = m.channel || 'umum';
      counts[ch] = (counts[ch] || 0) + 1;
    });
    return counts;
  }, [messages]);

  const filteredChannelMessages = React.useMemo(() => {
    return messages.filter(m => (m.channel || 'umum') === activeChannel);
  }, [messages, activeChannel]);

  // Pre-calculate chronological order and date dividers once per message set
  const displayMessages = React.useMemo(() => {
    const list = [...filteredChannelMessages].reverse();
    return list.map((message, index) => {
      const currentDate = getMessageDateLabel(message.created_at || message.timestamp);
      const prevMsg = list[index - 1];
      const prevDate = prevMsg ? getMessageDateLabel(prevMsg.created_at || prevMsg.timestamp) : null;
      const showDateDivider = Boolean(currentDate && currentDate !== prevDate);
      return {
        message,
        index,
        currentDate,
        showDateDivider
      };
    });
  }, [filteredChannelMessages]);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const lastSentRef = useRef(0);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const navigate = useNavigate();
  const pollingIntervalRef = useRef(null);
  const isPrependingOlderRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const isInitialLoadRef = useRef(true);

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

  // Check user status in Database (Security Enhanced)
  const checkUserStatus = useCallback(async () => {
    try {
      const authRes = await supabase.auth.getUser().catch(() => null);
      const authUser = authRes?.data?.user;
      
      if (!authUser) {
        setUser(null);
        return;
      }

      let { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      // Self-Healing: Jika profil di public.users belum ada, sinkronkan otomatis
      if (!data) {
        try {
          const { data: healed } = await supabase
            .from('users')
            .upsert({
              id: authUser.id,
              email: authUser.email,
              nama: authUser.user_metadata?.nama || authUser.email.split('@')[0],
              role: 'USER',
              status: 'aktif'
            }, { onConflict: 'id' })
            .select()
            .maybeSingle();
          if (healed) data = healed;
        } catch (healErr) {
          console.warn('Auto-healing profile in Live.jsx failed:', healErr);
        }
      }

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

      setUser(prev => {
        if (
          prev &&
          prev.id === userData.id &&
          prev.role === userData.role &&
          prev.messageCount === userData.messageCount &&
          prev.username === userData.username &&
          prev.muteUntil === userData.muteUntil &&
          prev.isShadowbanned === userData.isShadowbanned &&
          prev.banReason === userData.banReason
        ) {
          return prev;
        }
        return userData;
      });
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
        
        // Fetch all profiles for member sidebar
        fetchAllProfiles();
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Gagal memuat pesan. Silakan refresh halaman.');
    }
  }, []);

  // Load more messages (Cursor-based pagination with Tie-Breaker)
  const loadMoreMessages = useCallback(async () => {
    if (fetchingMore || !hasMore || messages.length === 0) return;

    setFetchingMore(true);
    try {
      const container = messagesContainerRef.current;
      if (container) {
        prevScrollHeightRef.current = container.scrollHeight;
        isPrependingOlderRef.current = true;
      }
      // Find oldest message with valid timestamp
      const oldestMessage = [...messages].reverse().find(m => m && m.timestamp);
      if (!oldestMessage) {
        setHasMore(false);
        isPrependingOlderRef.current = false;
        return;
      }

      let query = supabase.from('messages').select('*');

      if (oldestMessage.id && !String(oldestMessage.id).startsWith('temp-') && !isNaN(Number(oldestMessage.id))) {
        query = query.or(`timestamp.lt.${oldestMessage.timestamp},and(timestamp.eq.${oldestMessage.timestamp},id.lt.${oldestMessage.id})`);
      } else {
        query = query.lt('timestamp', oldestMessage.timestamp);
      }

      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .order('id', { ascending: false }) // Secondary sort
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id).filter(Boolean));
          const newUnique = data.filter(m => !existingIds.has(m.id));
          return [...prev, ...newUnique];
        });
        setHasMore(data.length === 50);
        
        // Fetch reactions for new messages
        fetchReactionsForMessages(data.map(m => m.id));
      } else {
        setHasMore(false);
        isPrependingOlderRef.current = false;
      }
    } catch (err) {
      console.error('Error loading more messages:', err);
      isPrependingOlderRef.current = false;
    } finally {
      setFetchingMore(false);
    }
  }, [fetchingMore, hasMore, messages]);

  // Setup Realtime Subscription and Presence
  const setupRealtime = useCallback(() => {
    // 1. Setup subscription for messages and reactions (Active for all users & guests)
    let messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        // Play receive sound if message is from someone else
        if (payload.new && payload.new.username !== userRef.current?.username) {
          playReceiveSound();
        }

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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, payload => {
        setReactions(prev => {
          const msgId = payload.new?.message_id || payload.old?.message_id;
          if (payload.eventType === 'INSERT' && payload.new) {
            const currentReactions = prev[payload.new.message_id] || [];
            if (currentReactions.some(r => r.id === payload.new.id)) return prev;
            return { ...prev, [payload.new.message_id]: [...currentReactions, payload.new] };
          }
          if (payload.eventType === 'DELETE' && payload.old) {
            if (msgId) {
              const currentReactions = prev[msgId] || [];
              return { ...prev, [msgId]: currentReactions.filter(r => r.id !== payload.old.id) };
            } else {
              // Fallback when replica identity only yields primary key id
              const next = { ...prev };
              let changed = false;
              for (const k in next) {
                if (next[k].some(r => r.id === payload.old.id)) {
                  next[k] = next[k].filter(r => r.id !== payload.old.id);
                  changed = true;
                  break;
                }
              }
              return changed ? next : prev;
            }
          }
          return prev;
        });
      })
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (!userRef.current || payload.id !== userRef.current.id) {
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
          playMentionSound();
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
    if (user?.id) {
      presenceChannel = supabase.channel('online-users');

      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const newState = presenceChannel.presenceState();
          const activeUsers = {};
          Object.keys(newState).forEach(key => {
            if (newState[key] && newState[key][0]) {
              const userData = newState[key][0];
              activeUsers[userData.id || userData.username] = userData;
            }
          });
          setOnlineUsers(activeUsers);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && userRef.current) {
            await presenceChannel.track({
              id: userRef.current.id,
              username: userRef.current.username,
              role: userRef.current.role,
              onlineAt: new Date().toISOString(),
            });
          }
        });
    }

    // 3. Setup subscription for current user profile changes (Instant Kick / Mute / Role Update)
    let userProfileSubscription = null;
    if (user?.id) {
      userProfileSubscription = supabase
        .channel(`public:user-profile-${user.id}`)
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users', 
          filter: `id=eq.${user.id}` 
        }, (payload) => {
          const updated = payload.new;
          if (!updated) return;

          // Handle Banned / Nonaktif in Realtime
          if (['nonaktif', 'banned'].includes(updated.status?.toLowerCase())) {
            setError('Akun Anda dinonaktifkan atau diblokir.');
            setTimeout(() => {
              supabase.auth.signOut();
              setUser(null);
              localStorage.removeItem('local_user');
              navigate('/Live-Discussion/login');
            }, 2000);
            return;
          }

          const userRole = (updated.role || 'USER').toUpperCase();
          const roleConfig = USER_ROLES[userRole] || USER_ROLES.USER;

          setUser(prev => {
            if (!prev) return prev;
            const nextUser = {
              ...prev,
              username: updated.nama || prev.username,
              role: userRole,
              roleName: roleConfig.name,
              roleLevel: roleConfig.level,
              roleBadge: roleConfig.badge,
              roleColor: roleConfig.color,
              messageCount: parseInt(updated.message_count) || 0,
              muteUntil: updated.mute_until,
              muteReason: updated.mute_reason,
              banReason: updated.ban_reason,
              isShadowbanned: updated.is_shadowbanned || false
            };
            localStorage.setItem('local_user', JSON.stringify(nextUser));
            return nextUser;
          });
        })
        .subscribe();
    }

    return () => {
      supabase.removeChannel(messageSubscription);
      if (presenceChannel) supabase.removeChannel(presenceChannel);
      if (userProfileSubscription) supabase.removeChannel(userProfileSubscription);
    };
  }, [user?.id, navigate]);

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

    // Fallback polling: Fetch messages every 30 seconds only if connection is offline
    pollingIntervalRef.current = setInterval(() => {
      if (document.visibilityState === 'visible' && connectionStatus === 'offline') {
        fetchMessagesFromDatabase();
      }
    }, 30000);

    fetchSystemConfig();

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } catch {
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

  // Lock body and html scroll so only the chat container can scroll
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyHeight = document.body.style.height;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100dvh';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  // Scroll to bottom: only scroll messagesContainerRef directly, never scroll the page/window
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (messagesContainerRef.current) {
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior
          });
        }
      });
    }
  }, []);

  // Auto scroll to latest message (preserve scroll if loading older)
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (isPrependingOlderRef.current && container) {
      const heightDiff = container.scrollHeight - prevScrollHeightRef.current;
      container.scrollTop += heightDiff;
      isPrependingOlderRef.current = false;
      return;
    }

    if (isInitialLoadRef.current) {
      if (messages.length > 0) {
        scrollToBottom('auto');
        isInitialLoadRef.current = false;
      }
      return;
    }

    if (!showScrollToBottom) {
      scrollToBottom('smooth');
    }
  }, [messages, showScrollToBottom, scrollToBottom]);

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
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // 1. Show "Scroll to Bottom" button if we are scrolled up
    const isUp = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollToBottom(prev => (prev !== isUp ? isUp : prev));

    // 2. Infinite Scroll: Fetch more when reaching the TOP (scrollTop near 0)
    // We use a small threshold like 100px
    if (scrollTop < 100 && !fetchingMore && hasMore) {
      loadMoreMessages();
    }
  }, [fetchingMore, hasMore, loadMoreMessages]);

  // Cleanup effect for stale typing indicators (Zero overhead when no one is typing)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => {
        const keys = Object.keys(prev);
        if (keys.length === 0) return prev;
        const filtered = {};
        let changed = false;
        keys.forEach(id => {
          if (now - prev[id].timestamp < 3000) {
            filtered[id] = prev[id];
          } else {
            changed = true;
          }
        });
        return changed ? filtered : prev;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Handle emoji click
  const handleEmojiClick = useCallback((emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    messageInputRef.current?.focus();
  }, []);

  // Handle reply
  const handleReply = useCallback((message) => {
    setReplyTo(message);
    messageInputRef.current?.focus();
  }, []);

  // Cancel reply
  const cancelReply = useCallback(() => {
    setReplyTo(null);
  }, []);

  // Lightbox handler
  const handleOpenLightbox = useCallback((url) => {
    setLightboxMedia({ isOpen: true, url });
  }, []);

  // Send message to Database (Dengan Graceful Fallback jika kolom baru belum dimigrasi di Supabase)
  const sendMessageToDatabase = async (messageData) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select();

      if (error) {
        // Fallback jika database belum menjalankan SQL migrasi channel/poll_data/is_best_answer
        if (error.message && (error.message.includes('channel') || error.message.includes('poll_data') || error.message.includes('is_best_answer'))) {
          const { channel: _Channel, is_best_answer: _IsBestAnswer, poll_data: _PollData, ...legacyData } = messageData;
          const retryRes = await supabase.from('messages').insert([legacyData]).select();
          if (retryRes.error) throw retryRes.error;
          return { data: retryRes.data[0], error: null };
        }
        throw error;
      }
      return { data: data[0], error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  // Handle Polling Creation
  const handleCreatePoll = useCallback(async (pollData) => {
    if (!user) return;
    try {
      const correlationId = `${user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const messageData = {
        user_id: user.id,
        username: user.username,
        content: `📊 **Jajak Pendapat**: ${pollData.question}`,
        role: user.role,
        channel: activeChannel,
        poll_data: pollData,
        correlation_id: correlationId,
        created_at: new Date().toISOString(),
        timestamp: Date.now(),
        status: 'sent'
      };

      setMessages(prev => [messageData, ...prev]);
      const { data: saved } = await sendMessageToDatabase(messageData);
      if (saved) {
        setMessages(prev => prev.map(m => m.correlation_id === correlationId ? saved : m));
      }
    } catch (err) {
      console.error('Failed to create poll message:', err);
    }
  }, [user, activeChannel]);

  // Handle Polling Vote
  const handleVotePoll = useCallback(async (pollId, optionId) => {
    if (!user) return;
    const currentUserId = user.id || user.username;

    setMessages(prev => prev.map(msg => {
      if (msg.poll_data && (msg.poll_data.id === pollId || msg.id === pollId)) {
        const prevVoted = msg.poll_data.votedUsers?.[currentUserId];
        if (prevVoted === optionId) return msg;

        const updatedOptions = msg.poll_data.options.map(opt => {
          let votes = opt.votes || 0;
          if (opt.id === optionId) votes += 1;
          if (prevVoted && opt.id === prevVoted) votes = Math.max(0, votes - 1);
          return { ...opt, votes };
        });

        const updatedPoll = {
          ...msg.poll_data,
          options: updatedOptions,
          votedUsers: {
            ...(msg.poll_data.votedUsers || {}),
            [currentUserId]: optionId
          },
          totalVotes: updatedOptions.reduce((s, o) => s + o.votes, 0)
        };

        if (msg.id) {
          supabase
            .from('messages')
            .update({ poll_data: updatedPoll })
            .eq('id', msg.id)
            .then(() => {});
        }

        return { ...msg, poll_data: updatedPoll };
      }
      return msg;
    }));
  }, [user]);

  // Handle Best Answer Toggle
  const handleToggleBestAnswer = useCallback(async (message) => {
    if (!user) return;
    const newStatus = !message.is_best_answer;
    setMessages(prev => prev.map(m => m.id === message.id ? { ...m, is_best_answer: newStatus } : m));

    try {
      await supabase.from('messages').update({ is_best_answer: newStatus }).eq('id', message.id);
    } catch (err) {
      console.warn('Failed to toggle best answer:', err);
    }
  }, [user]);

  // Handle Jump to Message (dari hasil Pencarian)
  const handleJumpToMessage = (messageId) => {
    const targetMsg = messages.find(m => m.id === messageId);
    if (targetMsg && targetMsg.channel && targetMsg.channel !== activeChannel) {
      setActiveChannel(targetMsg.channel);
    }
    setHighlightedMessageId(messageId);
    setTimeout(() => {
      const el = document.getElementById(`msg-${messageId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    setTimeout(() => {
      setHighlightedMessageId(null);
    }, 3500);
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
        channel: activeChannel,
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
      playSendSound();

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

      // Slowmode cooldown untuk member reguler
      if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
        setCooldownSeconds(5);
      }

      // 5. Achievement Check: Handled by Backend DB Trigger
      if ([1, 10, 50, 100].includes(newCount)) {
        setTimeout(() => loadAchievements(user.id), 2000);
      }

      setSuccess('Pesan terkirim!');
      setTimeout(() => setSuccess(''), 3000);

      // 6. Integrasi Cerdas AI Saipul Langsung di Room jika di-mention
      if (isAiMentioned(messageContent)) {
        const aiQuery = extractAiQuery(messageContent);
        setTimeout(async () => {
          try {
            const botReply = await generateAiRoomReply(aiQuery, user.username);
            const botCorrelationId = `saipul-${Date.now()}`;
            const botMessage = {
              user_id: null,
              username: 'Saipul AI',
              content: botReply,
              role: 'SUPER_ADMIN',
              channel: activeChannel,
              reply_to: {
                id: savedData?.id || correlationId,
                username: user.username,
                content: messageContent.substring(0, 50) + (messageContent.length > 50 ? '...' : '')
              },
              correlation_id: botCorrelationId,
              created_at: new Date().toISOString(),
              timestamp: Date.now(),
              status: 'sent'
            };

            const { data: botSaved } = await sendMessageToDatabase(botMessage);
            if (botSaved) {
              setMessages(prev => [botSaved, ...prev]);
            }
          } catch (aiErr) {
            console.warn('Saipul AI reply failed:', aiErr);
          }
        }, 1200);
      }

      messageInputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSending(false);
    }
  };

  // Handle logout/login
  const handleAuthAction = async () => {
    if (user) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('SignOut error:', err);
      }
      localStorage.removeItem('local_user');
      setUser(null);
      navigate('/Live-Discussion/login');
    } else {
      navigate('/Live-Discussion/login');
    }
  };

  // Navigate to dashboard (for admins and moderators)
  const goToDashboard = () => {
    if (user && ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(user.role)) {
      navigate('/Live-Discussion/dashboard');
    }
  };

  // Format timestamp (Memoized)
  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return 'Baru saja';
    const date = new Date(typeof timestamp === 'string' && /^\d+$/.test(timestamp) ? Number(timestamp) : timestamp);
    if (isNaN(date.getTime())) return 'Baru saja';
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
  }, []);

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
      // Use 'profiles' view to respect email privacy
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('nama', { ascending: true });

      if (error) {
        const res = await supabase
          .from('users')
          .select('id, nama, role, status, bio, custom_status, created_at')
          .order('nama', { ascending: true });
        data = res.data;
      }

      const mapped = (data || []).map(u => ({
        ...u,
        username: u.nama || u.email?.split('@')[0] || 'Member'
      }));
      setAllProfiles(mapped);
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

  const toggleReaction = useCallback(async (messageId, emoji) => {
    if (!user) return;
    
    const existing = (reactions[messageId] || []).find(
      r => r.emoji === emoji && (r.user_id === user.id || r.user_id === user.username)
    );

    // Optimistic Update: Instant feedback without waiting for network
    setReactions(prev => {
      const current = prev[messageId] || [];
      if (existing) {
        return {
          ...prev,
          [messageId]: current.filter(r => !(r.emoji === emoji && (r.user_id === user.id || r.user_id === user.username)))
        };
      } else {
        const optimisticReaction = {
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          message_id: messageId,
          user_id: user.id,
          emoji
        };
        return {
          ...prev,
          [messageId]: [...current, optimisticReaction]
        };
      }
    });

    try {
      if (existing) {
        if (existing.id && !String(existing.id).startsWith('temp-')) {
          await supabase.from('reactions').delete().eq('id', existing.id);
        } else {
          await supabase.from('reactions').delete().match({ message_id: messageId, user_id: user.id, emoji });
        }
      } else {
        const { data } = await supabase
          .from('reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            emoji: emoji
          })
          .select()
          .maybeSingle();

        if (data) {
          setReactions(prev => {
            const current = prev[messageId] || [];
            return {
              ...prev,
              [messageId]: current.map(r => (r.emoji === emoji && r.user_id === user.id ? data : r))
            };
          });
        }
      }
    } catch (err) {
      console.error('Error toggling reaction:', err);
      fetchReactionsForMessages([messageId]);
    }
  }, [user, reactions]);

  // Media Upload Logic (Auto-Compressed to WebP)
  const handleFileSelect = async (e) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile || !user) return;

    if (!rawFile.type.startsWith('image/')) {
      setError('Hanya file gambar yang diperbolehkan');
      return;
    }

    setUploadingMedia(true);
    try {
      // 1. Client-side Image Compression ke format WebP hemat kuota
      const file = await compressImageToWebP(rawFile);
      const fileExt = file.name.split('.').pop() || 'webp';
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('live_discussion_media')
        .upload(filePath, file, { contentType: file.type || 'image/webp' });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('live_discussion_media')
        .getPublicUrl(filePath);

      // Send image URL as a message
      await handleSendMessage(null, data.publicUrl);
      setSuccess('Gambar teroptimasi berhasil diunggah!');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Gagal mengunggah gambar.');
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Delete message with optimistic removal
  const handleDeleteMessage = useCallback(async (message) => {
    const messageId = typeof message === 'object' ? message.id : message;
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    
    // Optimistic deletion
    setMessages(prev => prev.filter(m => m.id !== messageId));

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
      fetchMessagesFromDatabase();
    }
  }, [fetchMessagesFromDatabase]);

  // Start edit message
  const startEditMessage = useCallback((message) => {
    setEditingMessage(message);
    setNewMessage(message.content);
    messageInputRef.current?.focus();
  }, []);

  // Save edited message
  const handleSaveEdit = async () => {
    if (!newMessage.trim() || !editingMessage) return;

    if (containsProfanity(newMessage.trim())) {
      setError('Pesan Anda mengandung kata-kata yang tidak diperbolehkan. Mohon jaga kesopanan.');
      return;
    }

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

  const cancelEdit = useCallback(() => {
    setEditingMessage(null);
    setNewMessage('');
  }, []);

  // Copy message content
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Teks disalin!');
    setTimeout(() => setSuccess(''), 2000);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-gray-900)] flex items-center justify-center relative overflow-hidden">
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
      <div className="min-h-screen bg-[var(--color-gray-900)] flex items-center justify-center p-6 relative overflow-hidden">
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
        <AppealModal 
          showAppealModal={showAppealModal}
          setShowAppealModal={setShowAppealModal}
          appealReason={appealReason}
          setAppealReason={setAppealReason}
          handleSumbitAppeal={handleSumbitAppeal}
          isSubmittingAppeal={isSubmittingAppeal}
        />
      </div>
    );
  }

  return (
    <div className={`theme-${theme} h-[100dvh] w-full bg-[var(--theme-bg)] text-[var(--theme-text)] relative overflow-hidden flex flex-col font-sans selection:bg-[var(--theme-accent)] selection:text-[var(--theme-bg)]`}>
      {/* Immersive Background Decor - Hardware Accelerated with zero JS animation overhead */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] will-change-transform animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-5%] w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[120px] will-change-transform animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
      </div>

      {/* Modern Floating Header (Modularized) */}
      <ChatHeader
        connectionStatus={connectionStatus}
        onlineUsers={onlineUsers}
        user={user}
        getRoleBadge={getRoleBadge}
        theme={theme}
        setTheme={setTheme}
        setShowMembers={setShowMembers}
        unreadMentions={unreadMentions}
        setShowNotifications={setShowNotifications}
        setUnreadMentions={setUnreadMentions}
        goToDashboard={goToDashboard}
        openProfileEditor={openProfileEditor}
        handleAuthAction={handleAuthAction}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        onOpenSummarizer={() => setShowSummarizerModal(true)}
        onOpenPollModal={() => setShowPollModal(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Channel Selector Bar */}
      <ChannelBar
        activeChannel={activeChannel}
        onSelectChannel={setActiveChannel}
        channelCounts={channelCounts}
      />

      <main className="flex-1 min-h-0 w-full max-w-6xl mx-auto flex flex-col pt-2 sm:pt-4 pb-3 sm:pb-6 px-2 sm:px-6 relative z-10 overflow-hidden">
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
        <div className="flex-1 min-h-0 flex flex-col bg-[var(--theme-surface)] backdrop-blur-[30px] rounded-[3rem] border border-[var(--theme-border)] overflow-hidden shadow-2xl">
          {/* Scrollable Message List */}
          <div 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar"
            style={{ overflowAnchor: 'auto', WebkitOverflowScrolling: 'touch' }}
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <MessageCircle className="w-20 h-20 mb-4 text-[var(--theme-text-muted)]" />
                <p className="text-lg font-medium tracking-tight text-[var(--theme-text)]">Belum ada diskusi</p>
                <p className="text-sm text-[var(--theme-text-muted)]">Jadilah yang pertama untuk memulai!</p>
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
                      <div className="bg-[var(--theme-surface)] backdrop-blur-xl border border-[var(--theme-border)] rounded-2xl px-4 py-2 flex items-center gap-3">
                        <div className="flex gap-1">
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-cyan-400 rounded-full"/>
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-cyan-400 rounded-full"/>
                          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-cyan-400 rounded-full"/>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] italic">
                          {Object.values(typingUsers).length === 1 
                            ? `${Object.values(typingUsers)[0].username} sedang mengetik...` 
                            : `${Object.values(typingUsers).length} orang sedang mengetik...`}
                        </span>
                      </div>
                    </motion.div>
                  )}
                  
                  {filteredChannelMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-[var(--theme-text-muted)]">
                      <div className="w-14 h-14 rounded-3xl bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] flex items-center justify-center mb-3 text-cyan-400 shadow-md">
                        <MessageCircle className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-bold text-[var(--theme-text)]">Belum ada sinyal di #{activeChannel}</h3>
                      <p className="text-xs max-w-sm mt-1">Jadilah yang pertama mengirim pesan, kode, atau pertanyaan di channel ini!</p>
                    </div>
                  )}

                  {displayMessages.map(({ message, index, currentDate, showDateDivider }) => {
                    // Standar Chat Universal:
                    // 1. Pesan saya sendiri selalu di KANAN (alignRight = true)
                    // 2. Pesan orang lain / admin / moderator selalu di KIRI (alignRight = false)
                    // 3. Jika Guest (belum login), semua pesan tampil di KIRI secara konsisten
                    const isOwnMessage = Boolean(
                      user && (
                        (message.user_id && user.id && String(message.user_id) === String(user.id)) ||
                        (message.username && (message.username === user.username || message.username === user.nama))
                      )
                    );
                    const alignRight = isOwnMessage;
                    const replyData = message.reply_to || null;
                    
                    return (
                      <MessageItem
                        key={message.id || message.correlation_id || message.timestamp || index}
                        message={message}
                        index={index}
                        showDateDivider={showDateDivider}
                        currentDate={currentDate}
                        isOwnMessage={isOwnMessage}
                        alignRight={alignRight}
                        replyData={replyData}
                        user={user}
                        userRoles={USER_ROLES}
                        reactions={reactions[message.id]}
                        activeReactionPicker={activeReactionPicker}
                        isHighlighted={highlightedMessageId === message.id}
                        onReply={handleReply}
                        onStartEdit={startEditMessage}
                        onDelete={handleDeleteMessage}
                        onCopy={copyToClipboard}
                        onReport={handleReportMessage}
                        onToggleBestAnswer={handleToggleBestAnswer}
                        onToggleReaction={toggleReaction}
                        onSetActiveReactionPicker={setActiveReactionPicker}
                        onVotePoll={handleVotePoll}
                        onOpenLightbox={handleOpenLightbox}
                        formatTime={formatTime}
                      />
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Interaction Bar Container or Guest CTA (Stabilized Height) */}
          {user && (
            <div className="p-2.5 sm:p-5 bg-[var(--theme-surface)] border-t border-[var(--theme-border)] backdrop-blur-xl relative flex items-center justify-center">
              {/* Scroll to Bottom FAB */}
            <AnimatePresence>
              {showScrollToBottom && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  onClick={scrollToBottom}
                  className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 p-2.5 sm:p-4 bg-cyan-500 rounded-full text-white shadow-2xl shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-all z-20 group"
                >
                  <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-0.5 transition-transform" />
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Kembali ke bawah</div>
                </motion.button>
              )}
            </AnimatePresence>

            <ChatInputArea
              user={user}
              systemConfig={systemConfig}
              replyTo={replyTo}
              editingMessage={editingMessage}
              cancelEdit={cancelEdit}
              cancelReply={cancelReply}
              handleSaveEdit={handleSaveEdit}
              handleSendMessage={handleSendMessage}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleTyping={handleTyping}
              fileInputRef={fileInputRef}
              uploadingMedia={uploadingMedia}
              handleFileSelect={handleFileSelect}
              showEmojiPicker={showEmojiPicker}
              setShowEmojiPicker={setShowEmojiPicker}
              emojiPickerRef={emojiPickerRef}
              handleEmojiClick={handleEmojiClick}
              theme={theme}
              sending={sending}
              error={error}
              setError={setError}
              cooldownSeconds={cooldownSeconds}
              onOpenPollModal={() => setShowPollModal(true)}
            />
            </div>
          )}
        </div>

        {/* Guest CTA */}
        {!user && (
          <div className="mt-3 mb-2 flex-shrink-0">
            <GuestCTA />
          </div>
        )}
      </main>

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
          className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-3xl sm:rounded-[2.5rem] w-full max-w-xl p-5 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-3xl"
        >
          <div className="absolute top-0 right-0 p-4 sm:p-6">
            <button 
              onClick={() => setShowProfileModal(false)} 
              className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] p-1 rounded-xl hover:bg-[var(--theme-surface-hover)] transition-colors"
              title="Tutup"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 rotate-45" />
            </button>
          </div>

          <div className="text-[var(--theme-text)]">
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
    messages={messages}
    currentUser={user}
    onSelectMember={(targetMember) => {
      openProfileEditor(targetMember);
      setShowMembers(false);
    }}
    onSelectMessage={(targetMsg) => {
      handleReply(targetMsg);
      setShowMembers(false);
    }}
  />

  {/* Notification Drawer / Modal */}
  <AnimatePresence>
    {showNotifications && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-3xl sm:rounded-[2.5rem] w-full max-w-lg p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-3xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-[var(--theme-border)] mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--theme-text)]">Pusat Notifikasi</h3>
                <p className="text-[10px] uppercase font-black tracking-widest text-[var(--theme-text-muted)]">
                  {mentions.length} Sinyal & Mention
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowNotifications(false)} 
              className="p-2 hover:bg-[var(--theme-surface-hover)] rounded-xl text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto space-y-3 custom-scrollbar pr-1">
            {mentions.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-[var(--theme-text-muted)] opacity-30 mb-3" />
                <p className="text-sm font-semibold text-[var(--theme-text)]">Belum ada notifikasi baru</p>
                <p className="text-xs text-[var(--theme-text-muted)] mt-1">Anda akan diberitahu jika seseorang menyebut Anda dengan @nama.</p>
              </div>
            ) : (
              mentions.map((mention, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-[var(--theme-surface-hover)] border border-[var(--theme-border)] flex items-start justify-between gap-3 transition-all"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--theme-text)]">
                      <span className="text-cyan-400">@{mention.fromUser}</span> menyebut Anda dalam diskusi
                    </p>
                    <p className="text-xs text-[var(--theme-text-muted)] mt-1 italic line-clamp-2">
                      "{mention.messagePreview}"
                    </p>
                    <span className="text-[9px] font-bold text-[var(--theme-text-muted)] opacity-60 mt-2 block">
                      {mention.time}
                    </span>
                  </div>
                  <button 
                    onClick={() => setMentions(prev => prev.filter((_, i) => i !== idx))} 
                    className="text-[var(--theme-text-muted)] hover:text-red-400 p-1"
                    title="Hapus notifikasi"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {mentions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[var(--theme-border)] flex justify-end">
              <button
                onClick={() => setMentions([])}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-[var(--theme-surface-hover)] rounded-xl transition-colors"
              >
                Hapus Semua
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Mention Notifications Overlay */}
  <MentionNotifications 
    mentions={mentions} 
    onDismiss={(idx) => setMentions(prev => prev.filter((_, i) => i !== idx))} 
  />

  {/* Message Search Modal */}
  <MessageSearchModal
    isOpen={showSearchModal}
    onClose={() => setShowSearchModal(false)}
    messages={messages}
    onJumpToMessage={handleJumpToMessage}
  />

  {/* AI Summarizer Modal */}
  <AISummarizerModal
    isOpen={showSummarizerModal}
    onClose={() => setShowSummarizerModal(false)}
    messages={filteredChannelMessages}
    activeChannel={activeChannel}
  />

  {/* Leaderboard Modal */}
  <LeaderboardModal
    isOpen={showLeaderboardModal}
    onClose={() => setShowLeaderboardModal(false)}
    currentUserId={user?.id}
  />

  {/* Community Poll Modal */}
  <PollModal
    isOpen={showPollModal}
    onClose={() => setShowPollModal(false)}
    onCreatePoll={handleCreatePoll}
  />

  {/* Image Lightbox Modal */}
  <ImageLightbox
    src={lightboxMedia.url}
    isOpen={lightboxMedia.isOpen}
    onClose={() => setLightboxMedia({ isOpen: false, url: '' })}
  />
</div>
  );
}

export default Live;
