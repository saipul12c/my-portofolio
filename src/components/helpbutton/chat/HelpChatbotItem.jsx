import { useState, useEffect, useMemo } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { ChatbotWindow } from "./components/ChatbotWindow";
import { ChatbotSettings } from "./components/ChatbotSettings";
import ErrorBoundary from "./components/ErrorBoundary";
import { storageService } from "./components/logic/utils/storageService";
import { loadKnowledgeBaseData, safeAccessKnowledgeBase } from "./components/logic/utils/dataLoader";

export default function HelpChatbotItem() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [knowledgeBase, setKnowledgeBase] = useState({
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
  });

  const defaultAIBase = useMemo(() => ({
    "Apa itu kecerdasan buatan?": "Kecerdasan buatan adalah teknologi yang membuat sistem komputer mampu melakukan tugas seperti manusia dengan kemampuan belajar, berpikir, dan beradaptasi.",
    "Apa itu machine learning?": "Machine learning adalah bagian dari AI yang memungkinkan sistem belajar dari data tanpa diprogram secara eksplisit, menggunakan algoritma statistik.",
    "Apa itu deep learning?": "Deep learning adalah metode machine learning yang menggunakan jaringan saraf tiruan berlapis untuk memproses data dalam jumlah besar dan kompleks.",
    "Apa fungsi neural network?": "Neural network berfungsi meniru cara kerja otak manusia untuk mengenali pola, membuat prediksi, dan mengambil keputusan berdasarkan data input."
  }), []);

  // Enhanced knowledge base loader dengan error handling & data validation
  useEffect(() => {
    const loadKnowledgeBase = async () => {
      try {
        // Gunakan utility untuk load dan validate data
        const { knowledgeBase: loadedData, loadResult } = await loadKnowledgeBaseData();
        
        // Merge dengan defaultAIBase jika AI data kosong
        if (!loadedData.AI || Object.keys(loadedData.AI).length === 0) {
          loadedData.AI = defaultAIBase;
        } else {
          // Merge dengan default untuk ensure semua concepts ada
          loadedData.AI = { ...defaultAIBase, ...loadedData.AI };
        }
        
        // Safe accessor memastikan semua field ada
        const safeKnowledgeBase = safeAccessKnowledgeBase(loadedData);
        setKnowledgeBase(safeKnowledgeBase);
        
        // Log untuk debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Knowledge Base Loading Complete:', loadResult);
        }
      } catch (error) {
        console.error("❌ Error loading knowledge base:", error);
        // Fallback dengan default AI base + empty arrays
        const fallbackKnowledgeBase = {
          AI: defaultAIBase,
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
        const safeKnowledgeBase = safeAccessKnowledgeBase(fallbackKnowledgeBase);
        setKnowledgeBase(safeKnowledgeBase);
      }
    };

    loadKnowledgeBase();
  }, [defaultAIBase]);

  // Enhanced unread message tracking
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const chatHistory = storageService.get("saipul_chat_history");
        if (chatHistory && Array.isArray(chatHistory)) {
          const messages = chatHistory;
          const lastMessage = messages[messages.length - 1];
          if (lastMessage && lastMessage.from === "bot" && !isChatOpen) {
            setUnreadCount(prev => Math.min(prev + 1, 99)); // Limit to 99
          }
        }
      } catch (e) {
        console.error("Error tracking unread messages:", e);
      }
    };

    const handleMessageEvent = (event) => {
      if (event.detail && event.detail.type === 'new_bot_message') {
        setUnreadCount(prev => Math.min(prev + 1, 99));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('saipul_chat_update', handleMessageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('saipul_chat_update', handleMessageEvent);
    };
  }, [isChatOpen]);

  const openChat = () => {
    setIsChatOpen(true);
    setUnreadCount(0);
    // Trigger chat opened event
    window.dispatchEvent(new CustomEvent('saipul_chat_opened'));
  };

  const closeChat = () => {
    setIsChatOpen(false);
    // Trigger chat closed event
    window.dispatchEvent(new CustomEvent('saipul_chat_closed'));
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const updateKnowledgeBase = (newData) => {
    setKnowledgeBase(prev => {
      const updated = { ...prev, ...newData };

      // Auto-save uploaded data to storage
      if (newData.uploadedData) {
        try {
          storageService.set("saipul_uploaded_data", newData.uploadedData);
        } catch (e) {
          console.error("Error saving uploaded data:", e);
        }
      }

      if (newData.fileMetadata) {
        try {
          storageService.set("saipul_file_metadata", newData.fileMetadata);
        } catch (e) {
          console.error("Error saving file metadata:", e);
        }
      }

      // Notify other components (chat) that KB has been updated
      try {
        window.dispatchEvent(new CustomEvent('saipul_kb_updated', { detail: { knowledgeBase: updated } }));
      } catch (e) {
        console.error('Error dispatching saipul_kb_updated:', e);
      }

      return updated;
    });
  };

  // Enhanced knowledge base stats
  const getKnowledgeStats = () => {
    const stats = {
      totalCategories: 0,
      totalItems: 0,
      aiConcepts: Object.keys(knowledgeBase.AI || {}).length,
      hobbies: (knowledgeBase.hobbies || []).length,
      certificates: (knowledgeBase.certificates || []).length,
      softskills: (knowledgeBase.softskills || []).length,
      uploadedFiles: (knowledgeBase.uploadedData || []).length,
      fileMetadata: (knowledgeBase.fileMetadata || []).length
    };
    
    stats.totalCategories = Object.keys(knowledgeBase).filter(key => {
      const value = knowledgeBase[key];
      return Array.isArray(value) ? value.length > 0 : 
             typeof value === 'object' && value !== null ? Object.keys(value).length > 0 : false;
    }).length;
    
    stats.totalItems = stats.aiConcepts + stats.hobbies + stats.certificates + 
                      stats.softskills + stats.uploadedFiles;
    
    return stats;
  };

  const stats = getKnowledgeStats();

  return (
    <>
      {/* Enhanced Chatbot Button with Real-time Stats */}
      <button
        onClick={openChat}
        className="saipul-help-item relative flex items-start gap-3 px-3 py-2 rounded-lg transition-all duration-300 text-left w-full group"
        aria-label="Buka Chatbot SaipulAI"
        style={{ background: 'transparent' }}
      >
        <div className="relative">
          <div className="w-9 h-9 flex items-center justify-center rounded-md shrink-0 transition-all saipul-help-badge" style={{ background: 'var(--saipul-accent-gradient)' }}>
            <MessageCircle size={18} className="saipul-help-icon" style={{ color: 'var(--saipul-surface)' }} />
            <div className="absolute -top-1 -right-1 w-3 h-3 saipul-presence-badge" />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce border border-gray-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium leading-tight truncate" style={{ color: 'var(--saipul-text)' }}>
              Chatbot SaipulAI
            </span>
            <Sparkles size={12} className="text-yellow-400 flex-shrink-0" />
          </div>
          <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: 'var(--saipul-muted)' }}>
            <span className="w-2 h-2 rounded-full saipul-online-dot" />
            Online • {stats.totalItems} data tersedia
          </div>
        </div>
      </button>

      {/* Enhanced Chatbot Window */}
      {isChatOpen && (
        <ErrorBoundary>
          <ChatbotWindow
            onClose={closeChat}
            onOpenSettings={() => {
              closeChat();
              openSettings();
            }}
            knowledgeBase={knowledgeBase}
            updateKnowledgeBase={updateKnowledgeBase}
            knowledgeStats={stats}
          />
        </ErrorBoundary>
      )}

      {/* Enhanced Settings Window */}
      {isSettingsOpen && (
        <ErrorBoundary>
          <ChatbotSettings 
            onClose={closeSettings} 
            knowledgeBase={knowledgeBase}
            updateKnowledgeBase={updateKnowledgeBase}
            knowledgeStats={stats}
          />
        </ErrorBoundary>
      )}
    </>
  );
}