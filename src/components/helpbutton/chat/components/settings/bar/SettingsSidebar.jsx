import { Palette, Cpu, Database, FileText, Archive, Zap, Shield, Keyboard, Menu } from "lucide-react";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function SettingsSidebar({ activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isUserClickRef = useRef(false); // Track if user clicked button (prevent sync loop)

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

  // Mapping between URL path segment and tab id (memoized to keep stable reference)
  const pathToTab = useMemo(() => ({
    general: 'umum',
    ai: 'ai',
    data: 'data',
    file: 'files',
    performance: 'perform',
    privacy: 'privacy',
    storage: 'storage',
    advanced: 'shortcuts'
  }), []);

  const tabToPath = useMemo(() => Object.entries(pathToTab).reduce((acc, [k, v]) => {
    acc[v] = k; return acc;
  }, {}), [pathToTab]);

  // FIXED: Sync active tab from current route ONLY when user navigates via URL/back button
  // Do NOT sync when user clicks button (isUserClickRef prevents this)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // If user just clicked button, don't sync from route
    if (isUserClickRef.current) {
      isUserClickRef.current = false;
      return;
    }

    // Sync from URL (e.g., browser back/forward, direct URL access)
    const parts = location.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || 'general';
    const mapped = pathToTab[last] || (last === 'settings' ? 'general' : null);
    if (mapped && mapped !== activeTab) {
      setActiveTab(mapped);
    }
  }, [location.pathname, pathToTab]);

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
          onClick={() => {
            // FIXED: Mark that this is a user click, prevent sync loop in useEffect
            isUserClickRef.current = true;
            
            // Update active tab immediately (synchronous state update)
            setActiveTab(tab.id);
            
            // Navigate to route AFTER state is queued
            // Use proper path mapping
            const p = tabToPath[tab.id] || 'general';
            navigate(`/help/chatbot/settings/${p}`);
          }}
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