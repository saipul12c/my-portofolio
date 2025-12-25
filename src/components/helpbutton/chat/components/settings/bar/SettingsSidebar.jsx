import { Palette, Cpu, Database, FileText, Archive, Zap, Shield, Keyboard, Menu } from "lucide-react";
import { useEffect, useState } from "react";

export function SettingsSidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    // Default to collapsed on small screens, expanded on md+
    if (typeof window !== "undefined") {
      setCollapsed(window.innerWidth < 768);
      const onResize = () => setCollapsed(window.innerWidth < 768);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  const tabs = [
    { id: "umum", label: "Tampilan & Umum", icon: Palette },
    { id: "ai", label: "AI & Model", icon: Cpu },
    { id: "data", label: "Data & Analisis", icon: Database },
    { id: "files", label: "File & Data", icon: FileText },
    { id: "storage", label: "Storage & Backup", icon: Archive },
    { id: "perform", label: "Performa", icon: Zap },
    { id: "privacy", label: "Privasi & Keamanan", icon: Shield },
    { id: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard }
  ];

  const getTabClasses = (tabId) => {
    const baseClasses = "text-left flex items-center gap-2 rounded-lg transition-all";
    return baseClasses;
  };

  return (
    <div className={`bg-gray-800/80 border-gray-700 flex flex-col p-2 gap-2 ${collapsed ? 'w-14' : 'w-52'} md:w-52` }>
      {/* Toggle only visible on small screens */}
      <button
        className="md:hidden mb-1 p-1 rounded-full bg-gray-700/60 text-gray-200"
        onClick={() => setCollapsed((s) => !s)}
        aria-pressed={!collapsed}
        aria-label={collapsed ? 'Open settings sidebar' : 'Collapse settings sidebar'}
      >
        <Menu size={16} />
      </button>

      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`group relative flex items-center gap-2 ${collapsed ? 'justify-center w-10 h-10' : 'justify-start px-3 py-2'}`}
          onClick={() => setActiveTab(tab.id)}
          aria-label={tab.label}
          style={activeTab === tab.id ? { background: 'var(--saipul-accent-gradient)', color: '#fff', border: '1px solid rgba(255,255,255,0.06)' } : { color: 'var(--saipul-muted-text)' }}
        >
          <tab.icon size={16} />
          <span className={`overflow-hidden text-ellipsis whitespace-nowrap ${collapsed ? 'hidden' : 'inline'}`}>{tab.label}</span>

          {/* Tooltip for small/collapsed screens: appears on hover or focus */}
          <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-[var(--saipul-surface)] text-[var(--saipul-text)] text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none ${collapsed ? '' : 'hidden'}`}>
            {tab.label}
          </div>
        </button>
      ))}
    </div>
  );
}