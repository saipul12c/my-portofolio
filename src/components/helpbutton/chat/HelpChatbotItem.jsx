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
      {/* Tombol di menu bantuan */}
      <li>
        <button
          onClick={openChat}
          className="flex items-center gap-2 text-green-400 hover:text-white transition-all duration-200 w-full text-left"
        >
          <MessageCircle size={15} />
          SaipulAI (Chatbot)
        </button>
      </li>

      {/* Jendela Chatbot */}
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
