import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiCalendar,
  FiEye,
  FiHeart,
  FiShare2,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiImage
} from "react-icons/fi";
import { getLabelColor, formatDate, formatNumber } from "../utils/blogUtils";

export default function BlogGrid({
  currentBlogs,
  handleOpenPopup,
  handleAuthorClick,
  handleShowTooltip,
  handleHideTooltip,
  showTooltip
}) {
  return (
    <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {currentBlogs.map((post, index) => (
        <ArticleCard
          key={post.slug}
          post={post}
          priority={index < 3}
          onOpenPopup={handleOpenPopup}
          onAuthorClick={handleAuthorClick}
          onShowTooltip={handleShowTooltip}
          onHideTooltip={handleHideTooltip}
          showTooltip={showTooltip}
        />
      ))}
    </div>
  );
}

function ArticleCard({ post, priority = false, onOpenPopup, onAuthorClick, onShowTooltip, onHideTooltip, showTooltip }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Optimasi URL gambar (misal dari Unsplash dengan format WebP dan ukuran thumbnail pas)
  const optimizedThumbnail = useMemo(() => {
    if (!post.thumbnail) return "";
    if (post.thumbnail.includes("images.unsplash.com")) {
      return post.thumbnail.replace(/w=\d+/, "w=600").replace(/q=\d+/, "q=75") + "&auto=format";
    }
    return post.thumbnail;
  }, [post.thumbnail]);

  return (
    <article
      className="group cursor-pointer rounded-xl sm:rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/40 hover:shadow-[0_0_30px_-8px_rgba(6,182,212,0.3)] transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
      style={{ contentVisibility: "auto", containIntrinsicSize: "350px 380px" }}
      onClick={() => onOpenPopup(post)}
    >
      {/* Gambar dengan Progressive Shimmer & Priority Loading */}
      <div className="relative overflow-hidden h-40 sm:h-48 lg:h-52 bg-slate-800">
        {/* Shimmer Wave Loader */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
            <FiImage className="w-8 h-8 text-cyan-400/30 animate-pulse relative z-10" />
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FiImage className="w-8 h-8 mx-auto mb-1 opacity-40" />
              <span className="text-[10px]">Gambar tidak tersedia</span>
            </div>
          </div>
        )}

        <img
          src={optimizedThumbnail}
          alt={post.title}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "low"}
          className={`w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 rounded-t-xl sm:rounded-t-2xl ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none"></div>

        {/* Label */}
        {post.labels?.length > 0 && (
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-wrap gap-1 pointer-events-none z-10">
            {post.labels.map((label, idx) => (
              <span
                key={idx}
                className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border ${getLabelColor(label)}`}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Overlay Info Dinamis */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 pointer-events-none z-10">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-white/90">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="flex items-center gap-1 bg-black/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-white/10">
                <FiEye size={10} className="sm:w-3 sm:h-3 text-cyan-400" /> {formatNumber(post.views || 0)}
              </span>
              <span className="flex items-center gap-1 bg-black/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-white/10">
                <FiHeart size={10} className="sm:w-3 sm:h-3 text-red-400" /> {formatNumber(post.likes || 0)}
              </span>
              <span className="flex items-center gap-1 bg-black/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-white/10">
                <FiShare2 size={10} className="sm:w-3 sm:h-3 text-purple-400" /> {formatNumber(post.shares || 0)}
              </span>
            </div>
            <span className="flex items-center gap-1 bg-black/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-yellow-300 font-semibold border border-white/10">
              <FiStar size={10} className="sm:w-3 sm:h-3 text-yellow-400 fill-current" /> {Number(post.rating || 5.0).toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Info Artikel */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
          <span className="flex items-center gap-1">
            <FiCalendar size={10} className="sm:w-3 sm:h-3" />
            {formatDate(post.date)}
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
          {/* Author dengan Tooltip dan Redirect */}
          <AuthorButton
            author={post.author}
            slug={post.slug}
            onAuthorClick={onAuthorClick}
            onShowTooltip={onShowTooltip}
            onHideTooltip={onHideTooltip}
            showTooltip={showTooltip}
          />

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
  );
}

function AuthorButton({ author, slug, onAuthorClick, onShowTooltip, onHideTooltip, showTooltip }) {
  return (
    <div className="relative">
      <button
        onClick={(e) => onAuthorClick(e, author)}
        onMouseEnter={() => onShowTooltip(slug)}
        onMouseLeave={onHideTooltip}
        className="flex items-center gap-2 group/author"
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-cyan-600 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
          {author.charAt(0)}
        </div>
        <span className="text-[10px] sm:text-xs text-gray-400 group-hover/author:text-cyan-400 transition-colors truncate max-w-[80px] sm:max-w-none">
          {author}
        </span>
        <FiCheckCircle className="w-3 h-3 text-green-400" />
      </button>

      {/* Tooltip Validasi */}
      {showTooltip === slug && (
        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 border border-green-500/30 rounded-lg shadow-lg z-50 min-w-[200px]">
          <div className="flex items-center gap-2 text-green-400 text-xs font-medium mb-1">
            <FiCheckCircle className="w-3 h-3" />
            <span>Author Terverifikasi</span>
          </div>
          <p className="text-gray-300 text-[10px] leading-tight">
            Informasi dari {author} telah divalidasi dan terpercaya. Klik untuk melihat profil lengkap.
          </p>
          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
}