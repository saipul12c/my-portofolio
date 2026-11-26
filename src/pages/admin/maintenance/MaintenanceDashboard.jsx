import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Wrench,
  Globe,
  Layers,
  Palette,
  Eye,
  Database,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Shield,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Monitor,
  Smartphone,
  Power,
} from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { useMaintenance } from '../../../context/useMaintenance';
import {
  MAINTENANCE_ADMIN_LOGIN_PATH,
  MAINTENANCE_PAGE_CATALOG,
} from '../../../config/maintenanceRoutes';
import {
  fetchMaintenanceLogs,
  normalizeMaintenanceConfig,
  saveLiveChatMaintenance,
  saveMaintenanceConfig,
} from '../../../services/maintenanceService';
import Maintenance from '../../errors/Maintenance';
import PagesControlTab from './components/PagesControlTab';
import AppearanceTab from './components/AppearanceTab';
import LogsDatabaseTab from './components/LogsDatabaseTab';

const TABS = [
  { id: 'overview', label: 'Kontrol Global', icon: Globe },
  { id: 'pages', label: 'Per Halaman', icon: Layers },
  { id: 'appearance', label: 'Tampilan & Pesan Global', icon: Palette },
  { id: 'preview', label: 'Live Preview', icon: Eye },
  { id: 'database', label: 'Database & Riwayat', icon: Database },
];

