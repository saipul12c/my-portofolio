import React from "react";

export const StatCard = ({ title, value, subtitle, color, icon }) => (
    <div className={`${color} p-4 rounded-xl border border-white/10`}>
        <div className="flex items-center justify-between mb-2">
            <span className="text-lg">{icon}</span>
            <span className="text-2xl font-bold">{value}</span>
        </div>
        <h4 className="font-semibold text-white">{title}</h4>
        {subtitle && <p className="text-xs text-white/80 mt-1">{subtitle}</p>}
    </div>
);