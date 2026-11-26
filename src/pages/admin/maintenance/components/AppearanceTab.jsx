import React, { useState } from 'react';
import {
  Save,
  Plus,
  Trash2,
  RotateCcw,
  Clock,
  MessageSquare,
  Type,
  Sparkles,
} from 'lucide-react';
import maintenanceData from '../../../../data/maintenance/maintenanceData.json';

function toLocalDateTimeInput(isoValue) {
  if (!isoValue) return '';
  const d = new Date(isoValue);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalDateTimeInput(localVal) {
  if (!localVal) return '';
  const d = new Date(localVal);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

export default function AppearanceTab({
  draftConfig,
  setDraftConfig,
  saving,
  onSaveTextSettings,
}) {
  const [newMessage, setNewMessage] = useState('');

  const updateField = (field, value) => {
    setDraftConfig((prev) => ({ ...prev, [field]: value }));
  };

  const applyDurationPreset = (minutes) => {
    const now = new Date();
    const target = new Date(now.getTime() + minutes * 60 * 1000);
    setDraftConfig((prev) => ({
      ...prev,
      startedAt: now.toISOString(),
      targetTime: target.toISOString(),
    }));
  };

  const clearSchedule = () => {
    setDraftConfig((prev) => ({
      ...prev,
      startedAt: '',
      targetTime: '',
    }));
  };

  const handleAddMessage = () => {
    const cleaned = newMessage.trim();
    if (!cleaned) return;
    setDraftConfig((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), cleaned],
    }));
    setNewMessage('');
  };

  const handleUpdateMessage = (index, val) => {
    setDraftConfig((prev) => {
      const next = [...(prev.messages || [])];
      next[index] = val;
      return { ...prev, messages: next };
    });
  };

  const handleDeleteMessage = (index) => {
    setDraftConfig((prev) => ({
      ...prev,
      messages: (prev.messages || []).filter((_, i) => i !== index),
    }));
  };

  const handleResetMessages = () => {
    const defaults = Array.isArray(maintenanceData?.messages) ? maintenanceData.messages : [];
    updateField('messages', [...defaults]);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSaveTextSettings();
      }}
      className="space-y-6"
    >
      {/* Konten Utama */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-300">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Teks & Informasi Halaman Maintenance</h3>
            <p className="text-xs text-gray-400">
              Ubah judul, deskripsi, catatan footer, dan email kontak yang tampil ke pengunjung.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Judul Utama</label>
            <input
              type="text"
              value={draftConfig.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Deskripsi Umum</label>
            <textarea
              rows={3}
              value={draftConfig.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Catatan Bawah (Footer)</label>
            <input
              type="text"
              value={draftConfig.footerNote}
              onChange={(e) => updateField('footerNote', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Email Kontak Darurat (Opsional)
            </label>
            <input
              type="email"
              value={draftConfig.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              placeholder="admin@domain.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        {/* Toggle Elemen Tampilan */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { key: 'showProgressBar', label: 'Tampilkan Progress Bar' },
            { key: 'showCountdown', label: 'Tampilkan Countdown Waktu' },
            { key: 'showHomeButton', label: 'Tombol Kembali ke Beranda' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/70 border border-white/10 cursor-pointer"
            >
              <span className="text-xs text-gray-200 font-medium">{item.label}</span>
              <input
                type="checkbox"
                checked={Boolean(draftConfig[item.key])}
                onChange={(e) => updateField(item.key, e.target.checked)}
                className="w-4 h-4 accent-teal-400"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Jadwal & Countdown */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Jadwal & Estimasi Selesai (Countdown)</h3>
            <p className="text-xs text-gray-400">
              Atur waktu mulai dan target selesai agar progress bar & hitung mundur berjalan otomatis.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: '+15 Menit', mins: 15 },
            { label: '+30 Menit', mins: 30 },
            { label: '+1 Jam', mins: 60 },
            { label: '+2 Jam', mins: 120 },
            { label: '+6 Jam', mins: 360 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyDurationPreset(preset.mins)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-xs font-semibold cursor-pointer"
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            onClick={clearSchedule}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs cursor-pointer"
          >
            Kosongkan Estimasi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">Waktu Mulai</label>
            <input
              type="datetime-local"
              value={toLocalDateTimeInput(draftConfig.startedAt)}
              onChange={(e) => updateField('startedAt', fromLocalDateTimeInput(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Target Estimasi Selesai
            </label>
            <input
              type="datetime-local"
              value={toLocalDateTimeInput(draftConfig.targetTime)}
              onChange={(e) => updateField('targetTime', fromLocalDateTimeInput(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>
      </div>

      {/* Pesan Status Berputar */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Pesan Status Berputar ({(draftConfig.messages || []).length})
              </h3>
              <p className="text-xs text-gray-400">
                Pesan yang berganti otomatis setiap 5 detik di halaman Maintenance.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetMessages}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default JSON</span>
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tambah pesan status baru..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
          />
          <button
            type="button"
            onClick={handleAddMessage}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-200 text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {(draftConfig.messages || []).map((msg, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-gray-500 w-6 text-right">{idx + 1}.</span>
              <input
                type="text"
                value={msg}
                onChange={(e) => handleUpdateMessage(idx, e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
              />
              <button
                type="button"
                onClick={() => handleDeleteMessage(idx)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 cursor-pointer"
                aria-label="Hapus pesan"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan ke Database...' : 'Simpan Pengaturan Tampilan ke Database'}</span>
        </button>
      </div>
    </form>
  );
}
