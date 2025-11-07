import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatbotWindow } from "./components/ChatbotWindow";
import { ChatbotSettings } from "./components/ChatbotSettings";

export default function HelpChatbotItem() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <>
      {/* Tombol di menu bantuan dengan styling yang konsisten */}
      <button
        onClick={openChat}
        className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left w-full"
        aria-label="Buka Chatbot SaipulAI"
      >
        <div className="w-9 h-9 flex items-center justify-center rounded-md bg-white/5 shrink-0">
          <MessageCircle size={18} className="text-cyan-300" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-white/90 leading-tight">
            Chatbot SaipulAI
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Tanya apa saja ke AI
          </div>
        </div>
      </button>

      {/* Jendela Chatbot - akan muncul sebagai popup terpisah di pojok kanan bawah */}
      {isChatOpen && (
        <ChatbotWindow
          onClose={closeChat}
          onOpenSettings={() => {
            closeChat();
            openSettings();
          }}
        />
      )}

      {/* Jendela Pengaturan */}
      {isSettingsOpen && <ChatbotSettings onClose={closeSettings} />}
    </>
  );
}