import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Pin as PinIcon, Bell as BellIcon, BellOff, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import api from '../../lib/api';
import { useChat } from '../../contexts/ChatContext';

const ChannelSettings = ({ channel, openTab = 'notifications', onClose }) => {
  const [tab, setTab] = useState(openTab);
  const [settings, setSettings] = useState({ muted: false, pinned_ids: [] });
  const [name, setName] = useState(channel?.name || '');
  const [saving, setSaving] = useState(false);
  const { messages } = useChat();

  useEffect(() => {
    if (!channel) return;
    (async () => {
      const s = await api.channels.settings.get(channel.id).catch(() => null) || { muted: false, pinned_ids: [] };
      setSettings(s);
      setName(channel.name || '');
    })();
  }, [channel]);

  const toggleMuted = async () => {
    const newSettings = { ...settings, muted: !settings.muted };
    setSettings(newSettings);
    try { await api.channels.settings.set(channel.id, newSettings); } catch (e) { console.error(e); }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      // try server-side rename if backend exists
      await api.channels.rename(channel.id, name).catch(() => null);
      setSaving(false);
      onClose?.();
    } catch (err) {
      console.error('Rename failed', err);
      setSaving(false);
    }
  };

  if (!channel) return null;

  return (
    <Modal onClose={onClose} size="md">
      <div className="text-white">
        <h3 className="text-lg font-semibold mb-2">Channel Settings — #{channel.name}</h3>

        <div className="flex space-x-2 mb-4">
          <button onClick={() => setTab('notifications')} className={`px-3 py-1 rounded ${tab === 'notifications' ? 'bg-[#42464d]' : 'bg-[#2f3136]'}`}>Notifikasi</button>
          <button onClick={() => setTab('pins')} className={`px-3 py-1 rounded ${tab === 'pins' ? 'bg-[#42464d]' : 'bg-[#2f3136]'}`}>Pesan Terpin</button>
          <button onClick={() => setTab('members')} className={`px-3 py-1 rounded ${tab === 'members' ? 'bg-[#42464d]' : 'bg-[#2f3136]'}`}>Anggota</button>
          <button onClick={() => setTab('settings')} className={`px-3 py-1 rounded ${tab === 'settings' ? 'bg-[#42464d]' : 'bg-[#2f3136]'}`}>Umum</button>
        </div>

        <div>
          {tab === 'notifications' && (
            <div>
              <div className="flex items-center justify-between p-3 rounded bg-[#2b2d30]">
                <div>
                  <div className="font-medium">Mute Channel</div>
                  <div className="text-gray-400 text-sm">Jika diaktifkan, notifikasi untuk channel ini akan dibisukan.</div>
                </div>
                <button onClick={toggleMuted} className={`px-3 py-1 rounded ${settings.muted ? 'bg-red-600' : 'bg-green-600'}`}>
                  {settings.muted ? 'Muted' : 'Unmuted'}
                </button>
              </div>
            </div>
          )}

          {tab === 'pins' && (
            <div>
              <div className="text-gray-400 text-sm mb-2">Pesan yang dipin di channel ini.</div>
              <div className="space-y-2">
                {(() => {
                  const pinnedFromMsgs = (messages || []).filter(m => m.pinned || (settings.pinned_ids || []).includes(m.id));
                  if (!pinnedFromMsgs || pinnedFromMsgs.length === 0) {
                    return <div className="p-3 rounded bg-[#2b2d30] text-gray-300">Belum ada pesan yang dipin.</div>;
                  }
                  return pinnedFromMsgs.map(m => {
                    const isPinned = !!(m.pinned || (settings.pinned_ids || []).includes(m.id));
                    return (
                      <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded bg-[#2b2d30] flex items-start justify-between">
                        <div>
                          <div className="text-white font-medium">{m.profiles?.username || 'Unknown'}</div>
                          <div className="text-gray-300 text-sm">{m.content}</div>
                        </div>
                        <div className="ml-4 flex flex-col space-y-1">
                          <button title={isPinned ? 'Lepas pin' : 'Pin pesan'} onClick={async () => {
                            // try server-side pin/unpin first
                            try {
                              if (isPinned) await api.messages.unpin(m.id).catch(() => null);
                              else await api.messages.pin(m.id).catch(() => null);
                            } catch (e) { console.error(e); }
                            // update settings.pinned_ids fallback
                            const ids = new Set(settings.pinned_ids || []);
                            if (ids.has(m.id)) ids.delete(m.id); else ids.add(m.id);
                            const newSettings = { ...settings, pinned_ids: Array.from(ids) };
                            setSettings(newSettings);
                            try { await api.channels.settings.set(channel.id, newSettings); } catch (e) { console.error(e); }
                          }} className="px-2 py-1 rounded bg-[#42464d] text-sm flex items-center space-x-2">
                            <PinIcon className="w-4 h-4" />
                            <span>{isPinned ? 'Unpin' : 'Pin'}</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {tab === 'members' && (
            <div>
              <div className="text-gray-400 text-sm mb-2">Daftar anggota (preview).</div>
              <div className="p-3 rounded bg-[#2b2d30] text-gray-300">Menampilkan anggota membutuhkan backend; ini hanya contoh.</div>
            </div>
          )}

          {tab === 'settings' && (
            <div>
              <form onSubmit={handleRename} className="space-y-2">
                <label className="text-sm text-gray-400">Nama Channel</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded bg-[#202225] text-white" />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={onClose} className="px-3 py-1 rounded bg-[#2f3136]">Batal</button>
                  <button type="submit" disabled={saving} className="px-3 py-1 rounded bg-cyan-600">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ChannelSettings;
