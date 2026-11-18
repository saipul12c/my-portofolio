import { Palette, Cpu, Shield, Keyboard, Menu } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
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
    { id: "umum", label: "Tampilan & Suara", icon: Palette },
    { id: "ai", label: "Gaya & Karakter AI", icon: Cpu },
    { id: "privacy", label: "Privasi & Data", icon: Shield },
    { id: "shortcuts", label: "Pintasan Keyboard", icon: Keyboard }
  ];

  // Mapping between URL path segment and tab id (with backwards-compatible aliases)
  const pathToTab = useMemo(() => ({
    general: 'umum',
    appearance: 'umum',
    umum: 'umum',
    ai: 'ai',
    data: 'ai',
    behavior: 'ai',
    privacy: 'privacy',
    storage: 'privacy',
    file: 'privacy',
    files: 'privacy',
    performance: 'umum',
    perform: 'umum',
    shortcuts: 'shortcuts',
    advanced: 'shortcuts'
  }), []);

  const tabToPath = useMemo(() => ({
    umum: 'general',
    ai: 'ai',
    privacy: 'privacy',
    shortcuts: 'shortcuts'
  }), []);

  // Sync active tab from current route ONLY when user navigates via URL/back button
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
    const mapped = pathToTab[last] || (last === 'settings' ? 'umum' : null);
    if (mapped && mapped !== activeTab) {
      setActiveTab(mapped);
    }
  }, [location.pathname, pathToTab, activeTab, setActiveTab]);

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
          className={`group relative flex items-center gap-2 rounded-lg transition-all ${collapsed ? 'justify-center w-10 h-10' : 'justify-start px-3 py-2'}`}
          onClick={() => {
            isUserClickRef.current = true;
            setActiveTab(tab.id);
            const p = tabToPath[tab.id] || 'general';
            navigate(`/help/chatbot/settings/${p}`, { replace: true });
          }}
          aria-label={tab.label}
          style={activeTab === tab.id ? { background: 'var(--saipul-accent-gradient)', color: '#fff', border: '1px solid rgba(255,255,255,0.06)' } : { color: 'var(--saipul-muted-text)' }}
        >
          <tab.icon size={16} />
          <span className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm ${collapsed ? 'hidden' : 'inline'}`}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
