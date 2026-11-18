import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { SLICE_LIMITS } from "../../utils/constants";

/**
 * CommitmentsSection component - displays values and service commitments
 */
export const CommitmentsSection = ({ commitments = [] }) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base font-bold text-white">Prinsip Kerja & Integritas</h4>
        </div>
        <Link
          to="/help/commitment"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 group"
        >
          <span>Detail Komitmen</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {commitments.slice(0, SLICE_LIMITS.commitments).map((c) => (
          <div
            key={c.id}
            className="p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl hover:border-emerald-500/30 transition-colors"
          >
            <div className="font-semibold text-white text-xs sm:text-sm mb-1 text-emerald-300">
              {c.title}
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              {c.short_desc || c.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
