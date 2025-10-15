import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import blogs from "../../data/blog/data.json";
import SearchBar from "../../components/blog/SearchBar";
import AiOverview from "../../components/blog/AI/AiOverview"; // ⬅️ Komponen baru

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;

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
      if (postDate >= sixMonthsAgo) labels.push("Baru");
      return { ...post, labels };
    });

    const shuffled = [...withLabels].sort(() => 0.5 - Math.random());
    shuffled.slice(0, 2).forEach((p) => p.labels.push("Rekomendasi"));
    shuffled.slice(2, 4).forEach((p) => p.labels.push("Hot"));

    return withLabels.sort((a, b) => b.labels.length - a.labels.length);
  }, []);

  // === 🔍 Filter berdasarkan pencarian ===
  const filteredBlogs = processedBlogs.filter((post) => {
    const lower = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(lower) ||
      post.author.toLowerCase().includes(lower) ||
      post.labels?.some((label) => label.toLowerCase().includes(lower))
    );
  });

  // === 📑 Pagination ===
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirst, indexOfLast);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-gray-50 relative">
      {/* === 🏷️ Header === */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-10 text-center bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
        Blog & Cerita Inspiratif ✨
      </h1>

      {/* === 🔍 SearchBar === */}
      <SearchBar
        blogs={processedBlogs}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
      />

      {/* === 🤖 AI OVERVIEW SECTION === */}
      {searchTerm && filteredBlogs.length > 0 && (
        <div className="mb-10">
          <AiOverview
            searchTerm={searchTerm}
            filteredBlogs={filteredBlogs}
          />
        </div>
      )}

      {/* === ⚠️ Tidak ada hasil === */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-3">
            😕 Tidak ada hasil ditemukan
          </p>
          <p className="text-sm text-gray-500">
            Coba gunakan kata kunci lain atau periksa ejaanmu.
          </p>
        </div>
      )}

      {/* === 📰 GRID LIST === */}
      <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {currentBlogs.map((post) => (
          <article
            key={post.slug}
            className="relative group cursor-pointer rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] transition-all duration-300 overflow-hidden"
            onClick={() => handleOpenPopup(post)}
          >
            {/* Gambar */}
            <div className="overflow-hidden rounded-t-3xl relative">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-56 sm:h-60 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>

              {/* Label */}
              {post.labels && post.labels.length > 0 && (
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {post.labels.map((label, idx) => {
                    const color =
                      label === "Baru"
                        ? "bg-green-500/20 border-green-500/30 text-green-300"
                        : label === "Rekomendasi"
                        ? "bg-cyan-400/20 border-cyan-400/30 text-cyan-300"
                        : "bg-pink-500/20 border-pink-500/30 text-pink-300";
                    return (
                      <span
                        key={idx}
                        className={`text-[11px] px-2 py-[2px] rounded-full backdrop-blur-sm border ${color}`}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info Artikel */}
            <div className="p-5 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-2">
                {post.author} •{" "}
                {new Date(post.date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                {post.excerpt}
              </p>
              <Link
                to={`/blog/${post.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold tracking-wide"
              >
                Baca Selengkapnya →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* === 📄 Pagination === */}
      {filteredBlogs.length > postsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-14">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700 hover:border-cyan-400 text-gray-300 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>
          <span className="text-gray-400">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-800/60 border border-gray-700 hover:border-cyan-400 text-gray-300 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* === 🔲 Popup Detail Artikel === */}
      {selectedPost && (
        <div
          onClick={handleClosePopup}
          className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 animate-fadeIn p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gray-900/90 backdrop-blur-2xl rounded-[1.5rem] shadow-2xl 
              w-full max-w-[clamp(320px,90vw,900px)] 
              max-h-[clamp(70vh,90vh,95vh)] 
              overflow-hidden animate-scaleIn flex flex-col"
          >
            <button
              onClick={handleClosePopup}
              className="absolute top-3 sm:top-4 right-4 text-gray-300 hover:text-white text-3xl sm:text-4xl font-light z-10"
            >
              ×
            </button>

            <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden flex-shrink-0">
              <img
                src={selectedPost.imageFull || selectedPost.thumbnail}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-lg">
                  {selectedPost.title}
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm">
                  ✍️ {selectedPost.author} •{" "}
                  {new Date(selectedPost.date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto scrollbar-hide flex-grow">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPost.labels?.map((label, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 px-3 py-[3px] rounded-full backdrop-blur-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4 text-gray-400 text-xs sm:text-sm mb-6">
                <span>👁 {selectedPost.views}</span>
                <span>❤️ {selectedPost.likes}</span>
                <span>💬 {selectedPost.commentCount || 0}</span>
                <span>⏱ {selectedPost.readTime}</span>
                <span>⭐ {selectedPost.rating}</span>
              </div>

              <p className="text-gray-200 leading-relaxed whitespace-pre-line text-sm sm:text-[15px]">
                {selectedPost.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* === Animations === */}
      <style>
        {`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes scaleIn { from { transform: scale(0.9); opacity: 0 } to { transform: scale(1); opacity: 1 } }
          .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
          .animate-scaleIn { animation: scaleIn 0.35s ease forwards; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </section>
  );
}
