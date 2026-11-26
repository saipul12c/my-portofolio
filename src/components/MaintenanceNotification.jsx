import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { useMaintenanceCheck } from '../hooks/useMaintenanceCheck';

export default function MaintenanceNotification() {
  const {
    config,
    isChecking,
    isGlobalMaintenance,
    activeMaintenancePages,
    liveChatMaintenance,
    helpButtonMaintenance,
    shouldShowNotification,
    recoveredInfo,
    dismissNotice,
    dismissRecovered,
    checkMaintenanceNow,
  } = useMaintenanceCheck();

  const [expanded, setExpanded] = useState(false);

  const previewPages = activeMaintenancePages.slice(0, 3);
  const remainingCount = Math.max(0, activeMaintenancePages.length - previewPages.length);

  const formatTargetTime = (isoVal) => {
    if (!isoVal) return null;
    const date = new Date(isoVal);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const singlePage = activeMaintenancePages.length === 1 ? activeMaintenancePages[0] : null;
  const headingText = isGlobalMaintenance
    ? 'Mode Maintenance Global Aktif'
    : singlePage
      ? `Maintenance: ${singlePage.label}`
      : activeMaintenancePages.length > 1
        ? `${activeMaintenancePages.length} Halaman Sedang Maintenance`
        : liveChatMaintenance
          ? 'Live Discussion Terkunci Sementara'
          : 'Tombol Bantuan Dalam Perawatan';

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[9997] flex flex-col gap-3 max-w-sm w-[calc(100%-2rem)] sm:w-[375px] pointer-events-none">
      {/* Notifikasi saat ada halaman / layanan sedang dalam Maintenance */}
      <AnimatePresence>
        {shouldShowNotification && (
          <motion.aside
            role="status"
            aria-live="polite"
            aria-label="Pemberitahuan status pemeliharaan halaman"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto relative overflow-hidden rounded-2xl bg-zinc-900/95 border border-amber-500/35 p-4 text-white shadow-2xl shadow-amber-950/35 backdrop-blur-xl ring-1 ring-white/10"
          >
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-400/35 flex items-center justify-center text-amber-300">
                <Wrench className="w-4 h-4 animate-pulse" />
              </div>

              <div className="flex-1 min-w-0 pr-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-zinc-100 leading-tight">
                    {headingText}
                  </h4>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-400/30">
                    Maintenance
                  </span>
                </div>

                <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                  {isGlobalMaintenance
                    ? 'Seluruh situs sedang dalam perawatan terjadwal (Anda melihat ini karena mode bypass admin).'
                    : singlePage
                      ? singlePage.description
                      : activeMaintenancePages.length > 1
                        ? 'Halaman berikut sedang menjalani pembaruan sementara. Halaman lain tetap dapat diakses normal.'
                        : 'Sebagian layanan interaktif sedang menjalani pemeliharaan rutin.'}
                </p>

                {/* Ringkasan halaman yang terkena Maintenance */}
                {activeMaintenancePages.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {(expanded ? activeMaintenancePages : previewPages).map((page) => {
                      const eta = formatTargetTime(page.targetTime);
                      return (
                        <div
                          key={page.key}
                          className="px-2.5 py-1.5 rounded-xl bg-black/30 border border-white/10 text-[11px]"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-amber-200 truncate">
                              {page.label}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                              {page.key}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5 flex flex-wrap items-center gap-2">
                            <span>{page.badge}</span>
                            {eta && (
                              <span className="inline-flex items-center gap-1 text-teal-300">
                                <Clock className="w-2.5 h-2.5" />
                                s/d {eta}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {!expanded && remainingCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setExpanded(true)}
                        className="text-[11px] text-amber-300 hover:text-amber-200 font-medium cursor-pointer"
                      >
                        + {remainingCount} halaman lainnya...
                      </button>
                    )}
                  </div>
                )}

                {/* Indikator layanan global pendukung */}
                {(liveChatMaintenance || helpButtonMaintenance) && (
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                    {liveChatMaintenance && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-400/25 text-rose-200">
                        <MessageSquare className="w-3 h-3" />
                        Chat Live Discussion Dikunci
                      </span>
                    )}
                    {helpButtonMaintenance && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-400/25 text-blue-200">
                        <HelpCircle className="w-3 h-3" />
                        Menu Bantuan Perbaikan
                      </span>
                    )}
                  </div>
                )}

                {config?.targetTime && activeMaintenancePages.length === 0 && (
                  <div className="mt-2 text-[11px] text-teal-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Estimasi selesai: {formatTargetTime(config.targetTime)}</span>
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={checkMaintenanceNow}
                    disabled={isChecking}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                    <span>{isChecking ? 'Memeriksa...' : 'Cek Ulang'}</span>
                  </button>

                  {activeMaintenancePages.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => !prev)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition-colors cursor-pointer"
                    >
                      {expanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Ringkas</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Lihat Semua</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={dismissNotice}
                    className="px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors cursor-pointer"
                  >
                    Mengerti
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={dismissNotice}
                aria-label="Tutup pemberitahuan maintenance"
                className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Notifikasi pemulihan otomatis saat halaman/sistem kembali online */}
      <AnimatePresence>
        {recoveredInfo && !shouldShowNotification && (
          <motion.aside
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto relative rounded-2xl bg-emerald-950/95 border border-emerald-500/40 p-3.5 text-emerald-100 shadow-xl backdrop-blur-xl flex items-start gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-emerald-200">Layanan Kembali Online</p>
              <p className="text-emerald-100/80 mt-0.5">{recoveredInfo.message}</p>
            </div>
            <button
              type="button"
              onClick={dismissRecovered}
              aria-label="Tutup notifikasi pemulihan"
              className="text-emerald-300/70 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
