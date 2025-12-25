import { Download, RefreshCw, Trash2, Upload } from "lucide-react";
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

  const renderTabContent = () => {
    const commonProps = {
      settings,
      handleSave,
      fileStats,
      formatFileSize,
      totalKBCategories,
      knowledgeStats
    };

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
                  <div className="text-gray-200 md:w-44">
                    {item.label}
                  </div>
                  <input
                    type="text"
                    value={shortcuts[item.key] || ''}
                    onChange={(e) => handleSave('shortcuts', { ...(settings.shortcuts || {}), [item.key]: e.target.value })}
                    className="w-full md:flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white"
                  />
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500">Gunakan format seperti <code>Ctrl+Enter</code> atau <code>Ctrl+Shift+U</code>.</div>
          </div>
        );
      }
      default:
        return <GeneralSettings {...commonProps} />;
    }
  };

  return (
    <div className="flex-1 p-4 text-sm space-y-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-white text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Pengaturan Lanjutan SaipulAI
          </h3>
          <div className="mt-1 text-xs text-gray-400">
            <span style={{ background: 'var(--saipul-accent-gradient)', color: 'white' }} className="inline-block px-2 py-0.5 rounded">{tabLabels[activeTab] || 'Umum'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportKnowledgeBase}
            className="px-3 py-1 text-xs rounded-lg transition text-white border flex items-center gap-1"
            style={{ background: 'var(--saipul-accent-gradient)', borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <Download size={12} />
            Export
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs rounded-lg bg-red-900/30 hover:bg-red-800/50 transition text-red-400 border border-red-500/30 flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Reset
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-400">Perubahan pengaturan akan diterapkan langsung ke chat aktif.</div>

      {renderTabContent()}

      <div className="pt-4 flex justify-between items-center border-t border-gray-700">
        <div className="text-xs text-gray-500">
          SaipulAI v7.0.0 • Enhanced Intelligence
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