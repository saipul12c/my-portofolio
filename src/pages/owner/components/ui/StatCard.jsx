import React from "react";
import { Link } from "react-router-dom";

/**
 * StatCard component - displays a statistic with icon, value, label, and optional link
 */
export const StatCard = ({ icon, label, value, to, trend }) => {
  const content = (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 group h-full flex flex-col items-center justify-center">
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 mb-3 group-hover:scale-110 group-hover:border-cyan-400/50 transition-all">
        {icon}
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
        {value}
      </div>
      <div className="text-xs font-medium text-slate-400 mt-1">{label}</div>
      {trend && (
        <span className="mt-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {trend}
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
};
