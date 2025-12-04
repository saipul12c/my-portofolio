import { useState, useEffect, useRef } from "react";
import { X, Settings, Send, Loader2, Calculator, TrendingUp, Brain, BarChart3, Mic, MicOff, Download, Upload, FileText, Image, File, Video, Music, Archive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatbotWindow({ onClose, onOpenSettings, knowledgeStats = {} }) {
  // Fixed undefined `setConversationContext` by adding a placeholder function
  const setConversationContext = () => {};

  // Fixed undefined `setIsTyping` by adding a placeholder function
  const setIsTyping = () => {};

  // Fixed undefined `uploadProgress` by initializing it with a default value
  const uploadProgress = 0;

  // Enhanced message system dengan typing indicators
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
  const chatEndRef = useRef(null);

  // Enhanced settings dengan file processing options
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
    maxFileSize: 10, // MB
    allowedFileTypes: ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'json', 'csv'],
    extractTextFromImages: false,
    processSpreadsheets: true
  });

  // Load settings dengan enhanced options
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

  // Enhanced message persistence dengan auto-backup
  useEffect(() => {
    if (!settings.privacyMode) {
      try {
        localStorage.setItem("saipul_chat_history", JSON.stringify(messages));
        
        // Auto-backup setiap 50 pesan
        if (messages.length % 50 === 0) {
          const backupData = {
            timestamp: new Date().toISOString(),
            messageCount: messages.length,
            messages: messages.slice(-100) // Backup 100 pesan terakhir
          };
          localStorage.setItem("saipul_chat_backup", JSON.stringify(backupData));
        }
      } catch (e) {
        console.error("Error saving chat history:", e);
      }
    }
    
    // Auto-scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Enhanced conversation context
    if (settings.memoryContext) {
      const recentMessages = messages.slice(-8).map(msg => ({
        role: msg.from,
        content: msg.text,
        timestamp: msg.timestamp,
        type: msg.type
      }));
      setConversationContext(recentMessages);
    }


  }, [messages, settings.privacyMode, settings.memoryContext]);





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
      // Navigate through history
      e.preventDefault();
      const userMessages = messages.filter(m => m.from === "user");
      if (userMessages.length > 0) {
        setInput(userMessages[userMessages.length - 1].text);
      }
    }
  };

  // Enhanced Speech Recognition dengan continuous mode
  



  // Enhanced knowledge response dengan multi-source search
  const generateBotReply = async (userText) => {
    setIsTyping(true);

    const history = messages.map(msg => ({
      role: msg.from === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMsg = { 
        from: "bot", 
        text: data.reply,
        timestamp: new Date().toISOString(),
        type: "response"
      };
      
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error("Error fetching bot reply:", error);
      setMessages((prev) => [...prev, { 
        from: "bot", 
        text: "❌ Maaf, terjadi error saat menghubungi AI. Pastikan server backend berjalan dan coba lagi.",
        timestamp: new Date().toISOString(),
        type: "error"
      }]);
    } finally {
      setIsTyping(false);
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
      
      // Success feedback
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



  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-20 right-6 bg-gray-800/95 border border-gray-700 rounded-2xl shadow-2xl w-96 overflow-hidden backdrop-blur-md z-[9999]"
      >
        {/* Enhanced Header */}
        <div className={`flex items-center justify-between bg-gradient-to-r ${getAccentGradient()} p-3 text-sm text-white font-semibold`}>
          <div className="flex items-center gap-2">
            <Brain size={16} className="text-white" />
            <div>
              <span>💬 SaipulAI v6.0</span>
              <div className="text-xs opacity-80 font-normal">
                {settings.aiModel.toUpperCase()} • 🟢 Enhanced
              </div>
            </div>
          </div>
          <div className="flex gap-1 items-center">

            <button 
              onClick={exportChat}
              className="text-xs bg-white/20 hover:bg-white/30 p-1 rounded transition"
              title="Export Chat"
            >
              <Download size={12} />
            </button>
            <button 
              onClick={clearChat}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition"
              title="Bersihkan Chat"
            >
              Hapus
            </button>
            <button onClick={onOpenSettings} className="hover:bg-white/20 p-1 rounded transition">
              <Settings size={14} />
            </button>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress > 0 && (
          <div className="h-1 bg-gray-700">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <div className="border-t border-gray-700 bg-gray-900/90 p-2">
          <div className="flex items-center gap-2">
            <div className="flex-grow relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent pr-16"
              />
              {input.length > 0 && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {input.length}/500
                </div>
              )}
            </div>
            
            <button 
              onClick={handleSend} 
              disabled={!input.trim()}
              className={`bg-gradient-to-r ${getAccentGradient()} hover:opacity-90 transition p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}