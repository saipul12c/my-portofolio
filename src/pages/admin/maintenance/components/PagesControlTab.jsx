import React, { useMemo, useState } from 'react';
import {
  Search,
  Globe,
  CheckCircle2,
  Wrench,
  Plus,
  Trash2,
  Power,
  PowerOff,
  SlidersHorizontal,
  Eye,
} from 'lucide-react';
import {
  MAINTENANCE_CATEGORIES,
  MAINTENANCE_PAGE_CATALOG,
  normalizeRoutePath,
} from '../../../../config/maintenanceRoutes';
import PageCustomizerModal from './PageCustomizerModal';

export default function PagesControlTab({
  draftConfig,
  saving,
  onTogglePage,
  onBulkTogglePages,
  onSavePageConfig,
  onPreviewPage,
  onAddCustomPath,
  onRemoveCustomPath,
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'maintenance' | 'online'
  const [customInput, setCustomInput] = useState('');
  const [customizingItem, setCustomizingItem] = useState(null);

  const pageOverrides = useMemo(
    () => draftConfig.pageOverrides || {},
    [draftConfig.pageOverrides]
  );
  const pageNotes = draftConfig.pageNotes || {};
  const pageConfigs = draftConfig.pageConfigs || {};
  const customPaths = useMemo(
    () => (Array.isArray(draftConfig.customPaths) ? draftConfig.customPaths : []),
    [draftConfig.customPaths]
  );

  const allEntries = useMemo(() => {
    const customEntries = customPaths.map((p) => ({
      key: p,
      label: `Rute Kustom (${p})`,
      category: 'Kustom',
      description: `Rute tambahan yang dikonfigurasi manual: ${p}`,
      matchPaths: [p],
      isCustom: true,
      defaultMaintenance: {
        badge: `Pemeliharaan ${p}`,
        title: `Halaman ${p} Sedang Dalam Perawatan`,
        description: `Halaman ${p} sedang menjalani pemeliharaan terjadwal.`,
        footerNote: 'Terima kasih atas pengertian Anda 🙏',
        messages: [`Memeriksa modul ${p}...`, 'Menjalankan pembaruan sistem...'],
      },
    }));
    return [...MAINTENANCE_PAGE_CATALOG, ...customEntries];
  }, [customPaths]);

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allEntries.filter((item) => {
      const isActive = Boolean(pageOverrides[item.key]);
      if (selectedCategory !== 'Semua' && item.category !== selectedCategory) return false;
      if (statusFilter === 'maintenance' && !isActive) return false;
      if (statusFilter === 'online' && isActive) return false;
      if (!q) return true;
      return (
        item.label.toLowerCase().includes(q) ||
        item.key.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.matchPaths || []).some((mp) => mp.toLowerCase().includes(q))
      );
    });
  }, [allEntries, pageOverrides, search, selectedCategory, statusFilter]);

  const activeCount = useMemo(
    () => allEntries.filter((e) => Boolean(pageOverrides[e.key])).length,
    [allEntries, pageOverrides]
  );

  const handleAddCustom = (e) => {
    e.preventDefault();
    const cleaned = normalizeRoutePath(customInput);
    if (!cleaned || cleaned === '/') return;
    onAddCustomPath(cleaned);
    setCustomInput('');
  };

  const hasCustomOverride = (key) => {
    const cfg = pageConfigs[key];
    const hasCfg =
      cfg &&
      Boolean(
        cfg.badge ||
          cfg.title ||
          cfg.description ||
          cfg.footerNote ||
          cfg.startedAt ||
          cfg.targetTime ||
          (Array.isArray(cfg.messages) && cfg.messages.length > 0)
      );
    return Boolean(hasCfg || pageNotes[key]);
  };

  return (
    <div className="space-y-6">
      {draftConfig.globalEnabled && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-3">
          <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Catatan:</strong> Saat ini <strong>Mode Maintenance Global</strong> sedang AKTIF, sehingga semua halaman menampilkan pesan global. Pengaturan & info unik per halaman di bawah ini akan berlaku ketika mode global dimatikan.
          </span>
        </div>
      )}

      {/* Filter & Bulk Actions */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama halaman atau rute (misal: /blog, /projects, /gallery)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-gray-200 focus:outline-none focus:border-teal-400"
            >
              <option value="all">Semua Status ({allEntries.length})</option>
              <option value="maintenance">Sedang Maintenance ({activeCount})</option>
              <option value="online">Online ({allEntries.length - activeCount})</option>
            </select>

            <button
              type="button"
              disabled={saving || filteredEntries.length === 0}
              onClick={() => onBulkTogglePages(filteredEntries.map((i) => i.key), true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Maintenance Hasil Filter</span>
            </button>

            <button
              type="button"
              disabled={saving || activeCount === 0}
              onClick={() => onBulkTogglePages(allEntries.map((i) => i.key), false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 text-xs font-semibold transition-colors disabled:opacity-40 cursor-pointer"
            >
              <PowerOff className="w-3.5 h-3.5" />
              <span>Online-kan Semua Halaman</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {[...MAINTENANCE_CATEGORIES, ...(customPaths.length > 0 ? ['Kustom'] : [])].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tambah Rute Kustom */}
        <form onSubmit={handleAddCustom} className="pt-2 border-t border-white/10 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Tambah rute kustom (contoh: /promo-khusus)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-teal-400"
          />
          <button
            type="submit"
            disabled={saving || !customInput.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Rute</span>
          </button>
        </form>
      </div>

      {/* Daftar Halaman */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((item) => {
          const isMaintenance = Boolean(pageOverrides[item.key]);
          const isCustomized = hasCustomOverride(item.key);
          const customCfg = pageConfigs[item.key];
          const previewTitle =
            customCfg?.title || item.defaultMaintenance?.title || `${item.label} Sedang Dalam Perawatan`;

          return (
            <div
              key={item.key}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isMaintenance
                  ? 'bg-amber-500/[0.06] border-amber-400/35'
                  : 'bg-slate-900/80 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{item.label}</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-gray-300 border border-white/10">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        isCustomized
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400/30'
                          : 'bg-teal-500/10 text-teal-300 border-teal-400/20'
                      }`}
                    >
                      {isCustomized ? 'Kustom Admin' : 'Info Unik Bawaan'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-teal-300/90 break-all">
                    {(item.matchPaths || [item.key]).join(' • ')}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                  <p className="text-[11px] text-gray-300/90 bg-slate-950/60 border border-white/5 rounded-lg px-2.5 py-1.5 line-clamp-1">
                    <span className="text-gray-500">Judul Maintenance:</span> {previewTitle}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onTogglePage(item.key, !isMaintenance)}
                    className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer disabled:opacity-50 ${
                      isMaintenance ? 'bg-amber-500' : 'bg-emerald-600/70'
                    }`}
                    aria-label={`Toggle maintenance untuk ${item.label}`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        isMaintenance ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                      isMaintenance ? 'text-amber-300' : 'text-emerald-300'
                    }`}
                  >
                    {isMaintenance ? (
                      <>
                        <Wrench className="w-3 h-3" />
                        Maintenance
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Online
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomizingItem(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/25 text-xs text-cyan-200 font-medium cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Kustomisasi Info & Jadwal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPreviewPage(item.key)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                {item.isCustom && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => onRemoveCustomPath(item.key)}
                    className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEntries.length === 0 && (
        <div className="p-10 text-center rounded-3xl bg-slate-900/60 border border-white/10 text-gray-400 text-sm">
          <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Tidak ada halaman yang cocok dengan filter pencarian.
        </div>
      )}

      <PageCustomizerModal
        item={customizingItem}
        existingPageConfig={customizingItem ? pageConfigs[customizingItem.key] : null}
        legacyNote={customizingItem ? pageNotes[customizingItem.key] : ''}
        saving={saving}
        onClose={() => setCustomizingItem(null)}
        onSave={async (key, form) => {
          const ok = await onSavePageConfig(key, form);
          if (ok) setCustomizingItem(null);
        }}
        onPreviewPage={(key, form) => {
          setCustomizingItem(null);
          onPreviewPage(key, form);
        }}
      />
    </div>
  );
}
