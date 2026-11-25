import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Rocket } from "lucide-react";

export default function HelpSubNav({ active }) {
  const location = useLocation();
  const current = active || (location.pathname.startsWith("/help/version") ? "version" : "docs");

  return (
    <div className="flex justify-center w-full mb-8 relative z-20">
      <nav
        aria-label="Navigasi Pusat Bantuan"
        className="inline-flex p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)] ring-1 ring-white/5"
      >
        <Link
          to="/help/docs"
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
            current === "docs"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/50"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <BookOpen
            size={16}
            className={current === "docs" ? "text-white" : "text-cyan-400"}
          />
          <span>Dokumentasi Sistem</span>
        </Link>

        <Link
          to="/help/version"
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
            current === "version"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/50"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Rocket
            size={16}
            className={current === "version" ? "text-white" : "text-cyan-400"}
          />
          <span>Riwayat Versi & Changelog</span>
        </Link>
      </nav>
    </div>
  );
}
