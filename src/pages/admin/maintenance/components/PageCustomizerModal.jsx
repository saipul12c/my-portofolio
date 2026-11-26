import React, { useEffect, useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  Clock,
} from 'lucide-react';

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

export default function PageCustomizerModal({
  item,
  existingPageConfig,
  legacyNote,
  saving,
  onClose,
  onSave,
  onPreviewPage,
}) {
  const defaults = item?.defaultMaintenance || {};

  const [form, setForm] = useState({
    badge: '',
    title: '',
    description: '',
    footerNote: '',
    startedAt: '',
    targetTime: '',
    messages: [],
  });
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    if (!item) return;
    setForm({
      badge: existingPageConfig?.badge || '',
      title: existingPageConfig?.title || '',
      description: existingPageConfig?.description || legacyNote || '',
      footerNote: existingPageConfig?.footerNote || '',
      startedAt: existingPageConfig?.startedAt || '',
      targetTime: existingPageConfig?.targetTime || '',
      messages: Array.isArray(existingPageConfig?.messages) ? [...existingPageConfig.messages] : [],
    });
  }, [item, existingPageConfig, legacyNote]);

  if (!item) return null;

  const handleLoadPageDefaults = () => {
    setForm((prev) => ({
      ...prev,
      badge: defaults.badge || '',
      title: defaults.title || '',
      description: defaults.description || '',
      footerNote: defaults.footerNote || '',
      messages: Array.isArray(defaults.messages) ? [...defaults.messages] : [],
    }));
  };

  const handleResetToEmpty = () => {
    setForm({
      badge: '',
      title: '',
      description: '',
      footerNote: '',
      startedAt: '',
      targetTime: '',
      messages: [],
    });
  };

  const applyDurationPreset = (minutes) => {
    const now = new Date();
    const target = new Date(now.getTime() + minutes * 60 * 1000);
    setForm((prev) => ({
      ...prev,
      startedAt: now.toISOString(),
      targetTime: target.toISOString(),
    }));
  };

  const handleAddMessage = () => {
    const cleaned = newMsg.trim();
    if (!cleaned) return;
    setForm((prev) => ({ ...prev, messages: [...prev.messages, cleaned] }));
    setNewMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.key, form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-6">
        <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3 bg-slate-900/95">
          <div>
            <h3 className="text-base font-bold text-white">
              Kustomisasi Info Maintenance: {item.label}
            </h3>
            <p className="text-xs font-mono text-teal-300 mt-0.5">{item.key}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-400/25 text-xs text-teal-100 flex flex-wrap items-center justify-between gap-2">
            <span>
              Kolom yang dikosongkan akan otomatis memakai <strong>info bawaan halaman ini</strong> ({defaults.badge || 'khusus halaman'}).
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleLoadPageDefaults}
                className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-200 font-semibold cursor-pointer"
              >
                Isi dari Default Halaman
              </button>
              <button
                type="button"
                onClick={handleResetToEmpty}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Badge Status Halaman
              </label>
              <input
                type="text"
                value={form.badge}
                onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                placeholder={defaults.badge || 'Pemeliharaan Halaman'}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Catatan Footer Halaman
              </label>
              <input
                type="text"
                value={form.footerNote}
                onChange={(e) => setForm((p) => ({ ...p, footerNote: e.target.value }))}
                placeholder={defaults.footerNote || 'Ikuti catatan footer global'}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Judul Maintenance Khusus
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder={defaults.title || `${item.label} Sedang Dalam Perawatan`}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Deskripsi / Informasi Alasan Perawatan
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder={defaults.description || 'Deskripsi khusus halaman ini...'}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Jadwal Khusus Halaman */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Jadwal Countdown Khusus Halaman (Opsional)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '+30m', mins: 30 },
                  { label: '+1j', mins: 60 },
                  { label: '+3j', mins: 180 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => applyDurationPreset(p.mins)}
                    className="px-2 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/25 text-cyan-200 text-[11px] cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 inline mr-0.5" />
                    {p.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, startedAt: '', targetTime: '' }))}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] cursor-pointer"
                >
                  Ikuti Global
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Waktu Mulai</label>
                <input
                  type="datetime-local"
                  value={toLocalDateTimeInput(form.startedAt)}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startedAt: fromLocalDateTimeInput(e.target.value) }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Estimasi Selesai</label>
                <input
                  type="datetime-local"
                  value={toLocalDateTimeInput(form.targetTime)}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, targetTime: fromLocalDateTimeInput(e.target.value) }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Pesan Status Berputar Khusus Halaman */}
          <div className="space-y-2.5">
            <label className="block text-xs font-medium text-gray-300">
              Pesan Status Berputar Khusus Halaman ({form.messages.length} pesan kustom)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Tambah pesan status khusus halaman ini..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-gray-500"
              />
              <button
                type="button"
                onClick={handleAddMessage}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-200 text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </button>
            </div>
            {form.messages.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {form.messages.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={msg}
                      onChange={(e) =>
                        setForm((prev) => {
                          const next = [...prev.messages];
                          next[idx] = e.target.value;
                          return { ...prev, messages: next };
                        })
                      }
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          messages: prev.messages.filter((_, i) => i !== idx),
                        }))
                      }
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onPreviewPage(item.key, form)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-cyan-200 font-semibold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Halaman Ini
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-xs shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Menyimpan...' : 'Simpan Kustomisasi ke DB'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
