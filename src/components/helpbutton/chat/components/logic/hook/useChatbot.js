import { useState, useEffect, useMemo, useCallback } from 'react';
import { getSmartReply } from '../utils/responseGenerator';

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
    fileMetadata: []
  }), []);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("saipul_chat_history");
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error("Error loading chat history:", e);
    }
    
    return [{ 
      from: "bot", 
      text: `Halo! 👋 Aku SaipulAI v6.0 Enhanced dengan kemampuan:\n\n• 🧮 **Matematika Lanjutan** & Analisis Data\n• 📊 **Multi-format File Upload** (PDF, DOCX, TXT, Gambar, dll)\n• 🤖 **AI Knowledge Base** Dinamis\n• 🎯 **Context-Aware Responses**\n• 📁 **File Management** & Metadata Tracking\n• 🔍 **Advanced Search** Across All Data\n\nKnowledge base saat ini: ${knowledgeStats.totalItems || 0} item dari ${knowledgeStats.totalCategories || 0} kategori.\n\nAda yang bisa kubantu analisis, hitung, atau proses hari ini?`,
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

  // Update quick actions based on latest messages and safeKnowledgeBase
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
      if (safeKnowledgeBase.hobbies.length > 0) {
        actions.push({ icon: 'Brain', label: "Hobi", action: `Ceritakan tentang ${safeKnowledgeBase.hobbies[0]?.title}` });
      }
      if (safeKnowledgeBase.certificates.length > 0) {
        actions.push({ icon: 'FileText', label: "Sertifikat", action: `Apa itu ${safeKnowledgeBase.certificates[0]?.name}` });
      }
      actions.push({ icon: 'Upload', label: "Upload File", action: "upload_file" });
    }

    setActiveQuickActions(actions.slice(0, 3));
  }, [messages, safeKnowledgeBase]);

  useEffect(() => {
    if (!settings.privacyMode) {
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
  }, [messages, settings.privacyMode, settings.memoryContext, updateQuickActions]);

  const generateSuggestions = useCallback((lastBotMessage) => {
    const text = lastBotMessage.toLowerCase();
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
      if (safeKnowledgeBase.AI && typeof safeKnowledgeBase.AI === 'object') {
        const aiQuestions = Object.keys(safeKnowledgeBase.AI).slice(0, 2);
        suggestions.push(...aiQuestions);
      }
      suggestions.push("Apa kelebihan deep learning?");
      suggestions.push("Bagaimana cara kerja GPT?");
    } else {
      if (safeKnowledgeBase.hobbies.length > 0) {
        suggestions.push(`Apa itu ${safeKnowledgeBase.hobbies[0]?.title}`);
      }
      if (safeKnowledgeBase.softskills.length > 0) {
        suggestions.push(`Jelaskan ${safeKnowledgeBase.softskills[0]?.name}`);
      }
      suggestions.push("Upload file untuk ditambahkan ke knowledge base");
      suggestions.push("Tampilkan semua data yang tersedia");
    }

    return suggestions.slice(0, 4);
  }, [safeKnowledgeBase]);

  useEffect(() => {
    if (settings.autoSuggestions && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.from === "bot") {
        const suggestedQuestions = generateSuggestions(lastMessage.text);
        setSuggestions(suggestedQuestions);
      }
    } else {
      setSuggestions([]);
    }
  }, [messages, settings.autoSuggestions, safeKnowledgeBase, generateSuggestions]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg = { 
      from: "user", 
      text: input,
      timestamp: new Date().toISOString(),
      type: "text"
    };
    
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    generateBotReply(userInput);
  };

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

  const clearChat = () => {
    setMessages([{ 
      from: "bot", 
      text: "Halo! 👋 Riwayat percakapan telah dibersihkan. Ada yang bisa kubantu analisis, hitung, atau proses hari ini?",
      timestamp: new Date().toISOString(),
      type: "welcome"
    }]);
    if (!settings.privacyMode) {
      localStorage.removeItem("saipul_chat_history");
    }
  };

  const exportChat = () => {
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
        from: "bot",
        text: "✅ **Chat berhasil diexport!**\n\nFile telah didownload dengan semua riwayat percakapan dan metadata.",
        timestamp: new Date().toISOString(),
        type: "success"
      }]);
    } catch (error) {
      console.error("Error exporting chat:", error);
      setMessages(prev => [...prev, {
        from: "bot",
        text: "❌ **Error exporting chat**. Silakan coba lagi.",
        timestamp: new Date().toISOString(),
        type: "error"
      }]);
    }
  };

  const reportIssue = useCallback((details) => {
    setMessages((prev) => [...prev, {
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

  const generateBotReply = (userText) => {
    setIsTyping(true);

    const baseTime = settings.responseSpeed === 'fast' ? 600 : 
                    settings.responseSpeed === 'thorough' ? 1800 : 1000;
    
    const complexityMultiplier = userText.length > 50 ? 1.3 : 1;
    const knowledgeMultiplier = userText.includes('upload') || userText.includes('file') ? 1.2 : 1;
    const typingTime = baseTime * complexityMultiplier * knowledgeMultiplier;

    setTimeout(() => {
      try {
        const reply = getSmartReply(userText, settings, conversationContext, safeKnowledgeBase, knowledgeStats);
        const botMsg = { 
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
          from: "bot", 
          text: "❌ Maaf, terjadi error saat memproses permintaan Anda. Silakan coba lagi atau gunakan format yang berbeda.",
          timestamp: new Date().toISOString(),
          type: "error"
        }]);
      } finally {
        setIsTyping(false);
      }
    }, typingTime);
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
    safeKnowledgeBase,
    reportIssue
  };
}