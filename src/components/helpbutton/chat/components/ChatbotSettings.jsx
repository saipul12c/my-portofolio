import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { processFileGeneric, saveUploadedData, exportKnowledgeBase as exportKB, DEFAULT_ALLOWED_TYPES } from './logic/utils/fileProcessor';
import { SettingsSidebar } from "./settings/bar/SettingsSidebar";
import { SettingsContent } from "./settings/conten/SettingsContent";
import { useSettings } from "./settings/hooks/useSettings";
import { useFileManagement } from "./settings/hooks/useFileManagement";

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

export function ChatbotSettings({
  onClose,
  knowledgeBase = {},
  updateKnowledgeBase,
  knowledgeStats = {},
  initialTab = null
}) {
  const {
    settings,
    handleSave,
    handleReset,
    safeKnowledgeBase,
    totalKBCategories
  } = useSettings(knowledgeBase, initialTab);

  const {
    uploadedFiles,
    fileStats,
    uploadProgress,
    loadFileStatistics,
    clearUploadedData,
    getFileIcon,
    formatFileSize
  } = useFileManagement(settings, updateKnowledgeBase, safeKnowledgeBase, knowledgeStats);

  // Debounce timer ref untuk prevent rapid settings saves
  const saveDebounceRef = useRef(null);
  const lastSaveRef = useRef(null);



  useEffect(() => {
    // Refresh file stats once on mount or when KB data structure is updated
    loadFileStatistics();
  }, [loadFileStatistics]);

  useEffect(() => {
    // Validate settings saat komponen dimuat — only save if different

    const validatedSettings = validateSettings({ ...settings });

    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
    }

    saveDebounceRef.current = setTimeout(() => {
      try {
        const currentStr = JSON.stringify(lastSaveRef.current || {});
        const validatedStr = JSON.stringify(validatedSettings || {});

        if (currentStr !== validatedStr) {
          lastSaveRef.current = validatedSettings; // Update ref immediately before call
          handleSave(validatedSettings);
        }
      } catch (err) {
        console.warn("Error comparing settings:", err);
      }
      saveDebounceRef.current = null;
    }, 500); 


    return () => {
      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
      }
    };
  }, [settings, handleSave]); // Removed safeKnowledgeBase and loadFileStatistics to avoid loops



  // Listen for external requests to open a specific settings tab
  const handler = useCallback((e) => {
    try {
      const tab = e?.detail?.tab;
      const context = e?.detail?.context;
      if (tab) {
        handleSave("activeTab", tab);
      }
      if (context) {
        // store context in settings so child components can react
        try {
          handleSave('settingsContext', context);
        } catch (_e) { void _e; }
      }
    } catch (err) { void err; }
  }, [handleSave]);

  useEffect(() => {
    window.addEventListener('saipul_open_settings_tab', handler);
    return () => window.removeEventListener('saipul_open_settings_tab', handler);
  }, [handler]);

  // Enhanced reset function
  const enhancedHandleReset = () => {
    handleReset();
  };

  // Enhanced close handler dengan validation
  const handleClose = useCallback(() => {
    const validatedSettings = validateSettings({ ...settings });
    handleSave(validatedSettings);
    onClose();
  }, [settings, handleSave, onClose]);

  // Enhanced export knowledge base dengan performance settings
  const enhancedExportKnowledgeBase = () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        knowledgeBase: safeKnowledgeBase,
        fileStats: fileStats,
        settings: settings,
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
    const _totalFiles = files.length;

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

  // Determine theme style category for CSS targeting
  const theme = settings?.theme || 'dark';
  const isLightLike = ['light', 'sepia', 'solar', 'soft'].includes(theme) || (theme === 'system' && typeof window !== 'undefined' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
  const themeStyleAttribute = isLightLike ? 'light' : 'dark';

  const modalRef = useRef(null);



  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000] p-4"
      >
        <div ref={modalRef} data-theme-style={themeStyleAttribute} className="saipul-settings-root bg-gray-900 text-gray-200 w-full max-w-[700px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-700" style={{ background: 'var(--saipul-modal-bg)' }}>

          <div className="flex flex-row h-[550px]">
            <SettingsSidebar
              activeTab={settings.activeTab}
              setActiveTab={(tab) => handleSave("activeTab", tab)}
            />

            <SettingsContent
              activeTab={settings.activeTab}
              settings={settings}
              handleSave={handleSave}
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