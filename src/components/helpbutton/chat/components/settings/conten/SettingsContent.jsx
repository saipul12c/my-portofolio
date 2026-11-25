import { useMemo } from "react";
import { motion } from "framer-motion";
import { Download, RefreshCw, ExternalLink } from "lucide-react";
import { CHATBOT_VERSION, AI_DOCS_PATH } from '../../../config';
import { GeneralSettings } from "../settings-tabs/GeneralSettings";
import { AISettings } from "../settings-tabs/AISettings";
import { PrivacySettings } from "../settings-tabs/PrivacySettings";

export function SettingsContent({
  activeTab,
  settings,
  handleSave,
  handleReset,
  onClose,
  fileStats,
  uploadedFiles = [],
  handleFileUpload,
  deleteSingleFile,
  clearUploadedData,
  exportKnowledgeBase,
  getFileIcon,
  formatFileSize,
  uploadProgress = 0,
  isUploading = false,
  totalKBCategories,
  knowledgeStats,
}) {
  const tabLabels = {
    umum: 'Tampilan & Suara',
    ai: 'Gaya & Karakter AI',
    privacy: 'Privasi & Data',
    shortcuts: 'Pintasan Keyboard'
  };

  const commonProps = useMemo(() => ({
    settings,
    handleSave,
    fileStats,
    formatFileSize,
    totalKBCategories,
    knowledgeStats
  }), [settings, handleSave, fileStats, formatFileSize, totalKBCategories, knowledgeStats]);

  const renderedTabContent = useMemo(() => {
    switch (activeTab) {
      case "umum":
        return <GeneralSettings {...commonProps} />;
      case "ai":
      case "data":
        return <AISettings {...commonProps} />;
      case "privacy":
      case "storage":
      case "files":
      case "perform":
        return (
          <PrivacySettings
            {...commonProps}
            handleFileUpload={handleFileUpload}
            deleteSingleFile={deleteSingleFile}
            uploadedFiles={uploadedFiles}
            clearUploadedData={clearUploadedData}
            exportKnowledgeBase={exportKnowledgeBase}
            getFileIcon={getFileIcon}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
          />
        );
      case "shortcuts": {
        const shortcuts = settings.shortcuts || {};
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium">Pintasan Keyboard (Shortcuts)</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Gunakan kombinasi keyboard berikut untuk mempercepat interaksi Anda dengan SaipulAI.
              </p>
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {[
                { key: 'send', label: 'Kirim pesan' },
                { key: 'clear', label: 'Bersihkan percakapan' },
                { key: 'export', label: 'Ekspor percakapan' },
                { key: 'openSettings', label: 'Buka pengaturan' },
                { key: 'focusInput', label: 'Fokus ke kotak input' },
                { key: 'regenerate', label: 'Ulangi respons terakhir' }
              ].map(item => (
                <div key={item.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-[var(--saipul-bg-card)] border border-[var(--saipul-border)] rounded-lg">
                  <span className="text-[var(--saipul-text-secondary)] text-xs sm:text-sm">
                    {item.label}
                  </span>
                  <input
                    type="text"
                    value={shortcuts[item.key] || ''}
                    onChange={(e) => handleSave('shortcuts', { ...(settings.shortcuts || {}), [item.key]: e.target.value })}
                    className="w-full sm:w-44 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded px-2.5 py-1 text-xs text-[var(--saipul-text-primary)] font-mono text-center outline-none focus:ring-1 focus:ring-[var(--saipul-accent)]"
                  />
                </div>
              ))}
            </div>
            <div className="text-xs text-[var(--saipul-text-muted)]">
              Contoh format: <code>Ctrl+Enter</code> atau <code>Ctrl+K</code>.
            </div>
          </div>
        );
      }
      default:
        return <GeneralSettings {...commonProps} />;
    }
  }, [
    activeTab, 
    commonProps, 
    handleSave,
    handleFileUpload,
    deleteSingleFile,
    uploadedFiles,
    clearUploadedData, 
    exportKnowledgeBase, 
    getFileIcon,
    uploadProgress,
    isUploading,
    settings.shortcuts
  ]);

  const isLiveCS = settings?.settingsContext === 'live-cs';

  return (
    <div className="flex-1 p-4 text-sm space-y-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-white text-lg bg-gradient-to-r from-[var(--saipul-accent-1)] to-[var(--saipul-accent-2)] bg-clip-text text-transparent">
            Pengaturan SaipulAI
          </h3>
          <div className="mt-1 text-xs text-gray-400">
            <span style={{ background: 'var(--saipul-accent-gradient)', color: 'white' }} className="inline-block px-2.5 py-0.5 rounded-full shadow-sm text-[11px] font-medium">
              {tabLabels[activeTab] || 'Tampilan & Suara'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {typeof exportKnowledgeBase === 'function' && (
            <button
              type="button"
              onClick={exportKnowledgeBase}
              className="px-3 py-1.5 text-xs rounded-lg transition-all text-white border flex items-center gap-1.5 hover:brightness-110 active:scale-95"
              style={{ background: 'var(--saipul-accent-gradient)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <Download size={13} />
              Ekspor
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs rounded-lg bg-red-900/20 hover:bg-red-800/40 transition-all text-red-400 border border-red-500/20 flex items-center gap-1.5 active:scale-95"
          >
            <RefreshCw size={13} />
            Reset
          </button>
        </div>
      </div>

      {isLiveCS && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-xl mb-4 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="font-bold text-cyan-200 uppercase tracking-wider text-[10px]">Live CS Active Mode</div>
          </div>
          <div className="text-xs text-cyan-100/80 leading-relaxed font-light">
            Sedang dalam sesi live support. Respons diprioritaskan untuk agen manusia.
            <div className="mt-2">
              <a href="/live-cs/security" className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-100 underline decoration-cyan-500/30 text-xs">
                Panduan Keamanan <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {renderedTabContent}

      <div className="pt-4 flex justify-between items-center border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <a
            href={AI_DOCS_PATH}
            onClick={(e) => { e.preventDefault(); window.location.href = AI_DOCS_PATH; }}
            className="hover:underline font-medium"
            style={{ color: 'var(--saipul-accent)' }}
          >
            SaipulAI v{CHATBOT_VERSION}
          </a>
          <br />
          <span className="text-gray-600 text-[11px]">
            {knowledgeStats?.totalItems || 0} topik tersedia
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg transition text-white font-medium text-xs shadow-md active:scale-95"
          style={{ background: 'var(--saipul-accent-gradient)' }}
        >
          Simpan & Tutup
        </button>
      </div>
    </div>
  );
}
