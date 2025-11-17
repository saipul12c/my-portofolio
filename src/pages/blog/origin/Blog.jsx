import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import blogs from "../../data/blog/data.json";
import SearchBar from "./components/pencarian/SearchBar";
import AiOverview from "./components/pencarian/AI/AiOverview";
import { 
  FiCalendar,
  FiEye,
  FiHeart,
  FiMessageSquare,
  FiStar,
  FiClock,
  FiX,
  FiTag,
  FiBook,
  FiUser,
  FiShare2,
  FiBookmark,
  FiCheckCircle
} from "react-icons/fi";

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showTooltip, setShowTooltip] = useState(null);
  
  const navigate = useNavigate();
  const postsPerPage = 6;

  // === 💡 Fungsi Redirect ke Detail Profile Author ===
  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    // Generate slug dari nama author
    const slug = author.toLowerCase().replace(/\s+/g, '-');
    navigate(`/blog/authors/${slug}`, { 
      state: { 
        authorName: author,
        // Anda bisa menambahkan data author lain yang diperlukan
      }
    });
  };

  // === 💡 Fungsi Tooltip ===
  const handleShowTooltip = (authorId) => {
    setShowTooltip(authorId);
  };

  const handleHideTooltip = () => {
    setShowTooltip(null);
  };

  // === 💡 Popup Open/Close ===
  const handleOpenPopup = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const handleClosePopup = () => {
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  // === 🏷️ Tambahkan label otomatis (Baru, Hot, Rekomendasi) ===
  const processedBlogs = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const withLabels = blogs.map((post) => {
      const postDate = new Date(post.date);
      const labels = [];
      if (post.featured) labels.push("Rekomendasi");
      if (postDate >= sixMonthsAgo) labels.push("Baru");
      if (post.views > 2000) labels.push("Hot");
      if (post.rating > 4.5) labels.push("Premium");
      return { ...post, labels };
    });

    return withLabels;
  }, []);

  // === 🔍 Filter dan Sortir ===
  const filteredBlogs = useMemo(() => {
    let filtered = processedBlogs.filter((post) => {
      const lower = searchTerm.toLowerCase();
      const matchesSearch = 
        post.title.toLowerCase().includes(lower) ||
        post.author.toLowerCase().includes(lower) ||
        post.excerpt.toLowerCase().includes(lower) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(lower)) ||
        post.labels?.some((label) => label.toLowerCase().includes(lower));

      const matchesCategory = 
        selectedCategory === "all" || 
        post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "trending":
        filtered.sort((a, b) => (b.likes + b.shares) - (a.likes + a.shares));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [processedBlogs, searchTerm, selectedCategory, sortBy]);

  // === 📑 Pagination ===
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  // === 🏷️ Categories ===
  const categories = ["all", ...new Set(blogs.map(post => post.category).filter(Boolean))];

  // === 🎨 Label Colors ===
  const getLabelColor = (label) => {
    switch (label) {
      case "Baru": return "bg-green-500/20 border-green-500/30 text-green-300";
      case "Rekomendasi": return "bg-cyan-500/20 border-cyan-500/30 text-cyan-300";
      case "Hot": return "bg-orange-500/20 border-orange-500/30 text-orange-300";
      case "Premium": return "bg-purple-500/20 border-purple-500/30 text-purple-300";
      default: return "bg-gray-500/20 border-gray-500/30 text-gray-300";
    }
  };

  // === 🎨 Tag Colors - Warna Warni untuk Tags ===
  const getTagColor = (tag, index) => {
    const colors = [
      "bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border-cyan-500/40 text-cyan-300",
      "bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/40 text-purple-300",
      "bg-gradient-to-r from-pink-500/20 to-pink-600/20 border-pink-500/40 text-pink-300",
      "bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/40 text-orange-300",
      "bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/40 text-green-300",
      "bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/40 text-blue-300",
      "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/40 text-yellow-300",
      "bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/40 text-red-300",
    ];
    return colors[index % colors.length];
  };

  // === 🧹 Clean Content Function ===
  const cleanContent = (content) => {
    if (!content) return "";
    
    if (typeof content === "object") {
      return Object.values(content)
        .map(item => String(item).replace(/###\s?/g, '').trim())
        .filter(item => item.length > 0)
        .join('\n\n');
    }
    
    return String(content).replace(/###\s?/g, '').trim();
  };

  // === 📊 Format Number ===
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-gray-50 relative">
        {/* === 🏷️ Header dengan Background Gradient === */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium">
              📚 Blog & Artikel
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
            Cerita & Inspirasi
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Temukan artikel menarik seputar teknologi, desain, marketing, dan pengembangan diri dari para ahli.
          </p>
        </div>

        {/* === 🎛️ Control Bar === */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Bar - NOW FULL WIDTH */}
            <div className="flex-1 w-full">
              <SearchBar
                blogs={processedBlogs}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setCurrentPage={setCurrentPage}
              />
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Category Filter */}
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "📁 Semua Kategori" : `📂 ${cat}`}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-700/50 border border-gray-600 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              >
                <option value="newest">🆕 Terbaru</option>
                <option value="popular">🔥 Populer</option>
                <option value="trending">📈 Trending</option>
                <option value="rating">⭐ Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* === 🤖 AI OVERVIEW SECTION === */}
        {searchTerm && filteredBlogs.length > 0 && (
          <div className="mb-8 sm:mb-10">
            <AiOverview searchTerm={searchTerm} filteredBlogs={filteredBlogs} />
          </div>
        )}

        {/* === 📊 Stats === */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-400">
          <span>📄 {filteredBlogs.length} artikel ditemukan</span>
          {selectedCategory !== "all" && <span>📂 Kategori: {selectedCategory}</span>}
          {searchTerm && <span>🔍 Pencarian: "{searchTerm}"</span>}
        </div>

        {/* === ⚠️ Tidak ada hasil === */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-gray-800/30 rounded-xl sm:rounded-2xl border border-gray-700/50">
            <div className="text-5xl sm:text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-base sm:text-lg mb-3">Tidak ada hasil ditemukan</p>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto px-4">
              Coba gunakan kata kunci lain, ubah filter, atau jelajahi kategori yang berbeda.
            </p>
          </div>
        )}

        {/* === 📰 GRID VIEW === */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {currentBlogs.map((post) => (
            <article
              key={post.slug}
              className="group cursor-pointer rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_30px_-8px_rgba(6,182,212,0.3)] transition-all duration-500 overflow-hidden"
              onClick={() => handleOpenPopup(post)}
            >
              {/* Gambar */}
              <div className="relative overflow-hidden h-40 sm:h-48 lg:h-52">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 rounded-t-xl sm:rounded-t-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                {/* Label */}
                {post.labels?.length > 0 && (
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1">
                    {post.labels.map((label, idx) => (
                      <span
                        key={idx}
                        className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm border ${getLabelColor(label)}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3">
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/90">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="flex items-center gap-1 backdrop-blur-sm bg-black/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        <FiEye size={10} className="sm:w-3 sm:h-3" /> {post.views}
                      </span>
                      <span className="flex items-center gap-1 backdrop-blur-sm bg-black/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                        <FiHeart size={10} className="sm:w-3 sm:h-3" /> {post.likes}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 backdrop-blur-sm bg-black/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      <FiStar size={10} className="sm:w-3 sm:h-3" /> {post.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Artikel */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
                  <span className="flex items-center gap-1">
                    <FiCalendar size={10} className="sm:w-3 sm:h-3" />
                    {new Date(post.date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FiClock size={10} className="sm:w-3 sm:h-3" />
                    {post.readTime}
                  </span>
                  <span>•</span>
                  <span className="text-cyan-400 truncate">{post.category}</span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  {/* 🆕 AUTHOR DENGAN TOOLTIP DAN REDIRECT */}
                  <div className="relative">
                    <button
                      onClick={(e) => handleAuthorClick(e, post.author)}
                      onMouseEnter={() => handleShowTooltip(post.slug)}
                      onMouseLeave={handleHideTooltip}
                      className="flex items-center gap-2 group/author"
                    >
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                        {post.author.charAt(0)}
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-400 group-hover/author:text-cyan-400 transition-colors truncate max-w-[80px] sm:max-w-none">
                        {post.author}
                      </span>
                      <FiCheckCircle className="w-3 h-3 text-green-400" />
                    </button>

                    {/* 🆕 TOOLTIP VALIDASI */}
                    {showTooltip === post.slug && (
                      <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 border border-green-500/30 rounded-lg shadow-lg z-50 min-w-[200px]">
                        <div className="flex items-center gap-2 text-green-400 text-xs font-medium mb-1">
                          <FiCheckCircle className="w-3 h-3" />
                          <span>Author Terverifikasi</span>
                        </div>
                        <p className="text-gray-300 text-[10px] leading-tight">
                          Informasi dari {post.author} telah divalidasi dan terpercaya. Klik untuk melihat profil lengkap.
                        </p>
                        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                      </div>
                    )}
                  </div>
                  
                  <Link
                    to={`/blog/${post.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm font-semibold flex items-center gap-1 group/link"
                  >
                    Baca
                    <span className="group-hover/link:translate-x-0.5 sm:group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* === 📄 Pagination === */}
        {filteredBlogs.length > postsPerPage && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 sm:mt-14">
            <div className="text-gray-400 text-xs sm:text-sm">
              Menampilkan {indexOfFirst + 1}-{Math.min(indexOfLast, filteredBlogs.length)} dari {filteredBlogs.length} artikel
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-800/60 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
              >
                ← Sebelumnya
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg transition-all text-xs sm:text-sm ${
                      currentPage === i + 1
                        ? "bg-cyan-600 text-white"
                        : "bg-gray-800/60 text-gray-400 hover:bg-gray-700/60"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gray-800/60 border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        )}

        {/* === 🔲 Popup Detail Artikel - DESIGN SUPERIOR === */}
        {selectedPost && (
          <div
            onClick={handleClosePopup}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn p-3 sm:p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl 
                w-full max-w-4xl sm:max-w-5xl 
                max-h-[90vh] sm:max-h-[95vh] 
                overflow-hidden animate-scaleIn flex flex-col border border-gray-700/50"
            >
              {/* Header dengan Gradient */}
              <div className="relative h-52 sm:h-60 lg:h-72 overflow-hidden flex-shrink-0">
                <img
                  src={selectedPost.imageFull || selectedPost.thumbnail}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover transform transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 sm:top-5 right-4 sm:right-5 w-8 h-8 sm:w-10 sm:h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all duration-300 hover:scale-110 border border-white/10 group"
                >
                  <FiX className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
                </button>

                {/* Labels */}
                {selectedPost.labels?.length > 0 && (
                  <div className="absolute top-4 sm:top-5 left-4 sm:left-5 flex flex-wrap gap-2">
                    {selectedPost.labels.map((label, idx) => (
                      <span
                        key={idx}
                        className={`text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border font-medium ${getLabelColor(label)} shadow-lg`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title & Meta */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
                    {selectedPost.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/90 text-sm">
                    {/* 🆕 AUTHOR DENGAN TOOLTIP DI POPUP */}
                    <div className="relative">
                      <button
                        onClick={(e) => handleAuthorClick(e, selectedPost.author)}
                        onMouseEnter={() => handleShowTooltip('popup-' + selectedPost.slug)}
                        onMouseLeave={handleHideTooltip}
                        className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-cyan-500/50 transition-colors group/author"
                      >
                        <FiUser className="w-4 h-4 text-cyan-400" />
                        <span className="group-hover/author:text-cyan-400 transition-colors">{selectedPost.author}</span>
                        <FiCheckCircle className="w-3 h-3 text-green-400" />
                      </button>

                      {/* 🆕 TOOLTIP VALIDASI DI POPUP */}
                      {showTooltip === 'popup-' + selectedPost.slug && (
                        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 border border-green-500/30 rounded-lg shadow-lg z-50 min-w-[220px]">
                          <div className="flex items-center gap-2 text-green-400 text-xs font-medium mb-1">
                            <FiCheckCircle className="w-3 h-3" />
                            <span>Author Terverifikasi</span>
                          </div>
                          <p className="text-gray-300 text-[10px] leading-tight">
                            Konten dari {selectedPost.author} telah melalui proses validasi dan terjamin kredibilitasnya.
                          </p>
                          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                      <FiCalendar className="w-4 h-4 text-green-400" />
                      <span>
                        {new Date(selectedPost.date).toLocaleDateString("id-ID", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                      <FiClock className="w-4 h-4 text-yellow-400" />
                      <span>{selectedPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8 overflow-y-auto flex-grow">
                {/* Stats Grid dengan Design Lebih Baik */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  {[
                    { icon: FiEye, value: selectedPost.views, label: 'Views', color: 'cyan' },
                    { icon: FiHeart, value: selectedPost.likes, label: 'Likes', color: 'red' },
                    { icon: FiMessageSquare, value: selectedPost.commentCount || 0, label: 'Comments', color: 'green' },
                    { icon: FiStar, value: selectedPost.rating, label: 'Rating', color: 'yellow' }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-center p-3 sm:p-4 bg-gray-800/40 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group">
                      <div className="text-center">
                        <stat.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${stat.color}-400 mb-2 mx-auto group-hover:scale-110 transition-transform`} />
                        <span className="text-lg sm:text-xl font-bold text-white block">{formatNumber(stat.value)}</span>
                        <span className="text-xs text-gray-400">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category & Series dengan Layout Lebih Rapi */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <FiBook className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 text-sm font-medium">{selectedPost.category}</span>
                  </div>
                  {selectedPost.series && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <FiTag className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300 text-sm font-medium">Seri: {selectedPost.series}</span>
                    </div>
                  )}
                  {selectedPost.source && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span className="text-orange-300 text-sm font-medium">Sumber: {selectedPost.source}</span>
                    </div>
                  )}
                </div>

                {/* Excerpt dengan Design Lebih Menarik */}
                {selectedPost.excerpt && (
                  <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/20 rounded-xl p-5 mb-6 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-400"></div>
                    <div className="flex items-start gap-3">
                      <div className="text-cyan-400 text-lg mt-0.5">💡</div>
                      <p className="text-cyan-100 text-sm sm:text-base leading-relaxed font-medium flex-1">
                        {selectedPost.excerpt}
                      </p>
                    </div>
                  </div>
                )}

                {/* Content Area dengan Layout Terstruktur */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"></div>
                    <h3 className="text-lg font-bold text-white">Konten Artikel</h3>
                  </div>
                  
                  <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700/50">
                    <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
                      <div className="text-gray-200 leading-relaxed whitespace-pre-line text-sm sm:text-base space-y-4">
                        {cleanContent(selectedPost.content)
                          .split('\n\n')
                          .map((paragraph, index) => (
                            paragraph.trim() && (
                              <p key={index} className="mb-4 last:mb-0 text-justify leading-7">
                                {paragraph}
                              </p>
                            )
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags dengan Warna Warni */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 mb-4">
                      <FiTag className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-lg font-bold text-white">Tag Terkait</h4>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {selectedPost.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full backdrop-blur-sm border font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${getTagColor(tag, i)}`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons dengan Design Lebih Baik */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-700/50">
                  <Link
                    to={`/blog/${selectedPost.slug}`}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white py-4 rounded-xl text-center font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] text-sm sm:text-base flex items-center justify-center gap-2 group"
                  >
                    <FiBookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    📖 Baca Artikel Lengkap
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-cyan-500/50 hover:bg-gray-700/70 transition-all duration-300">
                    <FiShare2 className="w-4 h-4" />
                    Bagikan
                  </button>
                </div>

                {/* Related Info */}
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="font-medium text-gray-300">Dibuat:</span>{' '}
                      {new Date(selectedPost.date).toLocaleDateString('id-ID')}
                    </div>
                    <div>
                      <span className="font-medium text-gray-300">Terakhir diperbarui:</span>{' '}
                      {selectedPost.updatedAt ? new Date(selectedPost.updatedAt).toLocaleDateString('id-ID') : 'Tidak tersedia'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}