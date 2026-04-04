import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

export const UserInfoCard = ({ user, onMention, isSelf = false }) => {
  const [showMentionBtn, setShowMentionBtn] = useState(false);

  if (!user) return null;

  const roleColors = {
    SUPER_ADMIN: 'from-purple-600 to-pink-600',
    ADMIN: 'from-red-500 to-orange-500',
    MODERATOR: 'from-blue-500 to-cyan-500',
    PREMIUM: 'from-green-500 to-emerald-500',
    VERIFIED: 'from-yellow-500 to-amber-500',
    USER: 'from-gray-500 to-gray-700'
  };

  const roleColor = roleColors[user.role] || roleColors.USER;

  return (
    <div
      className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all"
      onMouseEnter={() => setShowMentionBtn(true)}
      onMouseLeave={() => setShowMentionBtn(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {/* Avatar Mini */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${roleColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {user.username?.[0]?.toUpperCase() || 'U'}
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 flex-wrap">
              <p className="text-sm font-medium text-white truncate">
                {user.username}
              </p>
              {user.role && user.role !== 'USER' && (
                <span className="text-xs px-2 py-0.5 bg-white/10 text-white rounded-full whitespace-nowrap">
                  {user.role === 'SUPER_ADMIN' && '👑'}
                  {user.role === 'ADMIN' && '🛡️'}
                  {user.role === 'MODERATOR' && '⭐'}
                  {user.role === 'PREMIUM' && '💎'}
                  {user.role === 'VERIFIED' && '✅'}
                </span>
              )}
            </div>

            {/* Message count atau status */}
            <p className="text-xs text-gray-400">
              {user.messageCount} pesan
              {user.lastSeen && ` • Terakhir: ${user.lastSeen}`}
            </p>
          </div>
        </div>

        {/* Mention Button */}
        {!isSelf && showMentionBtn && (
          <button
            onClick={() => onMention?.(user)}
            className="ml-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex-shrink-0"
            title="Mention user"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const ActiveUsersList = ({ users, currentUser, onMention }) => {
  const sortedUsers = users.sort((a, b) => {
    // Sort: role level tinggi dulu, lalu alphabetical
    const roleOrder = { SUPER_ADMIN: 0, ADMIN: 1, MODERATOR: 2, PREMIUM: 3, VERIFIED: 4, USER: 5 };
    const aOrder = roleOrder[a.role] || 6;
    const bOrder = roleOrder[b.role] || 6;

    if (aOrder !== bOrder) return aOrder - bOrder;
    return (a.username || '').localeCompare(b.username || '');
  });

  return (
    <div className="space-y-2">
      {sortedUsers.map((user) => (
        <UserInfoCard
          key={user.id || user.email}
          user={user}
          onMention={onMention}
          isSelf={currentUser?.email === user.email}
        />
      ))}
    </div>
  );
};

export const UserProfile Preview = ({ user }) => {
  if (!user) return null;

  const roleColors = {
    SUPER_ADMIN: 'from-purple-600 to-pink-600',
    ADMIN: 'from-red-500 to-orange-500',
    MODERATOR: 'from-blue-500 to-cyan-500',
    PREMIUM: 'from-green-500 to-emerald-500',
    VERIFIED: 'from-yellow-500 to-amber-500',
    USER: 'from-gray-500 to-gray-700'
  };

  const roleColor = roleColors[user.role] || roleColors.USER;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-xl shadow-2xl border border-white/10 p-6 w-96">
        <div className="text-center">
          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${roleColor} flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4`}>
            {user.username?.[0]?.toUpperCase() || 'U'}
          </div>

          <h3 className="text-xl font-bold text-white">{user.username}</h3>
          <p className="text-sm text-gray-400">{user.email}</p>

          <div className="mt-4 flex justify-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${roleColor} text-white`}>
              {user.role}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-xs">Pesan</p>
              <p className="text-xl font-bold text-white">{user.messageCount || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Level</p>
              <p className="text-xl font-bold text-white">{Math.floor((user.messageCount || 0) / 10) || 1}</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">{user.bio || 'No bio'}</p>
        </div>
      </div>
    </div>
  );
};
