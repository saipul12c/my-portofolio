import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS } from '../../../config.js';
import { SETTINGS_KEY } from '../../logic/utils/fileProcessor';
import { storageService } from '../../logic/utils/storageService';
import { PALETTES, ACCENT_COLORS } from '../settingsConfig.js';

export function useSettings(knowledgeBase = {}) {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });

  // Apply theme/accent to :root so entire app (chat window, buttons, etc.) inherits colors
  useEffect(() => {
    try {
      const applyPalette = (theme = settings.theme, accent = settings.accent) => {
        const acc = ACCENT_COLORS[accent] || ACCENT_COLORS['cyan'];
        const th = PALETTES[theme] || PALETTES['dark'];

        const root = document?.documentElement?.style;
        if (!root) return;

        root.setProperty('--saipul-accent', acc.accent);
        root.setProperty('--saipul-accent-2', acc.accent2);
        root.setProperty('--saipul-accent-gradient', `linear-gradient(90deg, ${acc.accent}, ${acc.accent2})`);
        // additional aliases used in some components
        root.setProperty('--saipul-accent-1', acc.accent);
        root.setProperty('--saipul-accent-contrast', acc.accent2);
        root.setProperty('--saipul-modal-bg', th.surface);
        root.setProperty('--saipul-surface', th.surface);
        root.setProperty('--saipul-bg-card', (theme === 'dark' || theme === 'midnight') ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)');
        root.setProperty('--saipul-bg-input', (theme === 'dark' || theme === 'midnight') ? 'rgba(255,255,255,0.05)' : '#ffffff');
        root.setProperty('--saipul-text', th.text);
        root.setProperty('--saipul-text-primary', th.text);
        root.setProperty('--saipul-text-secondary', (theme === 'dark' || theme === 'midnight') ? '#94a3b8' : '#475569');
        root.setProperty('--saipul-text-muted', th.muted);
        root.setProperty('--saipul-muted', th.muted);
        root.setProperty('--saipul-border', th.border);
        // helper colors
        root.setProperty('--saipul-button-hover', acc.accent2 + '33');
        root.setProperty('--saipul-muted-text', th.muted);
      };

      applyPalette(settings.theme, settings.accent);
    } catch (err) {
      console.warn('Failed to apply theme to :root', err);
    }
  }, [settings.theme, settings.accent]);

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
      const savedSettings = storageService.get(SETTINGS_KEY);
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...savedSettings }));
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }, []);

  const handleSave = (key, value) => {
    let newSettings;
    if (typeof key === 'object' && key !== null) {
      newSettings = { ...settings, ...key };
    } else {
      newSettings = { ...settings, [key]: value };
    }
    setSettings(newSettings);
    try {
      storageService.set(SETTINGS_KEY, newSettings);
      window.dispatchEvent(new Event("storage"));

      if (typeof key === 'string') {
        window.dispatchEvent(new CustomEvent('saipul_settings_updated', {
          detail: { key, value }
        }));
      } else {
        window.dispatchEvent(new CustomEvent('saipul_settings_updated', {
          detail: { settings: newSettings }
        }));
      }
    } catch (e) {
      console.error("Error saving settings:", e);
    }
  };

  const handleReset = () => {
    setSettings(prev => ({ ...DEFAULT_SETTINGS, activeTab: prev.activeTab }));
    try {
      storageService.set(SETTINGS_KEY, DEFAULT_SETTINGS);
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