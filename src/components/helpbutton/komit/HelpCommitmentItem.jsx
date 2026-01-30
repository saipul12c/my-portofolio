import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import commitmentsData from "./data/commitments.json";
import {
  Heart, Sparkles, HandHeart, Users, Globe, Lightbulb, Star,
  ArrowRight, CheckCircle2, ChevronLeft, ChevronRight,
  Target, Shield, Zap, TrendingUp, Award, Clock, Globe2,
  Puzzle, RefreshCw, MessageSquare, BarChart, GitBranch,
  CheckCircle, BookOpen, Coins, GitMerge, Eye, Cpu, Map,
  Feather, Cloud, ThumbsUp, Search, Filter, X
} from "lucide-react";

// Update iconMap untuk mendukung semua ikon
const iconMap = {
  HandHeart: HandHeart,
  Users: Users,
  Globe: Globe,
  Lightbulb: Lightbulb,
  Star: Star,
  Target: Target,
  Shield: Shield,
  Zap: Zap,
  Heart: Heart,
  TrendingUp: TrendingUp,
  Award: Award,
  Clock: Clock,
  Globe2: Globe2,
  Puzzle: Puzzle,
  RefreshCw: RefreshCw,
  MessageSquare: MessageSquare,
  BarChart: BarChart,
  GitBranch: GitBranch,
  CheckCircle: CheckCircle,
  BookOpen: BookOpen,
  Coins: Coins,
  GitMerge: GitMerge,
  Eye: Eye,
  Cpu: Cpu,
  Map: Map,
  Feather: Feather,
  Cloud: Cloud,
  ThumbsUp: ThumbsUp
};

const colorMap = {
  primary: "from-pink-500 to-rose-500",
  secondary: "from-blue-500 to-cyan-500",
  success: "from-emerald-500 to-green-500",
  warning: "from-amber-500 to-orange-500",
  info: "from-indigo-500 to-purple-500"
};

// Fungsi untuk membuat slug
const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// Responsive items per page
const getItemsPerPage = () => {
  return window.innerWidth < 768 ? 6 : 9;
};

