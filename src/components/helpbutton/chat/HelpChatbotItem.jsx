import { useState, useEffect, useMemo } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { ChatbotWindow } from "./components/logic/ChatbotWindow";
import { ChatbotSettings } from "./components/ChatbotSettings";

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

  // Enhanced knowledge base loader dengan error handling
  useEffect(() => {
    const loadKnowledgeBase = async () => {
      try {
        const combinedKnowledge = {
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

        // Dynamic JSON loading dengan fallback
        const loadJSON = async (path, defaultData) => {
          try {
            const module = await import(path);
            return module.default || defaultData;
          } catch (error) {
            console.warn(`Failed to load ${path}:`, error);
            return defaultData;
          }
        };

        // Load semua JSON files secara parallel
        const [
          aiBase,
          hobbiesData,
          cards,
          certificates,
          collaborations,
          interests,
          profile,
          softskills
        ] = await Promise.all([
          loadJSON("./data/AI-base.json", defaultAIBase),
          loadJSON("./data/hobbiesData.json", []),
          loadJSON("./data/cards.json", { cards: [] }),
          loadJSON("./data/certificates.json", { certificates: [] }),
          loadJSON("./data/collaborations.json", { partners: [] }),
          loadJSON("./data/interests.json", {}),
          loadJSON("./data/profile.json", {}),
          loadJSON("./data/softskills.json", { skills: [] })
        ]);

        // Update knowledge base dengan data yang berhasil di-load
        combinedKnowledge.AI = aiBase;
        combinedKnowledge.hobbies = Array.isArray(hobbiesData) ? hobbiesData : [];
        combinedKnowledge.cards = Array.isArray(cards.cards) ? cards.cards : [];
        combinedKnowledge.certificates = Array.isArray(certificates.certificates) ? certificates.certificates : [];
        combinedKnowledge.collaborations = Array.isArray(collaborations.partners) ? collaborations.partners : [];
        combinedKnowledge.interests = interests || {};
        combinedKnowledge.profile = profile || {};
        combinedKnowledge.softskills = Array.isArray(softskills.skills) ? softskills.skills : [];

        // Load uploaded data dan metadata dari localStorage
        try {
          const savedUploadedData = localStorage.getItem("saipul_uploaded_data");
          const savedFileMetadata = localStorage.getItem("saipul_file_metadata");
          
          if (savedUploadedData) {
            const uploadedData = JSON.parse(savedUploadedData);
            combinedKnowledge.uploadedData = Array.isArray(uploadedData) ? uploadedData : [];
          }
          
          if (savedFileMetadata) {
            const fileMetadata = JSON.parse(savedFileMetadata);
            combinedKnowledge.fileMetadata = Array.isArray(fileMetadata) ? fileMetadata : [];
          }
        } catch (e) {
          console.error("Error loading uploaded data:", e);
        }

        setKnowledgeBase(combinedKnowledge);
        
      } catch (error) {
        console.error("Error loading knowledge base:", error);
        // Set minimal fallback knowledge base
        setKnowledgeBase({
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
        });
      }
    };

    loadKnowledgeBase();
  }, [defaultAIBase]);

  // Enhanced unread message tracking
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const chatHistory = localStorage.getItem("saipul_chat_history");
        if (chatHistory) {
          const messages = JSON.parse(chatHistory);
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
      
      // Auto-save uploaded data to localStorage
      if (newData.uploadedData) {
        try {
          localStorage.setItem("saipul_uploaded_data", JSON.stringify(newData.uploadedData));
        } catch (e) {
          console.error("Error saving uploaded data:", e);
        }
      }
      
      if (newData.fileMetadata) {
        try {
          localStorage.setItem("saipul_file_metadata", JSON.stringify(newData.fileMetadata));
        } catch (e) {
          console.error("Error saving file metadata:", e);
        }
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
        className="relative flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 text-left w-full group"
        aria-label="Buka Chatbot SaipulAI"
      >
        <div className="relative">
          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-purple-500/20 shrink-0 group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all">
            <MessageCircle size={18} className="text-cyan-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce border border-gray-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white/90 leading-tight truncate">
              Chatbot SaipulAI
            </span>
            <Sparkles size={12} className="text-yellow-400 flex-shrink-0" />
          </div>
          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Online • {stats.totalItems} data tersedia
          </div>
        </div>
      </button>

      {/* Enhanced Chatbot Window */}
      {isChatOpen && (
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
      )}

      {/* Enhanced Settings Window */}
      {isSettingsOpen && (
        <ChatbotSettings 
          onClose={closeSettings} 
          knowledgeBase={knowledgeBase}
          updateKnowledgeBase={updateKnowledgeBase}
          knowledgeStats={stats}
        />
      )}
    </>
  );
}