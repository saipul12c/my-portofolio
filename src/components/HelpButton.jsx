import { useState } from "react";
import { HelpCircle, X, Wrench, Info } from "lucide-react";
import HelpMenu from "./helpbutton/HelpMenu";
import Maintenance from "../pages/errors/Maintenance";

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [showNotice, setShowNotice] = useState(false);

  // 🧩 Aktifkan maintenance mode
  const isMaintenance = true;

  const handleOpenChatbot = () => setOpen(false);

  const handleClick = () => {
    if (isMaintenance) {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 5000);
    } else {
      setOpen(!open);
    }
  };

  if (isMaintenance && false) {
    return <Maintenance />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="relative group">
        {/* 🌟 Tombol utama */}
        <button
          onClick={handleClick}
          aria-label="Buka Menu Bantuan"
          className={`relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full p-4 shadow-[0_0_25px_rgba(34,211,238,0.4)] backdrop-blur-md border border-cyan-300/30 transition-all duration-500 ease-out hover:scale-110 hover:shadow-[0_0_35px_rgba(34,211,238,0.6)] focus:outline-none ${
            open ? "rotate-90" : "rotate-0"
          }`}
        >
          {isMaintenance ? (
            <Wrench size={22} className="animate-spin-slow drop-shadow-[0_0_6px_#22d3ee]" />
          ) : open ? (
            <X size={22} className="drop-shadow-[0_0_6px_#22d3ee]" />
          ) : (
            <HelpCircle size={22} className="drop-shadow-[0_0_6px_#22d3ee]" />
          )}
        </button>

        {/* 🔔 Badge status maintenance */}
        {isMaintenance && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-md border border-white animate-pulse" />
        )}

        {/* 🌈 Lingkaran cahaya latar */}
        <div className="absolute inset-0 -z-10 bg-cyan-500/20 blur-2xl rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700" />
      </div>

      {/* Menu Bantuan */}
      {!isMaintenance && open && <HelpMenu onOpenChatbot={handleOpenChatbot} />}

      {/* 💫 Popup notifikasi melebar */}
      {showNotice && (
        <div className="absolute bottom-24 right-0 flex items-center gap-3 bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.45)] px-5 py-3 w-[340px] animate-slide-left-fade">
          {/* Ikon glowing */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_15px_rgba(251,191,36,0.5)] shrink-0">
            <Info size={20} className="text-white" />
          </div>

          {/* Isi teks notifikasi */}
          <div className="flex-1">
            <p className="text-sm font-semibold text-white/90">
              Fitur Dalam Pengembangan 🚧
            </p>
            <p className="text-[13px] text-gray-200/80 leading-snug mt-0.5">
              Kami sedang menyempurnakan sistem agar lebih stabil dan interaktif.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
