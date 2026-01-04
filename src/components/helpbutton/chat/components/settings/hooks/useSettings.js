import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS } from '../../../config.js';
import { SETTINGS_KEY } from '../../logic/utils/fileProcessor';
import { storageService } from '../../logic/utils/storageService';

export function useSettings(knowledgeBase = {}) {
  const [settings, setSettings] = useState({ ...DEFAULT_SETTINGS });

  // Apply theme/accent to :root so entire app (chat window, buttons, etc.) inherits colors
  useEffect(() => {
    try {
      const applyPalette = (theme = settings.theme, accent = settings.accent) => {
        const accents = {
          cyan: { accent: '#06b6d4', accent2: '#0891b2' },
          amber: { accent: '#f59e0b', accent2: '#d97706' },
          blue: { accent: '#2563eb', accent2: '#1e40af' },
          teal: { accent: '#0ea5a4', accent2: '#0f766e' },
          rose: { accent: '#fb7185', accent2: '#be185d' },
          lime: { accent: '#84cc16', accent2: '#65a30d' }
        };

        const themes = {
          system: { surface: '#0f172a', text: '#e6eef8', muted: '#94a3b8', border: '#1f2a44' },
          dark: { surface: '#0b1220', text: '#e6eef8', muted: '#98a2b3', border: '#162232' },
          light: { surface: '#ffffff', text: '#0b1220', muted: '#6b7280', border: '#e6eef8' },
          sepia: { surface: '#fbf1e6', text: '#2b2b2b', muted: '#7b6f63', border: '#f0e6da' },
          solar: { surface: '#fff7ed', text: '#2a2a2a', muted: '#7a5a3c', border: '#f5e6d8' },
          midnight: { surface: '#071133', text: '#dbeafe', muted: '#93c5fd', border: '#0b2646' },
          soft: { surface: '#f7fafc', text: '#0b1220', muted: '#94a3b8', border: '#eef2f7' },
          contrast: { surface: '#000000', text: '#ffffff', muted: '#b3b3b3', border: '#222222' }
        };

        const acc = accents[accent] || accents['cyan'];
        const th = themes[theme] || themes['dark'];

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
        root.setProperty('--saipul-text', th.text);
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
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      storageService.set(SETTINGS_KEY, newSettings);
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