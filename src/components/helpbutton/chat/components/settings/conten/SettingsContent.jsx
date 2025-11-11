import { Download, RefreshCw, Trash2, Upload } from "lucide-react";
import { GeneralSettings } from "./settings-tabs/GeneralSettings";
import { AISettings } from "./settings-tabs/AISettings";
import { DataSettings } from "./settings-tabs/DataSettings";
import { FileSettings } from "./settings-tabs/FileSettings";
import { StorageSettings } from "./settings-tabs/StorageSettings";
import { PerformanceSettings } from "./settings-tabs/PerformanceSettings";
import { PrivacySettings } from "./settings-tabs/PrivacySettings";

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
  safeKnowledgeBase
}) {
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
      default:
        return <GeneralSettings {...commonProps} />;
    }
  };

  return (
    <div className="flex-1 p-4 text-sm space-y-4 overflow-y-auto">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Pengaturan Lanjutan SaipulAI
        </h3>
        <div className="flex gap-2">
          <button
            onClick={exportKnowledgeBase}
            className="px-3 py-1 text-xs rounded-lg bg-green-900/30 hover:bg-green-800/50 transition text-green-400 border border-green-500/30 flex items-center gap-1"
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

      {renderTabContent()}

      <div className="pt-4 flex justify-between items-center border-t border-gray-700">
        <div className="text-xs text-gray-500">
          SaipulAI v6.0 • Enhanced Intelligence
          <br />
          <span className="text-gray-600">
            {knowledgeStats.totalItems || 0} items • {fileStats.totalFiles} files
          </span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition text-white font-medium"
        >
          Simpan & Tutup
        </button>
      </div>
    </div>
  );
}