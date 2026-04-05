// Centralized configuration for settings UI (dynamic lists)
export const THEMES = [
  { value: 'system', label: 'System Auto' },
  { value: 'dark', label: 'Dark Mode' },
  { value: 'light', label: 'Light Mode' },
  { value: 'sepia', label: 'Sepia (Warm)' },
  { value: 'solar', label: 'Solar (Soft)' },
  { value: 'midnight', label: 'Midnight (Deep)' },
  { value: 'soft', label: 'Soft Light' },
  { value: 'contrast', label: 'High Contrast' }
];

export const PALETTES = {
  system: { surface: '#0f172a', text: '#e6eef8', muted: '#94a3b8', border: '#1f2a44' },
  dark: { surface: '#0b1220', text: '#e6eef8', muted: '#98a2b3', border: '#162232' },
  light: { surface: '#ffffff', text: '#0b1220', muted: '#6b7280', border: '#e6eef8' },
  sepia: { surface: '#fbf1e6', text: '#2b2b2b', muted: '#7b6f63', border: '#f0e6da' },
  solar: { surface: '#fff7ed', text: '#2a2a2a', muted: '#7a5a3c', border: '#f5e6d8' },
  midnight: { surface: '#071133', text: '#dbeafe', muted: '#93c5fd', border: '#0b2646' },
  soft: { surface: '#f7fafc', text: '#0b1220', muted: '#94a3b8', border: '#eef2f7' },
  contrast: { surface: '#000000', text: '#ffffff', muted: '#b3b3b3', border: '#222222' }
};

export const ACCENTS = [
  'cyan','blue','purple','green','orange','teal','rose','lime','amber','pink'
];

export const ACCENT_COLORS = {
  cyan: { accent: '#06b6d4', accent2: '#0891b2' },
  amber: { accent: '#f59e0b', accent2: '#d97706' },
  blue: { accent: '#2563eb', accent2: '#1e40af' },
  teal: { accent: '#0ea5a4', accent2: '#0f766e' },
  rose: { accent: '#fb7185', accent2: '#be185d' },
  lime: { accent: '#84cc16', accent2: '#65a30d' },
  purple: { accent: '#7c3aed', accent2: '#6d28d9' },
  green: { accent: '#10b981', accent2: '#059669' },
  orange: { accent: '#f59e0b', accent2: '#d97706' },
  pink: { accent: '#ec4899', accent2: '#db2777' }
};

export const LANGUAGES = [
  { value: 'auto', label: 'Auto (Indonesia/English)' },
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'English' },
  { value: 'id-en', label: 'Bilingual' }
];

export const AI_MODELS = [
  { value: 'basic', label: 'Basic (Cepat & Ringan)' },
  { value: 'enhanced', label: 'Enhanced (Rekomendasi)' },
  { value: 'advanced', label: 'Advanced (Akurasi Tinggi)' },
  { value: 'expert', label: 'Expert (Max Performance)' }
];

export const TOKEN_OPTIONS = [800, 1500, 2500, 4000];

export const FILE_SIZE_OPTIONS = [5, 10, 25, 50];

export const FILE_TYPE_PRESETS = [
  { value: 'txt,pdf,doc,docx,xls,xlsx,jpg,jpeg,png,json,csv,md', label: 'All Supported' },
  { value: 'txt,pdf,doc,docx', label: 'Documents Only' },
  { value: 'jpg,jpeg,png', label: 'Images Only' },
  { value: 'xls,xlsx,csv', label: 'Spreadsheets Only' }
];

export const CACHE_SIZES = [
  { value: 'small', label: 'Small (50MB)' },
  { value: 'medium', label: 'Medium (100MB)' },
  { value: 'large', label: 'Large (250MB)' },
  { value: 'unlimited', label: 'Unlimited' }
];

export const VOICE_DEFAULTS = {
  language: 'auto',
  rate: 1,
  pitch: 1
};

// Advanced NLP tuning options exposed to settings
export const NLP_TUNING = {
  spellMaxDist: 2,
  tfidfTopN: 5,
  tfidfMinScore: 0.01,
  factCheckerThreshold: 0.3,
  factCheckerSourceBoosts: { uploadedData: 1.5, AI: 1.2 }
};

export default {
  THEMES,
  ACCENTS,
  LANGUAGES,
  AI_MODELS,
  TOKEN_OPTIONS,
  FILE_SIZE_OPTIONS,
  FILE_TYPE_PRESETS,
  CACHE_SIZES,
  VOICE_DEFAULTS
};