export default function HelpCommitmentItem() {
  const navigate = useNavigate();
  const [commitments, setCommitments] = useState([]);
  const [filteredCommitments, setFilteredCommitments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  // Update itemsPerPage saat window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setItemsPerPage(getItemsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ekstrak kategori unik dari data
  const categories = useMemo(() => {
    const cats = ['all'];
    commitments.forEach(item => {
      if (item.category && !cats.includes(item.category)) {
        cats.push(item.category);
      }
    });
    return cats;
  }, [commitments]);

  // Ekstrak tags unik dari data
  const allTags = useMemo(() => {
    const tags = new Set();
    commitments.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [commitments]);

  // Load data dengan simulasi loading untuk data besar
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulasi delay loading untuk data besar
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Tambahkan slug ke setiap item jika belum ada
      const commitmentsWithSlug = (commitmentsData.commitments || []).map(item => ({
        ...item,
        slug: item.slug || createSlug(item.title)
      }));
      
      setCommitments(commitmentsWithSlug);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filter dan sort data
  useEffect(() => {
    if (!commitments.length) return;

    let result = [...commitments];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.desc.toLowerCase().includes(term) ||
        item.short_desc.toLowerCase().includes(term) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term))) ||
        (item.category && item.category.toLowerCase().includes(term))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      result = result.filter(item =>
        item.tags && selectedTags.every(tag => item.tags.includes(tag))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          aValue = a.priority || 0;
          bValue = b.priority || 0;
          break;
        case 'date':
          aValue = new Date(a.created_date || '1970-01-01');
          bValue = new Date(b.created_date || '1970-01-01');
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCommitments(result);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [commitments, searchTerm, selectedCategory, selectedTags, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCommitments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = useMemo(() => {
    return filteredCommitments.slice(startIndex, endIndex);
  }, [filteredCommitments, startIndex, endIndex]);

  // Infinite scroll handler
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [currentPage, totalPages]);

  // Handlers
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleTagToggle = useCallback((tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const handleCardExpand = useCallback((id) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleViewDetail = useCallback((slug) => {
    navigate(`/help/commitment/${slug}`);
  }, [navigate]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setSortBy('id');
    setSortOrder('asc');
  }, []);

  // Render commitment card
  const renderCommitmentCard = useCallback((item, index) => {
    const IconComponent = iconMap[item.icon] || Sparkles;
    const gradient = colorMap[item.color_scheme] || "from-pink-500 to-purple-500";
    const isExpanded = expandedCards.has(item.id);

    return (
      <motion.div
        key={`${item.id}-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-md`}>
            <IconComponent size={24} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              #{String(item.id).padStart(2, '0')}
            </span>
            {item.priority && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                Prioritas: {item.priority}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {item.title}
          </h3>
          
          {item.category && (
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300">
              {item.category}
            </span>
          )}

          <div className="flex flex-wrap gap-2 mb-2">
            {item.tags?.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
            {item.short_desc}
          </p>

          <p className={`text-gray-700 dark:text-gray-300 text-sm leading-relaxed ${
            isExpanded ? '' : 'line-clamp-3'
          }`}>
            {item.desc}
          </p>

          {/* Key Points */}
          {item.key_points && (
            <div className="space-y-2 pt-2">
              {item.key_points.slice(0, isExpanded ? 10 : 3).map((point, pointIndex) => (
                <div key={pointIndex} className="flex items-start gap-2">
                  <CheckCircle2 
                    className={`flex-shrink-0 mt-0.5 ${gradient.replace('from-', 'text-').split(' ')[0]}`} 
                    size={16} 
                  />
                  <span className="text-gray-600 dark:text-gray-400 text-xs">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4">
            <motion.button
              onClick={() => handleViewDetail(item.slug)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${gradient} text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200`}
            >
              Lihat Detail
              <ArrowRight size={14} />
            </motion.button>
            
            <button
              onClick={() => handleCardExpand(item.id)}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {isExpanded ? 'Tutup' : 'Selengkapnya'}
            </button>
          </div>
        </div>

        {/* Created Date */}
        {item.created_date && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dibuat: {new Date(item.created_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        )}
      </motion.div>
    );
  }, [expandedCards, handleCardExpand, handleViewDetail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black py-8 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-6xl mx-auto mb-8 relative"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl">
              <Heart className="text-white" size={32} />
              <Sparkles className="absolute -top-1 -right-1 text-yellow-300" size={16} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {commitmentsData.section_title || "Komitmen Kami"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1">
                  <Sparkles size={16} />
                  Total: {commitments.length} komitmen
                </span>
                <span className="flex items-center gap-1">
                  <Filter size={16} />
                  Tampil: {filteredCommitments.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
          {commitmentsData.section_subtitle || "Lebih dari sekadar kata-kata, ini adalah fondasi yang membentuk setiap langkah perjalanan kami"}
        </p>
      </motion.div>

      {/* Controls Section */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari komitmen berdasarkan judul, deskripsi, atau kategori..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Semua Kategori' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Urutkan Berdasarkan
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="id-asc">ID (Terlama)</option>
              <option value="id-desc">ID (Terbaru)</option>
              <option value="title-asc">Judul (A-Z)</option>
              <option value="title-desc">Judul (Z-A)</option>
              <option value="priority-desc">Prioritas (Tinggi ke Rendah)</option>
              <option value="priority-asc">Prioritas (Rendah ke Tinggi)</option>
              <option value="date-desc">Tanggal (Terbaru)</option>
              <option value="date-asc">Tanggal (Terlama)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || selectedCategory !== 'all' || selectedTags.length > 0 || sortBy !== 'id') && (
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Hapus Filter
              </button>
            </div>
          )}
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter Berdasarkan Tag
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 15).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {tag} {selectedTags.includes(tag) && '✓'}
                </button>
              ))}
              {allTags.length > 15 && (
                <span className="text-sm text-gray-500 px-3 py-1.5">
                  +{allTags.length - 15} tag lainnya
                </span>
              )}
            </div>
          </div>
        )}

        {/* Active Filters Info */}
        {(searchTerm || selectedCategory !== 'all' || selectedTags.length > 0) && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Filter Aktif:</strong> 
              {searchTerm && ` Pencarian: "${searchTerm}"`}
              {selectedCategory !== 'all' && ` • Kategori: ${selectedCategory}`}
              {selectedTags.length > 0 && ` • Tag: ${selectedTags.join(', ')}`}
            </p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Memuat data komitmen...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Commitment Cards Grid */}
          <div 
            ref={containerRef}
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
          >
            <AnimatePresence mode="popLayout">
              {currentItems.map((item, index) => renderCommitmentCard(item, index))}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="max-w-6xl mx-auto mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Menampilkan {Math.min(startIndex + 1, filteredCommitments.length)} - {Math.min(endIndex, filteredCommitments.length)} dari {filteredCommitments.length} komitmen
                {windowWidth < 768 ? ' (6 per halaman)' : ' (9 per halaman)'}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-pink-500 text-white'
                          : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                Halaman {currentPage} dari {totalPages}
              </div>
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          {currentPage < totalPages && (
            <div
              ref={observerRef}
              className="h-10 flex justify-center items-center mt-8"
            >
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                Memuat lebih banyak...
              </span>
            </div>
          )}

          {/* No Results */}
          {filteredCommitments.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Search className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tidak ada komitmen yang ditemukan
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Hapus Semua Filter
              </button>
            </motion.div>
          )}

          {/* Data Summary */}
          {filteredCommitments.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-6xl mx-auto mt-8 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Komitmen</p>
                  <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                    {commitments.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Hasil Filter</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {filteredCommitments.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Halaman Aktif</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {currentPage}/{totalPages}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}