import { useState, useEffect } from "react";
import { HelpCircle, X, Wrench, Info } from "lucide-react";
import HelpMenu from "./helpbutton/HelpMenu";
import { ErrorBoundary } from "react-error-boundary";

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

  // Ubah ke false jika fitur maintenance sudah selesai
  const isMaintenance = false;

  const handleClick = () => {
    if (isMaintenance) {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 5000);
      return;
    }
    setOpen((s) => !s);
  };

  // 🔹 Event Listener: buka Chatbot di window baru
  useEffect(() => {
    const handleOpenChatbot = () => {
      setOpen(false); // Tutup HelpMenu utama

      // Buka jendela Chatbot 
      const chatWindow = window.open(
        "/chatbot", // route halaman Chatbot
        "SaipulAIChatbot",
        "width=420,height=640,resizable=yes,scrollbars=yes"
      );

      // Cek setiap 0.5 detik, kalau jendela ditutup, tampilkan kembali menu utama
      const timer = setInterval(() => {
        if (chatWindow.closed) {
          clearInterval(timer);
          setOpen(true);
        }
      }, 500);
    };

    window.addEventListener("saipulai:openChatbot", handleOpenChatbot);
    return () => {
      window.removeEventListener("saipulai:openChatbot", handleOpenChatbot);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="relative group">
        {/* Efek cahaya di sekitar tombol */}
        <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

        {/* Tombol utama */}
        <button
          onClick={handleClick}
          aria-label="Buka Menu Bantuan"
          className={`relative flex items-center justify-center w-14 h-14 rounded-full
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
              size={24}
              className="animate-spin-slow text-cyan-300 drop-shadow-[0_0_6px_#22d3ee]"
            />
          ) : open ? (
            <X
              size={26}
              className="text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]"
            />
          ) : (
            <HelpCircle
              size={26}
              className="text-cyan-200 drop-shadow-[0_0_6px_#22d3ee]"
            />
          )}
        </button>

        {/* Notifikasi maintenance */}
        {isMaintenance && (
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 border border-white shadow-lg animate-pulse" />
        )}
      </div>

      {/* Popup Menu Bantuan */}
      {!isMaintenance && open && (
        <div
          className="absolute bottom-16 right-6 animate-fade-up-slow"
          style={{ transformOrigin: "bottom right" }}
        >
          <ErrorBoundary FallbackComponent={ChatbotErrorFallback}>
            <HelpMenu />
          </ErrorBoundary>
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
