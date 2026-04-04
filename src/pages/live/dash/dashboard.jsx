import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CheckCircle
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Check if user is Super Admin or Admin
  useEffect(() => {
    const savedRaw = localStorage.getItem('local_user');
    if (!savedRaw) {
      navigate('/Live-Discussion/login');
      return;
    }

    try {
      const savedParsed = JSON.parse(savedRaw);
      if (savedParsed.role !== 'SUPER_ADMIN' && savedParsed.role !== 'ADMIN') {
        navigate('/Live-Discussion/login');
        return;
      }
      setUser(savedParsed);
      loadDashboardData();
    } catch (err) {
      console.error('Error parsing user data:', err);
      navigate('/Live-Discussion/login');
    }
  }, [navigate]);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load users
      const { data: usersData, error: usersError } = await supabase.from('users').select('*').order('tanggal_daftar', { ascending: false });
      if (usersError) throw usersError;

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (messagesError) throw messagesError;

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayMessages = (messagesData || []).filter(msg =>
        msg.created_at && msg.created_at.startsWith(today)
      ).length;

      const activeUsers = (usersData || []).filter(u =>
        u.status === 'aktif' || u.status === 'active'
      ).length;

      setStats({
        totalUsers: (usersData || []).length,
        activeUsers,
        totalMessages: (messagesData || []).length,
        todayMessages
      });

      setUsers(usersData || []);
      setMessages((messagesData || []).slice(0, 50)); // Recent 50 messages

      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setLoading(false);
    }
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
  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase.from('users').delete().eq('id', id);

      if (!error) {
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

  // Toggle user status
  const toggleUserStatus = async (user) => {
    const newStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif';

    try {
      const { error } = await supabase.from('users').update({ status: newStatus }).eq('id', user.id);

      if (!error) {
        alert(`User ${newStatus === 'aktif' ? 'activated' : 'deactivated'}!`);
        loadDashboardData();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
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
        // Auto create usually handled by trigger, but we update role and status
        await supabase.from('users').update({
          role: newUserForm.role,
          status: newUserForm.status
        }).eq('id', data.user.id);

        alert('User berhasil ditambahkan!');
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

  // Delete single message
  const deleteMessage = async (messageId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;

    try {
      const { error } = await supabase.from('messages').delete().eq('id', messageId);

      if (!error) {
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
  const addAchievement = async (userId, achievementName) => {
    try {
      const achievementData = {
        user_id: userId,
        name: achievementName,
        date_earned: new Date().toISOString()
      };

      const { error } = await supabase.from('achievements').insert([achievementData]);

      if (!error) {
        alert(`Achievement "${achievementName}" berhasil ditambahkan untuk user!`);
        setShowAchievementModal(false);
        setSelectedUserForAchievement(null);
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
      alert('Mungkin Tabel achievements belum dibuat. Hubungi developer.');
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
    <div className="min-h-screen bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] relative overflow-hidden">
      {/* Animated Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 md:w-96 h-72 md:h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-purple-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] right-[30%] w-72 md:w-96 h-72 md:h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-16 md:w-64 bg-white/[0.02] backdrop-blur-2xl border-r border-white/10 shadow-[8px_0_32px_0_rgba(0,0,0,0.37)] z-20 flex flex-col transition-all duration-300">
        <div className="p-4 md:p-6 text-center md:text-left">
          <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 hidden md:block mb-2">Admin Panel</h1>
          <h1 className="text-xl font-bold text-cyan-400 md:hidden">AP</h1>
          <p className="text-gray-400 text-xs md:text-sm hidden md:block">Super Admin Dashboard</p>
        </div>

        <nav className="mt-6 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            <BarChart3 className="w-5 h-5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            <Users className="w-5 h-5" />
            Users
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Messages
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${activeTab === 'achievements' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            <Trophy className="w-5 h-5" />
            Achievements
          </button>

          <div className="mt-auto pt-6 border-t border-white/10">
            <button
              onClick={() => navigate('/Live-Discussion')}
              className="w-full flex justify-center md:justify-start items-center gap-3 px-2 md:px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-cyan-300 transition-colors mb-2"
              title="View Chat"
            >
              <Eye className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:inline">View Chat</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex justify-center md:justify-start items-center gap-3 px-2 md:px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-16 md:ml-64 p-4 md:p-8 relative z-10 h-screen overflow-y-auto flex-1 w-full max-w-[100vw]">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'messages' && 'Message Logs'}
              {activeTab === 'settings' && 'System Settings'}
              {activeTab === 'achievements' && 'User Achievements'}
            </h2>
            <p className="text-gray-400">Welcome back, {user?.username} 👑</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="search-input"
                name="search-input"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-sm transition-all hover:bg-white/10 w-32 md:w-48 lg:w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl hover:shadow-cyan-500/10 transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-200/50 text-sm font-medium">Total Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">{stats.totalUsers}</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl hover:shadow-green-500/10 transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200/50 text-sm font-medium">Active Users</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">{stats.activeUsers}</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                  <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl hover:shadow-purple-500/10 transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200/50 text-sm font-medium">Total Messages</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">{stats.totalMessages}</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl hover:shadow-yellow-500/10 transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-200/50 text-sm font-medium">Today's Messages</p>
                  <p className="text-xl sm:text-2xl font-bold text-white mt-1 sm:mt-2">{stats.todayMessages}</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">All Users ({filteredUsers.length})</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider hidden md:table-cell">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider hidden lg:table-cell">Messages</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider hidden xl:table-cell">Joined</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                            {user.nama?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.nama || 'No Name'}</p>
                            <p className="text-gray-400 text-xs">ID: {user.id || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">{user.email}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'SUPER_ADMIN' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                          user.role === 'ADMIN' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' :
                            user.role === 'MODERATOR' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                              user.role === 'PREMIUM' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                                user.role === 'VERIFIED' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' :
                                  'bg-gradient-to-r from-gray-500 to-gray-700 text-white'
                          }`}>
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${(user.status === 'aktif' || user.status === 'active')
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                          {user.status === 'aktif' || user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                        {user.message_count || 0}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-300">
                        {user.tanggal_daftar || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-1.5 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => toggleUserStatus(user)}
                            className="p-1.5 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30"
                            title={user.status === 'aktif' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'aktif' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => upgradeUserRole(user, 'PREMIUM')}
                            className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30"
                            title="Upgrade to Premium"
                          >
                            💎
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUserForAchievement(user);
                              setShowAchievementModal(true);
                            }}
                            className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30"
                            title="Add Achievement"
                          >
                            <Trophy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Message Logs */}
        {activeTab === 'messages' && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Recent Messages ({messages.length})</h3>
                <button
                  onClick={deleteAllMessages}
                  className="px-4 py-2 bg-red-600/80 text-white rounded-xl hover:bg-red-500 flex items-center gap-2 transition-colors shadow-lg shadow-red-500/20"
                  title="Delete all messages"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All
                </button>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {messages.map((message, index) => (
                <div key={message.id || index} className="p-4 sm:p-5 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {message.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{message.username}</p>
                        <p className="text-cyan-200/50 text-sm">{message.email}</p>
                      </div>
                    </div>
                    <span className="text-cyan-200/50 text-sm">
                      {new Date(message.created_at || message.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-3 p-4 bg-black/20 rounded-xl border border-white/5">
                    <p className="text-gray-200">{message.content}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
                    <span>Role: {message.role || 'USER'}</span>
                    <span>ID: {message.id || 'N/A'}</span>
                    <span>Reply To: {message.reply_to ? 'Yes' : 'No'}</span>
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="ml-auto p-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">System Settings</h3>

            <div className="space-y-6">
              <div className="p-6 bg-black/20 rounded-xl border border-white/10">
                <h4 className="text-lg font-medium text-white mb-4">Message Limits Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <label htmlFor="limit-user" className="block text-sm text-cyan-200/70 mb-1">User Limit</label>
                    <input id="limit-user" name="limit-user" type="number" defaultValue="5" className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <label htmlFor="limit-verified" className="block text-sm text-cyan-200/70 mb-1">Verified Limit</label>
                    <input id="limit-verified" name="limit-verified" type="number" defaultValue="10" className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <label htmlFor="limit-premium" className="block text-sm text-cyan-200/70 mb-1">Premium Limit</label>
                    <input id="limit-premium" name="limit-premium" type="number" defaultValue="50" className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                  </div>
                </div>
                <button className="mt-4 px-4 py-2 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-xl transition-colors shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                  Save Limits
                </button>
              </div>

              <div className="p-6 bg-black/20 rounded-xl border border-white/10">
                <h4 className="text-lg font-medium text-white mb-4">System Maintenance</h4>
                <div className="space-y-4">
                  <button className="w-full px-4 py-3 bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/20 transition-colors">
                    Clear Message Cache
                  </button>
                  <button className="w-full px-4 py-3 bg-green-500/10 text-green-300 border border-green-500/30 rounded-xl hover:bg-green-500/20 transition-colors">
                    Reset All Message Counts
                  </button>
                  <button className="w-full px-4 py-3 bg-red-500/10 text-red-300 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors">
                    Emergency System Lockdown
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/40 transition">
                <Trophy className="w-10 h-10 text-yellow-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Early Bird</h3>
                <p className="text-gray-400 text-sm mb-4">Member pertama yang bergabung dalam komunitas</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">1 member memiliki</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition">
                <Trophy className="w-10 h-10 text-blue-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Chatty</h3>
                <p className="text-gray-400 text-sm mb-4">Mengirim 100+ pesan dalam komunitas</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">5 members memiliki</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition">
                <Trophy className="w-10 h-10 text-purple-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Helper</h3>
                <p className="text-gray-400 text-sm mb-4">Membantu member lain dengan jawaban berkualitas</p>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Manual assign</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition">
                <Trophy className="w-10 h-10 text-green-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Moderator Pro</h3>
                <p className="text-gray-400 text-sm mb-4">Memoderasi komunitas dengan konsisten</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">2 members memiliki</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition">
                <Trophy className="w-10 h-10 text-red-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Premium Member</h3>
                <p className="text-gray-400 text-sm mb-4">Upgrade ke status premium member</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">3 members memiliki</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-xl p-6 hover:border-indigo-500/40 transition">
                <Trophy className="w-10 h-10 text-indigo-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Legendary</h3>
                <p className="text-gray-400 text-sm mb-4">Pencapaian luar biasa dalam komunitas</p>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-gray-400">Manual assign</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4">User Achievements</h3>
              <div className="space-y-3">
                {users.map((user, idx) => (
                  <div key={user.id || idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {user.nama?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.nama}</p>
                        <p className="text-cyan-200/50 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUserForAchievement(user);
                        setShowAchievementModal(true);
                      }}
                      className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-500/40 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Achievement
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a1a3a]/90 backdrop-blur-2xl rounded-2xl w-full max-w-md border border-cyan-500/20 shadow-[0_0_40px_rgba(0,255,255,0.1)]">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Edit User</h3>
              <p className="text-blue-200/70 text-sm">Update informasi pengguna ini</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="edit-nama" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Nama</label>
                <input
                  id="edit-nama"
                  name="edit-nama"
                  type="text"
                  value={editForm.nama}
                  onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Email</label>
                <input
                  id="edit-email"
                  name="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="edit-role" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Role</label>
                <select
                  id="edit-role"
                  name="edit-role"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all [&>option]:bg-[#0a1a3a]"
                >
                  <option value="USER">User</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Status</label>
                <select
                  id="edit-status"
                  name="edit-status"
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all [&>option]:bg-[#0a1a3a]"
                >
                  <option value="aktif">Active</option>
                  <option value="nonaktif">Inactive</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/10 rounded-b-2xl">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 bg-white/5 text-white rounded-xl hover:bg-white/10 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-400 hover:to-blue-500 font-medium shadow-lg shadow-cyan-500/20 transform active:scale-95 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a1a3a]/90 backdrop-blur-2xl rounded-2xl w-full max-w-md border border-cyan-500/20 shadow-[0_0_40px_rgba(0,255,255,0.1)]">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Tambah User Baru</h3>
              <p className="text-blue-200/70 text-sm">Buat akun pengguna baru</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="new-nama" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Nama</label>
                <input
                  id="new-nama"
                  name="new-nama"
                  type="text"
                  value={newUserForm.nama}
                  onChange={(e) => setNewUserForm({ ...newUserForm, nama: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  placeholder="Masukkan nama"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="new-email" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Email</label>
                <input
                  id="new-email"
                  name="new-email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-gray-500"
                  placeholder="user@example.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Password</label>
                <input
                  id="new-password"
                  name="new-password"
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-gray-500"
                  placeholder="Masukkan password"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label htmlFor="new-role" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Role</label>
                <select
                  id="new-role"
                  name="new-role"
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all [&>option]:bg-[#0a1a3a]"
                >
                  <option value="USER">User</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="new-status" className="block text-sm font-medium text-cyan-200/70 mb-1.5">Status</label>
                <select
                  id="new-status"
                  name="new-status"
                  value={newUserForm.status}
                  onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all [&>option]:bg-[#0a1a3a]"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-aktif</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-black/10 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUserForm({
                    nama: '',
                    email: '',
                    password: '',
                    role: 'USER',
                    status: 'aktif'
                  });
                }}
                className="px-5 py-2.5 bg-white/5 text-white rounded-xl hover:bg-white/10 font-medium transition-colors"
              >
                Batal
              </button>
              <button
                onClick={addNewUser}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-400 hover:to-emerald-500 font-medium shadow-lg shadow-green-500/20 transform active:scale-95 transition-all"
              >
                Tambah User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchievementModal && selectedUserForAchievement && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0a1a3a]/90 backdrop-blur-2xl rounded-2xl w-full max-w-md border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)] relative">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Tambah Achievement</h3>
              <p className="text-purple-200/70 text-sm">Untuk: {selectedUserForAchievement.nama}</p>
            </div>

            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Early Bird')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-yellow-500/10 hover:border-yellow-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Early Bird</p>
                    <p className="text-cyan-200/50 text-xs mt-0.5">Member pertama bergabung</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Chatty')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Chatty</p>
                    <p className="text-cyan-200/50 text-xs mt-0.5">Mengirim 100+ pesan</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Helper')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-purple-500/10 hover:border-purple-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Helper</p>
                    <p className="text-cyan-200/50 text-xs mt-0.5">Jawaban berkualitas</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Moderator Pro')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-green-500/10 hover:border-green-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Moderator Pro</p>
                    <p className="text-cyan-200/50 text-xs mt-0.5">Moderasi konsisten</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Premium Member')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Premium Member</p>
                    <p className="text-cyan-200/50 text-xs mt-0.5">Status premium</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Legendary')}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/30 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Legendary</p>
                    <p className="text-cyan-200/50 text-xs mt-0.5">Pencapaian luar biasa</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="p-6 border-t border-white/10 bg-black/10 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowAchievementModal(false);
                  setSelectedUserForAchievement(null);
                }}
                className="w-full px-5 py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;