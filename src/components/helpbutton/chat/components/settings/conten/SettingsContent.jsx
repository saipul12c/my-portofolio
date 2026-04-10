import { useMemo } from "react";
import { motion } from "framer-motion";
import { Download, RefreshCw, Trash2, Upload, ExternalLink } from "lucide-react";
import { CHATBOT_VERSION, AI_DOCS_PATH } from '../../../config';
import { GeneralSettings } from "../settings-tabs/GeneralSettings";
import { AISettings } from "../settings-tabs/AISettings";
import { DataSettings } from "../settings-tabs/DataSettings";
import { FileSettings } from "../settings-tabs/FileSettings";
import { StorageSettings } from "../settings-tabs/StorageSettings";
import { PerformanceSettings } from "../settings-tabs/PerformanceSettings";
import { PrivacySettings } from "../settings-tabs/PrivacySettings";

export function SettingsContent({
  activeTab,
  settings,
  handleSave,
  handleReset,
  onClose,
  uploadedFiles,
  fileStats,
  handleFileUpload,
  clearUploadedData,
  exportKnowledgeBase,
  getFileIcon,
  formatFileSize,
  totalKBCategories,
  knowledgeStats,
}) {
  const tabLabels = {
    umum: 'Tampilan & Umum',
    ai: 'AI & Model',
    data: 'Data & Analisis',
    files: 'File & Data',
    storage: 'Storage & Backup',
    perform: 'Performa',
    privacy: 'Privasi & Keamanan',
    shortcuts: 'Keyboard Shortcuts'
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
        return <AISettings {...commonProps} />;
      case "data":
        return <DataSettings {...commonProps} />;
      case "files":
        return (
          <FileSettings
            {...commonProps}
            handleFileUpload={handleFileUpload}
            clearUploadedData={clearUploadedData}
            getFileIcon={getFileIcon}
            uploadedFiles={uploadedFiles}
            uploadProgress={commonProps.settings?.uploadProgress}
          />
        );
      case "storage":
        return (
          <StorageSettings
            {...commonProps}
            exportKnowledgeBase={exportKnowledgeBase}
          />
        );
      case "perform":
        return <PerformanceSettings {...commonProps} />;
      case "privacy":
        return (
          <PrivacySettings
            {...commonProps}
            clearUploadedData={clearUploadedData}
          />
        );
      case "shortcuts": {
        const shortcuts = settings.shortcuts || {};
        return (
          <div className="space-y-4">
            <h4 className="text-white font-medium">Keyboard Shortcuts</h4>
            <div className="text-xs text-gray-400">Gunakan kombinasi keyboard berikut untuk mempercepat interaksi dengan Live Chat. Anda dapat mengubah kombinasi dan menyimpannya.</div>
            <div className="mt-3 space-y-3 text-sm">
              {[
                {key: 'send', label: 'Send message'},
                {key: 'clear', label: 'Clear chat'},
                {key: 'export', label: 'Export chat'},
                {key: 'openSettings', label: 'Open settings'},
                {key: 'focusInput', label: 'Focus message input'},
                {key: 'regenerate', label: 'Regenerate last bot response'},
                {key: 'openUpload', label: 'Open upload dialog'}
              ].map(item => (
                <div key={item.key} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="text-[var(--saipul-text-secondary)] md:w-44">
                    {item.label}
                  </div>
                  <input
                    type="text"
                    value={shortcuts[item.key] || ''}
                    onChange={(e) => handleSave('shortcuts', { ...(settings.shortcuts || {}), [item.key]: e.target.value })}
                    className="w-full md:flex-1 bg-[var(--saipul-bg-input)] border border-[var(--saipul-border)] rounded px-3 py-2 text-sm text-[var(--saipul-text-primary)]"
                  />
                </div>
              ))}
            </div>
            <div className="text-xs text-[var(--saipul-text-muted)]">Gunakan format seperti <code>Ctrl+Enter</code> atau <code>Ctrl+Shift+U</code>.</div>
          </div>
        );
      }
      default:
        return <GeneralSettings {...commonProps} />;
    }
  }, [
    activeTab, 
    commonProps, 
    handleFileUpload, 
    clearUploadedData, 
    getFileIcon, 
    uploadedFiles, 
    exportKnowledgeBase, 
    settings.shortcuts
  ]);

  const isLiveCS = settings?.settingsContext === 'live-cs';

  return (
    <div className="flex-1 p-4 text-sm space-y-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-white text-lg bg-gradient-to-r from-[var(--saipul-accent-1)] to-[var(--saipul-accent-2)] bg-clip-text text-transparent">
            Pengaturan Lanjutan SaipulAI
          </h3>
          <div className="mt-1 text-xs text-gray-400">
            <span style={{ background: 'var(--saipul-accent-gradient)', color: 'white' }} className="inline-block px-2 py-0.5 rounded-full shadow-sm">{tabLabels[activeTab] || 'Umum'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportKnowledgeBase}
            className="px-3 py-1.5 text-xs rounded-lg transition-all text-white border flex items-center gap-1.5 hover:brightness-110 active:scale-95"
            style={{ background: 'var(--saipul-accent-gradient)', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <Download size={14} />
            Export Data
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs rounded-lg bg-red-900/20 hover:bg-red-800/40 transition-all text-red-400 border border-red-500/20 flex items-center gap-1.5 active:scale-95"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>
      </div>

      {isLiveCS && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-xl mb-6 shadow-lg backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <div className="font-bold text-cyan-200 uppercase tracking-wider text-[10px]">Live CS Active Mode</div>
          </div>
          <div className="text-xs text-cyan-100/80 leading-relaxed font-light">
            Anda sedang dalam mode dukungan langsung. Beberapa fitur bot dinonaktifkan untuk mengutamakan privasi dan kecepatan agen manusia.
            <ul className="mt-2 space-y-1.5 list-none opacity-90">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">🕒</span> Jadwal: Senin–Jumat 09:00–17:00
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400">🛡️</span> Privasi: Transkrip hanya dibagikan ke agen
              </li>
              <li className="mt-3">
                <a href="/live-cs/security" className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-100 underline decoration-cyan-500/30 transition-colors">
                  Baca Panduan Keamanan <ExternalLink size={10} />
                </a>
              </li>
            </ul>
          </div>
        </motion.div>
      )}

      <div className="text-xs text-gray-400">Perubahan pengaturan akan diterapkan langsung ke chat aktif.</div>

      {renderedTabContent}

      <div className="pt-4 flex justify-between items-center border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <a
            href={AI_DOCS_PATH}
            onClick={(e) => { e.preventDefault(); window.location.href = AI_DOCS_PATH; }}
            className="hover:underline"
            style={{ color: 'var(--saipul-accent)' }}
          >
            SaipulAI {CHATBOT_VERSION} • Enhanced Intelligence
          </a>
          <br />
          <span className="text-gray-600">
            {knowledgeStats.totalItems || 0} items • {fileStats.totalFiles} files
          </span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg transition text-white font-medium"
          style={{ background: 'var(--saipul-accent-gradient)' }}
        >
          Simpan & Tutup
        </button>
      </div>
    </div>
  );
}