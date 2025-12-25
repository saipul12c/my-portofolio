import { useState, useEffect, useCallback } from 'react';
import { getSmartReply } from '../utils/responseGenerator';

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
      const saved = localStorage.getItem("saipul_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(m => ({
            ...m,
            id: m.id || `msg_${Date.now()}_${Math.floor(Math.random()*10000)}`
          }));
        }
        return [];
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
    
    return [{ 
      from: "bot", 
      text: `Halo! 👋 Aku SaipulAI v7.0.0 Enhanced dengan kemampuan:\n\n• 🧮 **Matematika Lanjutan** & Analisis Data\n• 📊 **Multi-format File Upload** (PDF, DOCX, TXT, Gambar, dll)\n• 🤖 **AI Knowledge Base** Dinamis\n• 🎯 **Context-Aware Responses**\n• 📁 **File Management** & Metadata Tracking\n• 🔍 **Advanced Search** Across All Data\n\nKnowledge base saat ini: ${knowledgeStats ? (knowledgeStats.totalItems || 0) : 0} item dari ${knowledgeStats ? (knowledgeStats.totalCategories || 0) : 0} kategori.\n\nAda yang bisa kubantu analisis, hitung, atau proses hari ini?`,
      timestamp: new Date().toISOString(),
      type: "welcome",
      data: { knowledgeStats }
    }];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [conversationContext, setConversationContext] = useState([]);
  const [activeQuickActions, setActiveQuickActions] = useState([]);
  const [userActivity, setUserActivity] = useState([]);

  const [settings, setSettings] = useState({
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
    allowedFileTypes: ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'json', 'csv'],
    extractTextFromImages: false,
    processSpreadsheets: true
  });

  const [isHidden, setIsHidden] = useState(false);

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

  useEffect(() => {
    // Skip saving while chat is hidden or when privacy mode is enabled
    if (!settings.privacyMode && !isHidden) {
      try {
        localStorage.setItem("saipul_chat_history", JSON.stringify(messages));
        
        if (messages.length % 50 === 0) {
          const backupData = {
            timestamp: new Date().toISOString(),
            messageCount: messages.length,
            messages: messages.slice(-100)
          };
          localStorage.setItem("saipul_chat_backup", JSON.stringify(backupData));
        }
      } catch (e) {
        console.error("Error saving chat history:", e);
      }
    }
    
    if (settings.memoryContext) {
      const recentMessages = messages.slice(-8).map(msg => ({
        role: msg.from,
        content: msg.text,
        timestamp: msg.timestamp,
        type: msg.type
      }));
      setConversationContext(recentMessages);
    }

    updateQuickActions();
  }, [messages, settings.privacyMode, settings.memoryContext, isHidden, updateQuickActions]);

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
        const savedSettings = localStorage.getItem("saipul_settings");
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (err) {
        console.error("Error applying updated settings:", err);
      }
    };

    const handleKBUpdate = (e) => {
      try {
        // prefer payload if provided, fallback to localStorage
        const payload = e?.detail?.knowledgeBase;
        const uploaded = JSON.parse(localStorage.getItem("saipul_uploaded_data") || "[]");
        const metadata = JSON.parse(localStorage.getItem("saipul_file_metadata") || "[]");
        if (payload) {
          setKbState(() => ({ ...DEFAULT_KB, ...payload, uploadedData: uploaded, fileMetadata: metadata }));
        } else {
          setKbState(prev => ({ ...prev, uploadedData: uploaded, fileMetadata: metadata }));
        }
      } catch (err) {
        console.error("Error applying updated KB from localStorage:", err);
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
    const text = raw.toLowerCase();
    let suggestions = [];

    if (text.includes('hitung') || text.includes('matematika')) {
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
        suggestions.push(...aiQuestions);
      }
      suggestions.push("Apa kelebihan deep learning?");
      suggestions.push("Bagaimana cara kerja GPT?");
    } else {
      if (kbState.hobbies.length > 0) {
        suggestions.push(`Apa itu ${kbState.hobbies[0]?.title}`);
      }
      if (kbState.softskills.length > 0) {
        suggestions.push(`Jelaskan ${kbState.softskills[0]?.name}`);
      }
      suggestions.push("Upload file untuk ditambahkan ke knowledge base");
      suggestions.push("Tampilkan semua data yang tersedia");
    }

    return suggestions.slice(0, 4);
  }, [kbState]);

  useEffect(() => {
    // Generate suggestions based on the last user message (show before bot reply)
    if (settings.autoSuggestions && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.from === "user") {
        const suggestedQuestions = generateSuggestions(lastMessage.text);
        setSuggestions(suggestedQuestions);
      } else {
        // hide suggestions while bot is replying
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  }, [messages, settings.autoSuggestions, kbState, generateSuggestions]);

  const generateBotReply = useCallback((userText) => {
    setIsTyping(true);

    const baseTime = settings.responseSpeed === 'fast' ? 600 :
                    settings.responseSpeed === 'thorough' ? 1800 : 1000;

    const complexityMultiplier = userText.length > 50 ? 1.3 : 1;
    const knowledgeMultiplier = userText.includes('upload') || userText.includes('file') ? 1.2 : 1;
    const typingTime = baseTime * complexityMultiplier * knowledgeMultiplier;

    setTimeout(() => {
      try {
        const reply = getSmartReply(userText, settings, conversationContext, kbState, knowledgeStats);
        const botMsg = {
          id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          from: "bot",
          text: reply,
          timestamp: new Date().toISOString(),
          type: "response"
        };

        setMessages((prev) => [...prev, botMsg]);

        window.dispatchEvent(new CustomEvent('saipul_chat_update', {
          detail: { type: 'new_bot_message', message: botMsg }
        }));
      } catch (error) {
        console.error("Error generating bot reply:", error);
        setMessages((prev) => [...prev, {
          id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          from: "bot",
          text: "❌ Maaf, terjadi error saat memproses permintaan Anda. Silakan coba lagi atau gunakan format yang berbeda.",
          timestamp: new Date().toISOString(),
          type: "error"
        }]);
      } finally {
        setIsTyping(false);
      }
    }, typingTime);
  }, [settings, conversationContext, kbState, knowledgeStats]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMsg = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      from: "user",
      text: input,
      timestamp: new Date().toISOString(),
      type: "text"
    };

    setMessages((prev) => [...prev, userMsg]);
    // clear suggestions when user sends a question
    setSuggestions([]);
    const userInput = input;
    setInput("");
    generateBotReply(userInput);
  }, [input, generateBotReply]);

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

  // hide suggestions when user starts typing to avoid stale suggestion buttons
  useEffect(() => {
    if (input && input.trim().length > 0 && suggestions.length > 0) {
      setSuggestions([]);
    }
  }, [input, suggestions.length]);

  const clearChat = useCallback(() => {
    setMessages([{ 
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      from: "bot", 
      text: "Halo! 👋 Riwayat percakapan telah dibersihkan. Ada yang bisa kubantu analisis, hitung, atau proses hari ini?",
      timestamp: new Date().toISOString(),
      type: "welcome"
    }]);
    if (!settings.privacyMode) {
      localStorage.removeItem("saipul_chat_history");
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
        text: "❌ **Error exporting chat**. Silakan coba lagi.",
        timestamp: new Date().toISOString(),
        type: "error"
      }]);
    }
  }, [messages, knowledgeStats, settings]);

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
    const trackActivity = (event) => {
      setUserActivity((prev) => {
        const updatedActivity = [...prev, event];

        // Batasi panjang array aktivitas hingga 10 elemen
        if (updatedActivity.length > 10) {
          updatedActivity.shift();
        }

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
        if (match(e, shortcuts.regenerate || 'Ctrl+R')) { e.preventDefault(); const lastBot = [...messages].reverse().find(m => m.from === 'bot'); if (lastBot) generateBotReply(lastBot.text || ''); return; }
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
        // Keep history in localStorage; clear UI messages
        setMessages([]);
      } catch (e) {
        console.error('Error hiding chat messages:', e);
      }
    };

    const handleChatOpened = () => {
      try {
        setIsHidden(false);
        const saved = localStorage.getItem("saipul_chat_history");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
        // If nothing saved, keep default welcome message (do nothing)
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
    setSuggestions,
    conversationContext,
    settings,
    activeQuickActions,
    handleSend,
    handleKeyDown,
    clearChat,
    exportChat,
    getAccentGradient,
    generateBotReply,
    safeKnowledgeBase: kbState,
    reportIssue
  };
}