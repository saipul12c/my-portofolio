import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
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

  // Debounce timer ref untuk prevent rapid settings saves
  const saveDebounceRef = useRef(null);
  const lastSaveRef = useRef(null);

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
    // BUT dengan debounce untuk prevent multiple rapid saves
    const validatedSettings = validateSettings({ ...settings });

    // Clear previous debounce timer
    if (saveDebounceRef.current) {
      clearTimeout(saveDebounceRef.current);
    }

    // Set new debounce timer (300ms to batch rapid changes)
    saveDebounceRef.current = setTimeout(() => {
      try {
        const current = JSON.stringify(lastSaveRef.current || {});
        const validated = JSON.stringify(validatedSettings || {});

        if (current !== validated) {
          handleSave(validatedSettings);
          lastSaveRef.current = validatedSettings;
        }
      } catch (err) {
        console.warn("Error comparing settings:", err);
      }
      saveDebounceRef.current = null;
    }, 300);

    // Cleanup debounce on unmount
    return () => {
      if (saveDebounceRef.current) {
        clearTimeout(saveDebounceRef.current);
      }
    };
  }, [safeKnowledgeBase, settings, handleSave, loadFileStatistics]);

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

  // Apply theme/accent to modal via CSS variables override if needed
  const modalRef = useRef(null);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;

    try {
      // Cleanup previous overrides
      if (el._saipul_modified && Array.isArray(el._saipul_modified)) {
        el._saipul_modified.forEach(node => {
          if (node && node.style) {
            node.style.backgroundColor = '';
            node.style.color = '';
            node.style.borderColor = '';
          }
        });
        el._saipul_modified = null;
      }

      // If light-like theme, adjust common dark utility classes inside modal to readable light equivalents
      const theme = settings?.theme || 'dark';
      const isLightLike = ['light', 'sepia', 'solar', 'soft'].includes(theme) || (theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isLightLike) {
        const all = el.querySelectorAll('*');
        const modified = [];
        all.forEach((node) => {
          const cls = node.className || '';
          if (typeof cls === 'string' && (cls.includes('bg-gray-800') || cls.includes('bg-gray-900') || cls.includes('bg-gray-800/50'))) {
            node.style.backgroundColor = 'var(--saipul-surface, #f3f4f6)';
            node.style.color = 'var(--saipul-text, #0b1220)';
            modified.push(node);
          }
          // text-white on light -> set dark text
          if (typeof cls === 'string' && cls.includes('text-white')) {
            node.style.color = 'var(--saipul-text, #0b1220)';
            modified.push(node);
          }
          // inputs/selects
          if (node.tagName === 'SELECT' || node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
            node.style.backgroundColor = 'var(--saipul-surface, #ffffff)';
            node.style.color = 'var(--saipul-text, #0b1220)';
            node.style.borderColor = 'rgba(15,23,36,0.08)';
            modified.push(node);
          }
        });
        // store modified elements so we can cleanup next run
        el._saipul_modified = modified;
      }
    } catch (e) {
      console.warn('Error adjusting settings theme overrides:', e);
    }
  }, [settings.theme, settings.accent]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000] p-4"
      >
        <div ref={modalRef} className="saipul-settings-root bg-gray-900 text-gray-200 w-full max-w-[700px] max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden border border-gray-700" style={{ background: 'var(--saipul-modal-bg)' }}>
          <div className="flex flex-row h-[550px]">
            <SettingsSidebar
              activeTab={settings.activeTab}
              setActiveTab={(tab) => handleSave("activeTab", tab)}
            />

            <SettingsContent
              activeTab={settings.activeTab}
              settings={settings}
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