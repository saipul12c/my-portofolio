import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * SectionHeader component - displays a section title with icon, description, and optional link
 */
export const SectionHeader = ({ title, description, icon, to, linkText = "Lihat Semua" }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
    <div className="flex items-start gap-3">
      {icon && (
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex-shrink-0 mt-0.5">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
      </div>
    </div>
    {to && (
      <Link
        to={to}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/50 hover:border-cyan-500/60 px-3 py-1.5 rounded-lg transition-all self-start sm:self-auto group"
      >
        <span>{linkText}</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    )}
  </div>
);
