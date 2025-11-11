import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { SettingsSidebar } from "./SettingsSidebar";
import { SettingsContent } from "./SettingsContent";
import { useSettings } from "./hooks/useSettings";
import { useFileManagement } from "./hooks/useFileManagement";

export function ChatbotSettings({ onClose, knowledgeBase = {}, updateKnowledgeBase, knowledgeStats = {} }) {
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
    loadFileStatistics,
    handleFileUpload,
    clearUploadedData,
    exportKnowledgeBase,
    getFileIcon,
    formatFileSize
  } = useFileManagement(settings, updateKnowledgeBase, safeKnowledgeBase, knowledgeStats);

  useEffect(() => {
    loadFileStatistics();
  }, [safeKnowledgeBase]);

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
            <SettingsSidebar activeTab={settings.activeTab} setActiveTab={(tab) => handleSave("activeTab", tab)} />
            
            <SettingsContent 
              activeTab={settings.activeTab}
              settings={settings}
              handleSave={handleSave}
              handleReset={handleReset}
              onClose={onClose}
              uploadedFiles={uploadedFiles}
              fileStats={fileStats}
              handleFileUpload={handleFileUpload}
              clearUploadedData={clearUploadedData}
              exportKnowledgeBase={exportKnowledgeBase}
              getFileIcon={getFileIcon}
              formatFileSize={formatFileSize}
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