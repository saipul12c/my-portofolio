import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
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
  Save,
  Zap,
  Globe,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Hash
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useAchievements } from '../hooks/useAchievements';

const Profile = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userAchievements: achievements, loadAchievements, unlockAchievement } = useAchievements();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nama: '', bio: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        let currentEmail = null;
        const savedRaw = localStorage.getItem('local_user');
        if (savedRaw) {
          const u = JSON.parse(savedRaw);
          setCurrentUser(u);
          currentEmail = u.email;
        } else if (!email) {
          // No user logged in and no target email in URL
          navigate('/Live-Discussion/login');
          return;
        }

        const targetEmail = email || currentEmail;
        if (targetEmail) {
          const { data, error } = await supabase.from('users').select('*').eq('email', targetEmail);
          if (!error && data?.length > 0) {
            const u = data[0];
            const role = u.role?.toUpperCase() || 'USER';
            const profile = {
              id: u.id,
              nama: u.nama,
              email: u.email,
              role,
              roleName: role.replace('_', ' '),
              messageCount: parseInt(u.message_count) || 0,
              joinDate: u.tanggal_daftar || 'N/A',
              status: u.status || 'aktif',
              bio: u.bio || 'Enter a sophisticated status update...'
            };
            setProfileUser(profile);
            setEditForm({ nama: profile.nama, bio: profile.bio });
            await loadAchievements(u.id, targetEmail);
          }
        }
      } catch (err) {
        console.error('Profile Load Err:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [email]);

  const saveProfile = async () => {
    try {
      if (!editForm.nama?.trim()) {
        setMessage({ type: 'error', text: 'Identity required' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }
      const { error } = await supabase.from('users').update({
        nama: editForm.nama,
        bio: editForm.bio
      }).eq('id', profileUser.id);

      if (!error) {
        setProfileUser(p => ({ ...p, ...editForm }));
        setMessage({ type: 'success', text: 'Identity Synced' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        setIsEditing(false);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Sync Failure' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      SUPER_ADMIN: 'from-purple-500 to-pink-500',
      ADMIN: 'from-red-500 to-orange-500',
      MODERATOR: 'from-blue-500 to-cyan-500',
      PREMIUM: 'from-green-500 to-emerald-500',
      VERIFIED: 'from-yellow-500 to-amber-500'
    };
    return colors[role] || 'from-gray-500 to-gray-400';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-12 h-12 border-t-2 border-cyan-500 rounded-full" />
    </div>
  );

  if (!profileUser) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Identity Not Found</h2>
        <button onClick={() => navigate('/Live-Discussion')} className="px-8 py-4 bg-cyan-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Return Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 font-sans antialiased overflow-hidden selection:text-cyan-200">
      {/* Immersive Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-150" />
      </div>

      {/* Floating Header */}
      <nav className="sticky top-0 z-50 bg-[#020617]/50 backdrop-blur-2xl border-b border-white/5 px-6 md:px-12 py-6 flex justify-between items-center">
        <motion.button 
          whileHover={{ x: -5 }}
          onClick={() => navigate('/Live-Discussion')}
          className="flex items-center gap-3 group"
        >
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/30 transition-all">
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-cyan-400 transition-all">Backstream</span>
        </motion.button>

        <h1 className="text-sm font-black italic uppercase tracking-tighter text-white/30 truncate max-w-[150px] md:max-w-none">
          User.Node: <span className="text-white">{profileUser.email}</span>
        </h1>

        <div className="flex items-center gap-4">
          {profileUser.status === 'aktif' ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Online</span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
              <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Offline</span>
            </div>
          )}
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col gap-12">
        {/* Profile Hero section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Identity */}
          <div className="lg:col-span-2 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-12 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[4rem] group overflow-hidden"
            >
              <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start text-center md:text-left">
                <div className="relative">
                  <div className={`w-40 h-40 rounded-[3rem] bg-gradient-to-br ${getRoleColor(profileUser.role)} p-1 shadow-2xl rotate-3`}>
                    <div className="w-full h-full rounded-[2.8rem] bg-[#020617] flex items-center justify-center text-4xl font-black italic text-white -rotate-3 overflow-hidden group-hover:scale-105 transition-transform">
                      {profileUser.nama?.[0] || 'U'}
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl bg-cyan-500 text-white shadow-xl rotate-12">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-1 space-y-6 pt-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editForm.nama}
                          onChange={e => setEditForm({ ...editForm, nama: e.target.value })}
                          className="text-4xl font-black text-white italic uppercase tracking-tighter bg-transparent border-b border-cyan-500 focus:outline-none"
                        />
                      ) : (
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{profileUser.nama}</h2>
                      )}
                      <div className={`px-4 py-1.5 rounded-xl bg-gradient-to-r ${getRoleColor(profileUser.role)} text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-500/20`}>
                        {profileUser.roleName}
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em]">Joined: {new Date(profileUser.joinDate).toLocaleDateString()}</p>
                  </div>

                  <div className="max-w-xl">
                    {isEditing ? (
                      <textarea
                        value={editForm.bio}
                        onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                        className="w-full h-24 p-4 bg-black/20 border border-white/5 rounded-2xl text-white/70 font-medium text-sm focus:border-cyan-500/30 outline-none resize-none"
                        placeholder="Define your existence..."
                      />
                    ) : (
                      <p className="text-white/60 font-medium leading-relaxed italic">"{profileUser.bio}"</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    {currentUser?.email === profileUser.email && (
                      <button 
                        onClick={() => isEditing ? saveProfile() : setIsEditing(true)}
                        className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all ${isEditing ? 'bg-green-500 text-white' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}
                      >
                        {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        {isEditing ? 'Commit Changes' : 'Modify Identity'}
                      </button>
                    )}
                    {isEditing && (
                      <button onClick={() => setIsEditing(false)} className="px-8 py-4 bg-red-500/10 text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-500/20">Abort</button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Overlay Bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            </motion.div>

            {/* Stats Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Signals Sent', val: profileUser.messageCount, icon: MessageSquare, col: 'cyan' },
                { label: 'Badge Level', val: achievements.length, icon: Trophy, col: 'yellow' },
                { label: 'Sync Grade', val: profileUser.role === 'USER' ? 'D' : 'A', icon: ShieldCheck, col: 'blue' },
                { label: 'Reputation', val: '992k', icon: TrendingUp, col: 'purple' },
              ].map((s, i) => (
                <motion.div 
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  className="p-8 bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2.5rem] group hover:bg-white/[0.04] transition-all text-center md:text-left"
                >
                  <s.icon className={`w-6 h-6 text-${s.col}-400 mb-4 mx-auto md:mx-0 group-hover:scale-125 transition-all`} />
                  <p className="text-3xl font-black text-white italic tracking-tighter">{s.val}</p>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Side Module: System Control / Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] space-y-8">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Node Protocol</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="p-3 rounded-[1.2rem] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"><Mail className="w-5 h-5" /></div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Secure Email</p>
                    <p className="text-xs font-bold text-white/70 truncate">{profileUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-[1.2rem] bg-purple-500/10 border border-purple-500/20 text-purple-400"><Globe className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Origin Node</p>
                    <p className="text-xs font-bold text-white/70 tracking-widest">GLOBAL.TRANSIT</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] space-y-6">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Operations</h3>
              <div className="grid gap-3">
                {currentUser?.email === profileUser.email && (
                  <button 
                    onClick={() => { localStorage.removeItem('local_user'); navigate('/Live-Discussion/login'); }}
                    className="w-full flex items-center justify-between p-6 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 rounded-2xl transition-all group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">Sever Connection</span>
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                {['SUPER_ADMIN', 'ADMIN'].includes(currentUser?.role) && (
                  <button 
                    onClick={() => navigate('/Live-Discussion/dashboard')}
                    className="w-full flex items-center justify-between p-6 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-white border border-cyan-500/20 rounded-2xl transition-all group"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">Admin Console</span>
                    <Settings className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Achievement Matrix */}
        <section className="space-y-12">
          <div className="flex items-center gap-6">
            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-white/5" />
            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Achievement Matrix</h3>
            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-white/5" />
          </div>

          {achievements.length === 0 ? (
            <div className="py-24 text-center bg-white/[0.02] border border-white/5 border-dashed rounded-[3rem]">
              <div className="p-8 rounded-full bg-white/5 w-fit mx-auto mb-8 border border-white/5">
                <Award className="w-12 h-12 text-white/20" />
              </div>
              <p className="text-xl font-black text-white italic uppercase tracking-tighter">Zero Signals Captured</p>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-2">Engage in discussions to synchronize badges</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((ach, i) => (
                <motion.div
                  key={ach.id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3rem] hover:bg-white/[0.05] transition-all relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-all">
                    <Award className="w-24 h-24 rotate-12" />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tighter leading-tight">{ach.name}</h4>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-2 leading-relaxed">{ach.description}</p>
                    </div>
                    <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                      <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest tracking-tighter">Synced</span>
                      <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">{new Date(ach.date_unlocked || ach.date_earned || ach.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Global Message Toast */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-10 py-5 rounded-[2rem] backdrop-blur-3xl border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'} shadow-2xl flex items-center gap-4`}
          >
            {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="ml-4 p-2 hover:bg-white/10 rounded-xl"><XCircle className="w-4 h-4 opacity-50" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;