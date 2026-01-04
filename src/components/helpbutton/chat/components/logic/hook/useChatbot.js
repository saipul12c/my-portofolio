import { useState, useEffect, useCallback, useRef } from 'react';
import { getSmartReply } from '../utils/responseGenerator';
import { sanitizeInput, classifyInput, addTrainingExample, containsPII, extractThemes } from '../utils/helpers';
import { DEFAULT_SETTINGS, CHATBOT_VERSION } from '../../../config.js';
import { storageService } from '../utils/storageService';

const DEFAULT_KB = {
  AI: {},
  hobbies: [],
  cards: [],
  certificates: [],
  collaborations: [],
  interests: {},
  profile: {},
  softskills: [],
  uploadedData: [],
  fileMetadata: []
};

// Human-friendly messages used across the chatbot for failures and greetings
const FRIENDLY_MESSAGES = {
  greetings: [
    'Halo! 👋 Senang bertemu lagi — mau mulai dari mana hari ini?',
    'Hai! Aku siap membantu. Mau tanya tentang data, hitungan, atau upload file?',
    'Selamat datang kembali! Butuh bantuan menganalisis data atau menjawab pertanyaan teknis?'
  ],
  responseError: 'Maaf, saya mengalami kesulitan memproses permintaan Anda saat ini. Coba lagi sebentar, atau klik "Regenerate" jika tersedia. Jika masalah terus muncul, coba ringkas pertanyaan Anda atau upload file terkait.',
  networkError: 'Sepertinya koneksi terputus. Mohon periksa jaringan Anda lalu coba lagi.',
  ttsError: 'Fitur suara tidak tersedia atau terjadi kesalahan pada browser Anda. Silakan periksa pengaturan suara atau matikan opsi suara di pengaturan.',
  saveError: 'Gagal menyimpan riwayat percakapan. Periksa ruang penyimpanan browser atau mode privasi Anda.',
  exportError: 'Gagal mengekspor chat. Coba lagi atau periksa izin unduhan pada browser Anda.',
  sensitiveDataRejected: '⚠️ Saya tidak dapat menerima data sensitif lewat chat. Hapus informasi seperti nomor kartu, NIK, atau password dan coba lagi.',
  fileUploadError: 'Terjadi masalah saat mengunggah file. Pastikan format didukung dan ukuran tidak melebihi batas, lalu coba lagi.',
  unknownError: 'Ups, terjadi kesalahan yang tidak terduga. Silakan coba lagi nanti atau laporkan masalah ini.',
  reportSaved: reason => `Terima kasih — laporan Anda telah diterima. Tim akan meninjau. (Alasan: ${reason || 'Tidak diberikan'})`
};

