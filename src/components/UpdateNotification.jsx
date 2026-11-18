import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, X, ArrowRight } from 'lucide-react';
import { useVersionCheck } from '../hooks/useVersionCheck';

export default function UpdateNotification() {
  const { hasUpdate, newVersion, currentVersion, reloadApp, dismissUpdate } = useVersionCheck();
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    // Beri sedikit jeda mikro agar animasi tombol terlihat responsif sebelum reload
    setTimeout(() => {
      reloadApp();
    }, 200);
  };

  return (
    <AnimatePresence>
      {hasUpdate && (
        <motion.aside
          role="status"
          aria-live="polite"
          aria-label="Pemberitahuan pembaruan versi website"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-[9999] max-w-sm w-[calc(100%-2.5rem)] sm:w-[360px] pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900/90 border border-cyan-500/30 p-4 text-white shadow-2xl shadow-cyan-950/40 backdrop-blur-xl ring-1 ring-white/10">
            {/* Efek kilau latar belakang */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-3">
              {/* Ikon pembaruan */}
              <div className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>

              {/* Konten teks */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-zinc-100">
                    Pembaruan Tersedia
                  </h4>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Baru
                  </span>
                </div>

                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  Versi terbaru website sudah aktif. Muat ulang untuk mendapatkan pembaruan dan perbaikan terbaru.
                </p>

                {/* Badge versi lama -> versi baru jika tersedia */}
                {newVersion && currentVersion && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-mono text-zinc-300">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-zinc-400">
                      v{currentVersion}
                    </span>
                    <ArrowRight className="w-3 h-3 text-cyan-400" />
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold">
                      v{newVersion}
                    </span>
                  </div>
                )}

                {/* Tombol Aksi */}
                <div className="mt-3.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReload}
                    disabled={isReloading}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 transition-all shadow-md shadow-cyan-600/20 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
                    {isReloading ? 'Memperbarui...' : 'Perbarui Sekarang'}
                  </button>

                  <button
                    type="button"
                    onClick={dismissUpdate}
                    className="px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors cursor-pointer"
                  >
                    Nanti Saja
                  </button>
                </div>
              </div>

              {/* Tombol Tutup Silang di Sudut */}
              <button
                type="button"
                onClick={dismissUpdate}
                aria-label="Tutup notifikasi pembaruan"
                className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-200 p-1 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
