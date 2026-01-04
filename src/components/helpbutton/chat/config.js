// Central config for chatbot small metadata
export const CHATBOT_VERSION = "7.1.0";
export const AI_DOCS_PATH = "/help/docs/ai";

// Default runtime settings used by the local chatbot UI
export const DEFAULT_SETTINGS = {
  // UI / general
  activeTab: 'umum',
  theme: 'system',
  accent: 'cyan',
  language: 'auto',
  aiModel: 'enhanced',

  // behaviour
  calculationPrecision: 'high',
  enablePredictions: true,
  dataAnalysis: true,
  memoryContext: true,
  autoSuggestions: true,
  voiceResponse: false,
  privacyMode: false,
  advancedMath: true,
  creativeMode: false,
  // preferred response style: null = auto, or one of ['concise','formal','friendly','technical','humorous','terse','elaborate','poetic','empathetic','step-by-step']
  responseStyle: null,
  responseSpeed: 'balanced',
  temperature: 0.7,
  maxTokens: 1500,
  enableFileUpload: true,
  useUploadedData: true,
  maxFileSize: 10,
  allowedFileTypes: ['txt','md','csv','json','pdf','doc','docx','xls','xlsx','jpg','jpeg','png'],
  extractTextFromImages: false,
  processSpreadsheets: true,
  autoSave: true,
  backupInterval: 30,
  enableAnalytics: false,
  batterySaver: false,
  hardwareAcceleration: true,
  cacheSize: 'medium',
  realTimeProcessing: true,
  // Storage/backup: when true, archive every conversation snapshot to 'saipul_chat_archive'
  storeAllConversations: false,

  // TTS
  voiceLanguage: 'auto',
  voiceRate: 1,
  voicePitch: 1,

  // shortcuts
  shortcuts: {
    send: 'Ctrl+Enter',
    clear: 'Ctrl+K',
    export: 'Ctrl+E',
    openSettings: 'Ctrl+Shift+S',
    focusInput: 'Ctrl+Shift+F',
    regenerate: 'Ctrl+R',
    openUpload: 'Ctrl+Shift+U',
    toggleSpeech: 'Ctrl+Shift+M'
  }
};

// Auto-training defaults
// trigger: 'always' | 'heuristic' | 'on_feedback'
DEFAULT_SETTINGS.autoTraining = true;
DEFAULT_SETTINGS.autoTrainingTrigger = 'always';
DEFAULT_SETTINGS.autoTrainingHeuristicConfidence = 0.8; // used when trigger='heuristic'

// Hukum mutlak untuk pembuatan respons (dipatuhi oleh engine)
export const ABSOLUTE_RESPONSE_RULES = [
  'Tidak membuat atau mengarang fakta yang tidak dapat diverifikasi; jika tidak yakin, nyatakan ketidakpastian dan minta klarifikasi.',
  'Tidak mengungkapkan atau menyimpulkan data pribadi/sensitif tentang individu (PII).',
  'Tidak memberikan bantuan untuk aktivitas ilegal, berbahaya, atau membahayakan keselamatan.'
];

// Hukum mutlak untuk pemerosesan input pengguna
export const ABSOLUTE_INPUT_RULES = [
  'Input yang mengandung data sensitif (KTP/NIK, nomor kartu, password, CVV, nomor rekening) harus ditolak dan pengguna diberi instruksi untuk merahasiakannya.',
  'Batasi panjang input dan sanitasi konten; potong input yang sangat panjang dan beri tahu pengguna.',
  'Jangan menyimpan atau mengarsipkan data sensitif ketika `privacyMode` aktif; redaksi/anonimisasi sebelum persistensi.'
];

export default {
  CHATBOT_VERSION,
  AI_DOCS_PATH,
  DEFAULT_SETTINGS
};

