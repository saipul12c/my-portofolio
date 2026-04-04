import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  BarChart3,
  AlertCircle,
  ArrowLeft,
  Search,
  Filter
} from 'lucide-react';
import { SuperAdminFeatures, AdminFeatures, ModeratorFeatures, PremiumFeatures } from '../features/RoleFeatures';
import { ROLE_FEATURES } from '../utils/roleUtils';

const RoleDashboard = ({ user, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [managedUsers] = useState([]);
  const [stats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    averageMessages: 0
  });

  // Get dashboard berdasarkan role
  const getDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'SUPER_ADMIN':
        return <SuperAdminFeatures user={user} onActionComplete={handleActionComplete} />;
      case 'ADMIN':
        return <AdminFeatures user={user} onActionComplete={handleActionComplete} />;
      case 'MODERATOR':
        return <ModeratorFeatures user={user} onActionComplete={handleActionComplete} />;
      case 'PREMIUM':
        return <PremiumFeatures user={user} onActionComplete={handleActionComplete} />;
      default:
        return null;
    }
  };

  const handleActionComplete = (featureId) => {
    // Handle fitur yang dipilih
    console.log('Feature selected:', featureId);
  };

  // Permission check
  const hasAccess = (userRole) => {
    return ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'PREMIUM'].includes(userRole);
  };

  if (!hasAccess(user?.role)) {
    return (
      <div className="bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-gray-400 mb-4">Anda tidak memiliki akses ke dashboard ini</p>
          <button
            onClick={() => onNavigate?.('/')}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0f172a]/95 to-[#1e293b]/95 backdrop-blur-lg text-white shadow-lg border-b border-cyan-500/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate?.('/')}
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali
            </button>

            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              {user?.role} Dashboard
            </h1>

            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role-specific Dashboard */}
        <div className="mb-8">
          {getDashboard()}
        </div>

        {/* Additional Tools untuk Admin & Super Admin */}
        {['SUPER_ADMIN', 'ADMIN'].includes(user?.role) && (
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-white">Management Tools</h2>

            {/* User Search & Filter */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">Semua Role</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="USER">User</option>
                  </select>
                </div>
              </div>

              {/* User List */}
              <div className="space-y-3">
                {managedUsers.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">Tidak ada user ditemukan</p>
                ) : (
                  managedUsers.map((u) => (
                    <UserManagementRow key={u.id} user={u} currentUserRole={user?.role} />
                  ))
                )}
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-yellow-400" />
                Statistik Sistem
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold text-cyan-300">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-400 mt-1">Total Users</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold text-green-300">{stats.activeUsers}</div>
                  <div className="text-sm text-gray-400 mt-1">Active Now</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold text-purple-300">{stats.totalMessages}</div>
                  <div className="text-sm text-gray-400 mt-1">Total Messages</div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-3xl font-bold text-yellow-300">{stats.averageMessages}</div>
                  <div className="text-sm text-gray-400 mt-1">Avg Messages/User</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Component untuk row user management
const UserManagementRow = ({ user, currentUserRole }) => {
  const [action] = useState(null);

  if (!user) return null;

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
          {user.nama?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="text-white font-medium">{user.nama}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-white">
          {user.role}
        </span>

        <button
          onClick={() => setAction('view')}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          View
        </button>

        {currentUserRole === 'SUPER_ADMIN' && (
          <>
            <button
              onClick={() => setAction('edit_role')}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
            >
              Change Role
            </button>

            <button
              onClick={() => setAction('ban')}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Ban
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RoleDashboard;