export function useChatbot(knowledgeBase, knowledgeStats) {
    // Integrasi Gemini: update pesan bot jika event Gemini diterima
    useEffect(() => {
      const handleGeminiResponse = (event) => {
        const { input, response } = event.detail || {};
        if (input && response) {
          setMessages((prev) => {
            // Cari pesan bot yang placeholder/fallback
            const idx = prev.findIndex(m => m.from === 'bot' && m.text.includes('Maaf, saya belum punya jawaban spesifik'));
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = {
                ...updated[idx],
                text: response,
                type: 'response-gemini'
              };
              return updated;
            }
            // Jika tidak ada, tambahkan sebagai pesan baru
            return [...prev, {
              id: `msg_${Date.now()}_${Math.floor(Math.random()*10000)}`,
              from: 'bot',
              text: response,
              timestamp: new Date().toISOString(),
              type: 'response-gemini'
            }];
          });
        }
      };
      window.addEventListener('saipul_chat_gemini', handleGeminiResponse);
      return () => window.removeEventListener('saipul_chat_gemini', handleGeminiResponse);
    }, []);
  const [kbState, setKbState] = useState(() => ({ ...DEFAULT_KB, ...(knowledgeBase || {}) }));

  const [messages, setMessages] = useState(() => {
    try {
      const saved = storageService.get("saipul_chat_history");
      const savedVersion = storageService.get("saipul_chat_version");
      if (saved && savedVersion === CHATBOT_VERSION && Array.isArray(saved)) {
        return saved.map(m => ({
          ...m,
          id: m.id || `msg_${Date.now()}_${Math.floor(Math.random()*10000)}`
        }));
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
    
    const greet = FRIENDLY_MESSAGES.greetings[Math.floor(Math.random() * FRIENDLY_MESSAGES.greetings.length)];
    return [{
      from: "bot",
      text: `${greet}\n\nVersi: v${CHATBOT_VERSION}\n\n• 🧮 Matematika dan Analisis Data\n• 📁 Upload & Proses Multi-format\n• 🤖 Knowledge Base Dinamis\n\nKnowledge base saat ini: ${knowledgeStats ? (knowledgeStats.totalItems || 0) : 0} item dari ${knowledgeStats ? (knowledgeStats.totalCategories || 0) : 0} kategori.\n\nAda yang bisa kubantu hari ini?`,
      timestamp: new Date().toISOString(),
      type: "welcome",
      data: { knowledgeStats }
    }];
  });

  const [input, setInput] = useState("");
  const [lastInputType, setLastInputType] = useState(() => ({ type: null, confidence: 0 }));
  const [profile, setProfile] = useState(() => {
    try { return storageService.get('saipul_profile', {}); } catch (e) { void e; return {}; }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(true);
  const [conversationContext, setConversationContext] = useState([]);
  const [activeQuickActions, setActiveQuickActions] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [feedbackStore, setFeedbackStore] = useState(() => {
    try { return storageService.get('saipul_feedback_store', {}); } catch (e) { void e; return {}; }
  });
  const [frequentQuestions, setFrequentQuestions] = useState(() => {
    try { return storageService.get('saipul_question_stats', {}); } catch (e) { void e; return {}; }
  });
  const [anomalies, setAnomalies] = useState(() => {
    try { return storageService.get('saipul_chat_anomalies', []); } catch (e) { void e; return []; }
  });

  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS }));

  const [isHidden, setIsHidden] = useState(false);
  const lastBotMessageIdRef = useRef(null);
  const pendingTrainingRef = useRef([]); // for trigger='on_feedback'
  const suggestionTimerRef = useRef(null);
  const closedForBotIdRef = useRef(null);
  const userQuestionCounterRef = useRef(Number(storageService.get('saipul_question_counter', 0)));
  const audioCacheRef = useRef(new Map()); // messageId -> { text }
  const playingMessageIdRef = useRef(null);

  useEffect(() => {
    try {
      const savedSettings = storageService.get("saipul_settings");
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...savedSettings }));
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  }, []);

  // profile updates from settings UI
  useEffect(() => {
    const handler = (e) => {
      try {
        const payload = e?.detail || {};
        const next = { ...(profile || {}), ...payload };
        setProfile(next);
        try { storageService.set('saipul_profile', next); } catch (_e) { void _e; }
      } catch (err) { void err; }
    };
    window.addEventListener('saipul_profile_updated', handler);
    return () => window.removeEventListener('saipul_profile_updated', handler);
  }, [profile]);

  // Ensure :root CSS variables follow saved settings so chat UI matches chosen theme/accent
  useEffect(() => {
    const applyPalette = (theme, accent) => {
      try {
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
        // aliases for components that reference alternate variable names
        root.setProperty('--saipul-accent-1', acc.accent);
        root.setProperty('--saipul-accent-contrast', acc.accent2);
        root.setProperty('--saipul-modal-bg', th.surface);
        root.setProperty('--saipul-surface', th.surface);
        root.setProperty('--saipul-text', th.text);
        root.setProperty('--saipul-muted', th.muted);
        root.setProperty('--saipul-border', th.border);
        root.setProperty('--saipul-button-hover', acc.accent2 + '33');
        root.setProperty('--saipul-muted-text', th.muted);
      } catch (err) {
        console.warn('applyPalette error', err);
      }
    };

    // apply once using initial settings state
    applyPalette(settings.theme, settings.accent);
  }, [settings.theme, settings.accent]);

  // Update quick actions based on latest messages and knowledge base
  const updateQuickActions = useCallback(() => {
    const lastMessage = messages[messages.length - 1];
    let actions = [];

    if (!lastMessage || lastMessage.from === "user") {
      actions = [
        { icon: 'Calculator', label: "Matematika", action: "Hitung integral x^2 dx dari 0 sampai 1" },
        { icon: 'Brain', label: "AI Knowledge", action: "Jelaskan tentang neural network" },
        { icon: 'FileText', label: "Data Info", action: "Tampilkan knowledge base yang tersedia" }
      ];
    } else if (lastMessage.text && (lastMessage.text.includes('matematika') || lastMessage.text.includes('hitung'))) {
      actions = [
        { icon: 'Calculator', label: "Kalkulus", action: "Hitung turunan dari sin(x) + cos(x)" },
        { icon: 'BarChart3', label: "Statistik", action: "Hitung rata-rata 10, 20, 30, 40, 50" },
        { icon: 'TrendingUp', label: "Analisis", action: "Analisis data statistik untuk 100, 200, 150" }
      ];
    } else if (lastMessage.text && (lastMessage.text.includes('AI') || lastMessage.text.includes('machine learning'))) {
      actions = [
        { icon: 'Brain', label: "Deep Learning", action: "Apa perbedaan AI dan machine learning?" },
        { icon: 'Settings', label: "Neural Network", action: "Jelaskan tentang convolutional neural network" },
        { icon: 'TrendingUp', label: "Prediksi", action: "Buat prediksi perkembangan AI 5 tahun ke depan" }
      ];
    } else {
      if (kbState.hobbies.length > 0) {
        actions.push({ icon: 'Brain', label: "Hobi", action: `Ceritakan tentang ${kbState.hobbies[0]?.title}` });
      }
      if (kbState.certificates.length > 0) {
        actions.push({ icon: 'FileText', label: "Sertifikat", action: `Apa itu ${kbState.certificates[0]?.name}` });
      }
      actions.push({ icon: 'Upload', label: "Upload File", action: "upload_file" });
    }

    setActiveQuickActions(actions.slice(0, 3));
  }, [kbState, messages]);

  // Debounced / throttled persistence to avoid UI freeze when messages array grows large
  const pendingSaveRef = useRef(null);
  // sanitize messages before persisting to avoid storing large binary data
  const sanitizeMessageForPersist = (m) => {
    if (!m || typeof m !== 'object') return m;
    const copy = { ...m };
    // Remove or redact large fields commonly used for file contents
    if (copy.fileData) {
      copy.fileData = '[REDACTED_FILE_CONTENT]';
    }
    if (copy.fileBlob) {
      delete copy.fileBlob;
    }
    if (copy.base64) {
      copy.base64 = '[REDACTED_BASE64]';
    }
    if (copy.attachments && Array.isArray(copy.attachments)) {
      copy.attachments = copy.attachments.map(a => ({ fileName: a.fileName, fileSize: a.fileSize, extension: a.extension }));
    }
    return copy;
  };
  useEffect(() => {
    // Update conversation context cheaply
    if (settings.memoryContext) {
      const recentMessages = messages.slice(-8).map(msg => ({
        role: msg.from,
        content: msg.text,
        timestamp: msg.timestamp,
        type: msg.type
      }));
      setConversationContext(recentMessages);
    }

    // Update quick actions (cheap operation)
    try { updateQuickActions(); } catch (e) { void e; }

    // Avoid saving when privacyMode or hidden
    if (settings.privacyMode || isHidden || !settings.autoSave) return;

    // clear any pending timer
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current);
      pendingSaveRef.current = null;
    }

    // schedule a save after a short delay, batching rapid updates
    pendingSaveRef.current = setTimeout(() => {
      try {
        // Only persist the last N messages to keep storage small
        const toPersist = messages.slice(-200);
        const sanitized = toPersist.map(sanitizeMessageForPersist);
        try {
          if (!settings.privacyMode) {
            storageService.set("saipul_chat_history", sanitized);
            storageService.set("saipul_chat_version", CHATBOT_VERSION);
          } else {
            // in privacy mode, avoid persisting chat history
            // keep only a minimal last-message summary
            const minimal = sanitized.slice(-1).map(m => ({ id: m.id, from: m.from, timestamp: m.timestamp, type: m.type }));
            storageService.set("saipul_chat_history", minimal);
            storageService.set("saipul_chat_version", CHATBOT_VERSION);
          }
        } catch (e) { console.warn('failed saving chat history', e); }

        // lightweight periodic backup metadata
        if (!settings.privacyMode && messages.length && messages.length % 50 === 0) {
          const backupData = {
            timestamp: new Date().toISOString(),
            messageCount: messages.length,
            messages: sanitized.slice(-100)
          };
          storageService.set('saipul_chat_backup', backupData);
        }

        // Archive snapshot only as summary (avoid storing entire huge arrays)
        try {
          if (!settings.privacyMode && settings.storeAllConversations) {
            const archiveKey = 'saipul_chat_archive';
            const existing = storageService.get(archiveKey, []);
            existing.push({ timestamp: new Date().toISOString(), messageCount: messages.length, sample: sanitized.slice(-50) });
            // cap archive to last 20 entries
            while (existing.length > 20) existing.shift();
            storageService.set(archiveKey, existing);
          }
        } catch (e) { console.warn('archive save failed', e); }
      } catch (e) {
        console.error("Error saving chat history:", e);
      }
      pendingSaveRef.current = null;
    }, 350);

    return () => {
      if (pendingSaveRef.current) {
        clearTimeout(pendingSaveRef.current);
        pendingSaveRef.current = null;
      }
    };
  }, [messages, settings.privacyMode, settings.memoryContext, isHidden, updateQuickActions, settings.storeAllConversations, settings.autoSave]);

  // Persist feedbackStore, question stats and anomalies whenever they change
  useEffect(() => {
    try { storageService.set('saipul_feedback_store', feedbackStore); } catch (e) { void e; }
  }, [feedbackStore]);
  useEffect(() => {
    try { storageService.set('saipul_question_stats', frequentQuestions); } catch (e) { void e; }
  }, [frequentQuestions]);
  useEffect(() => {
    try { storageService.set('saipul_chat_anomalies', anomalies); } catch (e) { void e; }
  }, [anomalies]);

  // Text-to-Speech: speak bot messages when enabled in settings
  useEffect(() => {
    if (!settings.voiceResponse) return;
    if (!('speechSynthesis' in window)) return;

    // speak the last bot message when it appears
    const last = messages.length ? messages[messages.length - 1] : null;
    if (!last || last.from !== 'bot' || !last.text) return;

    try {
    // cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(stripMarkup(last.text));
      // pick language from settings
      try {
        const lang = settings.voiceLanguage === 'id' || settings.language === 'id' ? 'id-ID' : (settings.voiceLanguage === 'en' || settings.language === 'en' ? 'en-US' : 'auto');
        if (lang !== 'auto') utter.lang = lang;
      } catch (_e) { void _e; }

      // gentle defaults (use settings if available)
      utter.rate = typeof settings.voiceRate === 'number' ? settings.voiceRate : (settings.rate || 1);
      utter.pitch = typeof settings.voicePitch === 'number' ? settings.voicePitch : (settings.pitch || 1);

      // if user selected a specific voice name, try to set it
      try {
        if (settings.voiceName && window.speechSynthesis.getVoices) {
          const v = window.speechSynthesis.getVoices().find(x => x.name === settings.voiceName);
          if (v) utter.voice = v;
        }
      } catch (_e) { void _e; }
      window.speechSynthesis.speak(utter);
    } catch (err) {
      console.warn('TTS error:', err);
    }

    // cleanup when component unmounts or messages change
    return () => {
      try { window.speechSynthesis.cancel(); } catch (_e) { void _e; }
    };
  }, [messages, settings.voiceResponse, settings.language, settings.voiceRate, settings.voicePitch, settings.voiceName, settings.voiceLanguage, settings.rate, settings.pitch]);

  // Per-message play/pause handling and basic caching
  useEffect(() => {
    const playHandler = (e) => {
      try {
        const id = e?.detail?.id;
        if (!id) return;
        const msg = messages.find(m => m.id === id);
        if (!msg) return;
        // prefer audio cache but fallback to SpeechSynthesis
        try { window.speechSynthesis.cancel(); } catch (_e) { void _e; }
        const utter = new SpeechSynthesisUtterance((msg.text || '').replace(/<[^>]*>/g, ''));
        try {
          const lang = settings.voiceLanguage === 'id' || settings.language === 'id' ? 'id-ID' : (settings.voiceLanguage === 'en' || settings.language === 'en' ? 'en-US' : 'auto');
          if (lang !== 'auto') utter.lang = lang;
        } catch (_e) { void _e; }
        utter.rate = typeof settings.voiceRate === 'number' ? settings.voiceRate : 1;
        utter.pitch = typeof settings.voicePitch === 'number' ? settings.voicePitch : 1;
        utter.onstart = () => { playingMessageIdRef.current = id; window.dispatchEvent(new CustomEvent('saipul_tts_playing', { detail: { id } })); };
        utter.onend = () => { playingMessageIdRef.current = null; window.dispatchEvent(new CustomEvent('saipul_tts_ended', { detail: { id } })); };
        utter.onerror = (err) => { console.warn('TTS play error', err); window.dispatchEvent(new CustomEvent('saipul_tts_error', { detail: { id, error: err } })); };
        window.speechSynthesis.speak(utter);
        // store simple cache entry to avoid re-synthesis attempt (text-only)
        try { audioCacheRef.current.set(id, { text: msg.text }); if (audioCacheRef.current.size > 200) { // cap cache
          const firstKey = audioCacheRef.current.keys().next().value; audioCacheRef.current.delete(firstKey);
        } } catch (_e) { void _e; }
      } catch (err) { console.error('playHandler error', err); }
    };

    const pauseHandler = () => {
      try { window.speechSynthesis.cancel(); playingMessageIdRef.current = null; } catch (e) { void e; }
    };

    window.addEventListener('saipul_play_message', playHandler);
    window.addEventListener('saipul_pause_message', pauseHandler);
    return () => {
      window.removeEventListener('saipul_play_message', playHandler);
      window.removeEventListener('saipul_pause_message', pauseHandler);
    };
  }, [messages, settings.voiceLanguage, settings.voiceRate, settings.voicePitch, settings.language]);

  // Helper to remove simple markdown/markdown-ish markup for clearer TTS
  function stripMarkup(text) {
    try {
      return String(text)
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();
      } catch (_e) { void _e; return text; }
  }

  // Global event to toggle speech (updates persisted settings so other hooks sync)
  useEffect(() => {
    const handler = () => {
      try {
        const parsed = storageService.get('saipul_settings', {});
        const newVal = !(parsed.voiceResponse === true);
        parsed.voiceResponse = newVal;
        storageService.set('saipul_settings', parsed);
        // update local state immediately
        setSettings(prev => ({ ...prev, voiceResponse: newVal }));
        // notify other components/hooks
        window.dispatchEvent(new CustomEvent('saipul_settings_updated', { detail: { key: 'voiceResponse', value: newVal } }));
      } catch (e) {
        console.error('Error toggling voiceResponse:', e);
      }
    };

    window.addEventListener('saipul_toggle_speech', handler);
    return () => window.removeEventListener('saipul_toggle_speech', handler);
  }, []);

  // Sync incoming knowledgeBase prop into local kb state
  useEffect(() => {
    try {
      setKbState(() => ({ ...DEFAULT_KB, ...(knowledgeBase || {}) }));
    } catch (e) {
      console.error('Error updating KB from props:', e);
    }
  }, [knowledgeBase]);

  // Listen for settings and KB updates dispatched elsewhere in the app
  useEffect(() => {
    const handleSettingsUpdate = () => {
      try {
        const savedSettings = storageService.get("saipul_settings");
        if (savedSettings) {
          setSettings(prev => ({ ...prev, ...savedSettings }));
        }
      } catch (err) {
        console.error("Error applying updated settings:", err);
      }
    };

    const handleKBUpdate = (e) => {
      try {
        // prefer payload if provided, fallback to storage
        const payload = e?.detail?.knowledgeBase;
        const uploaded = storageService.get("saipul_uploaded_data", []);
        const metadata = storageService.get("saipul_file_metadata", []);
        if (payload) {
          setKbState(() => ({ ...DEFAULT_KB, ...payload, uploadedData: uploaded, fileMetadata: metadata }));
        } else {
          setKbState(prev => ({ ...prev, uploadedData: uploaded, fileMetadata: metadata }));
        }
      } catch (err) {
        console.error("Error applying updated KB from storage:", err);
      }
    };

    window.addEventListener('saipul_settings_updated', handleSettingsUpdate);
    window.addEventListener('saipul_kb_updated', handleKBUpdate);
    window.addEventListener('storage', handleSettingsUpdate);

    return () => {
      window.removeEventListener('saipul_settings_updated', handleSettingsUpdate);
      window.removeEventListener('saipul_kb_updated', handleKBUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  const generateSuggestions = useCallback((lastBotMessage) => {
    const raw = typeof lastBotMessage === 'string' ? lastBotMessage : (lastBotMessage && lastBotMessage.text) || '';
    const text = (raw || '').toLowerCase().trim();
    let suggestions = [];

    // incorporate frequent user questions as dynamic suggestions (safe checks)
    try {
      const freqEntries = Object.entries(frequentQuestions || {});
      if (freqEntries.length > 0) {
        freqEntries.sort((a, b) => b[1] - a[1]);
        for (const [q] of freqEntries.slice(0, 3)) {
          if (!q) continue;
          const qLower = q.toLowerCase();
          // avoid adding suggestions that echo the last bot message
          if (text && qLower.includes(text.split(/\s+/).slice(0, 3).join(' '))) continue;
          if (!suggestions.includes(q)) suggestions.push(q);
        }
      }
    } catch (e) { void e; }

    // Heuristics based on last bot message content
    if (text.includes('hitung') || text.includes('matematika') || text.includes('integral')) {
      suggestions = [
        "Hitung integral x^3 + 2x dx",
        "Berapa hasil 123 * 45 / 6?",
        "Selesaikan persamaan linear 2x + 5 = 15"
      ];
    } else if (text.includes('analisis') || text.includes('data')) {
      suggestions = [
        "Analisis trend data penjualan",
        "Buat prediksi untuk kuartal depan",
        "Hitung statistik deskriptif"
      ];
    } else if (text.includes('ai') || text.includes('learning')) {
      if (kbState.AI && typeof kbState.AI === 'object') {
        const aiQuestions = Object.keys(kbState.AI).slice(0, 2);
        suggestions.push(...aiQuestions.filter(Boolean));
      }
      suggestions.push("Apa kelebihan deep learning?");
      suggestions.push("Bagaimana cara kerja GPT?");
    } else {
      if (kbState.hobbies && kbState.hobbies.length > 0) {
        suggestions.push(`Apa itu ${kbState.hobbies[0]?.title}`);
      }
      if (kbState.softskills && kbState.softskills.length > 0) {
        suggestions.push(`Jelaskan ${kbState.softskills[0]?.name}`);
      }
      suggestions.push("Upload file untuk ditambahkan ke knowledge base");
      suggestions.push("Tampilkan semua data yang tersedia");
    }

    // filter duplicates and empty entries, prefer most relevant
    const cleaned = Array.from(new Set(suggestions.filter(s => typeof s === 'string' && s.trim().length > 0)));
    return cleaned.slice(0, 4);
  }, [kbState, frequentQuestions]);
  useEffect(() => {
    // Generate suggestions after bot replies (show under bot response) with a delay
    if (!settings.autoSuggestions || messages.length === 0) return;
    // clear existing timer
    if (suggestionTimerRef.current) {
      clearTimeout(suggestionTimerRef.current);
      suggestionTimerRef.current = null;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.from === 'bot' && lastMessage.type !== 'error') {
      // track last bot id to allow close suppression
      lastBotMessageIdRef.current = lastMessage.id || null;

      // only schedule suggestions if user hasn't closed suggestions for this bot message
      if (closedForBotIdRef.current && closedForBotIdRef.current === lastBotMessageIdRef.current) {
        // user closed suggestions for this bot reply; do not re-open
        return;
      }

      suggestionTimerRef.current = setTimeout(() => {
        try {
          const suggestedQuestions = generateSuggestions(lastMessage.text || lastMessage);
          setSuggestions(suggestedQuestions);
          setSuggestionsVisible(true);
        } catch (e) { console.error('generate suggestions error', e); }
        suggestionTimerRef.current = null;
      }, 3000);
    }

    return () => {
      if (suggestionTimerRef.current) {
        clearTimeout(suggestionTimerRef.current);
        suggestionTimerRef.current = null;
      }
    };
  }, [messages, settings.autoSuggestions, kbState, generateSuggestions]);

  const generateBotReply = useCallback((userText, opts = {}) => {
    setIsTyping(true);

    const baseTime = settings.responseSpeed === 'fast' ? 600 :
                    settings.responseSpeed === 'thorough' ? 1800 : 1000;

    const complexityMultiplier = userText.length > 50 ? 1.3 : 1;
    const knowledgeMultiplier = userText.includes('upload') || userText.includes('file') ? 1.2 : 1;
    const typingTime = baseTime * complexityMultiplier * knowledgeMultiplier;

    try {
      // generate reply early so we can create a typing placeholder that reveals progressively
      const replyObj = getSmartReply(userText, settings, conversationContext, kbState, knowledgeStats);
      let replyText = typeof replyObj === 'string' ? replyObj : (replyObj && replyObj.text) || FRIENDLY_MESSAGES.responseError;

      // post-process reply text to improve presentation (clean up formatting, truncate preview)
      const postProcessBotText = (raw) => {
        try {
          if (!raw || typeof raw !== 'string') return { display: String(raw || ''), meta: {} };
          let s = String(raw).trim();

          // remove accidental repeated punctuation
          s = s.replace(/([.!?]){2,}/g, '$1');

          // collapse excessive blank lines to at most one empty line
          s = s.replace(/\n{3,}/g, '\n\n');

          // remove stray control chars
          s = s.replace(/[\x00-\x1F\x7F]/g, '');

          // normalize spaces around punctuation
          s = s.replace(/\s+([.,!?;:\)])/g, '$1');
          s = s.replace(/([\(\[] )/g, '$1');

          // trim long inline code fences or stack traces to keep preview readable
          const maxPreview = (settings && settings.previewLength) ? Number(settings.previewLength) : 1200;
          const meta = {};
          if (s.length > maxPreview) {
            meta.truncated = true;
            meta.full = s;
            // keep a friendly cut at sentence boundary
            const cut = s.slice(0, maxPreview);
            const lastSentenceEnd = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf('!'), cut.lastIndexOf('?'));
            const preview = lastSentenceEnd > Math.floor(maxPreview * 0.5) ? cut.slice(0, lastSentenceEnd + 1) : cut;
            s = preview.trim() + '\n\n...[Tampilkan selengkapnya]';
          }

          // small safety: redact obvious JSON-like dumps to avoid overwhelming UI
          if (/^{\s*"[\s\S]{10,}/.test(meta.full || s)) {
            meta.redacted = true;
            meta.full = meta.full || s;
            s = '[Hasil terlalu panjang / berformat data; klik untuk melihat detail]';
          }

          return { display: s, meta };
        } catch (e) { return { display: String(raw || ''), meta: {} }; }
      };

      const processed = postProcessBotText(replyText);
      const replyDisplayText = processed.display;
      const replyMetaFromPost = processed.meta || {};
      
      // Extract emotion and character data from replyObj
      const emotionData = replyObj?.emotion || null;
      const characterData = replyObj?.character || null;
      
      // enforce non-fabrication rule: prepend caution when confidence is low
      try {
        const conf = replyObj && typeof replyObj.confidence === 'number' ? replyObj.confidence : null;
        if (conf !== null && conf < 0.5) {
          replyText = `⚠️ Saya tidak sepenuhnya yakin terhadap jawaban ini. Mohon verifikasi sumber jika diperlukan.\n\n` + replyText;
        }
      } catch (_e) { void _e; /* ignore */ }

      // model -> characters per second (higher model => slower)
      const modelCps = {
        basic: 45,
        enhanced: 30,
        advanced: 20,
        expert: 12
      };
      const cps = modelCps[(settings.aiModel || 'enhanced')] || 30;

      // dynamic multi-loading variants
      const loadingVerbs = [
        'Memikirkan', 'Mengolah', 'Menganalisis', 'Menyusun jawaban', 'Mengindeks informasi',
        'Mengoptimalkan respons', 'Menggabungkan sumber', 'Memproses data'
      ];
      // generate a small unique list for this response
      const loadingVariants = Array.from({ length: 3 }, () => loadingVerbs[Math.floor(Math.random() * loadingVerbs.length)] + '...');

      // create placeholder typing message
      const placeholderId = `msg_typing_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
      const placeholder = {
        id: placeholderId,
        from: 'bot',
        text: '',
        timestamp: new Date().toISOString(),
        type: 'typing',
        emotion: emotionData,
        character: characterData,
        _meta: { expectedText: replyText, cps, loadingVariants, post: replyMetaFromPost }
      };

      setMessages(prev => {
        try {
          if (opts && opts.replaceMessageId) {
            // replace target message with placeholder
            const found = prev.some(m => m.id === opts.replaceMessageId);
            if (found) {
              return prev.map(m => m.id === opts.replaceMessageId ? placeholder : m);
            }
          }
        } catch (_e) { void _e; }
        return [...prev, placeholder];
      });
      window.dispatchEvent(new CustomEvent('saipul_chat_update', { detail: { type: 'typing_start', message: placeholder } }));

      // compute reveal duration based on cps and length, but respect typingTime minimum
      const estimatedRevealMs = Math.min(12000, Math.max(600, Math.ceil((replyText.length / cps) * 1000)));
      const finalDelay = Math.max(typingTime, estimatedRevealMs);

      // after delay, replace placeholder with final message (or alternatives)
      setTimeout(() => {
        try {
          const produceAlternatives = (userQuestionCounterRef.current || 0) % 20 === 0 && (userQuestionCounterRef.current || 0) !== 0;
          if (produceAlternatives) {
            try { window.dispatchEvent(new CustomEvent('saipul_telemetry', { detail: { event: 'alternatives_generated', count: 2, userQuestionCounter: userQuestionCounterRef.current } })); } catch (_e) { void _e; }
            const altId = `alt_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
            const styleA = 'friendly';
            const styleB = 'technical';
            const replyA = getSmartReply(userText, { ...settings, responseStyle: styleA }, conversationContext, kbState, knowledgeStats);
            const replyB = getSmartReply(userText, { ...settings, responseStyle: styleB, temperature: (settings.temperature || 0.7) + 0.1 }, conversationContext, kbState, knowledgeStats);

            const textA = typeof replyA === 'string' ? replyA : (replyA && replyA.text) || FRIENDLY_MESSAGES.responseError;
            const textB = typeof replyB === 'string' ? replyB : (replyB && replyB.text) || FRIENDLY_MESSAGES.responseError;
            
            const emotionDataA = replyA?.emotion || null;
            const characterDataA = replyA?.character || null;
            const emotionDataB = replyB?.emotion || null;
            const characterDataB = replyB?.character || null;

            // process alternatives for presentation
            const procA = postProcessBotText ? postProcessBotText(textA) : null;
            const procB = postProcessBotText ? postProcessBotText(textB) : null;

            const botMsgA = {
              id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
              from: 'bot',
              text: (procA && procA.display) ? procA.display : textA,
              timestamp: new Date().toISOString(),
              type: 'response',
              emotion: emotionDataA,
              character: characterDataA,
              _meta: Object.assign({ altGroup: altId, altIndex: 0 }, procA && procA.meta ? { post: procA.meta } : {})
            };

            const botMsgB = {
              id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
              from: 'bot',
              text: (procB && procB.display) ? procB.display : textB,
              timestamp: new Date().toISOString(),
              type: 'response',
              emotion: emotionDataB,
              character: characterDataB,
              _meta: procB && procB.meta ? { post: procB.meta } : {}
            };

            setMessages(prev => prev.map(m => m.id === placeholderId ? botMsgA : m).concat(botMsgB));
            window.dispatchEvent(new CustomEvent('saipul_chat_update', { detail: { type: 'new_bot_message', message: botMsgA } }));
            window.dispatchEvent(new CustomEvent('saipul_chat_update', { detail: { type: 'new_bot_message', message: botMsgB } }));
          } else {
            const botMsg = {
              id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
              from: 'bot',
              text: replyDisplayText || replyText,
              timestamp: new Date().toISOString(),
              type: 'response',
              emotion: emotionData,
              character: characterData,
              _meta: Object.assign({}, (typeof replyObj === 'object' && replyObj ? {
                source: replyObj.source || null,
                confidence: typeof replyObj.confidence === 'number' ? replyObj.confidence : null
              } : {}), replyMetaFromPost ? { post: replyMetaFromPost } : {})
            };

            setMessages(prev => prev.map(m => m.id === placeholderId ? botMsg : m));
            window.dispatchEvent(new CustomEvent('saipul_chat_update', { detail: { type: 'new_bot_message', message: botMsg } }));
          }
        } catch (error) {
          console.error('Error generating bot reply:', error);
          setMessages(prev => prev.map(m => m.id === placeholderId ? {
            id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            from: 'bot',
            text: FRIENDLY_MESSAGES.responseError,
            timestamp: new Date().toISOString(),
            type: 'error'
          } : m));
        } finally {
          setIsTyping(false);
        }
      }, finalDelay);
    } catch (err) {
      console.error('generateBotReply error', err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        from: 'bot',
          text: FRIENDLY_MESSAGES.responseError,
        timestamp: new Date().toISOString(),
        type: 'error'
      }]);
    }
  }, [settings, conversationContext, kbState, knowledgeStats]);

  // Listen for report events dispatched from ReportModal or elsewhere
  useEffect(() => {
    const handleReport = (e) => {
      try {
        const payload = e?.detail || {};
        const messageId = payload.messageId;
        // find message in current messages
        const message = messages.find(m => m.id === messageId) || null;

        const enriched = {
          id: `report_${Date.now()}_${Math.floor(Math.random()*10000)}`,
          messageId,
          messageText: message ? message.text : null,
          messageMeta: message ? message._meta : null,
          reason: payload.reason || null,
          severity: payload.severity || 'medium',
          details: payload.details || [],
          containsPersonalData: !!payload.containsPersonalData,
          allowContact: !!payload.allowContact,
          contactInfo: payload.contactInfo || '',
          context: conversationContext.slice(-8),
          settingsSnapshot: settings,
          knowledgeStats: knowledgeStats,
          timestamp: payload.timestamp || new Date().toISOString()
        };

        try {
          if (!settings.privacyMode) {
            const stored = storageService.get('saipul_chat_reports', []);
            stored.push(enriched);
            storageService.set('saipul_chat_reports', stored);
          } else {
            // In privacy mode, do not persist reports with potentially sensitive contact info
            try {
              const stored = storageService.get('saipul_chat_reports', []);
              const temp = { ...enriched, redacted: true };
              delete temp.contactInfo;
              temp.allowContact = false;
              stored.push(temp);
              // still avoid overwriting existing persisted reports with sensitive data; keep minimal local record
              storageService.set('saipul_chat_reports', stored);
            } catch (_e) { void _e; /* best-effort: ignore */ }
          }
        } catch (err) {
          console.error('Failed to save chat report', err);
        }

        // update feedbackStore with report count for this message
        try {
          setFeedbackStore(prev => {
            const next = { ...(prev || {}) };
            next[messageId] = next[messageId] || { like: 0, dislike: 0, regen: 0, reports: 0 };
            next[messageId].reports = (next[messageId].reports || 0) + 1;
            return next;
          });
        } catch (e) { void e; }

        // simple anomaly extraction from reported message text
        try {
          if (message && message.text) {
            const caps = Array.from(new Set(message.text.match(/\b[A-Z][a-z]{2,}\b/g) || []));
            if (caps.length > 0) {
              setAnomalies(prev => {
                const next = [...prev];
                next.push({ id: `anom_${Date.now()}`, messageId, entities: caps, text: message.text, ts: new Date().toISOString() });
                return next;
              });
            }
          }
        } catch (e) { void e; }

        // Show a friendly confirmation message to the user
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_${Math.floor(Math.random()*10000)}`,
          from: 'bot',
          text: FRIENDLY_MESSAGES.reportSaved(enriched.reason),
          timestamp: new Date().toISOString(),
          type: 'notice'
        }]);

        // notify other parts
        try { window.dispatchEvent(new CustomEvent('saipul_report_saved', { detail: enriched })); } catch (_e) { void _e; }
      } catch (err) {
        console.error('Error handling saipul_chat_report', err);
      }
    };

    window.addEventListener('saipul_chat_report', handleReport);
    return () => window.removeEventListener('saipul_chat_report', handleReport);
  }, [messages, conversationContext, settings, knowledgeStats]);

  const handleSend = useCallback(() => {
    const clean = sanitizeInput(input || '');
    if (!clean || !clean.trim()) return;

    // Enforce input rules: reject sensitive personal data in user input (use contextual detector)
    try {
      if (containsPII(clean)) {
        setMessages(prev => [...prev, {
          id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          from: 'bot',
          text: FRIENDLY_MESSAGES.sensitiveDataRejected,
          timestamp: new Date().toISOString(),
          type: 'notice'
        }]);
        return;
      }
    } catch (e) { void e; }

    // classify input type (question/information/statement) without changing existing behavior
    let classification = { type: 'statement', confidence: 0.6 };
    try {
      classification = classifyInput(clean || '');
      setLastInputType(classification);
    } catch (e) { void e; }

    const userMsg = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      from: "user",
      text: clean,
      intent: classification || { type: 'statement', confidence: 0.6 },
      timestamp: new Date().toISOString(),
      type: "text"
    };

    setMessages((prev) => [...prev, userMsg]);
    // do not show suggestions while awaiting bot reply; they will be updated after bot responds
    setSuggestionsVisible(false);
    const userInput = clean;
    setInput("");
    // increment user question counter for alternative-response feature and persist
    try {
      userQuestionCounterRef.current = (userQuestionCounterRef.current || 0) + 1;
      try { storageService.set('saipul_question_counter', String(userQuestionCounterRef.current)); } catch (_e) { void _e; }
    } catch (e) { void e; }
    // learn from user interaction: increment question frequency
    try {
      const key = userInput.trim().toLowerCase();
      setFrequentQuestions(prev => {
        const next = { ...(prev || {}) };
        next[key] = (next[key] || 0) + 1;
        return next;
      });
    } catch (e) { void e; }

    // Auto-training logic
    try {
      if (settings && settings.autoTraining && !settings.privacyMode) {
        const trigger = settings.autoTrainingTrigger || 'always';
        if (trigger === 'always') {
          try { addTrainingExample(clean, classification.type); } catch (_e) { void _e; }
        } else if (trigger === 'heuristic') {
          const minConf = typeof settings.autoTrainingHeuristicConfidence === 'number' ? settings.autoTrainingHeuristicConfidence : 0.8;
          if ((classification.confidence || 0) >= minConf) {
            try { addTrainingExample(clean, classification.type); } catch (_e) { void _e; }
          }
        } else if (trigger === 'on_feedback') {
          // queue pending example; will be saved when user gives positive feedback on bot reply
          pendingTrainingRef.current.push({ text: clean, label: classification.type, ts: Date.now() });
          // cap pending queue
          if (pendingTrainingRef.current.length > 200) pendingTrainingRef.current.shift();
        }
      }
    } catch (err) { void err; }
    generateBotReply(userInput);
  }, [input, generateBotReply, settings]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "ArrowUp" && !input.trim()) {
      e.preventDefault();
      const userMessages = messages.filter(m => m.from === "user");
      if (userMessages.length > 0) {
        setInput(userMessages[userMessages.length - 1].text);
      }
    }
  };

  // On mobile: hide suggestions UI when user types something that matches a suggestion.
  // On desktop: keep suggestions visible while typing.
  useEffect(() => {
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
    if (!input || !input.trim()) {
      setSuggestionsVisible(true);
      return;
    }

    if (isMobile && suggestions && suggestions.length > 0) {
      const v = input.trim().toLowerCase();
      const matched = suggestions.some(s => typeof s === 'string' && (s.toLowerCase().includes(v) || v.includes(s.toLowerCase())));
      if (matched) setSuggestionsVisible(false);
    }
    // desktop: leave suggestionsVisible as-is (do not auto-hide)
  }, [input, suggestions]);

  const clearChat = useCallback(() => {
    const greet = FRIENDLY_MESSAGES.greetings[Math.floor(Math.random() * FRIENDLY_MESSAGES.greetings.length)];
    setMessages([{ 
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      from: "bot", 
      text: `${greet} \n\nRiwayat percakapan telah dibersihkan. Ada yang bisa kubantu analisis, hitung, atau proses hari ini?`,
      timestamp: new Date().toISOString(),
      type: "welcome"
    }]);
    if (!settings.privacyMode) {
      localStorage.removeItem("saipul_chat_history");
      localStorage.removeItem("saipul_chat_version");
    }
  }, [settings.privacyMode]);

  const exportChat = useCallback(() => {
    try {
      const chatData = {
        exportDate: new Date().toISOString(),
        messageCount: messages.length,
        knowledgeStats: knowledgeStats,
        settings: settings,
        messages: messages
      };

      const dataStr = JSON.stringify(chatData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `saipulai-chat-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        from: "bot",
        text: "✅ **Chat berhasil diexport!**\n\nFile telah didownload dengan semua riwayat percakapan dan metadata.",
        timestamp: new Date().toISOString(),
        type: "success"
      }]);
    } catch (error) {
      console.error("Error exporting chat:", error);
      setMessages(prev => [...prev, {
        id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        from: "bot",
        text: FRIENDLY_MESSAGES.exportError,
        timestamp: new Date().toISOString(),
        type: "error"
      }]);
    }
  }, [messages, knowledgeStats, settings]);

  // Generate a concise session summary (topics, key questions, important answers)
  const generateSessionSummary = useCallback((opts = {}) => {
    try {
      const msgs = Array.isArray(opts.messages) ? opts.messages : messages || [];
      if (msgs.length === 0) return null;

      const sessionStart = msgs[0].timestamp || new Date().toISOString();
      const sessionEnd = msgs[msgs.length - 1].timestamp || new Date().toISOString();

      const userMsgs = msgs.filter(m => m.from === 'user' && m.text).map(m => ({ content: m.text, timestamp: m.timestamp }));
      const botMsgs = msgs.filter(m => m.from === 'bot' && m.text).map(m => ({ content: m.text, timestamp: m.timestamp }));

      // extract themes from user messages (helper)
      const themes = extractThemes(userMsgs || []);

      // key questions: messages classified as question or ending with '?'
      const keyQuestions = userMsgs.filter(u => (/\?$/.test(u.content) || (classifyInput(u.content || '').type === 'question'))).map(u => u.content).slice(-10);

      // pick representative bot answers for those questions (naive match: find next bot message after question)
      const answers = [];
      for (const q of keyQuestions) {
        const idx = msgs.findIndex(m => m.from === 'user' && m.text === q);
        if (idx !== -1) {
          // find next bot reply
          for (let j = idx + 1; j < msgs.length; j++) {
            if (msgs[j].from === 'bot' && msgs[j].text) { answers.push({ question: q, answer: msgs[j].text }); break; }
          }
        }
      }

      const summaryTextParts = [];
      summaryTextParts.push(`Ringkasan sesi: ${sessionStart} -> ${sessionEnd}`);
      summaryTextParts.push(`Topik: ${themes && themes.length ? themes.join(', ') : 'Umum'}`);
      if (keyQuestions.length) {
        summaryTextParts.push('Pertanyaan utama:');
        keyQuestions.forEach(k => summaryTextParts.push('- ' + k));
      } else {
        summaryTextParts.push('Pertanyaan utama: Tidak ada pertanyaan eksplisit.');
      }

      if (answers.length) {
        summaryTextParts.push('Jawaban representatif:');
        answers.slice(0, 6).forEach(a => summaryTextParts.push(`- Q: ${a.question}\n  A: ${a.answer}`));
      }

      // append quick follow-ups based on frequent questions
      try {
        const topFreq = Object.entries(frequentQuestions || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
        if (topFreq.length) {
          summaryTextParts.push('Saran tindak lanjut / pertanyaan populer:');
          topFreq.forEach(t => summaryTextParts.push('- ' + t));
        }
      } catch (_e) { void _e; }

      const summaryText = summaryTextParts.join('\n');

      // persist summary in storage (cap to last 50 summaries)
      try {
        const key = 'saipul_chat_summaries_v1';
        const existing = storageService.get(key, []);
        const next = Array.isArray(existing) ? existing.slice() : [];
        const entry = { id: `summary_${Date.now()}`, ts: new Date().toISOString(), start: sessionStart, end: sessionEnd, themes, keyQuestions, answers, summaryText };
        next.push(entry);
        while (next.length > 50) next.shift();
        storageService.set(key, next);
      } catch (e) { console.warn('failed to save chat summary', e); }

      return { summaryText, themes, keyQuestions, answers };
    } catch (err) {
      console.error('generateSessionSummary error', err);
      return null;
    }
  }, [messages, frequentQuestions]);

  // Recall top previous questions (memory) — friendly API used by UI to show remembered queries
  const recallPreviousQuestions = useCallback((count = 5) => {
    try {
      const freq = { ...(frequentQuestions || {}) };
      const arr = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, count).map(e => ({ question: e[0], count: e[1] }));
      return arr;
    } catch (e) { return []; }
  }, [frequentQuestions]);

  // auto-generate a session summary when chat session ends
  useEffect(() => {
    const handleSessionEnd = (e) => {
      try {
        const result = generateSessionSummary({ messages });
        if (result && result.summaryText) {
          // post a short notice into chat (non-persistent if privacyMode)
          setMessages(prev => [...prev, {
            id: `msg_${Date.now()}_${Math.floor(Math.random()*10000)}`,
            from: 'bot',
            text: `📋 Ringkasan sesi:\n${result.summaryText.split('\n').slice(0,6).join('\n')}\n\nKetik 'lihat ringkasan' atau klik tombol Ringkasan untuk melihat detail.`,
            timestamp: new Date().toISOString(),
            type: 'summary_notice'
          }]);
        }
      } catch (err) { console.error('handleSessionEnd error', err); }
    };

    window.addEventListener('saipul_chat_end', handleSessionEnd);
    return () => window.removeEventListener('saipul_chat_end', handleSessionEnd);
  }, [generateSessionSummary, messages]);

  const reportIssue = useCallback((details) => {
    setMessages((prev) => [...prev, {
      id: `msg_${Date.now()}_${Math.floor(Math.random()*10000)}`,
      from: "user",
      text: `Laporan diterima: ${details}`,
      timestamp: new Date().toISOString(),
      type: "report"
    }]);
    console.log("Issue reported:", details);
  }, []);

  // Record simple feedback about messages (like/dislike/regenerate/report)
  const recordFeedback = useCallback((messageId, type = 'like') => {
    try {
      setFeedbackStore(prev => {
        const next = { ...(prev || {}) };
        next[messageId] = next[messageId] || { like: 0, dislike: 0, regen: 0 };
        if (type === 'like') next[messageId].like += 1;
        else if (type === 'dislike') next[messageId].dislike += 1;
        else if (type === 'regen') next[messageId].regen += 1;
        return next;
      });

      // If negative feedback, record simple anomalies from capitalized tokens
      if (type === 'dislike' || type === 'report') {
        const msg = messages.find(m => m.id === messageId);
        if (msg && msg.text) {
          const caps = Array.from(new Set(msg.text.match(/\b[A-Z][a-z]{2,}\b/g) || []));
          if (caps.length > 0) {
            setAnomalies(prev => {
              const next = [...prev];
              next.push({ id: `anom_${Date.now()}`, messageId, entities: caps, text: msg.text, ts: new Date().toISOString() });
              return next;
            });
          }
        }
      }

      // If positive feedback and auto-training is configured to 'on_feedback', persist queued example or find the related user message
      if (type === 'like') {
        try {
          if (settings && settings.autoTraining && !settings.privacyMode && settings.autoTrainingTrigger === 'on_feedback') {
            // look for pending example that matches recent user text
            let saved = false;
            const pending = pendingTrainingRef.current || [];
            if (pending && pending.length > 0) {
              // match by approximate last timestamp order: take last pending
              const candidate = pending.pop();
              pendingTrainingRef.current = pending;
              try { addTrainingExample(candidate.text, candidate.label); saved = true; } catch (_e) { void _e; }
            }

            if (!saved) {
              // fallback: find related user message preceding this bot message
              const idx = messages.findIndex(m => m.id === messageId);
              if (idx > 0) {
                for (let i = idx - 1; i >= 0; i--) {
                  const um = messages[i];
                  if (um && um.from === 'user' && um.text) {
                    const label = (um.intent && um.intent.type) ? um.intent.type : (classifyInput(um.text || '').type || 'statement');
                    try { addTrainingExample(um.text, label); } catch (_e) { void _e; }
                    break;
                  }
                }
              }
            }
          }
        } catch (_e) { void _e; }
      }
    } catch (e) { console.error('recordFeedback error', e); }
  }, [messages, settings]);

  const closeSuggestions = useCallback(() => setSuggestionsVisible(false), []);

  const closeSuggestionsForCurrent = useCallback(() => {
    try {
      setSuggestionsVisible(false);
      // remember that user closed suggestions for this bot message id
      if (lastBotMessageIdRef.current) closedForBotIdRef.current = lastBotMessageIdRef.current;
    } catch (e) { void e; }
  }, []);

  const choosePreferredResponse = useCallback((messageId) => {
    try {
      // find the chosen message and its altGroup
      const chosen = messages.find(m => m.id === messageId);
      if (!chosen || !chosen._meta || !chosen._meta.altGroup) return;
      const group = chosen._meta.altGroup;

      // persist preference in settings so future replies may prefer similar style
      try {
        setSettings(prev => ({ ...prev, preferredResponseExample: chosen.text }));
        // persist to storage
        try { 
          const current = storageService.get('saipul_settings', {});
          current.preferredResponseExample = chosen.text;
          storageService.set('saipul_settings', current);
        } catch (_e) { void _e; }
      } catch (_e) { void _e; }

      // remove other alternatives from UI and keep chosen
      setMessages(prev => prev.filter(m => !(m._meta && m._meta.altGroup === group && m.id !== messageId)));

      // increment preference counter and persist
      try {
        const key = 'saipul_pref_count';
        const prevCount = Number(storageService.get(key, 0));
        const nextCount = prevCount + 1;
        storageService.set(key, String(nextCount));
        // dispatch global event so UI can show visual feedback
        try { window.dispatchEvent(new CustomEvent('saipul_preference_saved', { detail: { messageId, count: nextCount } })); } catch (_e) { void _e; }
      } catch (e) { void e; }
    } catch (e) { console.error('choosePreferredResponse error', e); }
  }, [messages]);

  const getAccentGradient = () => {
    const gradients = {
      cyan: "from-cyan-500 to-blue-500",
      purple: "from-purple-500 to-pink-500",
      green: "from-green-500 to-emerald-500",
      orange: "from-orange-500 to-red-500",
      indigo: "from-indigo-500 to-purple-500"
    };
    return gradients[settings.accent] || gradients.cyan;
  };

  useEffect(() => {
    let lastType = null;
    let lastTime = 0;
    const trackActivity = (event) => {
      // Hindari update beruntun dengan event yang sama dalam 100ms
      if (event.type === lastType && event.timeStamp - lastTime < 100) return;
      lastType = event.type;
      lastTime = event.timeStamp;
      setUserActivity((prev) => {
        const updatedActivity = [...prev, { type: event.type, time: Date.now() }];
        if (updatedActivity.length > 10) updatedActivity.shift();
        return updatedActivity;
      });
    };
    window.addEventListener("click", trackActivity);
    window.addEventListener("keydown", trackActivity);
    return () => {
      window.removeEventListener("click", trackActivity);
      window.removeEventListener("keydown", trackActivity);
    };
  }, []);

  // Global keyboard shortcuts for chat quick actions (configurable via settings.shortcuts)
  useEffect(() => {
    const parseCombo = (combo) => {
      if (!combo || typeof combo !== 'string') return null;
      const parts = combo.split('+').map(p => p.trim().toLowerCase());
      const obj = { ctrl: false, shift: false, alt: false, key: null };
      parts.forEach(p => {
        if (p === 'ctrl' || p === 'control') obj.ctrl = true;
        else if (p === 'shift') obj.shift = true;
        else if (p === 'alt') obj.alt = true;
        else obj.key = p;
      });
      return obj;
    };

    const match = (e, combo) => {
      if (!combo) return false;
      const p = parseCombo(combo);
      if (!p) return false;
      const key = (e.key || '').toLowerCase();
      if ((p.ctrl || false) !== e.ctrlKey) return false;
      if ((p.shift || false) !== e.shiftKey) return false;
      if ((p.alt || false) !== e.altKey) return false;
      return p.key ? p.key === key : false;
    };

    const shortcuts = (settings.shortcuts || {});

    const handler = (e) => {
      try {
        if (match(e, shortcuts.clear || 'Ctrl+K')) { e.preventDefault(); clearChat(); return; }
        if (match(e, shortcuts.export || 'Ctrl+E')) { e.preventDefault(); exportChat(); return; }
        if (match(e, shortcuts.openSettings || 'Ctrl+Shift+S')) { e.preventDefault(); try { window.dispatchEvent(new Event('saipul_open_settings')); } catch (err) { void err; } return; }
        if (match(e, shortcuts.focusInput || 'Ctrl+Shift+F')) { e.preventDefault(); try { window.dispatchEvent(new Event('saipul_focus_input')); } catch (err) { void err; } return; }
        if (match(e, shortcuts.send || 'Ctrl+Enter')) { e.preventDefault(); handleSend(); return; }
        if (match(e, shortcuts.regenerate || 'Ctrl+R')) {
          e.preventDefault();
          // find last bot message index then use previous user prompt to regenerate
          const lastBotIndex = (() => {
            for (let i = messages.length - 1; i >= 0; i--) {
              const m = messages[i]; if (m && m.from === 'bot' && m.type !== 'error') return i;
            }
            return -1;
          })();
          if (lastBotIndex !== -1) {
            let userText = null;
            for (let j = lastBotIndex - 1; j >= 0; j--) {
              const cand = messages[j]; if (cand && cand.from === 'user' && cand.text) { userText = cand.text; break; }
            }
            if (userText) {
              const lastBot = messages[lastBotIndex];
              generateBotReply(userText, { replaceMessageId: lastBot && lastBot.id });
            } else {
              // nothing to regenerate from; ignore
              console.warn('Regenerate keyboard shortcut: no preceding user prompt found');
            }
          }
          return;
        }
        if (match(e, shortcuts.openUpload || 'Ctrl+Shift+U')) { e.preventDefault(); try { window.dispatchEvent(new Event('saipul_open_upload')); } catch (err) { void err; } return; }
        if (match(e, shortcuts.toggleSpeech || 'Ctrl+Shift+M')) { e.preventDefault(); try { window.dispatchEvent(new Event('saipul_toggle_speech')); } catch (err) { void err; } return; }
      } catch (err) {
        void err;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [messages, handleSend, generateBotReply, settings.shortcuts, clearChat, exportChat]);

  // Handle chat open/close events: when closed, hide UI but keep history in localStorage;
  // when opened, reload saved history into UI.
  useEffect(() => {
    const handleChatClosed = () => {
      try {
        setIsHidden(true);
        // Keep history in storage; clear UI messages
        setMessages([]);
      } catch (e) {
        console.error('Error hiding chat messages:', e);
      }
    };

    const handleChatOpened = () => {
      try {
        setIsHidden(false);
        const saved = storageService.get("saipul_chat_history");
        let finalMessages = null;
        if (saved) {
          try {
            if (Array.isArray(saved) && saved.length > 0) finalMessages = saved;
          } catch (_e) { void _e; }
        }

        if (!finalMessages) {
          // Use a friendly greeting when there is no prior history
          const greet = FRIENDLY_MESSAGES.greetings[Math.floor(Math.random() * FRIENDLY_MESSAGES.greetings.length)];
          finalMessages = [{
            id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            from: 'bot',
            text: `${greet} \n\nAda yang bisa kubantu hari ini?`,
            timestamp: new Date().toISOString(),
            type: 'welcome'
          }];
        } else {
          // If history exists, append a short reconnection greeting if last message isn't already a welcome
          const last = finalMessages[finalMessages.length - 1];
          if (!last || last.type !== 'welcome') {
            const greet = FRIENDLY_MESSAGES.greetings[Math.floor(Math.random() * FRIENDLY_MESSAGES.greetings.length)];
            finalMessages = finalMessages.concat({
              id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
              from: 'bot',
              text: `${greet} \n\nLanjutkan percakapan dari sini, atau mulai topik baru.`,
              timestamp: new Date().toISOString(),
              type: 'welcome'
            });
          }
        }

        setMessages(finalMessages);
      } catch (e) {
        console.error('Error restoring chat messages:', e);
      }
    };

    window.addEventListener('saipul_chat_closed', handleChatClosed);
    window.addEventListener('saipul_chat_opened', handleChatOpened);

    return () => {
      window.removeEventListener('saipul_chat_closed', handleChatClosed);
      window.removeEventListener('saipul_chat_opened', handleChatOpened);
    };
  }, []);

  useEffect(() => {
    if (userActivity.length > 0) {
      console.log("User activity updated:", userActivity);
    }
  }, [userActivity]);

  return {
    messages,
    setMessages,
    input,
    setInput,
    isTyping,
    setIsTyping,
    suggestions,
    suggestionsVisible,
    setSuggestions,
    closeSuggestions,
    closeSuggestionsForCurrent,
    recordFeedback,
    feedbackStore,
    frequentQuestions,
    anomalies,
    conversationContext,
    settings,
    activeQuickActions,
    handleSend,
    handleKeyDown,
    clearChat,
    exportChat,
    getAccentGradient,
    generateBotReply,
    choosePreferredResponse,
    safeKnowledgeBase: kbState,
    reportIssue,
    generateSessionSummary,
    recallPreviousQuestions,
    // expose last input type classification
    lastInputType
  };
}