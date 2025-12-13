import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function PinnedMessages({ channelId, onUnpin }) {
  const [pinned, setPinned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!channelId) { setLoading(false); return; }
      try {
        const msgs = await api.messages.list(channelId).catch(() => []);
        if (!mounted) return;
        const pins = Array.isArray(msgs) ? msgs.filter(m => m.pinned) : [];
        setPinned(pins);
      } catch (e) { setPinned([]); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [channelId]);

  const unpin = async (id) => {
    try {
      await api.messages.unpin(id).catch(() => null);
      setPinned(prev => prev.filter(p => p.id !== id));
      if (onUnpin) onUnpin(id);
    } catch (e) {
      console.error('Unpin failed', e);
    }
  };

  if (!channelId) return <div className="p-3 text-gray-300">Pilih channel untuk melihat pesan yang di-pin.</div>;
  if (loading) return <div className="p-3 text-gray-300">Memuat pinned messages...</div>;

  if (!pinned.length) return <div className="p-3 text-gray-300">Tidak ada pesan yang di-pin pada channel ini.</div>;

  return (
    <div className="space-y-3">
      {pinned.map(m => (
        <div key={m.id} className="bg-[#111216] border border-white/6 rounded p-3">
          <div className="text-sm text-gray-300">{m.profiles?.username || m.username || 'Pengguna'}</div>
          <div className="text-white mt-1">{m.content}</div>
          <div className="flex justify-end mt-2">
            <button onClick={() => unpin(m.id)} className="px-2 py-1 text-sm bg-red-600 text-white rounded">Unpin</button>
          </div>
        </div>
      ))}
    </div>
  );
}
