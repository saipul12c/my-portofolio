import { motion } from "framer-motion";
import { useState, useMemo, memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Mail,
  Inbox,
  RefreshCw,
  Calendar,
  Bot,
  MessageSquare,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useContacts } from "../hooks/useContacts";
import { formatSheetDBDateToHuman } from "../utils/formatDate";
import { getEmailSecurityBadge } from "../utils/emailValidator";
import { analyzePriority } from "../utils/analyzePriority";

const getInitialColor = (name) => {
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];
  const index = name ? name.charCodeAt(0) % colors.length : 0;
  return colors[index];
};

const getEmailVerification = (email) => {
  if (!email) {
    return {
      icon: <ShieldAlert size={12} className="text-gray-400 shrink-0" />,
      color: 'text-gray-400',
      text: 'Email tidak tersedia',
    };
  }
  
  const badge = getEmailSecurityBadge(email);
  const { verification } = badge;
  
  if (verification.securityLevel === 'high') {
    return {
      icon: <ShieldCheck size={12} className="text-green-500 shrink-0" />,
      color: 'text-green-500',
      text: 'Email terverifikasi',
    };
  } else if (verification.securityLevel === 'medium') {
    return {
      icon: <ShieldCheck size={12} className="text-blue-500 shrink-0" />,
      color: 'text-blue-500',
      text: verification.isCorporate ? 'Email korporat' : 'Email valid',
    };
  } else {
    return {
      icon: <ShieldAlert size={12} className="text-orange-500 shrink-0" />,
      color: 'text-orange-500',
      text: verification.isSpam ? 'Disposable/Spam' : 'Belum terverifikasi',
    };
  }
};

const parseTimestamp = (contact) => {
  const timestamp = contact.timestamp || contact.date || contact.created_at || contact.createdAt;
  if (!timestamp) return 0;
  const date = new Date(timestamp);
  return isNaN(date.getTime()) ? 0 : date.getTime();
};

