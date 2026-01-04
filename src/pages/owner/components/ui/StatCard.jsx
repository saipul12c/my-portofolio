import React from "react";

/**
 * StatCard component - displays a statistic with icon, value, and label
 */
export const StatCard = ({ icon, label, value }) => (
  <div className="bg-slate-50 rounded-xl p-4 text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 
                  bg-gradient-to-br from-teal-100 to-cyan-100 
                  rounded-full mb-3 text-teal-600">
      {icon}
    </div>
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-slate-600">{label}</div>
  </div>
);
