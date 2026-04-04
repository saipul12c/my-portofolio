import React, { useState } from 'react';
import {
  Shield,
  AlertCircle,
  Users,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Zap,
  MessageCircle,
  Lock,
  Unlock,
  Clock
} from 'lucide-react';

// Fitur Super Admin: Full Control
export const SuperAdminFeatures = ({ onActionComplete }) => {
  const [stats] = useState({
    totalUsers: 0,
    totalMessages: 0,
    totalBans: 0,
    totalWarnings: 0
  });

  const features = [
    {
      id: 'system_stats',
      name: 'System Analytics',
      description: 'Lihat statistik sistem real-time',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'ban_system',
      name: 'Ban Management',
      description: 'Kelola ban dan blokir user',
      icon: <Lock className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'role_assign',
      name: 'Role Assignment',
      description: 'Assign role kepada user',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'server_config',
      name: 'Server Configuration',
      description: 'Konfigurasi server dan settings',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-amber-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-2">Super Admin Dashboard</h3>
        <p className="text-purple-100">Kontrol penuh atas sistem dan komunitas</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {features.map(feature => (
          <div
            key={feature.id}
            className={`bg-gradient-to-br ${feature.color} rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-shadow`}
            onClick={() => onActionComplete?.(feature.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-lg">{feature.name}</p>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
              {feature.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <StatCard label="Messages" value={stats.totalMessages} icon="💬" />
        <StatCard label="Bans" value={stats.totalBans} icon="🔒" />
        <StatCard label="Warnings" value={stats.totalWarnings} icon="⚠️" />
      </div>
    </div>
  );
};

// Fitur Admin: Community Management
export const AdminFeatures = ({ onActionComplete }) => {
  const features = [
    {
      id: 'mod_tools',
      name: 'Moderation Tools',
      description: 'Kelola moderator dan warning',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'community_config',
      name: 'Community Settings',
      description: 'Atur konfigurasi komunitas',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'user_reports',
      name: 'User Reports',
      description: 'Kelola laporan dari user',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'content_review',
      name: 'Content Review',
      description: 'Review konten yang dilaporkan',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-2">Admin Panel</h3>
        <p className="text-red-100">Kelola komunitas dengan efisien</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {features.map(feature => (
          <div
            key={feature.id}
            className={`bg-gradient-to-br ${feature.color} rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-shadow`}
            onClick={() => onActionComplete?.(feature.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-lg">{feature.name}</p>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
              {feature.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
        <p className="text-sm text-orange-800">
          💡 Sebagai Admin, Anda memiliki tanggung jawab untuk menjaga kualitas dan keamanan komunitas.
        </p>
      </div>
    </div>
  );
};

// Fitur Moderator: Enforcement & Support
export const ModeratorFeatures = ({ onActionComplete }) => {
  const features = [
    {
      id: 'warn_users',
      name: 'Warn Users',
      description: 'Berikan warning kepada user',
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'message_delete',
      name: 'Message Management',
      description: 'Hapus atau edit pesan',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-2">Moderator Tools</h3>
        <p className="text-blue-100">Bantu menjaga komunitas tetap aman</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {features.map(feature => (
          <div
            key={feature.id}
            className={`bg-gradient-to-br ${feature.color} rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-shadow`}
            onClick={() => onActionComplete?.(feature.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-lg">{feature.name}</p>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
              {feature.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fitur Premium: Exclusive Content
export const PremiumFeatures = ({ onActionComplete }) => {
  const features = [
    {
      id: 'priority_support',
      name: 'Priority Support',
      description: 'Dapatkan support lebih cepat',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'custom_badge',
      name: 'Custom Badge',
      description: 'Tampilkan badge custom Anda',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-amber-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-2">Premium Features</h3>
        <p className="text-green-100">Nikmati fitur eksklusif premium</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {features.map(feature => (
          <div
            key={feature.id}
            className={`bg-gradient-to-br ${feature.color} rounded-lg p-4 text-white cursor-pointer hover:shadow-lg transition-shadow`}
            onClick={() => onActionComplete?.(feature.id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-lg">{feature.name}</p>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
              {feature.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
        <p className="text-sm text-green-800">
          ✨ Terima kasih telah mendukung komunitas kami dengan membership Premium!
        </p>
      </div>
    </div>
  );
};

// Helper component untuk stats card
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-400 transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <span className="text-3xl opacity-50">{icon}</span>
    </div>
  </div>
);