// Memoized Card Item to avoid unnecessary re-renders during state changes
const ContactCard = memo(({ contact }) => {
  const analysis = contact.analysis;
  const emailStatus = contact.emailStatus;

  return (
    <div
      className="bg-slate-800/40 border border-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 group hover:border-cyan-500/30 hover:ring-1 hover:ring-cyan-500/30 hover:shadow-lg hover:bg-slate-800/60"
    >
      <div className="flex flex-col gap-2.5">
        {/* Header: User Info & Time */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 bg-gradient-to-br ${getInitialColor(contact.name)} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
              {contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-xs sm:text-sm truncate">
                {contact.name || "Anonymous"}
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400">
                <Mail size={11} className="shrink-0 text-cyan-400" />
                <span className="truncate">{contact.email || "No email"}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Calendar size={10} />
              <span>{contact.date ? formatSheetDBDateToHuman(contact.date) : "N/A"}</span>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${
              analysis.level === 'high' 
                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            }`}>
              {analysis.level.toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Message Body */}
        <div className="bg-slate-900/60 rounded-lg p-2.5 sm:p-3 border border-white/5">
          <p className="text-[12px] sm:text-[13px] text-gray-300 line-clamp-3 leading-relaxed break-words">
            {contact.message || "No message available"}
          </p>
        </div>
        
        {/* Footer: Verification status */}
        <div className="flex items-center justify-between text-[10px]">
          <div className={`flex items-center gap-1 ${emailStatus.color} font-medium`}>
            {emailStatus.icon}
            <span className="truncate max-w-[160px] sm:max-w-none">{emailStatus.text}</span>
          </div>
          <span className="text-gray-400 italic text-[10px]">
            {contact.message?.length > 100 ? 'Detail' : 'Singkat'}
          </span>
        </div>
      </div>
    </div>
  );
});

ContactCard.displayName = "ContactCard";

const ContactList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent");
  
  const {
    contacts,
    totalContacts,
    loadingContacts,
    refreshLoading,
    error,
    handleRefreshContacts,
  } = useContacts();

  // Optimized memoized contacts filter & sorting: runs priority analysis ONCE per contact
  const displayContacts = useMemo(() => {
    const safeContacts = Array.isArray(contacts) ? contacts : [];
    if (safeContacts.length === 0) return [];

    // Pre-calculate once per contact
    const enriched = safeContacts.map(contact => {
      const analysis = analyzePriority(contact.message, contact.email);
      const emailStatus = getEmailVerification(contact.email);
      const time = parseTimestamp(contact);
      return {
        ...contact,
        _time: time,
        _score: analysis.score,
        analysis,
        emailStatus
      };
    });

    if (activeTab === "recent") {
      return [...enriched].sort((a, b) => b._time - a._time).slice(0, 5);
    }
    if (activeTab === "priority") {
      return enriched
        .filter(c => c.analysis.level === 'high')
        .sort((a, b) => (b._score !== a._score ? b._score - a._score : b._time - a._time))
        .slice(0, 5);
    }
    return enriched.slice(0, 5);
  }, [contacts, activeTab]);

  const displayedCount = Array.isArray(contacts) ? contacts.length : 0;
  const totalCount = totalContacts || 0;

  return (
    <div className="space-y-4 sm:space-y-5 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1 gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="p-2 sm:p-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-md">
              <Inbox className="text-white" size={22} />
            </div>
            {totalContacts > 0 && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Pesan Terbaru
            </h2>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <Bot size={12} className="flex-shrink-0 text-cyan-400" />
              <span className="truncate">5 pesan masuk terakhir • Real-time</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefreshContacts}
          disabled={refreshLoading}
          className="p-2 bg-slate-800/80 border border-white/10 rounded-lg hover:bg-slate-700/80 hover:border-cyan-500/30 transition-colors disabled:opacity-50 shadow-md flex-shrink-0 active:scale-95"
          title="Refresh pesan"
          aria-label="Refresh pesan masuk"
        >
          <RefreshCw 
            size={16} 
            className={`text-cyan-400 ${refreshLoading ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      <div 
        className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 max-h-[650px] overflow-hidden flex flex-col shadow-xl hover:border-cyan-500/30 transition-colors duration-300"
        style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-400 mr-1">
                Filter:
              </span>
              {[
                { id: "all", label: "Semua" },
                { id: "recent", label: "Terbaru" },
                { id: "priority", label: "Prioritas" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20"
                      : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              
              <div className="relative ml-auto sm:ml-2">
                <button
                  onClick={() => navigate("/Live-Discussion")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <MessageSquare size={13} />
                  <span>Room Chat</span>
                </button>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0 self-end sm:self-center">
            <div className="text-base sm:text-xl font-bold text-cyan-400 leading-tight">
              {displayContacts.length}
            </div>
            <div className="text-[10px] text-gray-400">
              dari {totalCount} Pesan
            </div>
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto pr-1.5 sm:pr-2.5 custom-scrollbar">
          {loadingContacts ? (
            <div className="flex flex-col items-center justify-center h-44 space-y-3">
              <Loader2 className="text-cyan-400 animate-spin" size={32} />
              <div className="text-center">
                <p className="text-gray-300 font-medium text-xs sm:text-sm">Memuat Pesan</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Menyiapkan kotak masuk...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-44 space-y-3">
              <AlertCircle className="text-red-400" size={32} />
              <div className="text-center">
                <p className="text-red-400 font-medium text-xs sm:text-sm">Gagal Memuat Pesan</p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-xs">{error}</p>
                <button
                  onClick={handleRefreshContacts}
                  className="mt-3 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded-lg transition-colors flex items-center gap-1.5 mx-auto active:scale-95"
                >
                  <RefreshCw size={12} />
                  Coba Lagi
                </button>
              </div>
            </div>
          ) : displayContacts.length > 0 ? (
            displayContacts.map((contact, idx) => (
              <ContactCard key={contact.id || `contact-${idx}`} contact={contact} />
            ))
          ) : (
            <div className="text-center py-10 sm:py-12 text-gray-400 px-2">
              <Inbox size={44} className="mx-auto mb-3 opacity-30" />
              <p className="text-base sm:text-lg font-medium mb-1.5 text-gray-300">Kotak Masuk Kosong</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                {displayedCount === 0 && totalCount === 0
                  ? "Belum ada pesan yang diterima. Jadilah yang pertama mengirim pesan!"
                  : "Tidak ada pesan yang sesuai dengan filter ini."}
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] text-gray-400 flex-wrap gap-2">
            <p>
              Menampilkan <span className="font-semibold text-cyan-400">{displayContacts.length}</span> dari{' '}
              <span className="font-semibold text-blue-400">{displayedCount}</span> pesan valid
            </p>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span>Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.4);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.6);
        }
      `}</style>
    </div>
  );
};

export default memo(ContactList);
