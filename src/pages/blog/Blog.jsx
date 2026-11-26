import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AiOverview from "./components/pencarian/AI/AiOverview";
import SearchBar from "./components/pencarian/SearchBar";
import { useBlogData } from "./hooks/useBlogData";
import { useBlogFilters } from "./hooks/useBlogFilters";
import { useDebounce } from "../../hooks/useDebounce";
import { POSTS_PER_PAGE } from "./utils/constants";
import { fetchAllPosts, subscribeToBlogPosts, formatSupabasePost } from "./services/blogSupabase";
import { normalizeAuthorSlug } from "./services/authorProfileService";
import blogService from "./helpers/BlogService";

// Import komponen modular
import BlogHeader from "./components/BlogHeader";
import BlogControls from "./components/BlogControls";
import BlogGrid from "./components/BlogGrid";
import BlogPagination from "./components/BlogPagination";
import BlogPopup from "./components/BlogPopup";

export default function Blog() {
  const [blogList, setBlogList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showTooltip, setShowTooltip] = useState(null);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const blogGridRef = useRef(null);

  const [isAiActive, setIsAiActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load from Supabase on mount & ensure body overflow cleanup
  useEffect(() => {
    let isMounted = true;
    const loadPosts = () => {
      fetchAllPosts()
        .then((posts) => {
          if (isMounted && Array.isArray(posts)) {
            setBlogList(posts);
            blogService.setBlogs(posts);
          }
        })
        .catch(() => {});
    };

    loadPosts();

    // Refresh metrik dinamis saat user kembali ke tab ini
    window.addEventListener('focus', loadPosts);

    // Subscribe to realtime updates dari Supabase
    const unsubscribe = subscribeToBlogPosts((payload) => {
      if (!isMounted) return;
      if (payload.eventType === 'UPDATE' && payload.new) {
        const formatted = formatSupabasePost(payload.new);
        setBlogList(prev => {
          const updated = prev.map(p => p.slug === formatted.slug ? { ...p, ...formatted } : p);
          blogService.setBlogs(updated);
          return updated;
        });
      } else if (payload.eventType === 'INSERT' && payload.new) {
        const formatted = formatSupabasePost(payload.new);
        setBlogList(prev => {
          const updated = [formatted, ...prev.filter(p => p.slug !== formatted.slug)];
          blogService.setBlogs(updated);
          return updated;
        });
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setBlogList(prev => {
          const updated = prev.filter(p => p.id !== payload.old.id && p.slug !== payload.old.slug);
          blogService.setBlogs(updated);
          return updated;
        });
      }
    });

    return () => {
      isMounted = false;
      window.removeEventListener('focus', loadPosts);
      if (typeof unsubscribe === 'function') unsubscribe();
      document.body.style.overflow = "auto";
    };
  }, []);

  // Calculate bookmarked count
  const bookmarkedCount = blogList.filter(b => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`blog_bookmarked_${b.slug}`) === 'true';
  }).length;

  // Debounce search term to prevent heavy calculations on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Sync with AI toggle: Close AI if search term changes or is cleared
  useEffect(() => {
    setIsAiActive(false);
  }, [debouncedSearchTerm]);

  // Custom hooks untuk data processing
  const processedBlogs = useBlogData(blogList);
  const filteredBlogs = useBlogFilters(processedBlogs, debouncedSearchTerm, selectedCategory, sortBy, showBookmarkedOnly);

  // Pagination
  const indexOfLast = currentPage * POSTS_PER_PAGE;
  const indexOfFirst = indexOfLast - POSTS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

  // Categories
  const categories = ["all", ...new Set(blogList.map(post => post.category).filter(Boolean))];

  // Event handlers
  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    const slug = normalizeAuthorSlug(author);
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

  // 🎯 Scroll mulus ke area grid blog saat halaman berpindah
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    if (blogGridRef.current) {
      blogGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // 🚀 Background Preload thumbnail artikel halaman berikutnya saat browser idle
  useEffect(() => {
    const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
    if (currentPage >= totalPages) return;
    const nextStartIndex = currentPage * POSTS_PER_PAGE;
    const nextBlogs = filteredBlogs.slice(nextStartIndex, nextStartIndex + POSTS_PER_PAGE);
    if (!nextBlogs.length) return;

    const preloadImages = () => {
      nextBlogs.forEach((post) => {
        if (!post.thumbnail) return;
        let src = post.thumbnail;
        if (src.includes("images.unsplash.com")) {
          src = src.replace(/w=\d+/, "w=600").replace(/q=\d+/, "q=75") + "&auto=format";
        }
        const img = new Image();
        img.src = src;
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preloadImages, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(preloadImages, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentPage, filteredBlogs]);

  // 1. Sync state FROM URL on mount and location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    const cat = params.get("category") || "all";
    const sort = params.get("sort") || "newest";

    if (q !== searchTerm) setSearchTerm(q);
    if (cat !== selectedCategory) setSelectedCategory(cat);
    if (sort !== sortBy) setSortBy(sort);

    // Always reset to page 1 if URL search changes (likely a new search/filter)
    setCurrentPage(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // 2. Sync state TO URL when states change (Bidirectional)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (sortBy !== "newest") params.set("sort", sortBy);

    const newSearch = params.toString();
    const currentSearch = location.search.replace(/^\?/, "");

    if (newSearch !== currentSearch) {
      navigate({ search: newSearch ? `?${newSearch}` : "" }, { replace: true });
    }
  }, [searchTerm, selectedCategory, sortBy, navigate, location.search]);

  // Centralized handler for searches initiated from AI overview
  const handleAiSearch = (text) => {
    if (!text) return;
    setSearchTerm(text);
    setCurrentPage(1);
    navigate(`/blog?search=${encodeURIComponent(text)}`);
  };

  const handleAiToggle = () => {
    setIsAiActive(true);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
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
          onAiClick={handleAiToggle}
          showBookmarkedOnly={showBookmarkedOnly}
          setShowBookmarkedOnly={setShowBookmarkedOnly}
          bookmarkedCount={bookmarkedCount}
        />

        {/* AI Overview */}
        {isAiActive && debouncedSearchTerm && (
          <div className="mb-8 sm:mb-10">
            <AiOverview
              searchTerm={debouncedSearchTerm}
              filteredBlogs={filteredBlogs}
              allBlogs={processedBlogs}
              onSearch={handleAiSearch}
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-400">
          <span>📄 {filteredBlogs.length} artikel ditemukan</span>
          {showBookmarkedOnly && (
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              🔖 Koleksi Tersimpan
            </span>
          )}
          {selectedCategory !== "all" && <span>📂 Kategori: {selectedCategory}</span>}
          {debouncedSearchTerm && <span>🔍 Pencarian: "{debouncedSearchTerm}"</span>}
        </div>

        {/* No Results */}
        {filteredBlogs.length === 0 && (
          <NoResults isBookmark={showBookmarkedOnly} />
        )}

        {/* Articles Grid with Ref for smooth scroll */}
        {filteredBlogs.length > 0 && (
          <div ref={blogGridRef} className="scroll-mt-24">
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
              onPageChange={handlePageChange}
            />
          </div>
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

function NoResults({ isBookmark = false }) {
  if (isBookmark) {
    return (
      <div className="text-center py-16 sm:py-20 bg-gray-800/30 rounded-xl sm:rounded-2xl border border-gray-700/50">
        <div className="text-5xl sm:text-6xl mb-4">🔖</div>
        <p className="text-gray-300 text-base sm:text-lg mb-2 font-medium">Belum ada artikel yang Anda simpan</p>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto px-4">
          Jelajahi artikel blog dan klik tombol <strong>"Simpan"</strong> pada artikel untuk memasukkannya ke koleksi favorit Anda!
        </p>
      </div>
    );
  }

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