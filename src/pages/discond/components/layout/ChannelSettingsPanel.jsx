import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function ChannelSettingsPanel({ channelId, onSaved }) {
  const [settings, setSettings] = useState({ muted: false, pinned_ids: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!channelId) { setLoading(false); return; }
      try {
        const s = await api.channels.settings.get(channelId).catch(() => null);
        if (!mounted) return;
        setSettings(s || { muted: false, pinned_ids: [] });
      } catch (e) { setSettings({ muted: false, pinned_ids: [] }); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [channelId]);

  const save = async () => {
    setSaving(true);
    try {
      await api.channels.settings.set(channelId, settings).catch(() => null);
      if (onSaved) onSaved(settings);
    } catch (e) {
      console.error('Save channel settings failed', e);
    } finally { setSaving(false); }
  };

  if (!channelId) return <div className="p-3 text-gray-300">Pilih channel untuk melihat pengaturan.</div>;
  if (loading) return <div className="p-3 text-gray-300">Memuat pengaturan...</div>;

  return (
    <div className="bg-[#111216] border border-white/6 rounded p-4">
      <h3 className="font-semibold text-white mb-3">Pengaturan Channel</h3>
      <div className="mb-3">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={!!settings.muted} onChange={(e) => setSettings(prev => ({ ...prev, muted: e.target.checked }))} />
          <span className="text-sm text-gray-300">Mute notifikasi channel</span>
        </label>
      </div>

      <div className="mb-3 text-sm text-gray-300">Pinned pesan: {Array.isArray(settings.pinned_ids) ? settings.pinned_ids.length : 0}</div>

      <div className="flex justify-end gap-2">
        <button onClick={save} disabled={saving} className="px-3 py-2 bg-cyan-600 text-white rounded">{saving ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </div>
  );
}
