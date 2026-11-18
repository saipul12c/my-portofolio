import { Shield, Trash2, Download, HardDrive } from "lucide-react";
import { ToggleSwitch } from "../components/ToggleSwitch";

export function PrivacySettings({ 
  settings, 
  handleSave, 
  clearUploadedData, 
  fileStats = {}, 
  formatFileSize = (bytes) => `${bytes} B`, 
  exportKnowledgeBase 
}) {
  const handleClearChatHistory = () => {
    if (typeof window !== "undefined" && window.confirm("Apakah Anda yakin ingin menghapus semua riwayat percakapan? Tindakan ini akan mengembalikan chat ke kondisi awal.")) {
      try {
        localStorage.removeItem("saipul_chat_history");
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("saipul_chat_cleared"));
        alert("Riwayat chat berhasil dibersihkan!");
      } catch (e) {
        console.error("Error clearing chat history:", e);
        alert("Gagal menghapus riwayat chat.");
      }
    }
  };

  const totalUploadedFiles = fileStats?.totalFiles || 0;

  return (
    <div className="space-y-4">
      {/* Pengaturan Privasi */}
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
              checked={settings.privacyMode}
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
              checked={settings.autoSave}
              onChange={(value) => handleSave("autoSave", value)}
              id="autoSave"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
            <div>
              <span className="text-sm font-medium text-[var(--saipul-text-primary)]">Arsip Percakapan</span>
              <p className="text-xs text-[var(--saipul-text-secondary)]">Simpan salinan cadangan obrolan ke arsip lokal</p>
            </div>
            <ToggleSwitch 
              checked={settings.storeAllConversations}
              onChange={(value) => handleSave("storeAllConversations", value)}
              id="storeAllConversations"
            />
          </div>
        </div>
      </div>

      {/* Manajemen Data & Tindakan */}
      <div className="p-3 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded-lg space-y-3">
        <h4 className="text-sm font-medium text-[var(--saipul-text-primary)] flex items-center gap-1.5">
          <HardDrive size={15} className="text-[var(--saipul-accent)]" /> Manajemen Data
        </h4>
        
        <p className="text-xs text-[var(--saipul-text-muted)]">
          Kelola data yang tersimpan di browser Anda. Semua data percakapan tersimpan secara privat di perangkat lokal Anda.
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

        {totalUploadedFiles > 0 && typeof clearUploadedData === 'function' && (
          <div className="pt-2 border-t border-[var(--saipul-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--saipul-text-secondary)]">
              File tersimpan: {totalUploadedFiles} file ({formatFileSize(fileStats?.totalSize || 0)})
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Hapus semua file yang diunggah ke Knowledge Base?")) {
                  clearUploadedData();
                }
              }}
              className="text-xs text-red-400 hover:underline flex items-center gap-1"
            >
              <Trash2 size={12} /> Bersihkan File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
