import React from "react";

const tabs = [
  { id: "profile", label: "Profil", icon: "📊" },
  { id: "numerology", label: "Numerologi", icon: "🔢" },
  { id: "personality", label: "Kepribadian", icon: "🧠" },
  { id: "tarot", label: "Tarot Harian", icon: "🔮" },
  { id: "couple", label: "Cek Pasangan", icon: "💖" },
  { id: "compatibility", label: "Kecocokan", icon: "❤️" },
  { id: "insights", label: "Insights", icon: "💡" }
];

export const TabNavigation = ({ activeTab, onTabChange }) => (
  <div className="flex border-b border-white/20 mb-6 overflow-x-auto scrollbar-none gap-1 pb-1">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={`flex items-center justify-center gap-1.5 whitespace-nowrap px-4 py-3 font-medium text-xs md:text-sm rounded-t-xl transition-all ${
          activeTab === tab.id
            ? "text-pink-300 border-b-2 border-pink-400 bg-gradient-to-t from-pink-500/20 to-transparent font-semibold shadow-sm"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <span>{tab.icon}</span>
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);
