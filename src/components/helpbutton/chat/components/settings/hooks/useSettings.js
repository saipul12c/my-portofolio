import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { DEFAULT_SETTINGS } from '../../../config.js';
import { SETTINGS_KEY } from '../../logic/utils/fileProcessor';
import { storageService } from '../../logic/utils/storageService';
import { applySaipulThemeToRoot } from '../settingsConfig.js';

export function useSettings(knowledgeBase = {}, initialTab = null) {
  const [settings, setSettings] = useState(() => {
    const base = {
      ...DEFAULT_SETTINGS,
      activeTab: initialTab || DEFAULT_SETTINGS.activeTab
    };
    try {
      const savedSettings = storageService.get(SETTINGS_KEY);
      if (savedSettings && typeof savedSettings === 'object') {
        return {
          ...base,
          ...savedSettings,
          activeTab: initialTab || savedSettings.activeTab || base.activeTab
        };
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
    return base;
  });
  const isFirstMountRef = useRef(true);

  // Apply theme/accent to :root so entire app (chat window, buttons, etc.) inherits colors
  useEffect(() => {
    applySaipulThemeToRoot(settings.theme, settings.accent);
  }, [settings.theme, settings.accent]);

  const safeKnowledgeBase = useMemo(() => ({
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
    ...(knowledgeBase || {})
  }), [knowledgeBase]);

  const totalKBCategories = useMemo(() => Object.keys(safeKnowledgeBase).filter(key => {
    const value = safeKnowledgeBase[key];
    return Array.isArray(value) ? value.length > 0 :
      typeof value === 'object' && value !== null ? Object.keys(value).length > 0 : false;
  }).length, [safeKnowledgeBase]);

  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    if (initialTab) {
      setSettings(prev => (prev.activeTab === initialTab ? prev : { ...prev, activeTab: initialTab }));
    }
  }

  const handleSave = useCallback((key, value) => {
    setSettings(prev => {
      if (typeof key === 'object' && key !== null) {
        return { ...prev, ...key };
      } else {
        if (prev[key] === value) return prev;
        return { ...prev, [key]: value };
      }
    });
  }, []);

  // Persist only after initial mount so saved user settings aren't overwritten with defaults
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    try {
      storageService.set(SETTINGS_KEY, settings);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent('saipul_settings_updated', {
        detail: { settings }
      }));
    } catch (e) {
      console.error("Error persisting settings:", e);
    }
  }, [settings]);




  const handleReset = useCallback(() => {
    setSettings(prev => ({ ...DEFAULT_SETTINGS, activeTab: prev.activeTab }));
    try {
      storageService.set(SETTINGS_KEY, DEFAULT_SETTINGS);
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Error resetting settings:", e);
    }
  }, []);

  return {
    settings,
    handleSave,
    handleReset,
    safeKnowledgeBase,
    totalKBCategories
  };
}