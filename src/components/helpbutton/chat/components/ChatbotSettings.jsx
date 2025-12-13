import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { processFileGeneric, saveUploadedData, exportKnowledgeBase as exportKB, DEFAULT_ALLOWED_TYPES } from './logic/utils/fileProcessor';
import { SettingsSidebar } from "./settings/bar/SettingsSidebar";
import { SettingsContent } from "./settings/conten/SettingsContent";
import { useSettings } from "./settings/hooks/useSettings";
import { useFileManagement } from "./settings/hooks/useFileManagement";

export function ChatbotSettings({ 
  onClose, 
  knowledgeBase = {}, 
  updateKnowledgeBase, 
  knowledgeStats = {} 
}) {
  const {
    settings,
    handleSave,
    handleReset,
    safeKnowledgeBase,
    totalKBCategories
  } = useSettings(knowledgeBase);

  const {
    uploadedFiles,
    fileStats,
    uploadProgress,
    loadFileStatistics,
    clearUploadedData,
    getFileIcon,
    formatFileSize
  } = useFileManagement(settings, updateKnowledgeBase, safeKnowledgeBase, knowledgeStats);

  // Enhanced performance settings dari file kedua
  const [performanceSettings, setPerformanceSettings] = useState({
    batterySaver: false,
    hardwareAcceleration: true,
    cacheSize: "medium",
    realTimeProcessing: true
  });

  // Enhanced settings validation dari file kedua
  const validateSettings = (settings) => {
    if (settings.maxFileSize <= 0) {
      console.warn("Invalid maxFileSize, resetting to default (10MB)");
      settings.maxFileSize = 10;
    }

    if (!Array.isArray(settings.allowedFileTypes) || settings.allowedFileTypes.length === 0) {
      console.warn("Invalid allowedFileTypes, resetting to default");
      settings.allowedFileTypes = DEFAULT_ALLOWED_TYPES;
    }

    return settings;
  };

  // Handle performance settings
  const handlePerformanceSave = (key, value) => {
    setPerformanceSettings(prev => ({
      ...prev,
      [key]: value
    }));
    handleSave(key, value);
  };

  useEffect(() => {
    // Refresh file stats whenever the safe KB changes
    loadFileStatistics();

    // Validate settings saat komponen dimuat — only save if different
    const validatedSettings = validateSettings({ ...settings, ...performanceSettings });
    try {
      const current = JSON.stringify(settings || {});
      const validated = JSON.stringify(validatedSettings || {});
      if (current !== validated) {
        handleSave("settings", validatedSettings);
      }
    } catch (err) {
      console.warn("Error comparing settings:", err);
      // Fallback: if stringify fails, still attempt to save once
      handleSave("settings", validatedSettings);
    }
  }, [safeKnowledgeBase, settings, performanceSettings, handleSave, loadFileStatistics]);

  // Enhanced reset function yang termasuk performance settings
  const enhancedHandleReset = () => {
    handleReset();
    setPerformanceSettings({
      batterySaver: false,
      hardwareAcceleration: true,
      cacheSize: "medium",
      realTimeProcessing: true
    });
  };

  // Enhanced close handler dengan validation
  const handleClose = () => {
    const validatedSettings = validateSettings({ ...settings, ...performanceSettings });
    handleSave("settings", validatedSettings);
    onClose();
  };

  // Enhanced export knowledge base dengan performance settings
  const enhancedExportKnowledgeBase = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        knowledgeBase: safeKnowledgeBase,
        fileStats: fileStats,
        settings: {
          ...settings,
          ...performanceSettings
        },
        stats: knowledgeStats,
        uploadedFiles: uploadedFiles
      };
      exportKB(exportData);
      alert("Knowledge base berhasil diexport!");
    } catch (e) {
      console.error("Error exporting knowledge base:", e);
      alert("Error exporting knowledge base.");
    }
  };

  // Enhanced file upload handler dari file kedua dengan progress tracking
  const enhancedHandleFileUpload = async (event) => {
    if (!settings.enableFileUpload) {
      alert('File upload dinonaktifkan. Aktifkan di pengaturan terlebih dahulu.');
      return;
    }

    const files = Array.from(event.target.files);
    if (!files.length) return;

    let processedCount = 0;
    const totalFiles = files.length;

    for (const file of files) {
      try {
        const fileData = await processFileGeneric(file, settings);
        const { updatedData, updatedMetadata } = saveUploadedData(fileData);

        if (updateKnowledgeBase) {
          updateKnowledgeBase({ uploadedData: updatedData, fileMetadata: updatedMetadata });
        }

        processedCount++;
        loadFileStatistics();
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
        alert(`❌ Error processing ${file.name}: ${err.message}`);
      }
    }

    if (processedCount > 0) {
      alert(`✅ ${processedCount} file berhasil diupload dan diproses!`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000]"
      >
        <div className="bg-gray-900 text-gray-200 w-[700px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="flex h-[550px]">
            <SettingsSidebar 
              activeTab={settings.activeTab} 
              setActiveTab={(tab) => handleSave("activeTab", tab)} 
            />
            
            <SettingsContent 
              activeTab={settings.activeTab}
              settings={{
                ...settings,
                ...performanceSettings
              }}
              handleSave={(key, value) => {
                if (key in performanceSettings) {
                  handlePerformanceSave(key, value);
                } else {
                  handleSave(key, value);
                }
              }}
              handleReset={enhancedHandleReset}
              onClose={handleClose}
              uploadedFiles={uploadedFiles}
              fileStats={fileStats}
              handleFileUpload={enhancedHandleFileUpload}
              clearUploadedData={clearUploadedData}
              exportKnowledgeBase={enhancedExportKnowledgeBase}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
              uploadProgress={uploadProgress}
              totalKBCategories={totalKBCategories}
              knowledgeStats={knowledgeStats}
              safeKnowledgeBase={safeKnowledgeBase}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}