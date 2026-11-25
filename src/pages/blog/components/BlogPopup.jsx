import { Link, useNavigate } from "react-router-dom";
import { 
  FiX, 
  FiCheckCircle, 
  FiUser, 
  FiBookmark, 
  FiShare2, 
  FiCalendar, 
  FiClock, 
  FiImage,
  FiArrowRight,
  FiEye,
  FiHeart,
  FiStar,
  FiMessageSquare
} from "react-icons/fi";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect, useMemo } from 'react';
import { 
  getLabelColor, 
  getTagColor, 
  cleanContent, 
  formatNumber, 
  formatDate,
  STATS_CONFIG 
} from "../utils/blogUtils";
import { recordShare } from "../services/blogSupabase";

export default function BlogPopup({
  selectedPost,
  onClosePopup,
  onAuthorClick,
  onShowTooltip,
  onHideTooltip,
  showTooltip
}) {
  // Ensure body scroll is unlocked when component unmounts & handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClosePopup();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClosePopup]);

  // Track topik untuk AI assistant
  useEffect(() => {
    if (selectedPost) {
      const topicData = {
        name: selectedPost.category || (selectedPost.tags && selectedPost.tags[0]) || "Umum",
        title: selectedPost.title,
        timestamp: Date.now()
      };
      localStorage.setItem('saipul_ai_last_topic', JSON.stringify(topicData));
    }
  }, [selectedPost]);

  if (!selectedPost) return null;

  const handleAuthorClickWithOverflowReset = (e, author) => {
    document.body.style.overflow = "auto";
    if (typeof onAuthorClick === 'function') onAuthorClick(e, author);
  };

  return (
    <div
      onClick={onClosePopup}
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-6 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        data-popup-slug={selectedPost?.slug}
        className="relative bg-[#0f172a] rounded-2xl sm:rounded-3xl shadow-[0_0_50px_-10px_rgba(6,182,212,0.25)] 
          w-full max-w-4xl 
          max-h-[92vh] 
          overflow-hidden flex flex-col border border-white/10"
      >
        {/* Cover Header Banner */}
        <PopupCoverHeader 
          post={selectedPost} 
          onClose={onClosePopup}
          onAuthorClick={handleAuthorClickWithOverflowReset}
          onShowTooltip={onShowTooltip}
          onHideTooltip={onHideTooltip}
          showTooltip={showTooltip}
        />

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-grow space-y-6">
          {/* Ringkasan Statistik (Compact & Elegant Metric Pills) */}
          <StatsBar post={selectedPost} />

          {/* Excerpt Highlight Card */}
          {selectedPost.excerpt && (
            <div className="bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-slate-900 border-l-4 border-cyan-400 rounded-r-xl p-4 sm:p-5 text-cyan-100 text-sm sm:text-base leading-relaxed">
              <p className="font-medium italic">
                "{selectedPost.excerpt}"
              </p>
            </div>
          )}

          {/* Preview Konten Artikel */}
          <ContentPreview post={selectedPost} onClosePopup={onClosePopup} />

          {/* Tag Terkait */}
          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <TagsSection tags={selectedPost.tags} onClosePopup={onClosePopup} />
          )}
        </div>

        {/* Sticky Bottom Actions Bar */}
        <PopupFooter post={selectedPost} onClosePopup={onClosePopup} />
      </div>
    </div>
  );
}

