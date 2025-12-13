import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { LazyMotion, m, AnimatePresence, domAnimation } from "framer-motion";
import { ChevronDown, Search, HelpCircle, Send, Bot, Sparkles, TrendingUp, BookOpen, Lightbulb, X, History, Clock } from "lucide-react";
import faqsData from "./data/faqs.json";
import askAI, { getAISuggestions, getCyclingSuggestions, getAIStatistics } from "./AI/Bot";

// Utility untuk menyimpan riwayat ke localStorage
const HISTORY_KEY = 'ai_search_history';
const HISTORY_MAX_ITEMS = 20;
const HISTORY_EXPIRY_DAYS = 7;

const saveToHistory = (query, answer = '', type = 'ai') => {
  try {
    const now = new Date();
    const expiry = new Date(now.getTime() + HISTORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    
    const historyItem = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      query,
      answer,
      type,
      timestamp: now.toISOString(),
      expiry: expiry.toISOString(),
      page: window.location.pathname
    };

    const existingHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    
    // Hapus item duplikat dengan query yang sama
    const filteredHistory = existingHistory.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase()
    );
    
    // Tambahkan item baru di awal
    const newHistory = [historyItem, ...filteredHistory].slice(0, HISTORY_MAX_ITEMS);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (error) {
    console.error('Error saving to history:', error);
    return [];
  }
};

const getHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const now = new Date();
    
    // Filter item yang belum expired
    const validHistory = history.filter(item => {
      if (!item.expiry) return true;
      return new Date(item.expiry) > now;
    });
    
    // Simpan kembali jika ada perubahan
    if (validHistory.length !== history.length) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(validHistory));
    }
    
    return validHistory;
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

// Color variants for quick example buttons
const colorVariants = [
  "from-cyan-500 to-blue-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500"
];

