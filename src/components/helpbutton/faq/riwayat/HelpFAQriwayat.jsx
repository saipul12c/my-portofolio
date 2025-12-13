import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { LazyMotion, m, domAnimation } from "framer-motion";
import { ArrowLeft, Search, Clock, Trash2, Copy, ExternalLink, Bot, History, Calendar, Filter, ChevronRight, MessageSquare } from "lucide-react";

const HISTORY_KEY = 'ai_search_history';

const HelpFAQriwayat = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, ai, faq
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const storedHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        const now = new Date();
        
        // Filter expired items
        const validHistory = storedHistory.filter(item => {
          if (!item.expiry) return true;
          return new Date(item.expiry) > now;
        }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setHistory(validHistory);
        
        // If slug is provided, find the item
        if (slug) {
          const item = validHistory.find(h => h.id === slug);
          if (item) {
            setSelectedItem(item);
          } else {
            navigate('/help/faq/riwayat/ai');
          }
        }
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [slug, navigate]);

  // Filter history based on search and type
  useEffect(() => {
    let result = history;
    
    // Filter by type
    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.query.toLowerCase().includes(term) ||
        (item.answer && item.answer.toLowerCase().includes(term))
      );
    }
    
    setFilteredHistory(result);
  }, [history, searchTerm, filterType]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const clearHistory = useCallback(() => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]);
      setFilteredHistory([]);
      setSelectedItem(null);
    }
  }, []);

  const deleteItem = useCallback((id, e) => {
    e.stopPropagation();
    const newHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    setHistory(newHistory);
    
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
      navigate('/help/faq/riwayat/ai');
    }
  }, [history, selectedItem, navigate]);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Teks berhasil disalin!');
    } catch (error) {
      console.error('Copy failed:', error);
    }
  }, []);

  const handleUseAgain = useCallback((item) => {
    navigate('/help/faq', { state: { prefillQuery: item.query } });
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#071428] via-[#071a2a] to-[#061024] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <main className="min-h-screen bg-gradient-to-b from-[#071428] via-[#071a2a] to-[#061024] text-white font-inter">
        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden">
          <div className="absolute top-1/4 left-[10%] w-60 h-60 bg-purple-400/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-1/3 right-[10%] w-64 h-64 bg-cyan-400/10 rounded-full blur-[90px]" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/5 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/help/faq"
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                    <History className="w-6 h-6 text-white" />
                  </div>
                  <span>Riwayat Pencarian AI</span>
                </h1>
                <p className="text-gray-400 mt-2">
                  {history.length} pencarian tersimpan · Berlaku 7 hari
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Link to="/owner" title="Owner" className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10">
                  <Bot className="w-5 h-5 text-white" />
                </Link>
                <Link to="/blog/authors/syaiful-mukmin" title="Author" className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10">
                  <Bot className="w-5 h-5 text-white" />
                </Link>
              </div>
              <button
                onClick={clearHistory}
                disabled={history.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${history.length === 0 
                  ? 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Semua</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - List */}
            <div className="lg:col-span-2">
              {/* Search and Filter */}
              <div className="bg-gradient-to-br from-[#071428]/80 to-[#061024]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari dalam riwayat..."
                      className="w-full bg-[#0f1724]/80 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-4 py-3 rounded-xl border transition-all ${filterType === 'all' 
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-cyan-400/30'
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setFilterType('ai')}
                      className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${filterType === 'ai' 
                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-purple-400/30'
                      }`}
                    >
                      <Bot className="w-4 h-4" />
                      AI
                    </button>
                    <button
                      onClick={() => setFilterType('faq')}
                      className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 ${filterType === 'faq' 
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-400/30'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      FAQ
                    </button>
                  </div>
                </div>
              </div>

              {/* History List */}
              <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                  <div className="bg-gradient-to-br from-[#071428]/80 to-[#061024]/80 backdrop-blur-xl rounded-2xl p-12 border border-white/10 shadow-xl text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                      <Clock className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {searchTerm || filterType !== 'all' ? 'Tidak ada hasil' : 'Riwayat kosong'}
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      {searchTerm || filterType !== 'all' 
                        ? 'Coba ubah pencarian atau filter yang berbeda'
                        : 'Mulailah bertanya kepada AI atau mencari FAQ untuk melihat riwayat di sini'
                      }
                    </p>
                    <Link
                      to="/help/faq"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                    >
                      <Bot className="w-5 h-5" />
                      Mulai Bertanya
                    </Link>
                  </div>
                ) : (
                  filteredHistory.map((item) => (
                    <m.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-gradient-to-br from-[#071428]/80 to-[#061024]/80 backdrop-blur-xl rounded-2xl border transition-all cursor-pointer group ${selectedItem?.id === item.id 
                        ? 'border-cyan-500/40 bg-cyan-500/5' 
                        : 'border-white/10 hover:border-cyan-400/30 hover:bg-white/5'
                      }`}
                      onClick={() => {
                        setSelectedItem(item);
                        navigate(`/help/faq/riwayat/ai/${item.id}`);
                      }}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${item.type === 'ai' 
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
                              : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                            }`}>
                              {item.type === 'ai' ? (
                                <Bot className="w-5 h-5 text-purple-400" />
                              ) : (
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                              )}
                            </div>
                            <div>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${item.type === 'ai' 
                                ? 'bg-purple-500/20 text-purple-300' 
                                : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {item.type === 'ai' ? 'Pertanyaan AI' : 'Pencarian FAQ'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {formatDate(item.timestamp)}
                            </div>
                            <button
                              onClick={(e) => deleteItem(item.id, e)}
                              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">
                          {item.query}
                        </h3>
                        
                        {item.answer && (
                          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                            {item.answer.substring(0, 150)}...
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(item.query);
                              }}
                              className="text-xs text-gray-400 hover:text-cyan-300 transition-colors px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg"
                            >
                              <Copy className="w-3 h-3 inline mr-1" />
                              Salin
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUseAgain(item);
                              }}
                              className="text-xs text-gray-400 hover:text-emerald-300 transition-colors px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg"
                            >
                              <ExternalLink className="w-3 h-3 inline mr-1" />
                              Gunakan Lagi
                            </button>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </div>
                    </m.div>
                  ))
                )}
              </div>
            </div>

            {/* Right Panel - Detail */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {selectedItem ? (
                  <div className="bg-gradient-to-br from-[#071428]/80 to-[#061024]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Detail Riwayat</h2>
                        <span className="text-xs text-gray-500">
                          ID: {selectedItem.id.substring(0, 8)}
                        </span>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm text-gray-400 mb-2 block">Pertanyaan</label>
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <p className="text-white">{selectedItem.query}</p>
                          </div>
                        </div>
                        
                        {selectedItem.answer && (
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">Jawaban</label>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10 max-h-96 overflow-y-auto">
                              <p className="text-gray-300 whitespace-pre-line">{selectedItem.answer}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Tipe</label>
                            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${selectedItem.type === 'ai' 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {selectedItem.type === 'ai' ? 'AI Assistant' : 'FAQ Search'}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Waktu</label>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              {formatDate(selectedItem.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4 border-t border-white/10">
                          <button
                            onClick={() => copyToClipboard(selectedItem.query)}
                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Salin Pertanyaan</span>
                          </button>
                          <button
                            onClick={() => handleUseAgain(selectedItem)}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl py-3 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Gunakan Lagi</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-[#071428]/80 to-[#061024]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      Pilih Riwayat
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Pilih item dari daftar riwayat untuk melihat detail lengkapnya
                    </p>
                  </div>
                )}
                
                {/* Stats */}
                <div className="mt-6 bg-gradient-to-br from-[#071428]/80 to-[#061024]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
                  <h3 className="font-bold text-white mb-4">Statistik Riwayat</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Riwayat</span>
                      <span className="font-bold text-white">{history.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Pertanyaan AI</span>
                      <span className="font-bold text-purple-300">
                        {history.filter(h => h.type === 'ai').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Pencarian FAQ</span>
                      <span className="font-bold text-blue-300">
                        {history.filter(h => h.type === 'faq').length}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-500">
                        Riwayat disimpan secara lokal di browser Anda dan akan otomatis dihapus setelah 7 hari
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LazyMotion>
  );
};

export default HelpFAQriwayat;