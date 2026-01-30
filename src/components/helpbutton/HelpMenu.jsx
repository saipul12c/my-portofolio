// Import React untuk penggunaan JSX dan hooks jika diperlukan
import React from "react";
// Import ikon dari paket `lucide-react` yang digunakan di UI
import {
  ExternalLink,
  FileText,
  Info,
  BookOpen,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
// Mengimpor data dokumentasi statis untuk ditampilkan pada badge versi
import docsData from "./docs/data/docsSections.json";
// Mengimpor utilitas untuk mengambil informasi versi terbaru dari data docs
import { getLatestVersionInfo } from "./docs/lib/versionUtils";

// Komponen kecil untuk item dalam menu bantuan yang dapat menjadi tautan internal atau eksternal
function HelpMenuItem({ title, subtitle, icon: Icon, to, external = false, disabled = false, label = null, disabledMessage = null }) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  // Handler klik untuk navigasi atau membuka tab baru saat eksternal
  const handleClick = (e) => {
    // Mencegah perilaku default tombol/anchor
    e.preventDefault();
    // Jika disabled, jangan lakukan navigasi
    if (disabled) return;

    // Jika tautan eksternal, buka di tab baru dengan atribut keamanan
    if (external) {
      window.open(to, "_blank", "noopener,noreferrer");
      return;
    }
    // Coba gunakan assign untuk navigasi SPA; fallback ke href
    try {
      window.location.assign(to);
    } catch {
      window.location.href = to;
    }
  };

  // Render tombol/menu item dengan ikon, judul, dan subtitle jika ada
  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => disabled && disabledMessage && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left w-full
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-white/5"}`}
        aria-label={title}
        aria-disabled={disabled}
        disabled={disabled}
      >
        {/* Kontainer ikon */}
        <div className="w-9 h-9 flex items-center justify-center rounded-md bg-white/5 shrink-0">
          {/* Tampilkan ikon yang diberikan atau fallback ke FileText */}
          {Icon ? (
            <Icon size={18} className="text-cyan-300" />
          ) : (
            <FileText size={18} />
          )}
        </div>
        {/* Kontainer teks judul + subtitle */}
        <div className="flex-1">
          {/* Judul menu */}
          <div className="text-sm font-medium text-white/90 leading-tight">
            {title}
          </div>
          {/* Subtitle jika tersedia */}
          {subtitle && (
            <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
          )}
        </div>
        {/* Ikon eksternal bila benar */}
        {external && !disabled && (
          <ExternalLink size={14} className="text-gray-400 mt-1" />
        )}

        {/* Label custom atau OFF bila dinonaktifkan */}
        {disabled && (
          <div className={`text-[10px] mt-1 px-2.5 py-1 rounded-full font-medium ${
            label === "COMING SOON" 
              ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
              : label === "SEDANG DIPERBAIKI"
              ? "bg-blue-500/20 text-blue-300 border border-blue-400/40"
              : "bg-gray-800/40 text-gray-400"
          }`}>
            {label || "OFF"}
          </div>
        )}
      </button>

      {/* Tooltip untuk pesan disabled */}
      {showTooltip && disabledMessage && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 z-50">
          {disabledMessage}
          <div className="absolute top-full left-3 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

// Komponen badge yang menampilkan versi aplikasi berdasarkan data docs
function VersionBadge() {
  // Ambil info versi terbaru dari data dokumentasi
  const latest = getLatestVersionInfo(docsData);
  // Pilih properti versi yang tersedia
  const version = latest?.version || latest?.versiWebsite;

  // Handler untuk membuka halaman detail versi
  const handleOpenVersionPage = (e) => {
    e.preventDefault();
    window.location.assign("/help/version");
  };

  // Render badge versi dengan tombol untuk melihat detail
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
// Tombol khusus dalam menu untuk membuka chatbot; dapat dinonaktifkan lewat prop
function HelpChatbotButton({ onOpenChat, enabled = true }) {
  const [showTooltip, setShowTooltip] = React.useState(false);
  
  // Handler klik yang menghentikan aksi bila fitur dinonaktifkan
  const handleClick = (e) => {
    if (!enabled) {
      e.preventDefault();
      return;
    }
    onOpenChat();
  };

  // Render tombol chatbot dengan state enabled/disabled styling
  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => !enabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-colors text-left w-full
          ${enabled 
            ? "hover:bg-white/5 cursor-pointer" 
            : "opacity-50 cursor-not-allowed"
          }`}
        aria-label={enabled ? "Buka Chatbot SaipulAI" : "Chatbot SaipulAI sedang diperbaiki"}
        disabled={!enabled}
      >
        {/* Ikon chatbot */}
        <div className={`w-9 h-9 flex items-center justify-center rounded-md shrink-0
          ${enabled ? "bg-white/5" : "bg-gray-700/30"}`}>
          <MessageCircle 
            size={18} 
            className={enabled ? "text-cyan-300" : "text-gray-500"} 
          />
        </div>
        {/* Konten teks tombol */}
        <div className="flex-1">
          <div className={`text-sm font-medium leading-tight
            ${enabled ? "text-white/90" : "text-gray-500"}`}>
            Chatbot SaipulAI
          </div>
          <div className={`text-xs mt-0.5 ${enabled ? "text-gray-400" : "text-gray-500"}`}>
            {enabled ? "Tanya apa saja ke AI" : "Fitur sedang diperbaiki"}
          </div>
        </div>
        {/* Label menempel SEDANG DIPERBAIKI */}
        {!enabled && (
          <div className="text-[10px] mt-1 px-2.5 py-1 rounded-full font-medium bg-blue-500/20 text-blue-300 border border-blue-400/40">
            SEDANG DIPERBAIKI
          </div>
        )}
      </button>

      {/* Tooltip untuk pesan disabled */}
      {showTooltip && !enabled && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-200 z-50">
          Chatbot sedang dalam perbaikan
          <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

// Komponen utama menu bantuan yang merangkum item, tombol chatbot, dan badge versi
export default function HelpMenu({ onOpenChat, chatbotEnabled = false, roomEnabled = false }) {
  // Render kontainer dialog menu bantuan dengan styling dan aksesibilitas
  return (
    <div
      className="w-72 md:w-96 rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(56,189,248,0.2)]
        bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95
        backdrop-blur-2xl p-4 animate-fadeIn transition-all duration-300 max-h-[80vh] overflow-y-auto"
      role="dialog"
      aria-label="Menu Bantuan"
    >
      {/* Judul menu kecil */}
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pl-1">
        Menu Bantuan
      </div>

      {/* Daftar item menu */}
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
          title="Room Diskusi"
          subtitle="Masuk ke ruang diskusi langsung"
          icon={MessageCircle}
          to="/Live-Discussion"
          disabled={!roomEnabled}
          label="COMING SOON"
          disabledMessage="Fitur ini sedang dikembangkan"
        />
        <HelpMenuItem
          title="Komitmen / Kebijakan"
          subtitle="Janji layanan & kebijakan"
          icon={ShieldCheck}
          to="/help/commitment"
        />
        
        {/* Seksi khusus tombol chatbot */}
        <div className="mt-2 border-t border-gray-700/40 pt-3">
          <HelpChatbotButton 
            onOpenChat={onOpenChat} 
            enabled={chatbotEnabled} 
          />
        </div>
      </div>
      
      {/* Bagian footer dengan badge versi */}
      <div className="mt-4 pt-3 border-t border-gray-700/40">
        <VersionBadge />
      </div>

      {/* Copyright kecil di bawah */}
      <div className="text-[10px] text-gray-500 text-center mt-3">
        © {new Date().getFullYear()} {" "}
        <span className="text-cyan-400">Project Portofolio</span>
      </div>
    </div>
  );
}