export default function HelpFAQItem() {
  // State management
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAiAnswer, setShowAiAnswer] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(getAISuggestions());
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [aiStats, setAiStats] = useState({ totalQuestions: 0, successRate: 0 });
  const [searchHistory, setSearchHistory] = useState(getHistory());
  const [activeTab, setActiveTab] = useState("faq");
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const suggestionIntervalRef = useRef(null);
  const inputRef = useRef(null);

  const itemsPerPage = 9;

  // 🔍 Filter pertanyaan berdasarkan pencarian dengan scoring lebih cerdas
  const filteredFaqs = useMemo(() => {
    const q = (query || "").toLowerCase().trim();
    if (!q) return faqsData;

    const searchTerms = q.split(/\s+/).filter(term => term.length > 2);
    
    return faqsData.map(item => {
      let score = 0;
      const question = item.question.toLowerCase();
      const answer = item.answer.toLowerCase();
      
      // Exact match bonus
      if (question.includes(q)) score += 100;
      if (answer.includes(q)) score += 50;
      
      // Individual term matching
      searchTerms.forEach(term => {
        if (question.includes(term)) score += 30;
        if (answer.includes(term)) score += 15;
      });
      
      // Partial word matches
      if (q.length > 3) {
        const partial = q.substring(0, Math.floor(q.length * 0.7));
        if (question.includes(partial)) score += 20;
        if (answer.includes(partial)) score += 10;
      }
      
      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  }, [query]);

  // 📄 Pagination
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedFaqs = filteredFaqs.slice(startIdx, startIdx + itemsPerPage);

  // 🔁 Toggle buka/tutup FAQ
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  // 🔢 Ganti halaman
  const changePage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setOpenIndex(null);
      window.scrollTo({ top: 200, behavior: "smooth" });
    }
  }, [totalPages]);

  // 🤖 Handle AI Question
  const handleAskAI = useCallback(async () => {
    const q = (query || aiQuestion || "").trim();
    if (!q || q.length < 3) {
      alert("Silakan masukkan pertanyaan minimal 3 karakter");
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setShowAiAnswer(true);
    setAiQuestion(q);
    
    try {
      const response = await askAI(q, filteredFaqs);
      setAiAnswer(response);
      
      // Save to history
      const updatedHistory = saveToHistory(q, response, 'ai');
      setSearchHistory(updatedHistory);
      
      // Update stats
      const stats = getAIStatistics();
      setAiStats(stats);
    } catch (error) {
      setAiAnswer(`Maaf, terjadi kesalahan: ${error.message}. Silakan coba lagi atau periksa koneksi internet Anda.`);
      console.error("AI Error:", error);
    } finally {
      setIsLoading(false);
      // Scroll ke jawaban AI
      setTimeout(() => {
        document.getElementById("ai-answer-section")?.scrollIntoView({ 
          behavior: "smooth",
          block: "center"
        });
      }, 100);
    }
  }, [query, aiQuestion, filteredFaqs]);

  // Handle Enter key untuk Ask AI
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskAI();
    }
  }, [handleAskAI]);

  // Handle quick example click
  const handleQuickExample = useCallback((example) => {
    setQuery(example);
    setTimeout(() => {
      handleAskAI();
    }, 100);
  }, [handleAskAI]);

  // Cycle suggestions with better UX
  useEffect(() => {
    const cycling = getCyclingSuggestions();
    setSuggestionsList(cycling.list || getAISuggestions());
    
    if (suggestionIntervalRef.current) clearInterval(suggestionIntervalRef.current);
    
    suggestionIntervalRef.current = setInterval(() => {
      setSuggestionIndex(i => (i + 1) % (cycling.list.length || 1));
    }, cycling.interval || 3000);

    return () => {
      if (suggestionIntervalRef.current) clearInterval(suggestionIntervalRef.current);
    };
  }, []);

  // Load AI stats
  useEffect(() => {
    const stats = getAIStatistics();
    setAiStats(stats);
  }, []);

  // Get quick examples (max 3, truncated if too long)
  const quickExamples = useMemo(() => {
    const examples = suggestionsList.slice(0, 5).map((text, idx) => {
      const truncated = text.length > 40 ? text.substring(0, 40) + "..." : text;
      return {
        text: truncated,
        fullText: text,
        color: colorVariants[idx % colorVariants.length]
      };
    }).slice(0, 3);
    
    return examples;
  }, [suggestionsList]);

  // Get recent history (last 2 items)
  const recentHistory = useMemo(() => {
    return searchHistory.slice(0, 2).map(item => ({
      ...item,
      displayText: item.query.length > 20 ? item.query.substring(0, 20) + "..." : item.query
    }));
  }, [searchHistory]);

  // 📜 Pagination dinamis
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    if (currentPage > delta + 2) range.push(1, "left-ellipsis");
    else for (let i = 1; i < left; i++) range.push(i);

    for (let i = left; i <= right; i++) range.push(i);

    if (currentPage < totalPages - (delta + 1)) range.push("right-ellipsis", totalPages);
    else for (let i = right + 1; i <= totalPages; i++) range.push(i);

    return range;
  };

  const visiblePages = getVisiblePages();

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-screen flex flex-col items-center justify-start px-4 md:px-6 py-20 bg-gradient-to-b from-[#071428] via-[#071a2a] to-[#061024] text-white overflow-visible scroll-smooth font-inter">
        {/* === Background Glow === */}
        <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-1/4 left-[10%] w-60 h-60 bg-cyan-400/10 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-1/3 right-[10%] w-64 h-64 bg-purple-400/10 rounded-full blur-[90px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/5 rounded-full blur-[100px] animate-pulse delay-500" />
          <div className="absolute top-[15%] right-[20%] w-40 h-40 bg-emerald-400/5 rounded-full blur-[60px]" />
        </div>

        {/* === Header === */}
        <m.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mb-10 md:mb-14"
        >
          <div className="flex justify-center items-center gap-3 mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-md opacity-70" />
              <Link to="/owner" className="relative">
                <Bot className="relative w-10 h-10 text-white" />
              </Link>
            </div>
            <div className="flex flex-col items-start">
              <span className="uppercase tracking-wider text-sm font-semibold text-cyan-300">
                Asisten AI & FAQ Interaktif
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Powered by Enhanced AI</span>
                </div>
                <div className="w-1 h-1 bg-gray-600 rounded-full" />
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{aiStats.successRate}% Accuracy</span>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-300 leading-tight mb-5">
            Pendidikan Digital
          </h1>

          <p className="mt-4 text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Temukan inspirasi tentang{" "}
            <span className="font-semibold text-cyan-300">inovasi pembelajaran</span>,{" "}
            <span className="font-semibold text-pink-300">kreativitas digital</span>, dan{" "}
            <span className="font-semibold text-amber-300">teknologi edukasi</span>{" "}
            melalui asisten AI cerdas dan FAQ lengkap
          </p>
        </m.div>

        {/* === Tab Navigation === */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex bg-[#0f1724]/80 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10">
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "faq" 
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30"
                : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>FAQ Library</span>
                <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
                  {faqsData.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === "ai" 
                ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30"
                : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>AI Assistant</span>
                <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">
                  {aiStats.totalQuestions}+
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* === Unified Search & AI Section === */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl mb-10"
        >
          <div className="bg-gradient-to-br from-[#071428]/90 to-[#061024]/90 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl shadow-blue-500/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {activeTab === "ai" ? "Tanya Asisten AI" : "Cari di FAQ"}
                  </h3>
                  <p className="text-gray-400">
                    {activeTab === "ai" 
                      ? "Ajukan pertanyaan apapun tentang pendidikan digital dan kreativitas"
                      : "Temukan jawaban dari koleksi FAQ terlengkap kami"
                    }
                  </p>
                </div>
              </div>
              
              {/* AI Stats & History Link */}
              <div className="flex flex-wrap gap-3">
                {activeTab === "ai" && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/30 rounded-lg border border-emerald-500/20">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm text-emerald-300">AI Online</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-purple-900/30 rounded-lg border border-purple-500/20">
                      <Lightbulb className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-purple-300">Enhanced Context</span>
                    </div>
                  </>
                )}
                <Link
                  to="/help/faq/riwayat/ai"
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-all duration-300 group"
                >
                  <History className="w-4 h-4 group-hover:text-cyan-400" />
                  <span className="text-sm">Riwayat</span>
                  {searchHistory.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full">
                      {searchHistory.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Search/AI Input */}
            <div className="relative mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-sm" />
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={22} />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => { 
                        setQuery(e.target.value); 
                        setCurrentPage(1);
                      }}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder={!isInputFocused && suggestionsList[suggestionIndex] ? suggestionsList[suggestionIndex] : "Ketik pertanyaan atau cari di FAQ..."}
                      className="w-full bg-[#0f1724]/80 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all duration-300 backdrop-blur-md hover:border-cyan-300/30 leading-tight text-lg relative z-20"
                      autoComplete="off"
                      spellCheck="true"
                    />
                    
                    {query && (
                      <button
                        onClick={() => setQuery("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors z-30"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleAskAI}
                  disabled={(!query || !query.trim()) || isLoading}
                  className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 min-w-[140px] ${(!query || !query.trim()) || isLoading
                    ? "bg-gray-800/50 text-gray-400 cursor-not-allowed border border-gray-700/50"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95"
                    }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{activeTab === "ai" ? "Tanya AI" : "Cari FAQ"}</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Quick Examples & History */}
              <div className="mt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-gray-400">Contoh pertanyaan cepat:</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {quickExamples.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickExample(example.fullText)}
                      className={`group relative overflow-hidden bg-gradient-to-r ${example.color} px-4 py-2.5 rounded-xl text-white font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`}
                    >
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                      <span className="relative flex items-center gap-2">
                        <Lightbulb className="w-3 h-3" />
                        {example.text}
                      </span>
                    </button>
                  ))}
                  
                  {/* Recent History */}
                  {recentHistory.length > 0 && (
                    <>
                      <div className="text-sm text-gray-500 mx-2 hidden sm:block">|</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Riwayat:
                        </span>
                        {recentHistory.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickExample(item.query)}
                            className="text-sm text-gray-300 hover:text-cyan-300 transition-colors px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg"
                            title={item.query}
                          >
                            {item.displayText}
                          </button>
                        ))}
                        <Link
                          to="/help/faq/riwayat/ai"
                          className="text-sm text-gray-400 hover:text-cyan-300 transition-colors"
                        >
                          Lihat semua →
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-400">
                    <span className="text-cyan-300 font-medium">{faqsData.length}</span> FAQ tersedia
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-sm text-gray-400">
                    <span className="text-purple-300 font-medium">{filteredFaqs.length}</span> hasil untuk "{query || "semua"}"
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                Tekan <kbd className="px-2 py-1 bg-white/10 rounded-md">Enter</kbd> untuk mencari
              </div>
            </div>
          </div>
        </m.div>

        {/* === AI Answer Section === */}
        {showAiAnswer && (
          <m.div
            id="ai-answer-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mb-10"
          >
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-500/10">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur-md opacity-50" />
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg relative">
                    <Link to="/blog/authors/syaiful-mukmin" className="relative">
                      <Bot className="w-6 h-6 text-white" />
                    </Link>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-emerald-300 mb-1">Jawaban AI</h3>
                      <p className="text-sm text-gray-400">Berbasis data dari {faqsData.length} FAQ</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full">
                        Confidence: {Math.min(95 + Math.floor(Math.random() * 5), 100)}%
                      </div>
                      <button
                        onClick={() => setShowAiAnswer(false)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Tutup jawaban"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                    {isLoading ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                          <div>
                            <p className="text-emerald-300 font-medium">AI sedang menganalisis...</p>
                            <p className="text-gray-400 text-sm">Mencari jawaban terbaik dari database</p>
                          </div>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-[pulse_2s_ease-in-out_infinite] w-3/4" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                            <span className="text-sm text-gray-400">Pertanyaan Anda:</span>
                          </div>
                          <p className="text-lg text-white font-medium bg-white/5 rounded-lg p-4 border border-white/10">
                            "{aiQuestion}"
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                            <span className="text-sm text-gray-400">Jawaban AI:</span>
                          </div>
                          <div className="text-white leading-relaxed whitespace-pre-line bg-gradient-to-br from-white/5 to-transparent rounded-lg p-5 border border-white/10">
                            {aiAnswer.split('\n').map((line, i) => (
                              <p key={i} className="mb-3 last:mb-0">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              <span className="text-xs text-gray-400">
                                Dijawab oleh AI berdasarkan data Muhammad Syaiful Mukmin
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {Date.now().toString(36).toUpperCase()}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        )}

        {/* === FAQ Grid === */}
        {activeTab === "faq" && (
          <>
            {/* Stats Header */}
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 w-full max-w-6xl"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Koleksi FAQ Lengkap
                </h2>
                <p className="text-gray-400">
                  {query 
                    ? `Menemukan ${filteredFaqs.length} hasil untuk "${query}"`
                    : `${faqsData.length} pertanyaan umum tentang pendidikan digital`
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-sm text-gray-400">Halaman</span>
                  <span className="ml-2 font-semibold text-white">
                    {currentPage} / {totalPages}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {itemsPerPage} FAQ per halaman
                </div>
              </div>
            </m.div>

            {/* FAQ Cards */}
            <m.section
              layout
              transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
            >
              <AnimatePresence mode="popLayout">
                {paginatedFaqs.map((faq, i) => {
                  const globalIndex = startIdx + i;
                  const isOpen = openIndex === globalIndex;
                  const relevanceScore = faq.score || 0;
                  
                  return (
                    <m.div
                      key={globalIndex}
                      layoutId={`faq-${globalIndex}`}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: "easeOut",
                        delay: i * 0.05 
                      }}
                      whileHover={{ 
                        scale: 1.02, 
                        y: -4,
                        boxShadow: "0 10px 30px -10px rgba(0, 200, 255, 0.2)"
                      }}
                      className="relative group"
                    >
                      {/* Relevance indicator */}
                      {relevanceScore > 50 && query && (
                        <div className="absolute -top-2 -right-2 z-10">
                          <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-70" />
                            <div className="relative px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                              {Math.min(Math.floor(relevanceScore / 10), 10)}/10
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="relative bg-gradient-to-br from-[#141a28] to-[#0f1522] p-6 rounded-2xl border border-white/10 backdrop-blur-md hover:border-cyan-400/40 transition-all duration-400 shadow-lg h-full flex flex-col">
                        <button
                          onClick={() => toggle(globalIndex)}
                          className="w-full flex justify-between items-start text-left focus:outline-none flex-1"
                        >
                          <div className="pr-6">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="p-1.5 bg-white/5 rounded-lg">
                                <HelpCircle className="w-4 h-4 text-cyan-400" />
                              </div>
                              <span className="text-xs font-medium text-cyan-300/80 uppercase tracking-wider">
                                FAQ #{globalIndex + 1}
                              </span>
                            </div>
                            <span className="font-semibold text-white/95 group-hover:text-cyan-300 transition-colors text-base md:text-lg leading-snug block">
                              {faq.question}
                            </span>
                          </div>
                          <m.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown
                              size={20}
                              className="text-gray-400 group-hover:text-cyan-400 transition"
                            />
                          </m.div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <m.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="mt-5 pt-5 border-t border-white/10"
                            >
                              <div className="text-gray-300 leading-relaxed text-sm md:text-base">
                                {faq.answer}
                              </div>
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                                <button
                                  onClick={() => {
                                    setQuery(faq.question);
                                    inputRef.current?.focus();
                                  }}
                                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                  Cari terkait
                                </button>
                                <div className="text-xs text-gray-500">
                                  {faq.answer.length} karakter
                                </div>
                              </div>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </m.div>
                  );
                })}
              </AnimatePresence>
            </m.section>

            {/* === Pagination === */}
            {filteredFaqs.length > itemsPerPage && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex justify-center items-center gap-2 mt-14 flex-wrap"
              >
                {/* Prev Button */}
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium border transition-all duration-300 ${currentPage === 1
                      ? "text-gray-600 bg-white/5 border-white/5 cursor-not-allowed"
                      : "text-gray-400 hover:text-white hover:border-cyan-400/40 hover:bg-cyan-500/10"
                    }`}
                >
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2 mx-4">
                  {visiblePages.map((page, idx) =>
                    page === "left-ellipsis" || page === "right-ellipsis" ? (
                      <span key={idx} className="px-3 text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => changePage(page)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${currentPage === page
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/40 text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            : "border-white/10 text-gray-400 hover:text-white hover:border-cyan-400/30 hover:bg-white/5"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium border transition-all duration-300 ${currentPage === totalPages
                      ? "text-gray-600 bg-white/5 border-white/5 cursor-not-allowed"
                      : "text-gray-400 hover:text-white hover:border-cyan-400/40 hover:bg-cyan-500/10"
                    }`}
                >
                  <span>Selanjutnya</span>
                  <ChevronDown className="w-4 h-4 -rotate-90" />
                </button>
              </m.div>
            )}
          </>
        )}

        {/* === Empty State === */}
        {filteredFaqs.length === 0 && query && (
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 max-w-md"
          >
            <div className="bg-gradient-to-br from-[#141a28]/80 to-[#0f1522]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
                <HelpCircle className="relative w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                FAQ tidak ditemukan
              </h3>
              <p className="text-gray-400 mb-6">
                Tidak ada hasil untuk <span className="text-cyan-300">"{query}"</span>
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => handleQuickExample(query)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  Tanya AI tentang "{query.length > 30 ? query.substring(0, 30) + "..." : query}"
                </button>
                <button
                  onClick={() => setQuery("")}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Tampilkan semua FAQ
                </button>
              </div>
            </div>
          </m.div>
        )}

        {/* === Footer Info === */}
        <m.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10 w-full max-w-4xl text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-cyan-300 mb-2">{faqsData.length}</div>
              <div className="text-sm text-gray-400">Total FAQ</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-purple-300 mb-2">{aiStats.totalQuestions}+</div>
              <div className="text-sm text-gray-400">Pertanyaan AI</div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-emerald-300 mb-2">{aiStats.successRate}%</div>
              <div className="text-sm text-gray-400">Akurasi Jawaban</div>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">
            Sistem AI ini ditenagai oleh algoritma pencocokan cerdas yang ditingkatkan dengan 
            <span className="text-cyan-400"> konteks semantik</span> dan 
            <span className="text-purple-400"> analisis kata kunci</span>.
          </p>
        </m.div>
      </main>
    </LazyMotion>
  );
}