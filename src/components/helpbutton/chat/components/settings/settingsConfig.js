// Centralized configuration for settings UI (dynamic lists)
export const THEMES = [
  { value: 'system', label: 'System Auto' },
  { value: 'dark', label: 'Dark Mode' },
  { value: 'light', label: 'Light Mode' },
  { value: 'auto', label: 'Auto Switch' },
  { value: 'sepia', label: 'Sepia (Warm)' },
  { value: 'solar', label: 'Solar (Soft)' },
  { value: 'midnight', label: 'Midnight (Deep)' },
  { value: 'soft', label: 'Soft Light' },
  { value: 'contrast', label: 'High Contrast' }
];

export const ACCENTS = [
  'cyan','blue','purple','green','orange','teal','rose','lime','amber','pink'
];

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
