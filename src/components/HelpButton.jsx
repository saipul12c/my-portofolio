import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HelpCircle, X, Wrench, Info } from "lucide-react";
import HelpMenu from "./helpbutton/HelpMenu";
import { ErrorBoundary } from "react-error-boundary";
import { ChatbotWindow } from "./helpbutton/chat/components/ChatbotWindow";
import { ChatbotSettings } from "./helpbutton/chat/components/ChatbotSettings";
import { useRecaptcha } from "../context/useRecaptcha";

function ChatbotErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="fixed bottom-24 right-6 bg-red-900/90 text-white p-4 rounded-xl shadow-lg max-w-xs">
      <p className="font-semibold">⚠️ Chatbot Error</p>
      <p className="text-sm mt-1 break-words">
        {error?.message ?? "Terjadi kesalahan"}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-all"
      >
        Reload
      </button>
    </div>
  );
}

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showMainTooltip, setShowMainTooltip] = useState(false);
  const { isRecaptchaVisible } = useRecaptcha();

  // Ubah ke false jika fitur maintenance sudah selesai
  const isMaintenance = false;

  // Kontrol untuk mengaktifkan/menonaktifkan chatbot
  // Ubah ke true untuk mengaktifkan, false untuk menonaktifkan
  const isChatbotEnabled = true;

  // Kontrol untuk mengaktifkan/menonaktifkan tombol Room Diskusi
  // Ubah ke true ketika fitur sudah siap dirilis
  const isRoomDiscussionEnabled = true;

  const handleClick = () => {
    if (isMaintenance) {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 5000);
      return;
    }
    setOpen((s) => !s);
  };

  const openChat = () => {
    // Hanya buka chatbot jika diaktifkan
    if (!isChatbotEnabled) return;

    setOpen(false); // Tutup menu bantuan utama
    setIsChatOpen(true);
  };

  const closeChat = () => setIsChatOpen(false);

  const openSettings = () => {
    closeChat();
    setIsSettingsOpen(true);
  };

  const closeSettings = () => setIsSettingsOpen(false);

  // ✅ Logika untuk menyimpan percakapan chatbot di localStorage
  useEffect(() => {
    if (isChatOpen) {
      const chatObserver = new MutationObserver(() => {
        const chatContent = document.querySelector(".chat-window").innerText;
        localStorage.setItem("chatHistory", chatContent);
      });

      const chatWindow = document.querySelector(".chat-window");
      if (chatWindow) {
        chatObserver.observe(chatWindow, { childList: true, subtree: true });
      }

      return () => chatObserver.disconnect();
    }
  }, [isChatOpen]);

  return (
    <div
      className="fixed right-6 z-[9999] transition-all duration-300"
      style={{ bottom: isRecaptchaVisible ? '110px' : '20px' }}
    >
      <div className="relative group">
        {/* Efek cahaya di sekitar tombol */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

        {/* Tombol utama */}
        <button
          onClick={handleClick}
          onMouseEnter={() => setShowMainTooltip(true)}
          onMouseLeave={() => setShowMainTooltip(false)}
          aria-label="Buka Menu Bantuan"
          className={`relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full
            bg-gradient-to-br from-cyan-400/40 to-blue-600/50
            backdrop-blur-xl border border-white/20 text-white
            shadow-[0_0_25px_rgba(56,189,248,0.5)]
            transition-all duration-500 ease-out
            hover:scale-110 hover:shadow-[0_0_35px_rgba(56,189,248,0.7)]
            active:scale-95
            ${open ? "rotate-90" : "rotate-0"}
          `}
        >
          {isMaintenance ? (
            <Wrench
              size={20}
              className="md:w-6 md:h-6 animate-spin-slow text-cyan-300 drop-shadow-[0_0_6px_#22d3ee]"
            />
          ) : open ? (
            <X
              size={22}
              className="md:w-7 md:h-7 text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]"
            />
          ) : (
            <HelpCircle
              size={22}
              className="md:w-7 md:h-7 text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]"
            />
          )}
        </button>

        {/* Tooltip untuk tombol utama */}
        {showMainTooltip && !open && !isMaintenance && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-max bg-gray-900 border border-cyan-400/30 rounded-lg px-3 py-2 text-xs text-gray-200 z-50 whitespace-nowrap shadow-lg">
            📚 Menu Bantuan & Support - Akses FAQ, Docs, dan AI Chatbot
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-cyan-400/30 rotate-45"></div>
          </div>
        )}

        {/* Tooltip untuk maintenance */}
        {showMainTooltip && !open && isMaintenance && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-max bg-yellow-900/80 border border-yellow-400/50 rounded-lg px-3 py-2 text-xs text-yellow-100 z-50 whitespace-nowrap shadow-lg">
            🔧 Sistem sedang perbaikan - Kembali lagi sebentar
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-900/80 border-r border-b border-yellow-400/50 rotate-45"></div>
          </div>
        )}

        {/* Notifikasi maintenance */}
        {isMaintenance && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border border-white shadow-lg animate-pulse" />
        )}
      </div>

      {/* Popup Menu Bantuan */}
      {!isMaintenance && open && createPortal(
        <div
          className="fixed z-[10000] animate-fade-up-slow"
          style={{ 
            bottom: `calc(${isRecaptchaVisible ? '110px' : '20px'} + 5rem)`,
            right: '3rem',
            transformOrigin: "bottom right" 
          }}
        >
          <ErrorBoundary FallbackComponent={ChatbotErrorFallback}>
            <HelpMenu
              onOpenChat={openChat}
              chatbotEnabled={isChatbotEnabled}
              roomEnabled={isRoomDiscussionEnabled}
              isMaintenance={isMaintenance}
            />
          </ErrorBoundary>
        </div>,
        document.body
      )}

      {/* Popup Chatbot - TERPISAH dari menu bantuan */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-80 z-[10000]">
          <ChatbotWindow
            onClose={closeChat}
            onOpenSettings={openSettings}
          />
        </div>
      )}

      {/* Popup Settings */}
      {isSettingsOpen && (
        <div className="fixed bottom-24 right-80 z-[10000]">
          <ChatbotSettings onClose={closeSettings} />
        </div>
      )}

      {/* Pesan pemberitahuan saat maintenance aktif */}
      {showNotice && (
        <div
          className="absolute bottom-24 right-0 w-[360px] flex items-start gap-3
          px-5 py-4 rounded-2xl border border-white/20 
          bg-gradient-to-r from-[#0f172a]/80 to-[#1e293b]/80 
          backdrop-blur-2xl text-white shadow-[0_8px_35px_rgba(0,0,0,0.45)]
          animate-slide-left-fade"
        >
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.6)]">
            <Info size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/90">
              Fitur Dalam Pengembangan 🚧
            </p>
            <p className="text-[13px] text-gray-300/90 leading-snug mt-0.5">
              Sistem bantuan sedang dalam tahap penyempurnaan agar lebih stabil
              dan interaktif.
            </p>
          </div>
        </div>
      )}

      {/* Efek hiasan cahaya */}
      <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-5 right-20 w-16 h-16 bg-blue-500/10 blur-2xl rounded-full pointer-events-none" />
    </div>
  );
}