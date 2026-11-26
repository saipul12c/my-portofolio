import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  FileJson, 
  RefreshCw,
  Server,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { exportBlogBackup, importBlogBackup, resetBlogToSeed } from '../../services/blogAdminService';
import { getAdminSession } from '../../services/blogAdminAuth';
import { isSupabaseConfigured } from '../../../../../lib/supabaseClient';

export default function DataManagerTab({ 
  onDataChanged, 
  setToast 
}) {
  const adminSession = getAdminSession();
  const isCloudAuth = Boolean(isSupabaseConfigured && adminSession?.authMode === 'supabase');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMode, setImportMode] = useState('merge'); // 'merge' | 'overwrite'
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Estimasi penggunaan localStorage
  const getStorageSizeEstimate = () => {
    if (typeof window === 'undefined') return '0 KB';
    let total = 0;
    for (let x in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, x) && x.startsWith('blog_')) {
        total += ((localStorage[x].length + x.length) * 2);
      }
    }
    return (total / 1024).toFixed(1) + ' KB';
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportBlogBackup();
      if (setToast) setToast({ type: 'success', message: 'File cadangan JSON berhasil diunduh!' });
    } catch (e) {
      if (setToast) setToast({ type: 'error', message: 'Gagal mengekspor data: ' + e.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        const res = await importBlogBackup(text, importMode);
        if (res.success) {
          if (setToast) setToast({ type: 'success', message: `Berhasil memuat ${res.count} artikel!` });
          if (onDataChanged) onDataChanged();
        } else {
          if (setToast) setToast({ type: 'error', message: res.message || 'Format JSON tidak valid' });
        }
      } catch (err) {
        if (setToast) setToast({ type: 'error', message: 'Gagal membaca berkas: ' + err.message });
      } finally {
        setIsImporting(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    resetBlogToSeed();
    setShowResetConfirm(false);
    if (setToast) setToast({ type: 'success', message: 'Data blog berhasil direset ke dataset awal bawaan!' });
    if (onDataChanged) onDataChanged();
  };

  return (
    <div className="space-y-6">
      
      {/* 🚀 Header Status Penyimpanan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Status Koneksi Data</span>
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCloudAuth ? 'bg-emerald-400' : isSupabaseConfigured ? 'bg-amber-400' : 'bg-cyan-400'
                }`}
              />
              {isCloudAuth
                ? 'Supabase Cloud (Terautentikasi)'
                : isSupabaseConfigured
                  ? 'Supabase Read-Only (Mode Lokal)'
                  : 'Local Storage Engine'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Estimasi Memori Tersimpan</span>
            <span className="text-xs font-bold text-white mt-0.5 font-mono">
              {getStorageSizeEstimate()}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-gray-400 block font-medium">Integritas Basis Data</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
              100% Siap Digunakan
            </span>
          </div>
        </div>
      </div>

      {/* 📥 Ekspor & Impor JSON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ekspor Backup */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Cadangkan Data Blog (Ekspor JSON)</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Unduh seluruh artikel blog, data komentar, metrik tayangan, dan struktur kategori ke dalam satu berkas format JSON. File ini aman disimpan sebagai arsip atau dipindahkan ke lingkungan lain kapan saja.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <FileJson className="w-4 h-4" />
              <span>{isExporting ? 'Mengekspor Data...' : 'Unduh Cadangan Lengkap (.json)'}</span>
            </button>
          </div>
        </div>

        {/* Impor / Pulihkan JSON */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Pulihkan Data (Impor JSON)</h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Unggah file berkas cadangan JSON blog untuk mengimpor artikel dan data ke dalam sistem.
            </p>

            {/* Mode Impor */}
            <div className="mt-3 flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="text-cyan-500 focus:ring-0"
                />
                <span>Gabungkan (Merge)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                <input
                  type="radio"
                  name="importMode"
                  value="overwrite"
                  checked={importMode === 'overwrite'}
                  onChange={() => setImportMode('overwrite')}
                  className="text-cyan-500 focus:ring-0"
                />
                <span>Timpa Penuh (Overwrite)</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>{isImporting ? 'Memproses Berkas...' : 'Pilih Berkas Cadangan (.json)'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>
        </div>

      </div>

      {/* ⚠️ Zona Pemulihan Default (Reset Seed) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-red-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Reset ke Data Bawaan Awal (Seed Data)</h3>
            <p className="text-xs text-gray-400">
              Mengembalikan artikel contoh dan kategori ke kondisi default awal. Berguna untuk pemulihan demo.
            </p>
          </div>
        </div>

        {showResetConfirm ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Apakah Anda yakin ingin mengatur ulang data blog ke kondisi awal?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                Ya, Reset Sekarang
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-white/10 text-gray-300 text-xs hover:bg-white/20 cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="py-2 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium text-xs transition-colors cursor-pointer"
          >
            Reset ke Dataset Awal
          </button>
        )}
      </div>

    </div>
  );
}
