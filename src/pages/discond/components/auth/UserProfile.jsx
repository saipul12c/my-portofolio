import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { USER_ROLES, USER_TIERS } from '../../utils/constants';
import { getTierColor, getRoleBadge, friendlyFetchError } from '../../utils/helpers';
import Modal from '../ui/Modal';
import PresenceDot from '../PresenceDot';
import api from '../../lib/api';
import ReportModal from '../ui/ReportModal';

const UserProfile = ({ onClose, member }) => {
  const { user, updateProfile, signOut } = useAuth();
  const isOwn = !member || member.id === user?.id;
  const displayUser = member || user || {};
  const [username, setUsername] = useState(displayUser?.username || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) return;
    if (!isOwn) return; // only allow saving own profile

    setLoading(true);
    const result = await updateProfile({ username });
    setLoading(false);

    if (!result.error) {
      onClose();
    }
  };

  const roleBadge = getRoleBadge(displayUser?.role);
  const tierColor = getTierColor(displayUser?.tier);

  // perks mapping per tier (display-only)
  const TIER_PERKS = {
    [USER_TIERS.BRONZE]: ['Akses dasar', 'Profil publik'],
    [USER_TIERS.SILVER]: ['Semua keuntungan Bronze', 'Reaksi khusus'],
    [USER_TIERS.GOLD]: ['Semua keuntungan Silver', 'Prioritas pencarian'],
    [USER_TIERS.PLATINUM]: ['Semua keuntungan Gold', 'Badge Platinum'],
    [USER_TIERS.EMERALD]: ['Semua keuntungan Platinum', 'Badge Emerald'],
    [USER_TIERS.DIAMOND]: ['Semua keuntungan Emerald', 'Support prioritas']
  };

  const [friendLoading, setFriendLoading] = useState(false);
  const [friendResult, setFriendResult] = useState(null);
  const [tierPerksRemote, setTierPerksRemote] = useState(null);
  const navigate = useNavigate();
  const [showReport, setShowReport] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null); // e.g. 'none', 'requested', 'friends'

  useEffect(() => {
    // attempt to load perks mapping from backend (account tiers)
    let mounted = true;
    (async () => {
      try {
        const list = await api.accountTiers.list().catch(() => null);
        if (!mounted || !Array.isArray(list)) return;
        // expected structure: [{ id, key: 'bronze', perks: ['...'] }, ...]
        const map = {};
        list.forEach(t => {
          const key = (t.key || t.id || '').toString().toLowerCase();
          if (key) map[key] = t.perks || t.features || t.description_list || null;
        });
        if (Object.keys(map).length > 0) setTierPerksRemote(map);
      } catch (e) { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // try to resolve friend status for this profile
    let mounted = true;
    (async () => {
      if (!displayUser?.id) return;
      try {
        const list = await api.friends.list().catch(() => null);
        if (!mounted || !Array.isArray(list)) return;
        const found = list.find(f => String(f.id || f.user_id || f.user) === String(displayUser.id) || String(f.user_id) === String(displayUser.id));
        if (found) {
          // simple heuristics: friend object might contain status
          const st = found.status || (found.accepted ? 'friends' : (found.pending ? 'requested' : 'friends'));
          setFriendStatus(st || 'friends');
        } else {
          setFriendStatus('none');
        }
      } catch (e) { setFriendStatus('none'); }
    })();
    return () => { mounted = false; };
  }, [displayUser?.id]);

  const sendFriendRequest = async () => {
    if (!displayUser?.id) return;
    setFriendLoading(true);
    setFriendResult(null);
    try {
      const res = await api.friends.request(displayUser.id).catch((e) => Promise.reject(e));
      setFriendResult({ ok: true, msg: 'Permintaan teman terkirim' });
      setFriendStatus('requested');
    } catch (err) {
      setFriendResult({ ok: false, msg: friendlyFetchError(err) });
    } finally {
      setFriendLoading(false);
    }
  };

  const removeFriend = async () => {
    if (!displayUser?.id) return;
    if (!confirm('Hapus teman / batalkan permintaan?')) return;
    try {
      await api.friends.remove(displayUser.id).catch(() => null);
      setFriendStatus('none');
      setFriendResult({ ok: true, msg: 'Relasi pertemanan dihapus.' });
    } catch (e) {
      setFriendResult({ ok: false, msg: friendlyFetchError(e) });
    }
  };

  const sendDM = async () => {
    if (!displayUser?.id) return;
    try {
      const res = await api.dm.create({ user_id: displayUser.id }).catch(() => null);
      const dmId = res && (res.id || res.dm_id || res.dmId) ? (res.id || res.dm_id || res.dmId) : null;
      if (dmId) {
        // navigate to dm route under discord
        navigate(`/discord/dm/${dmId}`);
      } else {
        // fallback: if backend returned conversation object with members etc
        navigate('/discord');
      }
    } catch (e) {
      console.error('Create DM failed', e);
    }
  };

  const reportAccount = async () => {
    if (!displayUser?.id) return;
    const reason = window.prompt('Berikan alasan pelaporan singkat untuk akun ini:');
    if (!reason) return;
    try {
      await api.users.report(displayUser.id, { reason }).catch(() => null);
      alert('Terima kasih. Laporan telah dikirim.');
    } catch (e) {
      alert('Gagal mengirim laporan.');
    }
  };

  return (
    <Modal onClose={onClose} size="lg">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: tierColor, border: `3px solid ${tierColor}` }}
          >
            {displayUser?.avatar_url ? (
              <img src={displayUser.avatar_url} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              (displayUser?.username || displayUser?.display_name || '??').substring(0,2).toUpperCase()
            )}
          </div>
          <div className="absolute -bottom-1 -right-1">
            <PresenceDot status={displayUser?.presence || 'offline'} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">{displayUser?.display_name || displayUser?.username || 'Pengguna'}</h2>
            <span className={`px-2 py-1 text-xs rounded-full text-white ${roleBadge.color}`}>{roleBadge.text}</span>
            <span className="px-2 py-1 text-xs rounded-full text-white" style={{ backgroundColor: tierColor }}>{displayUser?.tier?.toUpperCase()}</span>
          </div>
          <div className="text-sm text-gray-300 mt-1">{displayUser?.username ? `@${displayUser.username}` : ''}</div>
          <div className="text-xs text-gray-400 mt-2">{displayUser?.email || ''}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Tentang</label>
          <div className="w-full bg-[#40444b] border border-[#40444b] rounded px-3 py-2 text-white min-h-[56px]">{displayUser?.bio || displayUser?.about || 'Belum ada deskripsi.'}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Tingkatan Akun</label>
            <div className="bg-[#40444b] rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: tierColor }}>{(displayUser?.tier || 'U').substring(0,1).toUpperCase()}</div>
                  <div>
                    <div className="text-white font-medium">{(displayUser?.tier || 'unknown').toUpperCase()}</div>
                    <div className="text-xs text-gray-400">Keistimewaan & hak akses</div>
                  </div>
                </div>
              </div>
              <ul className="text-sm text-gray-200 list-disc list-inside">
                {(
                  (tierPerksRemote && tierPerksRemote[displayUser?.tier]) ||
                  (TIER_PERKS[displayUser?.tier]) ||
                  ['Akses standar']
                ).map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Informasi</label>
            <div className="bg-[#40444b] rounded-lg p-3 text-sm text-gray-200">
              <div><strong>Peran:</strong> {roleBadge.text}</div>
              <div><strong>Status:</strong> <span className="ml-2 text-gray-300">{displayUser?.presence || 'offline'}</span></div>
              <div><strong>Gabung:</strong> <span className="ml-2 text-gray-300">{displayUser?.created_at ? new Date(displayUser.created_at).toLocaleDateString() : '—'}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 items-center">
        {isOwn ? (
          <button onClick={signOut} className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={sendDM}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
            >Kirim Pesan</button>
            {friendStatus === 'friends' ? (
              <button onClick={removeFriend} className="px-3 py-2 bg-transparent border border-white/10 text-white rounded">Hapus Teman</button>
            ) : friendStatus === 'requested' ? (
              <button onClick={removeFriend} className="px-3 py-2 bg-transparent border border-white/10 text-white rounded">Batalkan Permintaan</button>
            ) : (
              <button
                onClick={sendFriendRequest}
                disabled={friendLoading}
                className="px-3 py-2 bg-transparent border border-white/10 text-white rounded disabled:opacity-60"
              >{friendLoading ? 'Mengirim...' : 'Tambahkan Teman'}</button>
            )}
            <button onClick={() => setShowReport(true)} className="px-3 py-2 bg-transparent border border-red-600 text-red-400 rounded">Laporkan</button>
          </div>
        )}

        <div className="space-x-3 flex items-center">
          <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white transition-colors">Tutup</button>
          {isOwn && (
            <button onClick={handleSave} disabled={loading || !username.trim()} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors">{loading ? 'Menyimpan...' : 'Simpan'}</button>
          )}
        </div>
      </div>

      {friendResult && (
        <div className={`mt-4 text-sm ${friendResult.ok ? 'text-green-400' : 'text-red-400'}`}>{friendResult.msg}</div>
      )}
      {showReport && (
        <ReportModal userId={displayUser?.id} onClose={() => setShowReport(false)} onReported={() => { setShowReport(false); }} />
      )}
    </Modal>
  );
};

export default UserProfile;