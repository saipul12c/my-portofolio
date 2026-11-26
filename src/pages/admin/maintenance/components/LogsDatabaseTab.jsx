import React from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  History,
} from 'lucide-react';

export default function LogsDatabaseTab({
  syncSource,
  realtimeStatus,
  lastSyncedAt,
  logs,
  logsTableMissing,
  loadingLogs,
  onRefreshAll,
}) {
  return (
    <div className="space-y-6">
      {/* Status Koneksi Database & Realtime */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Database className="w-4 h-4 text-teal-400" />
            <span>Sumber Data Aktif</span>
          </div>
          <p className="text-sm font-bold text-white flex items-center gap-2">
            {syncSource === 'supabase' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Supabase (public.system_config)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Fallback Lokal ({syncSource})</span>
              </>
            )}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Status Sinkronisasi Realtime</span>
          </div>
          <p className="text-sm font-bold text-white">
            {realtimeStatus === 'SUBSCRIBED' ? (
              <span className="text-emerald-300">Terhubung (Realtime Aktif)</span>
            ) : (
              <span className="text-amber-300">{realtimeStatus || 'Menunggu...'}</span>
            )}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Sinkronisasi Terakhir</span>
          </div>
          <p className="text-xs font-mono text-gray-200">
            {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString('id-ID') : '-'}
          </p>
        </div>
      </div>

      {/* Info SQL Migration bila maintenance_logs belum dijalankan */}
      {logsTableMissing && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-100 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4" />
            <span>Tabel public.maintenance_logs Belum Dibuat di Supabase</span>
          </div>
          <p className="leading-relaxed text-amber-100/90">
            Konfigurasi maintenance sudah tersimpan ke <code className="text-teal-300">public.system_config</code>, namun untuk mengaktifkan pencatatan riwayat audit (<code className="text-teal-300">maintenance_logs</code>) dan siaran instan Realtime pada <code className="text-teal-300">system_config</code>, jalankan file <code className="text-cyan-300">database_supa/supabase-maintenance.sql</code> di Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* Tabel Riwayat Perubahan */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Riwayat Perubahan Maintenance</h3>
              <p className="text-xs text-gray-400">
                Audit trail perubahan status dari tabel <code className="text-teal-300">public.maintenance_logs</code>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRefreshAll}
            disabled={loadingLogs}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            <span>Muat Ulang</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-500">
            Belum ada catatan perubahan maintenance di database.
          </div>
        ) : (
          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/25 text-[10px] font-mono font-bold">
                      {log.action}
                    </span>
                    <span className="text-xs font-semibold text-white">{log.admin_name}</span>
                    <span className="text-[11px] text-gray-400">• scope: {log.scope}</span>
                  </div>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <p className="text-[11px] font-mono text-gray-400 break-all">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>

                <span className="text-[11px] font-mono text-gray-400 shrink-0">
                  {new Date(log.created_at).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
