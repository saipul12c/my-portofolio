import React from "react";
import { Link } from "react-router-dom";
import { Award, Target, Compass, Sparkles, ArrowRight } from "lucide-react";
import { DEFAULT_DESCRIPTION, VISION_MISSION } from "../../utils/constants";

/**
 * ProfileIntro component - displays profile overview, values, and vision
 */
export const ProfileIntro = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Intro Description Box */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Ringkasan & Filosofi Profesional</h3>
            <p className="text-xs text-slate-400">Evolusi antara pedagogi dan rekayasa perangkat lunak edukatif</p>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
          {profile?.description || DEFAULT_DESCRIPTION}
        </p>

        {/* Highlight Values Pill */}
        <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-cyan-400" /> Nilai Utama:
          </span>
          {VISION_MISSION.values.map((val, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-cyan-300 border border-slate-700/60"
            >
              {val}
            </span>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 px-3.5 py-2 rounded-xl transition-all"
          >
            <span>Halaman Tentang Saya Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/visi"
            className="inline-flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/60 px-3.5 py-2 rounded-xl transition-all"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Visi & Misi Menyeluruh</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