export default function MaintenanceDashboard({ adminUser }) {
  const navigate = useNavigate();
  const {
    config,
    liveChatMaintenance,
    syncSource,
    realtimeStatus,
    lastSyncedAt,
    refreshMaintenance,
  } = useMaintenance();

  const [activeTab, setActiveTab] = useState('overview');
  const [draftConfig, setDraftConfig] = useState(() => normalizeMaintenanceConfig(config));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logsTableMissing, setLogsTableMissing] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Preview states
  const [previewRouteKey, setPreviewRouteKey] = useState('__global__');
  const [previewPageOverride, setPreviewPageOverride] = useState(null);
  const [previewViewport, setPreviewViewport] = useState('desktop');

  useEffect(() => {
    setDraftConfig(normalizeMaintenanceConfig(config));
  }, [config]);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const loadLogs = useCallback(async () => {
    setLoadingLogs(true);
    const res = await fetchMaintenanceLogs(30);
    setLogs(res.logs || []);
    setLogsTableMissing(Boolean(res.tableMissing));
    setLoadingLogs(false);
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const activePageKeys = useMemo(
    () =>
      Object.entries(draftConfig.pageOverrides || {})
        .filter(([, enabled]) => enabled === true)
        .map(([key]) => key),
    [draftConfig.pageOverrides]
  );

  const commitConfig = async (nextConfig, meta, successMessage) => {
    setSaving(true);
    try {
      const saved = await saveMaintenanceConfig(nextConfig, meta);
      setDraftConfig(saved);
      await refreshMaintenance();
      await loadLogs();
      showToast('success', successMessage || 'Perubahan disimpan & disinkronkan ke database.');
      return true;
    } catch (err) {
      showToast('error', err?.message || 'Gagal menyimpan perubahan ke database.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleToggleGlobal = () => {
    const nextEnabled = !draftConfig.globalEnabled;
    const nowIso = new Date().toISOString();
    const nextConfig = {
      ...draftConfig,
      globalEnabled: nextEnabled,
      startedAt: nextEnabled ? draftConfig.startedAt || nowIso : draftConfig.startedAt,
    };
    commitConfig(
      nextConfig,
      { action: nextEnabled ? 'ENABLE_GLOBAL' : 'DISABLE_GLOBAL', scope: 'global' },
      nextEnabled
        ? 'Mode Maintenance Global AKTIF di seluruh halaman.'
        : 'Mode Maintenance Global DIMATIKAN. Situs kembali normal.'
    );
  };

  const handleToggleBooleanOption = (field, label, actionName) => {
    const nextVal = !draftConfig[field];
    const nextConfig = { ...draftConfig, [field]: nextVal };
    commitConfig(
      nextConfig,
      { action: actionName, scope: 'setting', details: { [field]: nextVal } },
      `${label} ${nextVal ? 'diaktifkan' : 'dinonaktifkan'}.`
    );
  };

  const handleToggleLiveChat = async () => {
    setSaving(true);
    try {
      const nextVal = !liveChatMaintenance;
      await saveLiveChatMaintenance(nextVal);
      await refreshMaintenance();
      await loadLogs();
      showToast(
        'success',
        nextVal
          ? 'Lockdown Chat Live Discussion diaktifkan.'
          : 'Chat Live Discussion kembali online.'
      );
    } catch (err) {
      showToast('error', err?.message || 'Gagal mengubah status Live Discussion.');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePage = (key, enabled) => {
    const nextOverrides = { ...(draftConfig.pageOverrides || {}), [key]: enabled };
    if (!enabled) delete nextOverrides[key];
    const nextConfig = { ...draftConfig, pageOverrides: nextOverrides };
    commitConfig(
      nextConfig,
      {
        action: enabled ? 'ENABLE_PAGE' : 'DISABLE_PAGE',
        scope: key,
        details: { page: key, enabled },
      },
      `Halaman ${key} ${enabled ? 'diubah ke Mode Maintenance' : 'kembali Online'}.`
    );
  };

  const handleBulkTogglePages = (keys, enabled) => {
    const nextOverrides = { ...(draftConfig.pageOverrides || {}) };
    keys.forEach((key) => {
      if (enabled) nextOverrides[key] = true;
      else delete nextOverrides[key];
    });
    const nextConfig = { ...draftConfig, pageOverrides: nextOverrides };
    commitConfig(
      nextConfig,
      {
        action: enabled ? 'BULK_ENABLE_PAGES' : 'BULK_DISABLE_PAGES',
        scope: 'pages',
        details: { count: keys.length, enabled },
      },
      `${keys.length} halaman berhasil diubah ke ${enabled ? 'Maintenance' : 'Online'}.`
    );
  };

  const handleSavePageConfig = async (key, form) => {
    const nextPageConfigs = { ...(draftConfig.pageConfigs || {}) };
    const nextPageNotes = { ...(draftConfig.pageNotes || {}) };
    const cleanedMessages = Array.isArray(form.messages)
      ? form.messages.map((m) => String(m || '').trim()).filter(Boolean)
      : [];

    const hasAnyValue = Boolean(
      form.badge?.trim() ||
        form.title?.trim() ||
        form.description?.trim() ||
        form.footerNote?.trim() ||
        form.startedAt ||
        form.targetTime ||
        cleanedMessages.length > 0
    );

    if (hasAnyValue) {
      nextPageConfigs[key] = {
        badge: form.badge?.trim() || '',
        title: form.title?.trim() || '',
        description: form.description?.trim() || '',
        footerNote: form.footerNote?.trim() || '',
        startedAt: form.startedAt || '',
        targetTime: form.targetTime || '',
        messages: cleanedMessages,
      };
    } else {
      delete nextPageConfigs[key];
    }

    delete nextPageNotes[key];

    return commitConfig(
      { ...draftConfig, pageConfigs: nextPageConfigs, pageNotes: nextPageNotes },
      { action: 'CUSTOMIZE_PAGE', scope: key },
      `Kustomisasi info halaman ${key} disimpan ke database.`
    );
  };

  const handleAddCustomPath = (path) => {
    const nextCustom = Array.from(new Set([...(draftConfig.customPaths || []), path]));
    const nextOverrides = { ...(draftConfig.pageOverrides || {}), [path]: true };
    commitConfig(
      { ...draftConfig, customPaths: nextCustom, pageOverrides: nextOverrides },
      { action: 'ADD_CUSTOM_ROUTE', scope: path },
      `Rute kustom ${path} ditambahkan & diset ke Maintenance.`
    );
  };

  const handleRemoveCustomPath = (path) => {
    const nextCustom = (draftConfig.customPaths || []).filter((p) => p !== path);
    const nextOverrides = { ...(draftConfig.pageOverrides || {}) };
    const nextNotes = { ...(draftConfig.pageNotes || {}) };
    const nextConfigs = { ...(draftConfig.pageConfigs || {}) };
    delete nextOverrides[path];
    delete nextNotes[path];
    delete nextConfigs[path];
    commitConfig(
      {
        ...draftConfig,
        customPaths: nextCustom,
        pageOverrides: nextOverrides,
        pageNotes: nextNotes,
        pageConfigs: nextConfigs,
      },
      { action: 'REMOVE_CUSTOM_ROUTE', scope: path },
      `Rute kustom ${path} dihapus.`
    );
  };

  const handlePreviewPage = (key, customForm = null) => {
    setPreviewRouteKey(key);
    setPreviewPageOverride(customForm);
    setActiveTab('preview');
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    navigate(MAINTENANCE_ADMIN_LOGIN_PATH, { replace: true });
  };

  const allPreviewEntries = useMemo(() => {
    const customEntries = (draftConfig.customPaths || []).map((p) => ({
      key: p,
      label: `Rute Kustom (${p})`,
      category: 'Kustom',
      defaultMaintenance: {
        badge: `Pemeliharaan ${p}`,
        title: `Halaman ${p} Sedang Dalam Perawatan`,
        description: `Halaman ${p} sedang menjalani pemeliharaan terjadwal.`,
        footerNote: 'Terima kasih atas pengertian Anda 🙏',
        messages: [`Memeriksa modul ${p}...`, 'Menjalankan pembaruan sistem...'],
      },
    }));
    return [...MAINTENANCE_PAGE_CATALOG, ...customEntries];
  }, [draftConfig.customPaths]);

  const selectedPreviewEntry = useMemo(
    () => allPreviewEntries.find((p) => p.key === previewRouteKey) || null,
    [allPreviewEntries, previewRouteKey]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet>
        <title>Internal Maintenance Console</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 max-w-md px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-2.5 text-xs font-medium ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white">
                  Dashboard Kontrol Maintenance
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    draftConfig.globalEnabled
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      : activePageKeys.length > 0
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  }`}
                >
                  {draftConfig.globalEnabled
                    ? 'Global Maintenance'
                    : activePageKeys.length > 0
                      ? `${activePageKeys.length} Halaman Maintenance`
                      : 'Semua Online'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Terhubung ke Supabase • Admin:{' '}
                <span className="text-teal-300 font-medium">
                  {adminUser?.nama || adminUser?.email || 'Admin'} ({adminUser?.role || 'ADMIN'})
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                refreshMaintenance();
                loadLogs();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync DB</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs text-rose-200 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigasi */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 flex gap-2 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Konten Utama */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Master Switch Card */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                draftConfig.globalEnabled
                  ? 'bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border-amber-400/40'
                  : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-teal-300">
                    <Power className="w-3.5 h-3.5" />
                    Saklar Utama Website
                  </span>
                  <h2 className="text-2xl font-extrabold text-white">
                    {draftConfig.globalEnabled
                      ? 'Website Sedang dalam Mode Maintenance Global'
                      : 'Website Berjalan Normal (Online)'}
                  </h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Jika diaktifkan, seluruh rute publik website akan otomatis menampilkan halaman Maintenance dan tersinkron langsung ke database Supabase. Rute internal admin tetap aman dan tersembunyi.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={handleToggleGlobal}
                  className={`px-6 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all shrink-0 cursor-pointer disabled:opacity-50 ${
                    draftConfig.globalEnabled
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  {draftConfig.globalEnabled
                    ? 'Matikan Maintenance Global'
                    : 'Aktifkan Maintenance Global'}
                </button>
              </div>
            </div>

            {/* Ringkasan Statistik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
                <p className="text-xs text-gray-400">Total Rute Terdaftar</p>
                <p className="text-2xl font-black text-white mt-1">
                  {MAINTENANCE_PAGE_CATALOG.length + (draftConfig.customPaths?.length || 0)}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
                <p className="text-xs text-gray-400">Halaman Maintenance Selektif</p>
                <p className="text-2xl font-black text-amber-300 mt-1">{activePageKeys.length}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
                <p className="text-xs text-gray-400">Sinkronisasi Database</p>
                <p className="text-sm font-bold text-emerald-300 mt-2">
                  {syncSource === 'supabase' ? 'Terhubung ke Supabase' : `Mode ${syncSource}`}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10">
                <p className="text-xs text-gray-400">Diperbarui Oleh</p>
                <p className="text-sm font-bold text-cyan-300 mt-2 truncate">
                  {draftConfig.updatedBy || '-'}
                </p>
              </div>
            </div>

            {/* Kontrol Tambahan & Integrasi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Admin Bypass */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-300 text-sm font-bold">
                    <Shield className="w-4 h-4" />
                    <span>Admin Bypass Otomatis</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    ADMIN/SUPER_ADMIN yang sedang login tetap dapat membuka seluruh halaman meski Maintenance aktif.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleToggleBooleanOption(
                      'allowAdminBypass',
                      'Admin Bypass',
                      'TOGGLE_ADMIN_BYPASS'
                    )
                  }
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    draftConfig.allowAdminBypass
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                      : 'bg-white/5 text-gray-300 border border-white/10'
                  }`}
                >
                  {draftConfig.allowAdminBypass ? 'Aktif (Admin Bisa Bypass)' : 'Nonaktif'}
                </button>
              </div>

              {/* HelpButton Maintenance */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-300 text-sm font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>Tombol Bantuan & SaipulAI</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Mengaktifkan status maintenance khusus tombol bantuan melayang (HelpButton) di semua halaman.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    handleToggleBooleanOption(
                      'helpButtonMaintenance',
                      'Maintenance HelpButton',
                      'TOGGLE_HELP_BUTTON'
                    )
                  }
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    draftConfig.helpButtonMaintenance
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                      : 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30'
                  }`}
                >
                  {draftConfig.helpButtonMaintenance ? 'Sedang Maintenance' : 'Beroperasi Normal'}
                </button>
              </div>

              {/* Integrasi Live Discussion */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-300 text-sm font-bold">
                    <MessageSquare className="w-4 h-4" />
                    <span>Live Discussion Chat Lockdown</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Mengontrol kunci chat <code className="text-purple-300">system_config.maintenance_mode</code> pada ruang Live Discussion.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleToggleLiveChat}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    liveChatMaintenance
                      ? 'bg-rose-500/20 text-rose-200 border border-rose-400/30'
                      : 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30'
                  }`}
                >
                  {liveChatMaintenance ? 'Chat Terkunci (Lockdown)' : 'Chat Terbuka (Online)'}
                </button>
              </div>
            </div>

            {/* Daftar Halaman Maintenance Aktif saat ini */}
            {activePageKeys.length > 0 && (
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-amber-400/25 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-300">
                    Halaman dalam Mode Maintenance Selektif ({activePageKeys.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pages')}
                    className="text-xs text-cyan-300 hover:underline cursor-pointer"
                  >
                    Kelola di Tab Per Halaman →
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activePageKeys.map((key) => (
                    <span
                      key={key}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-xs text-amber-200 font-mono"
                    >
                      {key}
                      <button
                        type="button"
                        onClick={() => handleTogglePage(key, false)}
                        className="text-amber-300 hover:text-white font-bold cursor-pointer"
                        title="Kembalikan Online"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pages' && (
          <PagesControlTab
            draftConfig={draftConfig}
            saving={saving}
            onTogglePage={handleTogglePage}
            onBulkTogglePages={handleBulkTogglePages}
            onSavePageConfig={handleSavePageConfig}
            onPreviewPage={handlePreviewPage}
            onAddCustomPath={handleAddCustomPath}
            onRemoveCustomPath={handleRemoveCustomPath}
          />
        )}

        {activeTab === 'appearance' && (
          <AppearanceTab
            draftConfig={draftConfig}
            setDraftConfig={setDraftConfig}
            saving={saving}
            onSaveTextSettings={() =>
              commitConfig(
                draftConfig,
                { action: 'UPDATE_APPEARANCE', scope: 'appearance' },
                'Tampilan, jadwal, dan pesan Maintenance global berhasil disimpan ke database!'
              )
            }
          />
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs text-gray-300 font-medium">Simulasikan Halaman:</label>
                <select
                  value={previewRouteKey}
                  onChange={(e) => {
                    setPreviewRouteKey(e.target.value);
                    setPreviewPageOverride(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
                >
                  <option value="__global__">Mode Global (Seluruh Website)</option>
                  {allPreviewEntries.map((p) => (
                    <option key={p.key} value={p.key}>
                      {p.label} ({p.key})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewViewport('desktop')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs cursor-pointer ${
                    previewViewport === 'desktop'
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-white/5 text-gray-300 border border-white/10'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewViewport('mobile')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs cursor-pointer ${
                    previewViewport === 'mobile'
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-white/5 text-gray-300 border border-white/10'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile
                </button>
              </div>
            </div>

            <div className={previewViewport === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'}>
              <Maintenance
                isPreview
                previewConfig={{
                  ...draftConfig,
                  globalEnabled: previewRouteKey === '__global__',
                }}
                scope={previewRouteKey === '__global__' ? 'global' : 'page'}
                matchedPage={selectedPreviewEntry}
                pageNote={
                  selectedPreviewEntry
                    ? draftConfig.pageNotes?.[selectedPreviewEntry.key] || ''
                    : ''
                }
                pageConfig={
                  previewPageOverride ||
                  (selectedPreviewEntry
                    ? draftConfig.pageConfigs?.[selectedPreviewEntry.key] || null
                    : null)
                }
              />
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <LogsDatabaseTab
            syncSource={syncSource}
            realtimeStatus={realtimeStatus}
            lastSyncedAt={lastSyncedAt}
            logs={logs}
            logsTableMissing={logsTableMissing}
            loadingLogs={loadingLogs}
            onRefreshAll={() => {
              refreshMaintenance();
              loadLogs();
            }}
          />
        )}
      </main>
    </div>
  );
}
