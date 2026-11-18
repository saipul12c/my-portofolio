import React from "react";
import { Link } from "react-router-dom";
import { Compass, Target, ArrowRight } from "lucide-react";
import { VISION_MISSION } from "../../utils/constants";

/**
 * VisionMissionSection component - displays vision, mission and philosophy
 */
export const VisionMissionSection = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-purple-950/20 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-purple-500/20 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-purple-400" />
          <h4 className="text-base font-bold text-white">Visi & Misi Transformasi Edukasi</h4>
        </div>
        <Link
          to="/visi"
          className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 group"
        >
          <span>Laman Visi Lengkap</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
            Visi Besar
          </span>
          <p>{VISION_MISSION.vision}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
            Misi Strategis
          </span>
          <p>{VISION_MISSION.mission}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-purple-400" /> Pilar Nilai:
        </span>
        {VISION_MISSION.values.map((value, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full text-xs font-medium"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
};