// 🖼️ Header Cover Gambar & Judul Terpadu
function PopupCoverHeader({ post, onClose, onAuthorClick, onShowTooltip, onHideTooltip, showTooltip }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imgSrc = post.imageFull || post.thumbnail;

  return (
    <div className="relative h-56 sm:h-64 md:h-72 flex-shrink-0 bg-slate-900 overflow-hidden">
      {/* Shimmer Wave Loader */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
          <FiImage className="w-10 h-10 text-cyan-400/30 animate-pulse relative z-10" />
        </div>
      )}

      {/* Gambar Cover */}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={post.title}
          loading="eager"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-gray-500">
          <FiImage className="w-12 h-12 opacity-30" />
        </div>
      )}

      {/* Dark Seamless Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-black/30 pointer-events-none" />

      {/* Top Floating Bar: Badges & Close Button */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex flex-wrap gap-2">
          {post.category && (
            <span className="px-3 py-1 rounded-full bg-cyan-500/80 backdrop-blur-md border border-cyan-400 text-slate-950 text-xs font-bold shadow-lg">
              {post.category}
            </span>
          )}
          {post.labels?.map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] sm:text-xs px-2.5 py-1 rounded-full backdrop-blur-md border font-semibold ${getLabelColor(label)} shadow-md`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Tombol Tutup Bulat Mewah */}
        <button
          onClick={onClose}
          aria-label="Tutup popup"
          className="w-9 h-9 sm:w-10 sm:h-10 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all duration-300 hover:scale-110 border border-white/20 shadow-xl cursor-pointer"
        >
          <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Title & Metadata yang Tertata Rapi di Atas Gradient */}
      <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-6 right-4 sm:right-6 z-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2.5 leading-snug line-clamp-2 drop-shadow-md">
          {post.title}
        </h2>

        {/* Meta Row: Author, Date, Read Time */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300">
          {/* Author Button */}
          <div className="relative">
            <button
              onClick={(e) => onAuthorClick(e, post.author)}
              onMouseEnter={() => onShowTooltip('popup-' + post.slug)}
              onMouseLeave={onHideTooltip}
              className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 hover:border-cyan-400/50 transition-colors text-white font-medium cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-cyan-600 flex items-center justify-center text-[10px] font-bold">
                {post.author?.charAt(0) || "A"}
              </div>
              <span className="hover:text-cyan-300 transition-colors">{post.author}</span>
              <FiCheckCircle className="w-3 h-3 text-green-400" />
            </button>

            {showTooltip === ('popup-' + post.slug) && (
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 border border-green-500/30 rounded-lg shadow-xl z-50 min-w-[200px] text-left">
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold mb-1">
                  <FiCheckCircle className="w-3 h-3" />
                  <span>Author Terverifikasi</span>
                </div>
                <p className="text-gray-300 text-[10px] leading-tight">
                  Konten dari {post.author} terverifikasi dan terjamin kualitasnya.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-gray-300">
            <FiCalendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatDate(post.date)}</span>
          </div>

          {post.readTime && (
            <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-gray-300">
              <FiClock className="w-3.5 h-3.5 text-purple-400" />
              <span>{post.readTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 📊 Bar Statistik Ringkas & Rapi
function StatsBar({ post }) {
  const stats = [
    { icon: FiEye, label: "Dilihat", value: formatNumber(post.views || 0), color: "text-cyan-400" },
    { icon: FiHeart, label: "Disukai", value: formatNumber(post.likes || 0), color: "text-rose-400" },
    { icon: FiShare2, label: "Dibagikan", value: formatNumber(post.shares || 0), color: "text-purple-400" },
    { icon: FiStar, label: "Rating", value: Number(post.rating || 5.0).toFixed(1), color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div key={idx} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03]">
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${s.color} flex-shrink-0`} />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white block leading-tight truncate">
                {s.value}
              </span>
              <span className="text-[10px] text-gray-400 block truncate">
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// 📝 Cuplikan Konten Artikel yang Rapi dengan Tombol Terarah
function ContentPreview({ post, onClosePopup }) {
  const navigate = useNavigate();

  // Bersihkan teks konten untuk preview singkat
  const cleanSnippet = useMemo(() => {
    if (!post?.content) return "";
    const raw = cleanContent(post.content);
    const paragraphs = raw.split(/\n\n+/).filter(Boolean);
    // Ambil maksimal 2 paragraf pertama untuk preview yang proporsional
    return paragraphs.slice(0, 2).join("\n\n");
  }, [post?.content]);

  const handleOpenFull = () => {
    document.body.style.overflow = "auto";
    if (typeof onClosePopup === "function") onClosePopup();
    navigate(`/blog/${post.slug}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-4 bg-cyan-400 rounded-full" />
          Cuplikan Artikel
        </h3>
        <span className="text-xs text-gray-400">Pratinjau Cepat</span>
      </div>

      <div className="relative bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-white/5 overflow-hidden">
        <div className="text-gray-300 text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cleanSnippet}
          </ReactMarkdown>
        </div>

        {/* Gradient Fade di Bawah Cuplikan */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />
      </div>

      <div className="text-center pt-1">
        <button
          onClick={handleOpenFull}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1.5 hover:underline cursor-pointer"
        >
          <span>Lanjutkan membaca artikel lengkap</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// 🏷️ Tag Section
function TagsSection({ tags, onClosePopup }) {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    document.body.style.overflow = "auto";
    if (typeof onClosePopup === 'function') onClosePopup();
    navigate(`/blog?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="pt-4 border-t border-white/10">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
        Tag Terkait
      </h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={`text-xs px-3 py-1 rounded-full border font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${getTagColor(tag, i)}`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}

// 🚀 Sticky Bottom Action Bar
function PopupFooter({ post, onClosePopup }) {
  const [copied, setCopied] = useState(false);
  const [shares, setShares] = useState(post?.shares || 0);

  const handleShare = async () => {
    const nextShares = await recordShare(post.slug, shares);
    setShares(nextShares);

    const shareUrl = `${window.location.origin}/blog/${post.slug}`;
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  const handleReadFull = () => {
    document.body.style.overflow = "auto";
    if (typeof onClosePopup === 'function') onClosePopup();
  };

  return (
    <div className="p-4 sm:p-5 bg-slate-900/95 border-t border-white/10 flex items-center justify-between gap-3 sm:gap-4 flex-shrink-0">
      <button 
        onClick={handleShare}
        className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
          copied 
            ? 'bg-green-500/20 text-green-300 border-green-500/40' 
            : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
        }`}
      >
        <FiShare2 className="w-4 h-4 text-purple-400" />
        <span>{copied ? 'Tautan Disalin! ✅' : `Bagikan (${formatNumber(shares)})`}</span>
      </button>

      <Link
        to={`/blog/${post.slug}`}
        onClick={handleReadFull}
        className="flex-1 max-w-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl text-center text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 group cursor-pointer"
      >
        <span>Baca Artikel Lengkap</span>
        <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}