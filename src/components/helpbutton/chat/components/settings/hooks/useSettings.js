import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS, SETTINGS_KEY } from '../../logic/utils/fileProcessor';

export function useSettings(knowledgeBase = {}) {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });

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
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
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
    setSettings(prev => ({ ...DEFAULT_SETTINGS, activeTab: prev.activeTab }));
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
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