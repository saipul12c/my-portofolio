import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import blogs from "../../data/blog/data.json";

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const handleOpenPopup = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const handleClosePopup = () => {
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-gray-50 relative">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-14 text-center bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
        Blog & Cerita Inspiratif ✨
      </h1>

      {/* GRID LIST */}
      <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post) => (
          <article
            key={post.slug}
            className="relative group cursor-pointer rounded-3xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.4)] transition-all duration-300 overflow-hidden"
            onClick={() => handleOpenPopup(post)}
          >
            {/* Thumbnail */}
            <div className="overflow-hidden rounded-t-3xl relative">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-56 sm:h-60 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
            </div>

            {/* Konten ringkas */}
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

      {/* POPUP OVERLAY */}
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
            {/* Tombol Close */}
            <button
              onClick={handleClosePopup}
              className="absolute top-3 sm:top-4 right-4 text-gray-300 hover:text-white text-3xl sm:text-4xl font-light z-10"
            >
              ×
            </button>

            {/* Header */}
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

            {/* Konten */}
            <div className="p-5 sm:p-8 overflow-y-auto scrollbar-hide flex-grow">
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

              {/* Gallery */}
              {selectedPost.gallery?.length > 0 && (
                <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedPost.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`gallery-${idx}`}
                      className="rounded-2xl w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animasi + Scrollbar Hide */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0 }
            to { transform: scale(1); opacity: 1 }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease forwards;
          }
          .animate-scaleIn {
            animation: scaleIn 0.35s ease forwards;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </section>
  );
}
