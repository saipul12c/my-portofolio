import { Palette, Cpu, Database, FileText, Archive, Zap, Shield } from "lucide-react";

export function SettingsSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "umum", label: "Tampilan & Umum", icon: Palette },
    { id: "ai", label: "AI & Model", icon: Cpu },
    { id: "data", label: "Data & Analisis", icon: Database },
    { id: "files", label: "File & Data", icon: FileText },
    { id: "storage", label: "Storage & Backup", icon: Archive },
    { id: "perform", label: "Performa", icon: Zap },
    { id: "privacy", label: "Privasi & Keamanan", icon: Shield }
  ];

  const getTabClasses = (tabId) => {
    const baseClasses = "p-3 text-left flex items-center gap-2 rounded-lg transition-all";
    const activeClasses = {
      umum: "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30",
      ai: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30",
      data: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30",
      files: "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30",
      storage: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30",
      perform: "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30",
      privacy: "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30"
    };

    return `${baseClasses} ${
      activeTab === tabId 
        ? activeClasses[tabId] 
        : "hover:bg-gray-700/50 text-gray-300"
    }`;
  };

  return (
    <div className="w-52 bg-gray-800/80 border-r border-gray-700 flex flex-col text-sm p-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={getTabClasses(tab.id)}
          onClick={() => setActiveTab(tab.id)}
        >
          <tab.icon size={14} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}