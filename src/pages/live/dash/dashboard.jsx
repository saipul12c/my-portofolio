import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Shield, 
  Settings, 
  LogOut,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Trophy,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

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

  // Check if user is Super Admin
  useEffect(() => {
    const savedRaw = localStorage.getItem('local_user');
    if (!savedRaw) {
      navigate('/Live-Discussion/login');
      return;
    }

    try {
      const savedParsed = JSON.parse(savedRaw);
      if (savedParsed.role !== 'SUPER_ADMIN') {
        navigate('/Live-Discussion');
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
      const usersResponse = await fetch(`${DATABASE_URL}/users`);
      const usersData = await usersResponse.json();
      
      // Load messages
      const messagesResponse = await fetch(`${DATABASE_URL}/messages`);
      const messagesData = await messagesResponse.json();
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayMessages = messagesData.filter(msg => 
        msg.created_at && msg.created_at.startsWith(today)
      ).length;
      
      const activeUsers = usersData.filter(u => 
        u.status === 'aktif' || u.status === 'active'
      ).length;
      
      setStats({
        totalUsers: usersData.length,
        activeUsers,
        totalMessages: messagesData.length,
        todayMessages
      });
      
      setUsers(usersData);
      setMessages(messagesData.slice(0, 50)); // Recent 50 messages
      
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
      const response = await fetch(`${DATABASE_URL}/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        alert('User updated successfully!');
        setShowEditModal(false);
        loadDashboardData();
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
      const response = await fetch(`${DATABASE_URL}/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('User deleted successfully!');
        loadDashboardData();
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
      const response = await fetch(`${DATABASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus
        })
      });
      
      if (response.ok) {
        alert(`User ${newStatus === 'aktif' ? 'activated' : 'deactivated'}!`);
        loadDashboardData();
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
      const response = await fetch(`${DATABASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm)
      });
      
      if (response.ok) {
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
      const response = await fetch(`${DATABASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: newRole
        })
      });
      
      if (response.ok) {
        alert(`Role user diubah menjadi ${newRole}!`);
        loadDashboardData();
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
      const response = await fetch(`${DATABASE_URL}/messages/${messageId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Pesan berhasil dihapus!');
        loadDashboardData();
      }
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
      
      // Delete semua pesan satu per satu
      for (let message of messages) {
        await fetch(`${DATABASE_URL}/messages/${message.id}`, {
          method: 'DELETE'
        });
      }
      
      alert('Semua pesan berhasil dihapus!');
      loadDashboardData();
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

      const response = await fetch(`${DATABASE_URL}/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementData)
      });
      
      if (response.ok) {
        alert(`Achievement "${achievementName}" berhasil ditambahkan untuk user!`);
        setShowAchievementModal(false);
        setSelectedUserForAchievement(null);
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
      alert('Gagal menambahkan achievement');
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
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400 text-sm">Super Admin Dashboard</p>
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
          
          <div className="mt-auto pt-6 border-t border-gray-700">
            <button
              onClick={() => navigate('/Live-Discussion')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 mb-2"
            >
              <Eye className="w-5 h-5" />
              View Chat
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
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
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
                </div>
                <Users className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
                </div>
                <UserCheck className="w-10 h-10 text-green-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Messages</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.totalMessages}</p>
                </div>
                <MessageSquare className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Today's Messages</p>
                  <p className="text-3xl font-bold text-white mt-2">{stats.todayMessages}</p>
                </div>
                <BarChart3 className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
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
                  <tr className="bg-gray-700/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Messages</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id || index} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                            {user.nama?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.nama || 'No Name'}</p>
                            <p className="text-gray-400 text-sm">ID: {user.id || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.role === 'SUPER_ADMIN' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                          user.role === 'ADMIN' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' :
                          user.role === 'MODERATOR' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                          user.role === 'PREMIUM' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                          user.role === 'VERIFIED' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white' :
                          'bg-gradient-to-r from-gray-500 to-gray-700 text-white'
                        }`}>
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          (user.status === 'aktif' || user.status === 'active') 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                          {user.status === 'aktif' || user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {user.message_count || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                        {user.tanggal_daftar || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Recent Messages ({messages.length})</h3>
                <button 
                  onClick={deleteAllMessages}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  title="Delete all messages"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete All
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-700">
              {messages.map((message, index) => (
                <div key={message.id || index} className="p-6 hover:bg-gray-700/30">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {message.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{message.username}</p>
                        <p className="text-gray-400 text-sm">{message.email}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(message.created_at || message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="mt-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="text-gray-300">{message.content}</p>
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
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6">System Settings</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="text-lg font-medium text-white mb-4">Message Limits Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <label className="block text-sm text-gray-400 mb-1">User Limit</label>
                    <input type="number" defaultValue="5" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <label className="block text-sm text-gray-400 mb-1">Verified Limit</label>
                    <input type="number" defaultValue="10" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <label className="block text-sm text-gray-400 mb-1">Premium Limit</label>
                    <input type="number" defaultValue="50" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
                  </div>
                </div>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Limits
                </button>
              </div>
              
              <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h4 className="text-lg font-medium text-white mb-4">System Maintenance</h4>
                <div className="space-y-4">
                  <button className="w-full px-4 py-3 bg-yellow-600/20 text-yellow-300 border border-yellow-600/30 rounded-lg hover:bg-yellow-600/30">
                    Clear Message Cache
                  </button>
                  <button className="w-full px-4 py-3 bg-green-600/20 text-green-300 border border-green-600/30 rounded-lg hover:bg-green-600/30">
                    Reset All Message Counts
                  </button>
                  <button className="w-full px-4 py-3 bg-red-600/20 text-red-300 border border-red-600/30 rounded-lg hover:bg-red-600/30">
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

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">User Achievements</h3>
              <div className="space-y-3">
                {users.map((user, idx) => (
                  <div key={user.id || idx} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.nama?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.nama}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUserForAchievement(user);
                        setShowAchievementModal(true);
                      }}
                      className="px-4 py-2 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 flex items-center gap-2"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Edit User</h3>
              <p className="text-gray-400 text-sm">Update user information</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.nama}
                  onChange={(e) => setEditForm({...editForm, nama: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
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
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="aktif">Active</option>
                  <option value="nonaktif">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={updateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Tambah User Baru</h3>
              <p className="text-gray-400 text-sm">Buat akun pengguna baru</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nama</label>
                <input
                  type="text"
                  value={newUserForm.nama}
                  onChange={(e) => setNewUserForm({...newUserForm, nama: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Masukkan nama"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="Masukkan password"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="USER">User</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="MODERATOR">Moderator</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={newUserForm.status}
                  onChange={(e) => setNewUserForm({...newUserForm, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Non-aktif</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
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
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
              <button
                onClick={addNewUser}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Tambah User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {showAchievementModal && selectedUserForAchievement && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Tambah Achievement</h3>
              <p className="text-gray-400 text-sm">Untuk: {selectedUserForAchievement.nama}</p>
            </div>
            
            <div className="p-6 space-y-3">
              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Early Bird')}
                className="w-full p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 text-left"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Early Bird</p>
                    <p className="text-gray-400 text-xs">Member pertama bergabung</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Chatty')}
                className="w-full p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 text-left"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Chatty</p>
                    <p className="text-gray-400 text-xs">Mengirim 100+ pesan</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Helper')}
                className="w-full p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 text-left"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Helper</p>
                    <p className="text-gray-400 text-xs">Jawaban berkualitas</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Moderator Pro')}
                className="w-full p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 text-left"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Moderator Pro</p>
                    <p className="text-gray-400 text-xs">Moderasi konsisten</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Premium Member')}
                className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 text-left"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white font-medium">Premium Member</p>
                    <p className="text-gray-400 text-xs">Status premium</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => addAchievement(selectedUserForAchievement.id, 'Legendary')}
                className="w-full p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 text-left"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-white font-medium">Legendary</p>
                    <p className="text-gray-400 text-xs">Pencapaian luar biasa</p>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowAchievementModal(false);
                  setSelectedUserForAchievement(null);
                }}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;