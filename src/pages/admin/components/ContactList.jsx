import { motion } from "framer-motion";
import { useState } from "react";
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
import { formatDate, formatSheetDBDateToHuman } from "../utils/formatDate";
import { getEmailSecurityBadge } from "../utils/emailValidator";
import { shouldMarkAsPriority, analyzePriority } from "../utils/analyzePriority";

const ContactList = () => {
  const [activeTab, setActiveTab] = useState("recent"); // Default ke terbaru
  const [hoveredContact, setHoveredContact] = useState(null);
  const [emailWarningTooltip, setEmailWarningTooltip] = useState(null);
  const [chatRoomHover, setChatRoomHover] = useState(false);
  const [showSpamFilter, setShowSpamFilter] = useState(true); // Toggle spam filter
  
  const {
    contacts,
    totalContacts,
    loadingContacts,
    refreshLoading,
    error,
    handleRefreshContacts,
  } = useContacts();

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

  // Get email verification status with comprehensive validation
  const getEmailVerification = (email) => {
    if (!email) {
      return {
        verified: false,
        level: 'unknown',
        icon: '❓',
        color: 'text-gray-400',
        text: 'Email tidak tersedia',
        description: 'Tidak ada email yang diberikan'
      };
    }
    
    const badge = getEmailSecurityBadge(email);
    const { verification } = badge;
    
    // Map security levels to UI elements
    const uiMap = {
      high: {
        verified: true,
        icon: <ShieldCheck size={14} className="text-green-500" />,
        color: 'text-green-500',
        text: '📧 Email terverifikasi',
        description: badge.description,
        showWarning: false
      },
      medium: {
        verified: true,
        icon: <ShieldCheck size={14} className="text-blue-500" />,
        color: 'text-blue-500',
        text: '📧 Email valid',
        description: verification.isCorporate 
          ? 'Email korporat yang legitimate' 
          : badge.description,
        showWarning: false
      },
      low: {
        verified: false,
        icon: <ShieldAlert size={14} className="text-orange-500" />,
        color: 'text-orange-500',
        text: '📧 Email belum terverifikasi',
        description: verification.isSpam 
          ? 'Email disposable/spam terdeteksi - BERBAHAYA!'
          : 'Email dari domain yang tidak terverifikasi',
        showWarning: true,
        warningLevel: verification.isSpam ? 'danger' : 'warning'
      },
      unknown: {
        verified: false,
        icon: <ShieldAlert size={14} className="text-gray-400" />,
        color: 'text-gray-400',
        text: '📧 Status tidak diketahui',
        description: 'Tidak dapat memverifikasi email ini',
        showWarning: false
      }
    };
    
    const result = uiMap[verification.securityLevel] || uiMap.unknown;
    
    // Add typo suggestion if exists
    if (verification.hasTypo && verification.suggestion) {
      result.typoSuggestion = verification.suggestion;
      result.description += ` | Kemungkinan typo, maksud Anda: ${verification.suggestion}?`;
    }
    
    return result;
  };

  // Helper function untuk parse timestamp
  const parseTimestamp = (contact) => {
    const timestamp = contact.timestamp || contact.date || contact.created_at || contact.createdAt;
    if (!timestamp) return 0;
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? 0 : date.getTime();
  };

  // Filter contacts based on active tab (contacts sudah difilter dari hook)
  const getFilteredContacts = () => {
    // Pastikan contacts selalu array, bahkan jika undefined/null
    const safeContacts = Array.isArray(contacts) ? contacts : [];
    
    if (safeContacts.length === 0) return [];
    
    let filtered = [...safeContacts]; // Clone array
    
    switch (activeTab) {
      case "recent":
        // Ambil hanya 5 email terbaru, sort berdasarkan timestamp
        filtered = filtered.sort((a, b) => parseTimestamp(b) - parseTimestamp(a));
        filtered = filtered.slice(0, 5);
        break;
      case "priority":
        // Filter email yang teranalisa sebagai priority (automatic)
        // Urutkan berdasarkan priority score (descending), kemudian timestamp
        filtered = filtered
          .filter(contact => shouldMarkAsPriority(contact.message, contact.email))
          .sort((a, b) => {
            // Sort by priority score (descending)
            const scoreA = analyzePriority(a.message, a.email).score;
            const scoreB = analyzePriority(b.message, b.email).score;
            if (scoreB !== scoreA) return scoreB - scoreA;
            // Jika score sama, sort by timestamp terbaru
            return parseTimestamp(b) - parseTimestamp(a);
          })
          .slice(0, 5);
        break;
      case "all":
      default:
        // Tampilkan semua tanpa sorting khusus (sudah disort di hook)
        break;
    }
    
    // Limit to 5 contacts jika belum di-limit pada case-nya
    if (activeTab !== "recent" && activeTab !== "priority") {
      filtered = filtered.slice(0, 5);
    }
    return filtered;
  };

  const displayContacts = getFilteredContacts();
  const displayedCount = Array.isArray(contacts) ? contacts.length : 0;
  const totalCount = totalContacts || 0;

  return (
    <div className="space-y-6 w-full min-h-[500px]">
      {/* Debug info - hapus nanti */}
      <div className="sr-only">ContactList Component Loaded</div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
              <Inbox className="text-white" size={28} />
            </div>
            {totalContacts > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Pesan Terbaru
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Bot size={14} />
              5 pesan masuk terakhir • Real-time updates
            </p>
          </div>
        </div>
        
        <motion.button
          onClick={handleRefreshContacts}
          disabled={refreshLoading}
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
          title="Refresh pesan"
        >
          <RefreshCw 
            size={20} 
            className={`text-purple-600 dark:text-purple-400 ${refreshLoading ? 'animate-spin' : ''}`} 
          />
        </motion.button>
      </div>

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/30 dark:border-gray-700/50 rounded-3xl p-6 max-h-[700px] overflow-hidden flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-500">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Filter:
              </div>
              {["all", "recent", "priority"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {tab === "all" ? "Semua" : tab === "recent" ? "Terbaru" : "Prioritas"}
                </button>
              ))}
              
              {/* Tombol Room Chat - Disabled */}
              <div
                className="relative ml-2"
                onMouseEnter={() => setChatRoomHover(true)}
                onMouseLeave={() => setChatRoomHover(false)}
              >
                <button
                  disabled
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60 flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Room Chat
                </button>
                
                {/* Hover Popup */}
                {chatRoomHover && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 left-0 bg-gray-900 dark:bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg border border-gray-700 z-50"
                  >
                    🔧 Fitur sedang dikembangkan
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {displayContacts.length}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              dari {totalCount} Pesan
            </div>
          </div>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar">
          {loadingContacts ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="animate-spin">
                <Loader2 className="text-purple-600 dark:text-purple-400" size={40} />
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 font-medium">Memuat Pesan</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Menyiapkan kotak masuk...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <AlertCircle className="text-red-500" size={48} />
              <div className="text-center">
                <p className="text-red-500 font-medium">Gagal Memuat Pesan</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{error}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Data tidak tersedia atau terjadi kesalahan koneksi
                </p>
                <button
                  onClick={handleRefreshContacts}
                  className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={16} />
                  Coba Lagi
                </button>
              </div>
            </div>
          ) : displayContacts.length > 0 ? (
            displayContacts.map((contact, idx) => (
              <div
                key={contact.id || `contact-${idx}`}
                onMouseEnter={() => setHoveredContact(idx)}
                onMouseLeave={() => setHoveredContact(null)}
                className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border-2 rounded-2xl p-5 transition-all duration-300 group cursor-pointer ${
                  hoveredContact === idx
                    ? "border-purple-300 dark:border-purple-500 shadow-2xl transform scale-105"
                    : "border-purple-100 dark:border-purple-900/30 shadow-lg"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${getInitialColor(contact.name)} rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                        {contact.name ? contact.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-base break-words max-w-[150px]">
                          {contact.name || "Anonymous"}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <Mail size={12} />
                          {contact.email || "Email tidak tersedia"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
                        <Calendar size={12} />
                        <span>{contact.date ? formatSheetDBDateToHuman(contact.date) : (contact.timestamp ? formatDate(contact.timestamp) : "Tanggal tidak tersedia")}</span>
                      </div>
                      
                      {/* Priority Badge - Automatic Analysis */}
                      {(() => {
                        const analysis = analyzePriority(contact.message, contact.email);
                        return (
                          <div
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold border transition-all ${
                              analysis.level === 'high'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            }`}
                            title={`Priority Score: ${analysis.score}/100\n${analysis.reasons.join('\n')}`}
                          >
                            <span className="text-lg">{analysis.level === 'high' ? '🔴' : '🔵'}</span>
                            <span>{analysis.level === 'high' ? 'HIGH' : 'NORMAL'}</span>
                            <span className="opacity-70">({analysis.score})</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-600/50 dark:to-gray-700/50 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                        {contact.message || "Pesan tidak tersedia"}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative group">
                          {(() => {
                            const emailStatus = getEmailVerification(contact.email);
                            
                            return (
                              <>
                                <span 
                                  className={`flex items-center gap-1 ${emailStatus.color} cursor-help transition-all`}
                                  onMouseEnter={() => setEmailWarningTooltip(idx)}
                                  onMouseLeave={() => setEmailWarningTooltip(null)}
                                >
                                  {emailStatus.icon}
                                  {emailStatus.text}
                                </span>
                                
                                {emailWarningTooltip === idx && (
                                  <div className={`absolute bottom-full left-0 mb-2 w-72 p-3 rounded-lg shadow-2xl z-50 animate-fadeIn ${
                                    emailStatus.showWarning
                                      ? emailStatus.warningLevel === 'danger'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-orange-500 text-white'
                                      : 'bg-blue-600 text-white'
                                  }`}>
                                    <div className="font-bold mb-1 flex items-center gap-1">
                                      {emailStatus.showWarning ? (
                                        <>
                                          <ShieldAlert size={14} />
                                          {emailStatus.warningLevel === 'danger' ? 'Peringatan Keamanan Tinggi' : 'Peringatan Keamanan'}
                                        </>
                                      ) : (
                                        <>
                                          <ShieldCheck size={14} />
                                          Verifikasi Email
                                        </>
                                      )}
                                    </div>
                                    <p className="leading-relaxed">{emailStatus.description}</p>
                                    {emailStatus.typoSuggestion && (
                                      <p className="mt-2 text-xs bg-white/20 p-2 rounded">
                                        💡 Saran: {emailStatus.typoSuggestion}
                                      </p>
                                    )}
                                    <div className={`absolute -bottom-1 left-4 w-2 h-2 transform rotate-45 ${
                                      emailStatus.showWarning
                                        ? emailStatus.warningLevel === 'danger'
                                          ? 'bg-red-600'
                                          : 'bg-orange-500'
                                        : 'bg-blue-600'
                                    }`}></div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <span className="text-gray-400">
                          {contact.message && contact.message.length > 100 ? '⭐ Prioritas tinggi' : '💬 Pesan standar'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <Inbox size={64} className="mx-auto mb-6 opacity-30" />
              <p className="text-2xl font-medium mb-3">Kotak Masuk Kosong</p>
              <p className="text-sm max-w-sm mx-auto mb-4">
                {displayedCount === 0 && totalCount === 0
                  ? "Belum ada pesan yang diterima. Jadilah yang pertama mengirim pesan dan mulai percakapan!"
                  : displayedCount === 0 && totalCount > 0
                  ? `Semua ${totalCount} pesan telah difilter sebagai spam atau tidak sesuai dengan filter ini.`
                  : "Tidak ada pesan yang sesuai dengan filter ini."}
              </p>
              {displayedCount === 0 && totalCount === 0 && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md mx-auto">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    💡 <strong>Tips:</strong> Pastikan konfigurasi SheetDB sudah benar atau kirim pesan melalui form di sebelah kanan.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Enhanced Footer info */}
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 dark:text-gray-400">
                Menampilkan <span className="font-semibold text-purple-600 dark:text-purple-400">{displayContacts.length}</span> dari{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">{displayedCount}</span> pesan valid
              </p>
              {totalCount > displayedCount && (
                <p className="text-xs text-orange-500 dark:text-orange-400">
                  🛡️ {totalCount - displayedCount} pesan spam difilter dari total {totalCount} pesan
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs">Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactList;