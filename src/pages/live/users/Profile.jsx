import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Award,
  MessageSquare,
  Shield,
  Star,
  Trophy,
  TrendingUp,
  Edit,
  CheckCircle,
  XCircle,
  ArrowLeft,
  AlertCircle,
  Save
} from 'lucide-react';
import { AchievementsSection } from '../components/AchievementBadge';
import { PersonalTagsManager } from '../components/NotificationCenter';
import { supabase } from '../../../lib/supabaseClient';

const Profile = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [personalTags, setPersonalTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nama: '',
    bio: ''
  });
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);

      try {
        // Get current user from localStorage
        let currentEmail = null;
        let currentUserData = null;
        const savedRaw = localStorage.getItem('local_user');
        if (savedRaw) {
          currentUserData = JSON.parse(savedRaw);
          setCurrentUser(currentUserData);
          currentEmail = currentUserData.email;
        }

        // Determine which user profile to show
        const targetEmail = email || currentEmail;

        if (targetEmail) {
          // Load profile user data
          const { data, error } = await supabase.from('users').select('*').eq('email', targetEmail);

          if (!error && data && data.length > 0) {
            const userData = data[0];
            const userRole = userData.role?.toUpperCase() || 'USER';

            const profileData = {
              id: userData.id || userData.email,
              nama: userData.nama,
              email: userData.email,
              role: userRole,
              roleName: getRoleName(userRole),
              messageCount: parseInt(userData.message_count) || 0,
              joinDate: userData.tanggal_daftar || 'Unknown',
              status: userData.status || 'aktif',
              bio: userData.bio || 'Belum ada bio...'
            };

            setProfileUser(profileData);
            setEditForm({
              nama: profileData.nama,
              bio: profileData.bio
            });

            // Load achievements dan tags
            await loadAchievements(targetEmail);
            if (currentEmail) {
              await loadPersonalTags(currentEmail);
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [email]);

  // Get role name
  const getRoleName = (role) => {
    const roleConfig = {
      'SUPER_ADMIN': 'Super Admin',
      'ADMIN': 'Admin',
      'MODERATOR': 'Moderator',
      'PREMIUM': 'Premium',
      'VERIFIED': 'Verified',
      'USER': 'User'
    };
    return roleConfig[role] || 'User';
  };

  // Get role color
  const getRoleColor = (role) => {
    const roleColors = {
      'SUPER_ADMIN': 'from-purple-600 to-pink-600',
      'ADMIN': 'from-red-500 to-orange-500',
      'MODERATOR': 'from-blue-500 to-cyan-500',
      'PREMIUM': 'from-green-500 to-emerald-500',
      'VERIFIED': 'from-yellow-500 to-amber-500',
      'USER': 'from-gray-500 to-gray-700'
    };
    return roleColors[role] || 'from-gray-500 to-gray-700';
  };

  // Check if current user can edit this profile
  const canEdit = () => {
    if (!currentUser || !profileUser) return false;
    return currentUser.email === profileUser.email ||
      currentUser.role === 'SUPER_ADMIN' ||
      currentUser.role === 'ADMIN';
  };

  // Load achievements
  const loadAchievements = async (email) => {
    try {
      const { data, error } = await supabase.from('achievements').select('*').eq('email', email);
      if (!error && data) {
        setAchievements(data);
      }
    } catch (error) {
      console.error('Error loading achievements/Tabel missing:', error);
    }
  };

  // Save profile edits
  const saveProfile = async () => {
    try {
      setSaveError('');
      setSaveSuccess('');

      if (!editForm.nama || editForm.nama.trim() === '') {
        setSaveError('Nama tidak boleh kosong');
        return;
      }

      if (editForm.nama.length < 3) {
        setSaveError('Nama minimal 3 karakter');
        return;
      }

      const { error } = await supabase.from('users').update({
        nama: editForm.nama,
        bio: editForm.bio
      }).eq('id', profileUser.id);

      if (!error) {
        setProfileUser(prev => ({
          ...prev,
          nama: editForm.nama,
          bio: editForm.bio
        }));
        setSaveSuccess('Profile berhasil diperbarui!');
        setIsEditing(false);
      } else {
        setSaveError('Gagal menyimpan profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveError('Terjadi kesalahan: ' + error.message);
    }
  };

  // Grant achievement
  const grantAchievement = async (achievement) => {
    if (!currentUser || (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'ADMIN')) return;

    try {
      const newAchievement = {
        email: profileUser.email,
        name: achievement.title,
        icon: achievement.icon,
        date_earned: new Date().toISOString()
      };

      const { error } = await supabase.from('achievements').insert([newAchievement]);

      if (!error) {
        await loadAchievements(profileUser.email);
        setSaveSuccess('Achievement berhasil diberikan!');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error granting achievement:', error);
      setSaveError('Gagal memberikan achievement');
    }
  };

  // Load personal tags
  const loadPersonalTags = async (userEmail) => {
    try {
      const { data, error } = await supabase.from('tags').select('*').eq('email', userEmail);

      if (!error && data && data.length > 0) {
        setPersonalTags(data.filter(t => t.tag));
      }
    } catch (error) {
      console.error('Error loading personal tags:', error);
    }
  };

  // Add personal tag
  const addPersonalTag = async (tag) => {
    try {
      const { error } = await supabase.from('tags').insert([{
        email: currentUser?.email,
        user_id: profileUser.id,
        tag: tag,
        created_at: new Date().toISOString()
      }]);

      if (!error) {
        await loadPersonalTags(currentUser?.email);
      }
    } catch (error) {
      console.error('Error adding personal tag:', error);
    }
  };

  // Remove personal tag
  const removePersonalTag = async (index) => {
    try {
      const tagToRemove = personalTags[index];
      const { error } = await supabase.from('tags').delete().eq('id', tagToRemove.id);

      if (!error) {
        setPersonalTags(prev => prev.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error('Error removing personal tag:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-cyan-300 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-cyan-300 text-lg">Profile not found</p>
          <button
            onClick={() => navigate('/Live-Discussion')}
            className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Back to Chat
          </button>
        </div>
      </div>
    );
  }

  // Predefined achievements berdasarkan role
  const availableAchievements = [
    { id: 'first_msg', title: 'Peserta Baru', description: 'Kirim pesan pertama', icon: '🚀', points: 10, category: 'global' },
    { id: 'ten_msg', title: 'Pembicara Aktif', description: 'Kirim 10 pesan', icon: '💬', points: 25, category: 'global' },
    { id: 'fifty_msg', title: 'Orator Ulung', description: 'Kirim 50 pesan', icon: '🎤', points: 50, category: 'global' },
    { id: 'seven_days', title: 'Konsisten', description: 'Aktif 7 hari berturut-turut', icon: '🔥', points: 30, category: 'global' },
    { id: 'helpful', title: 'Pembantu Sejati', description: 'Di-mention oleh 5 orang', icon: '🤝', points: 40, category: 'global' },
    { id: 'mod_warn', title: 'Penegak Aturan', description: 'Berikan peringatan pertama', icon: '⚠️', points: 20, category: 'moderator' },
    { id: 'admin_ban', title: 'Penjaga Komunitas', description: 'Blokir user pertama kali', icon: '🔒', points: 30, category: 'admin' },
    { id: 'premium_adopt', title: 'Pendukung Awal', description: 'Menjadi Premium dalam 7 hari', icon: '⭐', points: 50, category: 'premium' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07102a] via-[#0a1a3a] to-[#0c234a] relative overflow-hidden flex flex-col">
      {/* Animated Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-72 md:w-96 h-72 md:h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 md:w-96 h-72 md:h-96 bg-purple-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] right-[30%] w-72 md:w-96 h-72 md:h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[80px] animate-pulse pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Header */}
      <header className="bg-gradient-to-r from-[#0f172a]/90 to-[#1e293b]/90 backdrop-blur-xl text-white shadow-lg border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/Live-Discussion')}
              className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Chat
            </button>

            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              User Profile
            </h1>

            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden border border-white/10 p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                    {profileUser.nama?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.nama}
                          onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                          className="text-3xl font-bold bg-transparent border-b border-cyan-500 text-white"
                        />
                      ) : (
                        <h2 className="text-3xl font-bold text-white">{profileUser.nama}</h2>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getRoleColor(profileUser.role)} text-white`}>
                          {profileUser.roleName}
                        </span>

                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${profileUser.status === 'aktif'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                          {profileUser.status === 'aktif' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    {/* Edit Button */}
                    {canEdit() && !isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">About</h3>
                    {isEditing ? (
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-cyan-300/50 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-300 whitespace-pre-wrap">{profileUser.bio}</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-300">{profileUser.messageCount}</div>
                      <div className="text-sm text-gray-400">Messages</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-300">{achievements.length}</div>
                      <div className="text-sm text-gray-400">Achievements</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-purple-300">
                        {Math.floor((profileUser.messageCount || 0) / 10) || 0}
                      </div>
                      <div className="text-sm text-gray-400">Level</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-300">
                        {new Date(profileUser.joinDate).getFullYear()}
                      </div>
                      <div className="text-sm text-gray-400">Joined</div>
                    </div>
                  </div>

                  {/* Edit Actions */}
                  {isEditing && (
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={saveProfile}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            nama: profileUser.nama,
                            bio: profileUser.bio
                          });
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg hover:from-gray-600 hover:to-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white">{profileUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm text-gray-400">Joined Date</p>
                      <p className="text-white">{profileUser.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden border border-white/10 p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  Achievements
                </h3>

                {currentUser?.role === 'SUPER_ADMIN' && (
                  <div className="text-sm text-cyan-300">
                    Admin: Can grant achievements
                  </div>
                )}
              </div>

              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No achievements yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={achievement.id || index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold text-white">{achievement.name}</h4>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Earned: {new Date(achievement.date_earned).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Personal Tags (Only for current user viewing another user) */}
            {currentUser && currentUser.email !== profileUser.email && (
              <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden border border-white/10 p-6 sm:p-8">
                <PersonalTagsManager
                  tags={personalTags.map(tag => ({ name: tag.tag, userName: profileUser.nama }))}
                  onAddTag={addPersonalTag}
                  onRemoveTag={removePersonalTag}
                />
              </div>
            )}
          </div>

          {/* Right Column - Admin Tools & Info */}
          <div className="space-y-8">
            {/* Admin Tools (Only for Super Admin) */}
            {currentUser?.role === 'SUPER_ADMIN' && (
              <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden border border-white/10 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-400" />
                  Admin Tools
                </h3>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/Live-Discussion/dashboard`)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-pink-500/30"
                  >
                    Go to Dashboard
                  </button>

                  <button
                    onClick={() => {
                      // Toggle user status
                      const newStatus = profileUser.status === 'aktif' ? 'nonaktif' : 'aktif';
                      supabase.from('users').update({ status: newStatus }).eq('id', profileUser.id).then(({ error }) => {
                        if (error) {
                          alert('Gagal memperbarui status');
                          return;
                        }
                        setProfileUser(prev => ({
                          ...prev,
                          status: newStatus
                        }));
                        alert(`User ${newStatus === 'aktif' ? 'activated' : 'deactivated'}`);
                      });
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg hover:from-yellow-500/30 hover:to-amber-500/30"
                  >
                    {profileUser.status === 'aktif' ? 'Deactivate User' : 'Activate User'}
                  </button>
                </div>

                {/* Grant Achievements */}
                <div className="mt-6">
                  <h4 className="font-semibold text-white mb-3">Grant Achievement</h4>
                  <div className="space-y-2">
                    {availableAchievements.map((achievement, index) => (
                      <div key={index} className="flex justify-between items-center p-2 hover:bg-white/5 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{achievement.icon}</span>
                          <div>
                            <p className="text-sm text-white">{achievement.title}</p>
                            <p className="text-xs text-gray-400">{achievement.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => grantAchievement(achievement)}
                          className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded hover:bg-green-500/30"
                        >
                          Grant
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Role Information */}
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden border border-white/10 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-4">Role Information</h3>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${getRoleColor(profileUser.role)}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{profileUser.roleName}</p>
                      <p className="text-white/80 text-sm">Current Role</p>
                    </div>
                    <div className="text-2xl">
                      {profileUser.role === 'SUPER_ADMIN' && '👑'}
                      {profileUser.role === 'ADMIN' && '🛡️'}
                      {profileUser.role === 'MODERATOR' && '⭐'}
                      {profileUser.role === 'PREMIUM' && '💎'}
                      {profileUser.role === 'VERIFIED' && '✅'}
                      {profileUser.role === 'USER' && '👤'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Message Limit:</span>
                    <span className="text-white font-semibold">
                      {profileUser.role === 'SUPER_ADMIN' && 'Unlimited'}
                      {profileUser.role === 'ADMIN' && '500/month'}
                      {profileUser.role === 'MODERATOR' && '100/month'}
                      {profileUser.role === 'PREMIUM' && '50/month'}
                      {profileUser.role === 'VERIFIED' && '10/month'}
                      {profileUser.role === 'USER' && '5/month'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Admin Access:</span>
                    <span className="text-white font-semibold">
                      {['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(profileUser.role) ? 'Yes' : 'No'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Priority Support:</span>
                    <span className="text-white font-semibold">
                      {['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'PREMIUM'].includes(profileUser.role) ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] overflow-hidden border border-white/10 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/Live-Discussion')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 flex items-center gap-3"
                >
                  <MessageSquare className="w-5 h-5" />
                  Back to Chat
                </button>

                {currentUser?.email === profileUser.email && (
                  <>
                    <button
                      onClick={() => {
                        localStorage.removeItem('local_user');
                        navigate('/Live-Discussion/login');
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30 rounded-lg hover:from-red-500/30 hover:to-red-600/30 flex items-center gap-3"
                    >
                      <XCircle className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;