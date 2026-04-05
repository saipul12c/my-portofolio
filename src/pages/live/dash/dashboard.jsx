import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut, 
  UserCheck, 
  UserX, 
  Edit, 
  Trash2, 
  Search, 
  Download, 
  Eye, 
  Plus, 
  Trophy, 
  AlertCircle, 
  CheckCircle,
  LayoutDashboard,
  Shield,
  MessageCircle,
  Activity,
  ArrowRight,
  AlertTriangle,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabaseClient';
import { ACHIEVEMENTS } from '../hooks/useAchievements';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false); // New: Live Signal Pulse indicator

  const ROLE_LEVELS = {
    'SUPER_ADMIN': 10,
    'ADMIN': 8,
    'MODERATOR': 5,
    'PREMIUM': 3,
    'VERIFIED': 2,
    'USER': 1
  };
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    todayMessages: 0
  });
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userPage, setUserPage] = useState(0);
  const [msgPage, setMsgPage] = useState(0);
  const PAGE_SIZE = 15;
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nama: '',
    email: '',
    role: 'USER',
    status: 'aktif'
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    nama: '',
    email: '',
    password: '',
    role: 'USER',
    status: 'aktif'
  });
  // eslint-disable-next-line no-unused-vars
  const [achievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedUserForAchievement, setSelectedUserForAchievement] = useState(null);
  
  // Reports & Appeals State
  const [reports, setReports] = useState([]);
  const [appeals, setAppeals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingAppeals, setLoadingAppeals] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('saipul_theme') || 'default');

  // System Config State (New Phase 2)
  const [systemConfigs, setSystemConfigs] = useState({
    message_limits: {
      SUPER_ADMIN: 999999,
      ADMIN: 500,
      MODERATOR: 100,
      PREMIUM: 50,
      VERIFIED: 25,
      USER: 5
    },
    maintenance_mode: false
  });
  const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);

  useEffect(() => {
    localStorage.setItem('saipul_theme', theme);
  }, [theme]);

  // Check if user is Super Admin or Admin
  useEffect(() => {
    const isMounted = { current: true };
    const savedRaw = localStorage.getItem('local_user');
    if (!savedRaw) {
      navigate('/Live-Discussion/login');
      return;
    }

    const checkAccess = async () => {
      try {
        // 1. Get real user session from Supabase Auth (Anti-Spoofing)
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          navigate('/Live-Discussion/login');
          return;
        }

        // 2. Deep DB Verification (Prevent Stale Session Access)
        const { data: dbUser, error: dbError } = await supabase
          .from('users')
          .select('id, role, nama')
          .eq('id', authUser.id)
          .single();

        if (dbError || !dbUser || !['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(dbUser.role)) {
          console.warn('Dashboard access revoked by database policy.');
          localStorage.removeItem('local_user');
          navigate('/Live-Discussion');
          return;
        }

        if (isMounted.current) {
          const userData = {
            ...dbUser,
            username: dbUser.nama // Map for UI consistency
          };
          setUser(userData);
          localStorage.setItem('local_user', JSON.stringify(userData));
          loadDashboardData();
        }
      } catch (err) {
        console.error('Error verifying dashboard access:', err);
        navigate('/Live-Discussion/login');
      }
    };

    checkAccess();
    return () => { isMounted.current = false; };
  }, [navigate]);

  // Load dashboard data (Lightweight Server-Side Stats)
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Get Stats via RPC
      const { data: statsData, error: statsError } = await supabase.rpc('get_dashboard_stats');
      if (statsError) throw statsError;
      setStats(statsData || stats);
      
      // 2. Fetch System Configs
      fetchSystemConfigs();

      // 3. Load initial lists
      loadUsersPage(0);
      fetchReports();
      fetchAppeals();
      fetchAuditLogs();

      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setLoading(false);
    }
  };

  // Load specific page of users from 'profiles' view (Respects Privacy)
  const loadUsersPage = async (page, search = searchTerm) => {
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.or(`nama.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query
        .order('tanggal_daftar', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setUsers(data || []);
      setUserPage(page);
    } catch (err) {
      console.error('Error loading users page:', err);
    }
  };

  // Load specific page of messages
  const loadMessagesPage = async (page) => {
    try {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setMessages(data || []);
      setMsgPage(page);
    } catch (err) {
      console.error('Error loading messages page:', err);
    }
  };

  // Realtime Listener for Dashboard (Throttled for Performance)
  useEffect(() => {
    if (!user) return;
    let lastRefresh = 0;
    const REFRESH_THRESHOLD = 2000; // 2 seconds throttle

    const dashboardChannel = supabase
      .channel('dashboard-precision-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        const now = Date.now();
        if (now - lastRefresh > REFRESH_THRESHOLD) {
          loadDashboardData();
          lastRefresh = now;
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        // Trigger visual pulse when new message arrives (keep this instant)
        setPulse(true);
        setTimeout(() => setPulse(false), 2000);
        
        const now = Date.now();
        if (now - lastRefresh > REFRESH_THRESHOLD) {
          loadDashboardData();
          lastRefresh = now;
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, () => {
        fetchReports();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(dashboardChannel);
    };
  }, [user]);

  // Helper: Verify Authorization Hierarchy
  const canManageUser = (targetUser) => {
    if (!user || !targetUser) return false;
    const myLevel = ROLE_LEVELS[user.role] || 0;
    const targetLevel = ROLE_LEVELS[targetUser.role] || 0;
    
    // Admin cannot manage Super Admin. 
    // Moderator cannot manage Admin/Super Admin.
    // Must have strictly higher level to manage.
    return myLevel > targetLevel;
  };

  // Handle user edit
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      nama: user.nama || '',
      email: user.email || '',
      role: user.role || 'USER',
      status: user.status || 'aktif'
    });
    setShowEditModal(true);
  };

  // Update user
  const updateUser = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update(editForm)
        .eq('id', selectedUser.id);

      if (!error) {
        alert('User updated successfully!');
        setShowEditModal(false);
        loadDashboardData();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  // Delete user
  const deleteUser = async (targetUser) => {
    if (!canManageUser(targetUser)) {
      alert('Peringatan Keamanan: Anda tidak memiliki wewenang untuk menghapus user ini (Izin Hierarki).');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus user ${targetUser.nama}?`)) return;

    try {
      const { error } = await supabase.from('users').delete().eq('id', targetUser.id);

      if (!error) {
        await createAuditLog(targetUser.id, 'DELETE_USER', 'Pelanggaran berat (Admin action)');
        alert('User deleted successfully!');
        loadDashboardData();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Toggle user status (Active / Banned)
  const toggleUserStatus = async (targetUser) => {
    if (!canManageUser(targetUser)) {
      alert('Anda tidak memiliki izin untuk mengubah status user ini.');
      return;
    }
    
    const isBanning = targetUser.status === 'aktif' || targetUser.status === 'active';
    const newStatus = isBanning ? 'banned' : 'aktif';
    const actionLabel = isBanning ? 'BAN' : 'UNBAN';
    
    let reason = 'Restorasi akses normal';
    if (isBanning) {
      reason = prompt('Alasan Banned:', 'Melanggar standar komunitas');
      if (reason === null) return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status: newStatus,
          ban_reason: isBanning ? reason : null 
        })
        .eq('id', targetUser.id);

      if (!error) {
        alert(`User ${targetUser.nama} set to ${newStatus}!`);
        loadDashboardData();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const toggleShadowban = async (targetUser) => {
    if (!canManageUser(targetUser)) {
      alert('Unauthorized.');
      return;
    }
    const newStatus = !targetUser.is_shadowbanned;
    try {
      const { error } = await supabase.from('users').update({ is_shadowbanned: newStatus }).eq('id', targetUser.id);
      if (error) throw error;
      alert(newStatus ? 'User shadowbanned!' : 'Shadowban lifted!');
      loadDashboardData();
    } catch (err) {
      console.error('Error shadowbanning:', err);
    }
  };

  const muteUser = async (targetUser, days = 1) => {
    if (!canManageUser(targetUser)) {
      alert('Unauthorized.');
      return;
    }
    
    const reason = prompt('Masukkan alasan pembungkaman (mute):', 'Melanggar aturan diskusi');
    if (reason === null) return;

    const until = new Date();
    until.setDate(until.getDate() + days);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          mute_until: until.toISOString(),
          mute_reason: reason 
        })
        .eq('id', targetUser.id);
        
      if (error) throw error;
      
      alert(`User muted for ${days} days!`);
      loadDashboardData();
    } catch (err) {
      console.error('Error muting user:', err);
    }
  };

  const createAuditLog = async (targetId, action, reason, metadata = {}) => {
    if (!user) return;
    try {
      await supabase.from('audit_logs').insert({
        admin_id: user.id,
        target_id: targetId,
        action,
        reason,
        metadata
      });
    } catch (err) {
      console.error('Failed to create audit log:', err);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          message:messages(*),
          reporter:users!reports_reporter_id_fkey(nama, username)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchAppeals = async () => {
    setLoadingAppeals(true);
    try {
      const { data, error } = await supabase
        .from('appeals')
        .select(`*, user:users(nama, username, ban_reason)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setAppeals(data || []);
    } catch (err) {
      console.error('Error fetching appeals:', err);
    } finally {
      setLoadingAppeals(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`*, admin:users!audit_logs_admin_id_fkey(nama), target:users!audit_logs_target_id_fkey(nama)`)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      setAuditLogs(data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  };

  const handleAppealAction = async (appeal, status) => {
    try {
      const response = prompt(`Masukkan tanggapan Anda untuk user (Status: ${status}):`);
      if (response === null) return;

      const { error } = await supabase
        .from('appeals')
        .update({ status, admin_response: response })
        .eq('id', appeal.id);

      if (error) throw error;

      if (status === 'approved') {
        await supabase.from('users').update({ status: 'aktif', ban_reason: null }).eq('id', appeal.user_id);
        await createAuditLog(appeal.user_id, 'UNBAN_APPEAL', response);
      }

      alert(`Banding ${status}!`);
      loadDashboardData();
    } catch (err) {
      console.error('Error handling appeal:', err);
    }
  };

  const dismissReport = async (reportId) => {
    try {
      const { error } = await supabase.from('reports').delete().eq('id', reportId);
      if (error) throw error;
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      console.error('Error dismissing report:', err);
      alert('Gagal menghapus laporan');
    }
  };

  const handleModerationAction = async (report, action) => {
    if (action === 'delete_message') {
      if (!confirm('Hapus pesan ini permanen?')) return;
      await deleteMessage(report.message_id);
      await dismissReport(report.id);
    } else if (action === 'ban_user') {
      if (!confirm('Nonaktifkan user ini?')) return;
      const { data: userData } = await supabase.from('users').select('*').eq('id', report.message.user_id).single();
      if (userData) {
        await updateStatus(userData, 'nonaktif');
        await dismissReport(report.id);
      }
    }
  };

  // Add new user
  const addNewUser = async () => {
    if (!newUserForm.nama || !newUserForm.email || !newUserForm.password) {
      alert('Mohon isi semua field yang diperlukan!');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: newUserForm.email,
        password: newUserForm.password,
        options: {
          data: {
            nama: newUserForm.nama
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Force update profile record to match admin intent
        const { error: updateError } = await supabase.from('users').update({
          role: newUserForm.role,
          status: newUserForm.status
        }).eq('id', data.user.id);

        if (updateError) throw updateError;

        alert(`User ${newUserForm.nama} berhasil ditambahkan!`);
        setShowAddUserModal(false);
        setNewUserForm({
          nama: '',
          email: '',
          password: '',
          role: 'USER',
          status: 'aktif'
        });
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Gagal menambahkan user');
    }
  };

  // Upgrade user role
  const upgradeUserRole = async (user, newRole) => {
    try {
      const { error } = await supabase.from('users').update({ role: newRole }).eq('id', user.id);

      if (!error) {
        alert(`Role user diubah menjadi ${newRole}!`);
        loadDashboardData();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error upgrading user role:', error);
      alert('Gagal mengubah role user');
    }
  };

  // Delete single message with media cleanup
  const deleteMessage = async (messageId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;

    try {
      // 1. Fetch message to check for media
      const { data: msg } = await supabase.from('messages').select('*').eq('id', messageId).single();
      
      // 2. Media cleanup
      if (msg && msg.media_url) {
        const path = msg.media_url.split('/public/live_discussion_media/')[1];
        if (path) {
          await supabase.storage.from('live_discussion_media').remove([path]);
        }
      }

      // 3. Delete from DB
      const { error } = await supabase.from('messages').delete().eq('id', messageId);

      if (!error) {
        await createAuditLog(msg?.user_id, 'DELETE_MESSAGE', 'Moderation: Cleanup requirement');
        alert('Pesan berhasil dihapus!');
        loadDashboardData();
      } else throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Gagal menghapus pesan');
    }
  };

  // Delete all messages
  const deleteAllMessages = async () => {
    if (!confirm('PERINGATAN! Apakah Anda yakin ingin menghapus SEMUA pesan? Tindakan ini tidak dapat dibatalkan!')) return;

    try {
      setLoading(true);

      // Menggunakan empty filter untuk menghapus seluruh data yang tidak id-nya kosong
      const { error } = await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (!error) {
        alert('Semua pesan berhasil dihapus!');
        loadDashboardData();
      } else throw error;
    } catch (error) {
      console.error('Error deleting all messages:', error);
      alert('Gagal menghapus semua pesan');
      setLoading(false);
    }
  };

  // Add achievement to user
  const addAchievement = async (userId, achievement) => {
    try {
      const achievementData = {
        user_id: userId,
        achievement_id: achievement.id,
        name: achievement.name,
        icon: achievement.icon,
        points: achievement.points,
        category: achievement.category,
        date_unlocked: new Date().toISOString()
      };

      const { error } = await supabase.from('achievements').insert([achievementData]);

      if (!error) {
        alert(`Achievement "${achievement.name}" berhasil ditambahkan untuk user!`);
        setShowAchievementModal(false);
        setSelectedUserForAchievement(null);
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
      alert('Gagal menambahkan achievement. Pastikan koneksi database stabil.');
    }
  };

  // Filter users
  const filteredUsers = users.filter(user =>
    user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('local_user');
    navigate('/Live-Discussion/login');
  };

  // Reset all message counts via RPC
  const handleResetMessageCounts = async () => {
    if (!confirm('Apakah Anda yakin ingin mereset SEMUA hitungan pesan user menjadi 0?')) return;
    try {
      setLoading(true);
      const { error } = await supabase.rpc('reset_monthly_message_counts');
      if (error) throw error;
      alert('Semua hitungan pesan berhasil direset!');
      loadDashboardData();
    } catch (err) {
      console.error('Error resetting counts:', err);
      alert('Gagal mereset hitungan pesan.');
    } finally {
      setLoading(false);
    }
  };

  // New: Archive Old Messages Trigger
  const handleArchiveMessages = async () => {
    if (!confirm('Apakah Anda yakin ingin memindahkan pesan lama ke arsip (menghapus dari tabel utama)? Pesan yang lebih tua dari 30 hari akan dibersihkan.')) return;
    try {
      setLoading(true);
      const { data: deletedCount, error } = await supabase.rpc('archive_old_messages', { days_to_keep: 30 });
      if (error) throw error;
      alert(`Pembersihan Berhasil: Berhasil mengarsipkan ${deletedCount} pesan lama.`);
      loadDashboardData();
    } catch (err) {
      console.error('Error archiving messages:', err);
      alert('Gagal menjalankan pengarsipan sistem.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-cyan-300 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`theme-${theme} min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-sans selection:bg-[var(--theme-accent)]/30 flex flex-col md:flex-row overflow-hidden`}>
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[var(--theme-accent)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Mobile Top Header & Scrollable Nav */}
      <div className="md:hidden flex flex-col bg-[var(--theme-surface)] border-b border-[var(--theme-border)] z-40 sticky top-0">
        <div className="p-4 flex justify-between items-center bg-[var(--theme-bg)] border-b border-[var(--theme-border)]">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-[var(--theme-accent)] to-blue-600 rounded-xl flex items-center justify-center">
               <Shield className="w-4 h-4 text-white" />
             </div>
             <div>
               <h1 className="text-sm font-black tracking-tighter text-[var(--theme-text)] uppercase italic leading-tight">Admin</h1>
               <p className="text-[8px] font-bold text-[var(--theme-text-muted)] uppercase tracking-widest leading-tight">Console v2.0</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTheme(prev => prev === 'default' ? 'light' : prev === 'light' ? 'dark' : 'default')} className="p-2 border border-[var(--theme-border)] rounded-lg text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]">
               {theme === 'default' ? <Monitor className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button onClick={handleLogout} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg">
               <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Scrollable Mobile Nav Tabs */}
        <div className="flex overflow-x-auto p-2 gap-2 custom-scrollbar items-center">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'users', icon: Users, label: 'User Hub' },
            { id: 'messages', icon: MessageCircle, label: 'Discussions' },
            { id: 'reports', icon: AlertTriangle, label: 'Reports', badge: reports.length },
            { id: 'appeals', icon: UserCheck, label: 'Appeals', badge: appeals.length },
            { id: 'audit', icon: Activity, label: 'Audit Log' },
            { id: 'achievements', icon: Trophy, label: 'Badges' },
            { id: 'settings', icon: Settings, label: 'System' },
          ].map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                 activeTab === item.id 
                   ? 'bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20' 
                   : 'text-[var(--theme-text-muted)] border border-transparent'
               }`}
             >
               <item.icon className="w-4 h-4" />
               {item.label}
               {item.badge !== undefined && item.badge > 0 && (
                 <span className="ml-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{item.badge}</span>
               )}
             </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex w-64 bg-[var(--theme-surface)] backdrop-blur-3xl border-r border-[var(--theme-border)] flex-col z-30 relative"
      >
        <div className="p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">Admin</h1>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Console v2.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'users', icon: Users, label: 'User Hub' },
            { id: 'messages', icon: MessageCircle, label: 'Discussions' },
            { id: 'reports', icon: AlertTriangle, label: 'Reports', badge: reports.length },
            { id: 'appeals', icon: UserCheck, label: 'Appeals', badge: appeals.length },
            { id: 'audit', icon: Activity, label: 'Audit Log' },
            { id: 'achievements', icon: Trophy, label: 'Badges' },
            { id: 'settings', icon: Settings, label: 'System' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:block text-sm font-bold tracking-tight">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto space-y-2 border-t border-[var(--theme-border)]">
          <button 
            onClick={() => setTheme(prev => prev === 'default' ? 'light' : prev === 'light' ? 'dark' : 'default')}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">Theme: {theme}</span>
            {theme === 'default' ? <Monitor className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <Link to="/Live-Discussion" className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--theme-text-muted)] hover:text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/10 transition-all">
            <Eye className="w-5 h-5" />
            <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Live View</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Terminate</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Dynamic Header */}
        <header className="p-4 md:p-8 md:pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[var(--theme-text)] uppercase italic">
              {activeTab === 'overview' && 'Console'}
              {activeTab === 'users' && 'User Hub'}
              {activeTab === 'messages' && 'Discussions'}
              {activeTab === 'reports' && 'Moderation'}
              {activeTab === 'settings' && 'System'}
              {activeTab === 'achievements' && 'Badges'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                Operative: {user?.username} <span className="mx-2 text-cyan-500/30">|</span> Status: Alpha
              </p>
              {pulse && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                  className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
                />
              )}
            </div>
          </motion.div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search Database..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-12 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-sm font-bold text-white placeholder-white/10 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 transition-all backdrop-blur-md"
              />
            </div>
            <button className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 text-white/40 hover:text-white transition-all backdrop-blur-md">
              <Activity className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Bento Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Operators', value: stats.totalUsers, icon: Users, color: 'cyan', glow: 'shadow-cyan-500/10' },
                  { label: 'Active Signals', value: stats.activeUsers, icon: Activity, color: 'blue', glow: 'shadow-blue-500/10' },
                  { label: 'Signal Logs', value: stats.totalMessages, icon: MessageCircle, color: 'purple', glow: 'shadow-purple-500/10' },
                  { label: 'Pending Alerts', value: reports.length, icon: AlertTriangle, color: 'orange', glow: 'shadow-orange-500/10' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all group ${stat.glow} hover:shadow-2xl`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-4 rounded-2xl bg-${stat.color}-500/10 border border-${stat.color}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20">LIVE</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black tracking-tighter text-white">{stat.value}</h3>
                        <span className="text-[10px] font-bold text-green-400">+12%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Placeholder for future Charts/Content area */}
            </motion.div>
          )}

        {/* User Management */}
        {activeTab === 'users' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Database Cache</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Total Signals: {filteredUsers.length}</p>
              </div>
              <div className="flex gap-3">
                {user?.role !== 'MODERATOR' && (
                  <>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="px-6 py-3 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Insert User
                    </button>
                    <button className="px-6 py-3 bg-white/5 text-white/60 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Dump CSV
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Ident</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Class</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Pulse</th>
                    <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u, i) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                            <User className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-white tracking-tight">{u.nama}</p>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit border ${
                            u.role === 'SUPER_ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            u.role === 'MODERATOR' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            u.role === 'PREMIUM' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            'bg-white/5 text-white/40 border-white/10'
                          }`}>
                            {u.role}
                          </span>
                          <span className={`text-[8px] font-bold uppercase tracking-widest ${
                            (u.status === 'aktif' || u.status === 'active') ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {(u.status === 'aktif' || u.status === 'active') ? 'Active Node' : 'Terminated'}
                          </span>
                          {u.is_shadowbanned && (
                            <span className="text-[8px] font-bold uppercase tracking-widest text-purple-400">Shadowbanned</span>
                          )}
                          {u.mute_until && new Date(u.mute_until) > new Date() && (
                            <span className="text-[8px] font-bold uppercase tracking-widest text-orange-400">Muted</span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-500/40" style={{ width: `${Math.min((u.message_count || 0) / 100 * 100, 100)}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-white tracking-widest">{u.message_count || 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                           {user?.role !== 'MODERATOR' && (
                             <>
                               <button onClick={() => muteUser(u)} className="p-2 hover:bg-orange-500/10 rounded-xl transition-all text-orange-400" title="Mute 24h">
                                 <AlertCircle className="w-5 h-5" />
                               </button>
                               <button onClick={() => toggleShadowban(u)} className={`p-2 rounded-xl transition-all ${u.is_shadowbanned ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-purple-500/10 text-purple-400/40'}`} title="Toggle Shadowban">
                                 <Eye className="w-5 h-5" />
                               </button>
                               <button onClick={() => toggleUserStatus(u)} className={`p-2 rounded-xl transition-all ${u.status === 'nonaktif' ? 'text-red-400 bg-red-400/20' : 'text-white/20 hover:text-red-400 hover:bg-red-400/10'}`} title="Ban/Deactivate">
                                 <UserX className="w-5 h-5" />
                               </button>
                             </>
                           )}
                           <button onClick={() => handleEditUser(u)} className="p-2 hover:bg-cyan-500/10 rounded-xl transition-all text-cyan-400/60 hover:text-cyan-400" title="Edit Class">
                             <Edit className="w-5 h-5" />
                           </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Users */}
            <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                Showing {userPage * PAGE_SIZE + 1} - {Math.min((userPage + 1) * PAGE_SIZE, stats.totalUsers)} of {stats.totalUsers}
              </p>
              <div className="flex gap-2">
                <button 
                  disabled={userPage === 0}
                  onClick={() => loadUsersPage(userPage - 1)}
                  className="px-4 py-2 bg-white/5 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                >
                  Prev
                </button>
                <button 
                  disabled={(userPage + 1) * PAGE_SIZE >= stats.totalUsers}
                  onClick={() => loadUsersPage(userPage + 1)}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-400 disabled:opacity-30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/30 transition-all border border-cyan-500/20"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}

          {/* Signal Logs (Messages) */}
          {activeTab === 'messages' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-8 rounded-[2rem]">
                <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Signal Traffic</h3>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Intercepted: {messages.length} Units</p>
                </div>
                {user?.role !== 'MODERATOR' && (
                  <button
                    onClick={deleteAllMessages}
                    className="px-6 py-3 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-400 transition-all shadow-lg shadow-red-500/20 active:scale-95 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Purge Database
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                {messages.map((m, i) => (
                  <motion.div 
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-6 rounded-[2rem] hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-white/5">
                          <MessageCircle className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white tracking-tight">{m.username}</p>
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{new Date(m.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => deleteMessage(m.id)} className="p-2.5 bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-400 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="pl-14">
                      <div className="bg-black/20 border border-white/5 p-4 rounded-2xl">
                        <p className="text-sm text-white/70 leading-relaxed font-medium">{m.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination Controls Messages */}
              <div className="flex justify-center gap-4 pt-4 pb-8">
                <button 
                  disabled={msgPage === 0}
                  onClick={() => loadMessagesPage(msgPage - 1)}
                  className="px-6 py-3 bg-white/5 disabled:opacity-30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5"
                >
                  Load Newer
                </button>
                <button 
                  disabled={(msgPage + 1) * PAGE_SIZE >= stats.totalMessages}
                  onClick={() => loadMessagesPage(msgPage + 1)}
                  className="px-6 py-3 bg-cyan-500/10 text-cyan-400 disabled:opacity-30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                >
                  Load Earlier
                </button>
              </div>
            </motion.div>
          )}

          {/* System Config (Settings) */}
          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-4xl space-y-8"
            >
              <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem]">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">Node Constraints</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.keys(systemConfigs.message_limits).filter(role => role !== 'SUPER_ADMIN').map((type) => (
                    <div key={type} className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">{type} Limit</label>
                      <input 
                        type="number" 
                        value={systemConfigs.message_limits[type]}
                        onChange={(e) => handleLimitChange(type, e.target.value)}
                        className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 transition-all"
                      />
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => updateSystemConfigs('message_limits', systemConfigs.message_limits)}
                  disabled={isUpdatingConfig}
                  className="mt-8 px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
                >
                  {isUpdatingConfig ? 'Syncing...' : 'Update Protocols'}
                </button>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Flush Cache', desc: 'Clear all signal buffers', color: 'yellow', action: null },
                  { label: 'System Archive', desc: 'Move 30d+ signals to cold storage', color: 'blue', action: handleArchiveMessages },
                  { label: 'Reset Pulse', desc: 'Zero all message counters', color: 'green', action: handleResetMessageCounts },
                  { 
                    label: systemConfigs.maintenance_mode ? 'System Online' : 'Lockdown', 
                    desc: systemConfigs.maintenance_mode ? 'End maintenance period' : 'Emergency signal termination', 
                    color: 'red', 
                    action: () => updateSystemConfigs('maintenance_mode', !systemConfigs.maintenance_mode) 
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center group hover:bg-white/[0.04] transition-all">
                    <div>
                      <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">{item.label}</h4>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">{item.desc}</p>
                    </div>
                    <button 
                      onClick={item.action}
                      className={`p-4 rounded-2xl bg-${item.color}-500/10 border border-${item.color}-500/20 text-${item.color}-400 hover:scale-110 transition-all`}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reports View (New) */}
          {activeTab === 'reports' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-white/[0.04] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                 <div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Moderation Queue</h3>
                   <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Found {reports.length} pending alerts</p>
                 </div>
                 <button onClick={fetchReports} disabled={loadingReports} className="p-4 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-2xl border border-cyan-500/20 text-cyan-400 font-bold uppercase text-[10px] tracking-widest transition-all">
                   Refresh Database
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {reports.length === 0 ? (
                  <div className="py-20 text-center opacity-20 flex flex-col items-center">
                    <CheckCircle className="w-20 h-20 mb-4" />
                    <p className="text-xl font-black uppercase tracking-tighter">No Reports Found</p>
                    <p className="text-sm font-bold mt-1">System is clear of active signals</p>
                  </div>
                ) : (
                  reports.map((r) => (
                    <motion.div 
                      key={r.id}
                      layout
                      className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] hover:border-orange-500/30 transition-all group"
                    >
                      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/20 rounded-xl">
                              <AlertTriangle className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic block">Reporter Information</span>
                              <p className="text-sm font-black text-white">{r.reporter?.nama || 'Anonymous Operator'} (@{r.reporter?.username || 'unknown'})</p>
                            </div>
                          </div>

                          <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic mb-2 block">Signal Content</span>
                            <p className="text-sm text-white/80 italic leading-relaxed">
                              {r.message ? r.message.content : '[Message content not found or already deleted]'}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Target ID: {r.message?.user_id || 'Unknown'}</span>
                              <span className="w-1 h-1 bg-white/10 rounded-full" />
                              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Time: {new Date(r.created_at).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 md:flex-col min-w-[150px]">
                          <button onClick={() => handleModerationAction(r, 'delete_message')} className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/10">Delete Signal</button>
                          <button onClick={() => handleModerationAction(r, 'ban_user')} className="w-full px-4 py-3 bg-white/5 hover:bg-red-600/40 text-white/60 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">Restrict Operator</button>
                          <button onClick={() => dismissReport(r.id)} className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">Dismiss Alert</button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Badge Matrix (Achievements) */}
          {activeTab === 'achievements' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(ACHIEVEMENTS).map((b) => (
                  <div key={b.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                       <span className="text-6xl">{b.icon}</span>
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Trophy className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">{b.name}</h4>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1 mb-6">{b.description}</p>
                      <div className="flex items-center justify-between">
                         <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-cyan-500/20">+{b.points} PTR</span>
                         <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest italic">{b.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">Operator Matrix</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((u, idx) => (
                    <div key={u.id || idx} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-white/40 font-black text-lg border border-white/5 group-hover:text-white transition-all">
                          {u.nama?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white tracking-tight">{u.nama}</p>
                          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">{u.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedUserForAchievement(u);
                          setShowAchievementModal(true);
                        }}
                        className="p-3 bg-purple-500/10 hover:bg-purple-500 text-purple-400 hover:text-white rounded-xl transition-all shadow-lg shadow-purple-500/0 hover:shadow-purple-500/20"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Appeals View */}
          {activeTab === 'appeals' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 px-1">
              <div className="bg-white/[0.04] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Banding System</h3>
                 <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">{appeals.length} user requests pending evaluation</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {appeals.length === 0 ? (
                   <div className="py-20 text-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/10">
                     <p className="text-sm font-bold text-white/20 uppercase tracking-widest">No pending appeals found</p>
                   </div>
                ) : appeals.map((a) => (
                  <div key={a.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row justify-between gap-6 hover:bg-white/[0.04] transition-all group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 font-bold uppercase tracking-tighter">
                          {a.user?.username?.[0] || 'U'}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white italic uppercase tracking-tighter">@{a.user?.username}</h4>
                          <span className="text-[9px] font-black uppercase text-red-500/60 font-mono">Ban Reason: {a.user?.ban_reason || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <p className="text-sm text-white/80 leading-relaxed italic">"{a.reason}"</p>
                      </div>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-3">Submitted: {new Date(a.created_at).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-col gap-2 justify-center">
                      {a.status === 'pending' ? (
                        <>
                          <button 
                            onClick={() => handleAppealAction(a, 'approved')}
                            className="px-6 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/0 hover:shadow-green-500/20"
                          >
                            Approve & Unban
                          </button>
                          <button 
                            onClick={() => handleAppealAction(a, 'rejected')}
                            className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                          >
                            Reject Permanent
                          </button>
                        </>
                      ) : (
                        <div className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center flex items-center gap-2 ${a.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                          {a.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {a.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Audit Log View */}
          {activeTab === 'audit' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-white/[0.04] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl flex justify-between items-center">
                 <div>
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sovereign Audit</h3>
                   <p className="text-xs font-bold text-white/30 uppercase tracking-widest mt-1">Timeline of all administrative node operations</p>
                 </div>
                 <Activity className="w-10 h-10 text-cyan-500/20" />
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Temporal</th>
                        <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Operative</th>
                        <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Action</th>
                        <th className="px-8 py-5 text-[10px] font-black text-white/40 uppercase tracking-widest">Protocol Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {auditLogs.length === 0 ? (
                        <tr><td colSpan="4" className="px-8 py-20 text-center text-white/10 font-black uppercase tracking-[0.3em]">No logs synchronized</td></tr>
                      ) : auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-all group">
                          <td className="px-8 py-4 text-[10px] font-medium text-white/30 font-mono italic">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-2">
                              <Shield className="w-3 h-3 text-cyan-500/40" />
                              <span className="text-xs font-bold text-white/80 tracking-tighter uppercase">{log.admin?.nama || 'System'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                              log.action.includes('BAN') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                              log.action.includes('MUTE') ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                              'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-8 py-4">
                            <p className="text-xs text-white/40 italic truncate max-w-xs group-hover:text-white/60 transition-colors">"{log.reason}"</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>


      {/* Modal Systems */}
      <AnimatePresence>
        {/* Edit User Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-white/5">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Modify Operative</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">{selectedUser?.email}</p>
              </div>

              <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Display Name</label>
                  <input
                    type="text"
                    value={editForm.nama}
                    onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                    className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Clearance</label>
                    <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 outline-none transition-all"
                    >
                      {['USER', 'VERIFIED', 'PREMIUM', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'].map(r => <option key={r} value={r} className="bg-[#020617]">{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-2">Node Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500/30 outline-none transition-all"
                    >
                      <option value="aktif" className="bg-[#020617]">ACTIVE</option>
                      <option value="nonaktif" className="bg-[#020617]">TERMINATED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-white/5 flex gap-4">
                <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-white/5 text-white/40 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Abort</button>
                <button onClick={updateUser} className="flex-1 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">Commit Changes</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddUserModal(false)} className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 border-b border-white/5">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Initialize Operative</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">New Node Entry</p>
              </div>

              <div className="p-10 space-y-6">
                <input type="text" placeholder="DISPLAY NAME" value={newUserForm.nama} onChange={(e) => setNewUserForm({ ...newUserForm, nama: e.target.value })} className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold focus:border-cyan-500/30 outline-none uppercase placeholder:text-white/10" />
                <input type="email" placeholder="EMAIL ADDRESS" value={newUserForm.email} onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })} className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold focus:border-cyan-500/30 outline-none uppercase placeholder:text-white/10" />
                <input type="password" placeholder="ACCESS KEY" value={newUserForm.password} onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })} className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold focus:border-cyan-500/30 outline-none uppercase placeholder:text-white/10" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={newUserForm.role} onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })} className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none"><option value="USER" className="bg-[#020617]">USER</option><option value="PREMIUM" className="bg-[#020617]">PREMIUM</option></select>
                  <select value={newUserForm.status} onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value })} className="w-full px-6 py-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none"><option value="aktif" className="bg-[#020617]">ACTIVE</option></select>
                </div>
              </div>

              <div className="p-10 bg-white/5 flex gap-4">
                <button onClick={() => setShowAddUserModal(false)} className="flex-1 py-4 bg-white/5 text-white/40 rounded-2xl font-black text-[10px] uppercase tracking-widest">Abort</button>
                <button onClick={addNewUser} className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20">Authorize</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Achievement Modal */}
        {showAchievementModal && selectedUserForAchievement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAchievementModal(false)} className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter text-center">Assign Badge</h3>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest text-center mt-2">Target: {selectedUserForAchievement.nama}</p>
              </div>

              <div className="p-8 space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {Object.values(ACHIEVEMENTS).map((ach) => (
                  <button
                    key={ach.id}
                    onClick={() => addAchievement(selectedUserForAchievement.id, ach)}
                    className="w-full p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/10 transition-all flex items-center gap-4 group"
                  >
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:scale-110 transition-all">
                      <span className="text-xl group-hover:rotate-12 transition-transform duration-500 inline-block">{ach.icon}</span>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest block">{ach.name}</span>
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest block mt-0.5">{ach.id}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-8 bg-black/20">
                <button onClick={() => setShowAchievementModal(false)} className="w-full py-4 text-white/40 font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">Close Matrix</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;