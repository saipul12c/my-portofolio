import { useRef } from "react";
import { Shield, Trash2, Download, HardDrive, UploadCloud } from "lucide-react";
import { ToggleSwitch } from "../components/ToggleSwitch";
import { storageService } from "../../logic/utils/storageService";

export function PrivacySettings({ 
  settings, 
  handleSave, 
  clearUploadedData, 
  handleFileUpload,
  deleteSingleFile,
  uploadedFiles = [],
  uploadProgress = 0,
  isUploading = false,
  fileStats = {}, 
  formatFileSize = (bytes) => `${bytes} B`, 
  getFileIcon = () => '📁',
  exportKnowledgeBase 
}) {
  const fileInputRef = useRef(null);

  const handleClearChatHistory = () => {
    if (typeof window !== "undefined" && window.confirm("Apakah Anda yakin ingin menghapus semua riwayat percakapan? Tindakan ini akan mengembalikan chat ke kondisi awal.")) {
      try {
        storageService.remove("saipul_chat_history");
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("saipul_chat_cleared"));
        alert("Riwayat chat berhasil dibersihkan!");
      } catch (e) {
        console.error("Error clearing chat history:", e);
        alert("Gagal menghapus riwayat chat.");
      }
    }
  };

  const totalUploadedFiles = fileStats?.totalFiles || uploadedFiles.length || 0;
  const maxMb = settings?.maxFileSize || 10;
  const allowedList = Array.isArray(settings?.allowedFileTypes) && settings.allowedFileTypes.length > 0
    ? settings.allowedFileTypes
    : ['txt', 'md', 'csv', 'json', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
  const allowedExtensions = allowedList.join(', .');
  const acceptAttr = allowedList.map(ext => `.${String(ext).replace(/^\./, '')}`).join(',');

  return (
    <div className="space-y-4">
      {/* 1. Bagian Unggah Dokumen & Manajemen Knowledge Base */}
      <div className="p-3 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-[var(--saipul-text-primary)] flex items-center gap-1.5">
            <UploadCloud size={16} className="text-[var(--saipul-accent)]" /> Unggah Dokumen ke Memori SaipulAI
          </h4>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--saipul-accent)]/10 text-[var(--saipul-accent)] font-medium">
            {totalUploadedFiles} berkas • Maks {maxMb}MB
          </span>
        </div>

        <p className="text-xs text-[var(--saipul-text-muted)]">
          Unggah dokumen catatan (`.txt`, `.md`, `.csv`, `.json`) untuk dibaca & diindeks isinya. Format biner (`.pdf`, Office, gambar) dicatat sebagai referensi berkas.
        </p>

        {/* Input File Tersembunyi */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept={acceptAttr}
          className="hidden"
        />

        {/* Area Drag & Drop / Tombol Pemilih Berkas */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer?.files?.length && typeof handleFileUpload === 'function') {
              handleFileUpload({ target: { files: e.dataTransfer.files } });
            }
          }}
          className="border-2 border-dashed border-[var(--saipul-border)] hover:border-[var(--saipul-accent)] bg-[var(--saipul-bg-card)] rounded-xl p-4 text-center cursor-pointer transition-all hover:bg-[var(--saipul-accent)]/5 group"
        >
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-[var(--saipul-accent)]/10 text-[var(--saipul-accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <UploadCloud size={20} />
            </div>
            <span className="text-xs font-medium text-[var(--saipul-text-primary)]">
              {isUploading ? "Sedang memproses dokumen..." : "Klik untuk memilih berkas atau seret dokumen ke sini"}
            </span>
            <span className="text-[10px] text-[var(--saipul-text-secondary)]">
              Mendukung format: .{allowedExtensions}
            </span>
          </div>
        </div>

        {/* Indikator Progress Upload */}
        {(uploadProgress > 0 || isUploading) && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[var(--saipul-text-secondary)]">
              <span>Memproses berkas...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-[var(--saipul-border)] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[var(--saipul-accent)] h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Daftar Dokumen yang Tersimpan */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[var(--saipul-border)]">
            <div className="flex items-center justify-between text-xs text-[var(--saipul-text-secondary)]">
              <span className="font-medium">Dokumen Terindeks ({uploadedFiles.length})</span>
              <span>Total: {formatFileSize(fileStats?.totalSize || 0)}</span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={`${file.name}-${idx}`}
                  className="flex items-center justify-between p-2 rounded-lg bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] text-xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <span className="text-sm">{getFileIcon(file.extension)}</span>
                    <div className="truncate">
                      <p className="font-medium text-[var(--saipul-text-primary)] truncate">{file.name}</p>
                      <p className="text-[10px] text-[var(--saipul-text-muted)]">
                        {formatFileSize(file.size)} • {file.sentences || 0} kalimat terindeks
                      </p>
                    </div>
                  </div>

                  {typeof deleteSingleFile === 'function' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSingleFile(file.name);
                      }}
                      title="Hapus berkas ini"
                      className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {typeof clearUploadedData === 'function' && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={clearUploadedData}
                  className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 size={12} /> Bersihkan Semua Dokumen
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Pengaturan Privasi & Keamanan Lokal */}
      <div className="p-3 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-[var(--saipul-text-primary)] flex items-center gap-1.5">
          <Shield size={15} className="text-[var(--saipul-accent)]" /> Keamanan & Penyimpanan Lokal
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
            <div>
              <span className="text-sm font-medium text-[var(--saipul-text-primary)]">Mode Privasi (Incognito)</span>
              <p className="text-xs text-[var(--saipul-text-secondary)]">Jangan simpan riwayat percakapan apa pun ke browser</p>
            </div>
            <ToggleSwitch 
              checked={settings?.privacyMode}
              onChange={(value) => handleSave("privacyMode", value)}
              id="privacyMode"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
            <div>
              <span className="text-sm font-medium text-[var(--saipul-text-primary)]">Simpan Otomatis (Auto-Save)</span>
              <p className="text-xs text-[var(--saipul-text-secondary)]">Simpan pesan secara otomatis agar tidak hilang saat reload</p>
            </div>
            <ToggleSwitch 
              checked={settings?.autoSave}
              onChange={(value) => handleSave("autoSave", value)}
              id="autoSave"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
            <div>
              <span className="text-sm font-medium text-[var(--saipul-text-primary)]">Telemetri & Analitik Lokal</span>
              <p className="text-xs text-[var(--saipul-text-secondary)]">Catat metrik respons secara anonim di perangkat lokal untuk optimasi akurasi</p>
            </div>
            <ToggleSwitch 
              checked={settings?.enableAnalytics}
              onChange={(value) => handleSave("enableAnalytics", value)}
              id="enableAnalytics"
            />
          </div>
        </div>
      </div>

      {/* 3. Manajemen Ekspor & Pembersihan Riwayat */}
      <div className="p-3 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-[var(--saipul-text-primary)] flex items-center gap-1.5">
          <HardDrive size={15} className="text-[var(--saipul-accent)]" /> Ekspor & Pembersihan Riwayat
        </h4>
        
        <p className="text-xs text-[var(--saipul-text-muted)]">
          Seluruh data percakapan dan dokumen disimpan secara aman di perangkat lokal Anda.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {typeof exportKnowledgeBase === 'function' && (
            <button
              type="button"
              onClick={exportKnowledgeBase}
              className="px-3 py-2.5 rounded-lg border flex items-center justify-center gap-2 text-xs font-medium transition-all hover:brightness-110 active:scale-95"
              style={{ borderColor: 'var(--saipul-border)', background: 'var(--saipul-bg-card)', color: 'var(--saipul-accent)' }}
            >
              <Download size={14} />
              Ekspor Data Chat (.json)
            </button>
          )}

          <button
            type="button"
            onClick={handleClearChatHistory}
            className="px-3 py-2.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center gap-2 text-xs font-medium transition-all active:scale-95"
          >
            <Trash2 size={14} />
            Hapus Riwayat Chat
          </button>
        </div>
      </div>
    </div>
  );
}
