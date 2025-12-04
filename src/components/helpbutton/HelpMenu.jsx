import React from "react";
import {
  ExternalLink,
  FileText,
  Info,
  BookOpen,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

function HelpMenuItem({ title, subtitle, icon: Icon, to, external = false }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (external) {
      window.open(to, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      window.location.assign(to);
    } catch {
      window.location.href = to;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left w-full"
      aria-label={title}
    >
      <div className="w-9 h-9 flex items-center justify-center rounded-md bg-white/5 shrink-0">
        {Icon ? (
          <Icon size={18} className="text-cyan-300" />
        ) : (
          <FileText size={18} />
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-white/90 leading-tight">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
        )}
      </div>
      {external && <ExternalLink size={14} className="text-gray-400 mt-1" />}
    </button>
  );
}

function VersionBadge() {
  const version =
    document.querySelector('meta[name="app-version"]')?.content ||
    window?.__APP_VERSION__ ||
    "v1.16.0";

  const handleOpenVersionPage = (e) => {
    e.preventDefault();
    window.location.assign("/help/version");
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center">
          <Info size={16} className="text-cyan-300" />
        </div>
        <div>
          <div className="text-xs text-gray-300">Versi Aplikasi</div>
          <div className="text-sm text-white/90 font-medium">{version}</div>
        </div>
      </div>
      <button
        onClick={handleOpenVersionPage}
        className="text-xs bg-white/6 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
        aria-label="Lihat detail versi"
      >
        Detail
      </button>
    </div>
  );
}

// Komponen untuk tombol chatbot di dalam menu
function HelpChatbotButton({ onOpenChat, enabled = true }) {
  const handleClick = (e) => {
    if (!enabled) {
      e.preventDefault();
      return;
    }
    onOpenChat();
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left w-full
        ${enabled 
          ? "hover:bg-white/5 cursor-pointer" 
          : "opacity-50 cursor-not-allowed"
        }`}
      aria-label={enabled ? "Buka Chatbot SaipulAI" : "Chatbot SaipulAI dinonaktifkan karna perbaikan"}
      disabled={!enabled}
    >
      <div className={`w-9 h-9 flex items-center justify-center rounded-md shrink-0
        ${enabled ? "bg-white/5" : "bg-gray-700/30"}`}>
        <MessageCircle 
          size={18} 
          className={enabled ? "text-cyan-300" : "text-gray-500"} 
        />
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium leading-tight
          ${enabled ? "text-white/90" : "text-gray-500"}`}>
          Chatbot SaipulAI
        </div>
        <div className="text-xs mt-0.5">
          {enabled ? "Tanya apa saja ke AI" : "Fitur sedang dinonaktifkan"}
        </div>
      </div>
      {!enabled && (
        <div className="text-[10px] text-gray-500 mt-1 px-2 py-1 bg-gray-800/50 rounded">
          OFF
        </div>
      )}
    </button>
  );
}

export default function HelpMenu({ onOpenChat, chatbotEnabled = true }) {
  return (
    <div
      className="w-72 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(56,189,248,0.2)]
        bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95
        backdrop-blur-2xl p-4 animate-fadeIn transition-all duration-300 max-h-[80vh] overflow-y-auto"
      role="dialog"
      aria-label="Menu Bantuan"
    >
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pl-1">
        Menu Bantuan
      </div>

      <div className="flex flex-col gap-2">
        <HelpMenuItem
          title="FAQ (Pertanyaan Umum)"
          subtitle="Panduan cepat & jawaban umum"
          icon={BookOpen}
          to="/help/faq"
        />
        <HelpMenuItem
          title="Dokumentasi"
          subtitle="Halaman dokumentasi lengkap"
          icon={FileText}
          to="/help/docs"
        />
        <HelpMenuItem
          title="Komitmen / Kebijakan"
          subtitle="Janji layanan & kebijakan"
          icon={ShieldCheck}
          to="/help/commitment"
        />
        
        {/* 🔹 Tombol Chatbot - Dikontrol oleh prop chatbotEnabled */}
        <div className="mt-2 border-t border-gray-700/40 pt-3">
          <HelpChatbotButton 
            onOpenChat={onOpenChat} 
            enabled={chatbotEnabled} 
          />
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-700/40">
        <VersionBadge />
      </div>

      <div className="text-[10px] text-gray-500 text-center mt-3">
        © {new Date().getFullYear()}{" "}
        <span className="text-cyan-400">Project Portofolio</span>
      </div>
    </div>
  );
}