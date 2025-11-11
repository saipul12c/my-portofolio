import { useState, useEffect } from "react";

export function useSettings(knowledgeBase = {}) {
  const [settings, setSettings] = useState({
    activeTab: "umum",
    theme: "system",
    accent: "cyan",
    language: "auto",
    aiModel: "enhanced",
    calculationPrecision: "high",
    enablePredictions: true,
    dataAnalysis: true,
    memoryContext: true,
    autoSuggestions: true,
    voiceResponse: false,
    privacyMode: false,
    advancedMath: true,
    creativeMode: false,
    responseSpeed: "balanced",
    temperature: 0.7,
    maxTokens: 1500,
    enableFileUpload: true,
    useUploadedData: true,
    maxFileSize: 10,
    allowedFileTypes: ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'json', 'csv', 'md'],
    extractTextFromImages: false,
    processSpreadsheets: true,
    autoSave: true,
    backupInterval: 30,
    enableAnalytics: false
  });

  const safeKnowledgeBase = {
    AI: {},
    hobbies: [],
    cards: [],
    certificates: [],
    collaborations: [],
    interests: {},
    profile: {},
    softskills: [],
    uploadedData: [],
    fileMetadata: [],
    ...knowledgeBase
  };

  const totalKBCategories = Object.keys(safeKnowledgeBase).filter(key => {
    const value = safeKnowledgeBase[key];
    return Array.isArray(value) ? value.length > 0 : 
           typeof value === 'object' && value !== null ? Object.keys(value).length > 0 : false;
  }).length;

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("saipul_settings");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }, []);

  const handleSave = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      localStorage.setItem("saipul_settings", JSON.stringify(newSettings));
      window.dispatchEvent(new Event("storage"));
      
      window.dispatchEvent(new CustomEvent('saipul_settings_updated', {
        detail: { key, value }
      }));
    } catch (e) {
      console.error("Error saving settings:", e);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: "system",
      accent: "cyan",
      language: "auto",
      aiModel: "enhanced",
      calculationPrecision: "high",
      enablePredictions: true,
      dataAnalysis: true,
      memoryContext: true,
      autoSuggestions: true,
      voiceResponse: false,
      privacyMode: false,
      advancedMath: true,
      creativeMode: false,
      responseSpeed: "balanced",
      temperature: 0.7,
      maxTokens: 1500,
      enableFileUpload: true,
      useUploadedData: true,
      maxFileSize: 10,
      allowedFileTypes: ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'json', 'csv', 'md'],
      extractTextFromImages: false,
      processSpreadsheets: true,
      autoSave: true,
      backupInterval: 30,
      enableAnalytics: false
    };
    setSettings(defaultSettings);
    try {
      localStorage.setItem("saipul_settings", JSON.stringify(defaultSettings));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Error resetting settings:", e);
    }
  };

  return {
    settings,
    handleSave,
    handleReset,
    safeKnowledgeBase,
    totalKBCategories
  };
}