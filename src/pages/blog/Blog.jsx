import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import blogs from "../../data/blog/data.json";
import AiOverview from "./components/pencarian/AI/AiOverview";
import SearchBar from "./components/pencarian/SearchBar"; 
import { useBlogData } from "./hooks/useBlogData";
import { useBlogFilters } from "./hooks/useBlogFilters";
import { POSTS_PER_PAGE } from "./utils/constants";

// Import komponen modular
import BlogHeader from "./components/BlogHeader";
import BlogControls from "./components/BlogControls";
import BlogGrid from "./components/BlogGrid";
import BlogPagination from "./components/BlogPagination";
import BlogPopup from "./components/BlogPopup";

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showTooltip, setShowTooltip] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Custom hooks untuk data processing
  const processedBlogs = useBlogData(blogs);
  const filteredBlogs = useBlogFilters(processedBlogs, searchTerm, selectedCategory, sortBy);

  // Pagination
  const indexOfLast = currentPage * POSTS_PER_PAGE;
  const indexOfFirst = indexOfLast - POSTS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

  // Categories
  const categories = ["all", ...new Set(blogs.map(post => post.category).filter(Boolean))];

  // Event handlers
  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    const slug = author.toLowerCase().replace(/\s+/g, '-');
    navigate(`/blog/authors/${slug}`, { 
      state: { authorName: author }
    });
  };

  const handleShowTooltip = (authorId) => {
    setShowTooltip(authorId);
  };

  const handleHideTooltip = () => {
    setShowTooltip(null);
  };

  const handleOpenPopup = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const handleClosePopup = () => {
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  // Sync search term from URL ?search=... so clicking links updates the search box
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    if (q !== searchTerm) {
      setSearchTerm(q);
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Centralized handler for searches initiated from AI overview
  const handleAiSearch = (text) => {
    if (!text) return;
    setSearchTerm(text);
    setCurrentPage(1);
    navigate(`/blog?search=${encodeURIComponent(text)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-gray-900)] via-[var(--color-gray-800)] to-[var(--color-gray-900)]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 text-gray-50 relative" style={{ zIndex: 1 }}>
        <BlogHeader />
        
        <BlogControls
          blogs={processedBlogs}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setCurrentPage={setCurrentPage}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />

        {/* AI Overview */}
        {searchTerm && (
          <div className="mb-8 sm:mb-10">
            <AiOverview
              searchTerm={searchTerm}
              filteredBlogs={filteredBlogs}
              allBlogs={processedBlogs}
              onSearch={handleAiSearch}
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-400">
          <span>📄 {filteredBlogs.length} artikel ditemukan</span>
          {selectedCategory !== "all" && <span>📂 Kategori: {selectedCategory}</span>}
          {searchTerm && <span>🔍 Pencarian: "{searchTerm}"</span>}
        </div>

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <NoResults />
        )}

        {/* Articles Grid */}
        {filteredBlogs.length > 0 && (
          <>
            <BlogGrid
              currentBlogs={currentBlogs}
              handleOpenPopup={handleOpenPopup}
              handleAuthorClick={handleAuthorClick}
              handleShowTooltip={handleShowTooltip}
              handleHideTooltip={handleHideTooltip}
              showTooltip={showTooltip}
            />

            <BlogPagination
              filteredBlogs={filteredBlogs}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}

        {/* Article Detail Popup */}
        <BlogPopup
          selectedPost={selectedPost}
          onClosePopup={handleClosePopup}
          onAuthorClick={handleAuthorClick}
          onShowTooltip={handleShowTooltip}
          onHideTooltip={handleHideTooltip}
          showTooltip={showTooltip}
        />
      </section>
    </div>
  );
}

function NoResults() {
  return (
    <div className="text-center py-16 sm:py-20 bg-gray-800/30 rounded-xl sm:rounded-2xl border border-gray-700/50">
      <div className="text-5xl sm:text-6xl mb-4">🔍</div>
      <p className="text-gray-400 text-base sm:text-lg mb-3">Tidak ada hasil ditemukan</p>
      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto px-4">
        Coba gunakan kata kunci lain, ubah filter, atau jelajahi kategori yang berbeda.
      </p>
    </div>
  );
}