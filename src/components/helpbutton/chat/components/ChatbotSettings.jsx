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

  // Enhanced performance settings dari file kedua
  const [performanceSettings, setPerformanceSettings] = useState({
    batterySaver: false,
    hardwareAcceleration: true,
    cacheSize: "medium",
    realTimeProcessing: true
  });

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
    const validatedSettings = validateSettings({ ...settings, ...performanceSettings });
    
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
          handleSave("settings", validatedSettings);
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
  }, [safeKnowledgeBase, settings, performanceSettings, handleSave, loadFileStatistics]);

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
  const handleClose = useCallback(() => {
    const validatedSettings = validateSettings({ ...settings, ...performanceSettings });
    handleSave("settings", validatedSettings);
    onClose();
  }, [settings, performanceSettings, handleSave, onClose]);

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

  // Apply theme/accent to modal via CSS variables so settings take effect immediately
  const modalRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current) return;
    // cleanup previous inline overrides
    try {
      const prev = modalRef.current._saipul_modified;
      if (prev && Array.isArray(prev)) {
        prev.forEach((n) => {
          if (n && n.style) {
            n.style.backgroundColor = '';
            n.style.color = '';
            n.style.borderColor = '';
          }
        });
        modalRef.current._saipul_modified = null;
      }
    } catch (_e) { void _e; }

    const accentMap = {
      cyan: ['#06b6d4', '#0ea5e9'],
      blue: ['#2563eb', '#3b82f6'],
      purple: ['#7c3aed', '#a78bfa'],
      green: ['#16a34a', '#22c55e'],
      orange: ['#f97316', '#fb923c'],
      red: ['#ef4444', '#f87171'],
      amber: ['#f59e0b', '#fbbf24'],
      pink: ['#ec4899', '#f472b6'],
      teal: ['#0d9488', '#14b8a6'],
      rose: ['#fb7185', '#f43f5e'],
      lime: ['#84cc16', '#a3e635']
    };

    const accent = settings?.accent || 'cyan';
    const [c1, c2] = accentMap[accent] || accentMap.cyan;

    const theme = settings?.theme || 'system';
    let bg = '#0f1724'; // default dark modal bg
    let text = '#e6eef8';

    // Theme palette handling (include new themes)
    if (theme === 'light') {
      bg = '#ffffff';
      text = '#0b1220';
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!prefersDark) {
        bg = '#ffffff';
        text = '#0b1220';
      }
    } else if (theme === 'sepia') {
      bg = '#f4ecd8';
      text = '#2b2b20';
    } else if (theme === 'solar') {
      bg = '#fff8e1';
      text = '#2b2b20';
    } else if (theme === 'midnight') {
      bg = '#071026';
      text = '#e6f0ff';
    } else if (theme === 'soft') {
      bg = '#f7fafc';
      text = '#0f1724';
    }
    else if (theme === 'contrast') {
      bg = '#000000';
      text = '#ffffff';
    }

    try {
      const el = modalRef.current;
      if (!el) return;  // Guard: element not yet mounted
      
      // Only apply styles if they've actually changed (check via dataset)
      const currentTheme = el.dataset.saipulTheme;
      const currentAccent = el.dataset.saipulAccent;
      
      if (currentTheme === theme && currentAccent === accent) {
        // No change needed
        return;
      }
      
      el.style.setProperty('--saipul-accent-1', c1);
      el.style.setProperty('--saipul-accent-2', c2);
      el.style.setProperty('--saipul-accent-gradient', `linear-gradient(90deg, ${c1}, ${c2})`);
      el.style.setProperty('--saipul-accent', c1);
      el.style.setProperty('--saipul-accent-contrast', c2);
      el.style.setProperty('--saipul-modal-bg', bg);
      el.style.setProperty('--saipul-surface', (theme === 'dark' || theme === 'midnight') ? '#0f1724' : (theme === 'sepia' ? '#f6efe0' : (theme === 'solar' ? '#fff8e1' : (theme === 'soft' ? '#fbfdff' : bg))));
      el.style.setProperty('--saipul-muted', (theme === 'dark' || theme === 'midnight') ? '#1f2937' : '#eef2f6');
      el.style.setProperty('--saipul-border', (theme === 'dark' || theme === 'midnight') ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,36,0.08)');
      el.style.setProperty('--saipul-text', text);
      el.style.setProperty('--saipul-muted-text', (theme === 'dark' || theme === 'midnight') ? '#9aa4b2' : '#6b7280');
      el.style.setProperty('--saipul-button-hover', c2 + '33');
      el.style.color = text;
      // also set dataset for easy CSS selectors
      el.dataset.saipulTheme = theme;
      el.dataset.saipulAccent = accent;

      // Ensure native <select> and their <option>s inherit the modal variables
      try {
        const selects = el.querySelectorAll('select');
        selects.forEach((s) => {
          s.style.backgroundColor = 'var(--saipul-surface)';
          s.style.color = 'var(--saipul-text)';
          s.style.borderColor = 'var(--saipul-border)';
          const opts = s.querySelectorAll('option');
          opts.forEach((o) => {
            try {
              o.style.backgroundColor = 'var(--saipul-surface)';
              o.style.color = 'var(--saipul-text)';
            } catch (_e) { void _e; }
          });
        });
      } catch (_e) { void _e; }

      // If light-like theme, adjust common dark utility classes inside modal to readable light equivalents
      const isLightLike = ['light','sepia','solar','soft'].includes(theme) || (theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isLightLike) {
        const all = el.querySelectorAll('*');
        const modified = [];
        all.forEach((node) => {
          const cls = node.className || '';
          if (typeof cls === 'string' && (cls.includes('bg-gray-800') || cls.includes('bg-gray-900') || cls.includes('bg-gray-800/50') )) {
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
    } catch (_e) { void _e; }
  }, [settings]);

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