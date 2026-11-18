import React from "react";
import { Link } from "react-router-dom";
import { Send, Briefcase, Sparkles, MessageCircle } from "lucide-react";
import { OWNER_FACTS } from "../../utils/constants";

/**
 * FooterCTA component - call-to-action buttons with working React Router Links
 */
export const FooterCTA = () => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-800/80">
      <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-purple-950/40 border border-cyan-500/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-white text-base">Siap Berkolaborasi?</h4>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm">
            Terbuka untuk pengembangan aplikasi edukasi, modul pembelajaran interaktif, dan proyek digital.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>Katalog Proyek</span>
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Hubungi Saya</span>
          </Link>
          <a
            href={OWNER_FACTS.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
