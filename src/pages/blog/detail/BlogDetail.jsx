import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cleanContent, getLabelColor, formatNumber } from "../utils/blogUtils";
import { useState, useEffect, useRef, useMemo } from "react";
import blogService from "../helpers/BlogService";
import {
  fetchComments,
  addComment,
  getLikeStatus,
  toggleLike,
  getBookmarkStatus,
  toggleBookmark,
  recordView,
  recordShare,
  getUserRating,
  submitRating,
  fetchPostBySlug,
  subscribeToComments
} from "../services/blogSupabase";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiEye,
  FiHeart,
  FiStar,
  FiMessageSquare,
  FiShare2,
  FiBookmark,
  FiUser,
  FiTag,
  FiBook,
  FiCheckCircle,
  FiChevronRight,
  FiMail,
  FiThumbsUp,
  FiX,
  FiCopy,
  FiList,
  FiImage
} from "react-icons/fi";

// Komponen Code Block dengan tombol Salin Kode
function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');
  const language = className ? className.replace(/language-/, '') : 'code';

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-gray-700/80 bg-gray-950/90 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900/90 border-b border-gray-800 text-xs text-gray-400 font-mono">
        <span className="uppercase tracking-wider text-cyan-400 font-semibold">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <FiCheckCircle className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-300">Tersalin!</span>
            </>
          ) : (
            <>
              <FiCopy className="w-3.5 h-3.5" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-200 leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

// 🖼️ Komponen Gambar Konten Artikel (Diperkecil elegan + Shimmer Wave + Progressive Loading)
function BlogContentImage({ src, alt, onOpenLightbox, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isVideo = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.mov'));
  if (isVideo) {
    return (
      <span className="block my-6 max-w-xl mx-auto">
        <span className="block relative overflow-hidden rounded-xl border border-gray-700/60 bg-gray-900 shadow-xl">
          <video
            src={src}
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-[360px] object-cover rounded-xl"
          />
        </span>
        {alt && (
          <span className="block text-center text-xs text-cyan-400 mt-2 italic font-medium">
            🎬 {alt}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="block my-6 max-w-md sm:max-w-lg md:max-w-xl mx-auto group">
      <span
        className="block relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-700/60 bg-slate-900/90 shadow-lg cursor-pointer hover:border-cyan-500/50 transition-all duration-300 min-h-[160px]"
        onClick={() => onOpenLightbox && onOpenLightbox(src)}
      >
        {/* Shimmer Wave Loader */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
            <FiImage className="w-8 h-8 text-cyan-400/30 animate-pulse relative z-10" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center text-gray-500 text-xs">
            <FiImage className="w-6 h-6 mr-1 opacity-40 text-red-400/60" /> Gambar tidak dapat dimuat
          </div>
        )}

        <img
          src={src}
          alt={alt || "Gambar artikel"}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`w-full max-h-[320px] sm:max-h-[360px] object-contain sm:object-cover mx-auto transition-all duration-500 group-hover:scale-102 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          {...props}
        />

        <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <span className="bg-black/80 text-cyan-300 text-xs font-medium px-3.5 py-1.5 rounded-full border border-cyan-500/40 flex items-center gap-1.5 shadow-xl">
            🔍 Perbesar foto
          </span>
        </span>
      </span>
      {alt && (
        <span className="block text-center text-xs text-gray-400 mt-2 italic">
          📷 {alt}
        </span>
      )}
    </span>
  );
}

// 🖼️ Komponen Gambar Cover Utama Artikel
function BlogDetailCover({ post }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (post.coverVideo) {
    return (
      <div className="mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
        <video
          src={post.coverVideo}
          controls
          className="w-full h-80 sm:h-96 object-cover"
          poster={post.thumbnail}
        />
      </div>
    );
  }

  const imgSrc = post.imageFull || post.thumbnail;
  if (!imgSrc) {
    return (
      <div className="mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50 w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📷</div>
          <p>Tidak ada gambar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50 relative bg-slate-900 h-80 md:h-96">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
          <FiImage className="w-12 h-12 text-cyan-400/30 animate-pulse relative z-10" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={post.title}
        loading="eager"
        fetchpriority="high"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover hover:scale-105 transition-all duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

// 🖼️ Komponen Item Galeri Blog
function BlogGalleryItem({ img, index, title, onOpenLightbox }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={() => onOpenLightbox && onOpenLightbox(img)}
      className="group relative overflow-hidden rounded-xl bg-slate-900/90 border border-gray-700/50 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer shadow-lg h-48"
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
          <FiImage className="w-8 h-8 text-cyan-400/30 animate-pulse relative z-10" />
        </div>
      )}
      <img
        src={img}
        alt={`${title} - Gallery ${index + 1}`}
        loading={index < 3 ? "eager" : "lazy"}
        fetchpriority={index < 3 ? "high" : "low"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 pointer-events-none">
        <span className="text-white font-medium text-xs bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 border border-white/10">
          🔍 Perbesar Foto {index + 1}
        </span>
      </div>
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const endRef = useRef(null);

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [shares, setShares] = useState(0);
  const [rating, setRating] = useState(5.0);
  const [totalRatings, setTotalRatings] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [showTOC, setShowTOC] = useState(true);
  const [relatedLimit, _setRelatedLimit] = useState(6);

  // Komentar state
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // 1. Dynamic SEO & Meta tags
  useEffect(() => {
    if (post) {
      const originalTitle = document.title;
      document.title = `${post.title} | Blog Syaiful`;

      const setMeta = (name, content, isProperty = false) => {
        const attr = isProperty ? 'property' : 'name';
        let meta = document.querySelector(`meta[${attr}="${name}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attr, name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      if (post.excerpt) {
        setMeta('description', post.excerpt);
        setMeta('og:description', post.excerpt, true);
        setMeta('twitter:description', post.excerpt);
      }
      setMeta('og:title', post.title, true);
      setMeta('twitter:title', post.title);
      if (post.imageFull || post.thumbnail) {
        setMeta('og:image', post.imageFull || post.thumbnail, true);
        setMeta('twitter:image', post.imageFull || post.thumbnail);
      }
      setMeta('og:type', 'article', true);
      setMeta('og:url', window.location.href, true);

      return () => {
        document.title = originalTitle;
      };
    }
  }, [post]);

  // 2. Daftar Isi Otomatis (Table of Contents)
  const tableOfContents = useMemo(() => {
    if (!post?.content) return [];
    const raw = cleanContent(post.content);
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const list = [];
    let match;
    while ((match = headingRegex.exec(raw)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      list.push({ level, title, id });
    }
    return list;
  }, [post?.content]);

  // 3. Scroll listener untuk reading progress & back-to-top
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const related = useMemo(() => {
    if (!post) return [];
    const posts = blogService.getRelatedPosts(post.slug, relatedLimit || 6) || [];
    return posts.map(r => ({ post: r, reason: post.relatedPosts?.includes(r.slug) ? 'Direkomendasikan' : 'Terkait' }));
  }, [post, relatedLimit]);

  // Load Post, Comments, dan Likes/Views/Shares/Ratings dari Supabase (fallback ke lokal dinamis)
  useEffect(() => {
    document.body.style.overflow = "auto";
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch data artikel terbaru dari Supabase/lokal dinamis
    fetchPostBySlug(slug)
      .then((p) => {
        if (p) {
          setPost(p);
          setLikes(p.likes || 0);
          setViews(p.views || 0);
          setShares(p.shares || 0);
          setRating(Number(p.rating || 5.0));
          setTotalRatings(p.totalRatings || 1);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    // Catat view secara dinamis & perbarui state
    recordView(slug, 0).then((v) => {
      if (typeof v === 'number') {
        setViews(v);
      }
    });

    // Ambil rating user saat ini
    const curUserRating = getUserRating(slug);
    setUserRating(curUserRating);

    // Ambil komentar dinamis
    fetchComments(slug).then((cmts) => {
      if (Array.isArray(cmts)) {
        setComments(cmts);
      }
    });

    // Subscribe ke realtime komentar jika Supabase aktif
    const unsubComments = subscribeToComments(slug, (newComment) => {
      setComments((prev) => {
        if (prev.some(c => c.id === newComment.id || (c.name === newComment.name && c.message === newComment.message))) {
          return prev;
        }
        return [newComment, ...prev];
      });
    });

    // Cek status like & bookmark
    setIsLiked(getLikeStatus(slug));
    setIsBookmarked(getBookmarkStatus(slug));

    return () => {
      if (typeof unsubComments === 'function') unsubComments();
      document.body.style.overflow = "auto";
    };
  }, [slug]);

  // Track topik artikel untuk konteks AI setelah post termuat
  useEffect(() => {
    if (!post) return;
    const topicData = {
      name: post.category || (post.tags && post.tags[0]) || "Umum",
      title: post.title,
      timestamp: Date.now()
    };
    localStorage.setItem('saipul_ai_last_topic', JSON.stringify(topicData));
  }, [post]);

  const handleToggleLike = async () => {
    if (!post) return;
    const res = await toggleLike(post.slug, likes);
    setIsLiked(res.isLiked);
    setLikes(res.count);
  };

  const handleToggleBookmark = async () => {
    if (!post) return;
    const res = await toggleBookmark(post.slug);
    setIsBookmarked(res);
  };

  const handleRatingSubmit = async (score) => {
    if (!post) return;
    const res = await submitRating(post.slug, score, rating, totalRatings);
    setUserRating(res.userRating);
    setRating(res.rating);
    setTotalRatings(res.totalRatings);
    setRatingSuccess(true);
    setTimeout(() => setRatingSuccess(false), 3500);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentMessage.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await addComment({
        postSlug: slug,
        name: commentName,
        email: commentEmail,
        message: commentMessage
      });

      setComments(prev => [newComment, ...prev]);
      setCommentMessage("");
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch (err) {
      console.error("Gagal menambah komentar:", err);
      alert("Gagal mengirim komentar: " + (err.message || "Silakan coba lagi"));
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Handle scroll untuk tombol back to top
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Jika datang dari popup dengan permintaan scroll ke akhir
  useEffect(() => {
    if (location?.state?.scrollToEnd) {
      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
  }, [location]);

  // === 💡 Fungsi Redirect ke Detail Profile Author ===
  const handleAuthorClick = (e, author) => {
    e.stopPropagation();
    // Generate slug dari nama author
    const authorSlug = author.toLowerCase().replace(/\s+/g, '-');
    navigate(`/blog/authors/${authorSlug}`, {
      state: {
        authorName: author,
      }
    });
  };

  // === ⏳ Loading state saat mengambil artikel dinamis ===
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium text-lg">Memuat artikel...</p>
          <p className="text-gray-500 text-sm mt-1">Mengambil data terbaru dari database</p>
        </div>
      </div>
    );
  }

  // === 🚨 Jika artikel tidak ditemukan ===
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <section className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-gray-700/50 backdrop-blur-lg">
            <div className="text-6xl mb-6">📝</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Artikel Tidak Ditemukan</h1>
            <p className="text-gray-400 mb-8 text-lg">Maaf, artikel yang kamu cari tidak tersedia atau telah dihapus.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/60 text-sm text-gray-200 rounded-lg border border-gray-700/50 hover:bg-gray-800">
              <FiArrowLeft className="w-4 h-4" /> Kembali ke Blog
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // === 🕓 Format waktu baca ===
  const formatReadTime = (time) => {
    if (!time) return "Waktu baca tidak tersedia";
    const num = parseInt(time);
    return isNaN(num) ? time : `${num} menit baca`;
  };

  // === 🕰️ Format waktu relatif (Indonesia) ===
  const formatRelativeTime = (input) => {
    if (!input) return '-';
    const date = new Date(input);
    if (isNaN(date)) return input;
    const now = new Date();
    let diff = Math.floor((now - date) / 1000); // seconds

    const units = [
      { name: 'tahun', secs: 31536000 },
      { name: 'bulan', secs: 2592000 },
      { name: 'minggu', secs: 604800 },
      { name: 'hari', secs: 86400 },
      { name: 'jam', secs: 3600 },
      { name: 'menit', secs: 60 },
      { name: 'detik', secs: 1 },
    ];

    const isFuture = diff < 0;
    diff = Math.abs(diff);

    for (const u of units) {
      if (diff >= u.secs) {
        const val = Math.floor(diff / u.secs);
        const label = val === 1 ? `satu ${u.name}` : `${val} ${u.name}`;
        return isFuture ? `dalam ${label}` : `${label} lalu`;
      }
    }

    return 'baru saja';
  };

  // === 📊 Status Badge ===
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      published: { color: "bg-green-500/20 text-green-400 border-green-500/30", text: "📢 Terbit", icon: FiCheckCircle },
      draft: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", text: "📝 Draf", icon: FiBook },
      archived: { color: "bg-gray-500/20 text-gray-400 border-gray-500/30", text: "📁 Arsip", icon: FiBookmark }
    };

    const config = statusConfig[status] || statusConfig.published;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  // === 📱 Share Artikel Dinamis ===
  const handleShare = async () => {
    if (!post) return;

    // Tingkatkan counter share secara dinamis
    const nextShares = await recordShare(post.slug, shares);
    setShares(nextShares);

    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled or error:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link artikel berhasil disalin!');
    }
  };

  // === 🎨 Custom Components untuk ReactMarkdown ===
  const MarkdownComponents = {
    h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-6 text-cyan-400 border-b border-cyan-400/20 pb-3" {...props} />,
    h2: (props) => {
      const text = typeof props.children === 'string' ? props.children : String(props.children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h2 id={id} className="scroll-mt-24 text-2xl font-bold mt-8 mb-4 text-purple-400" {...props} />;
    },
    h3: (props) => {
      const text = typeof props.children === 'string' ? props.children : String(props.children);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return <h3 id={id} className="scroll-mt-24 text-xl font-bold mt-6 mb-3 text-green-400" {...props} />;
    },
    p: (props) => <p className="mb-6 leading-8 text-gray-300 text-justify" {...props} />,
    strong: (props) => <strong className="font-bold text-cyan-300" {...props} />,
    a: (props) => <a className="text-cyan-400 hover:text-cyan-300 underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
    ul: (props) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300" {...props} />,
    ol: (props) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-300" {...props} />,
    blockquote: (props) => (
      <blockquote className="border-l-4 border-cyan-500 pl-6 italic bg-gray-800/50 py-4 rounded-r-lg my-6 text-cyan-100" {...props} />
    ),
    code: ({ inline, className, children, ...props }) =>
      inline ? (
        <code className="bg-gray-800 px-2 py-1 rounded-lg text-cyan-300 text-sm font-mono" {...props}>{children}</code>
      ) : (
        <CodeBlock className={className} {...props}>{children}</CodeBlock>
      ),
    img: ({ src, alt, ...props }) => (
      <BlogContentImage
        src={src}
        alt={alt}
        onOpenLightbox={setLightboxImage}
        {...props}
      />
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
      {/* 🚀 Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-gray-900/60 backdrop-blur-md">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-75 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-3 rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-cyan-500/30"
        >
          <FiArrowLeft className="w-5 h-5 rotate-90" />
        </button>
      )}

      {/* Header dengan Background Gradient */}
      <div className="bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-blue-900/20 border-b border-gray-700/50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 pt-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap">
            <Link to="/" className="hover:text-cyan-400 transition-all duration-300 flex items-center gap-1">
              <span>🏠</span> Home
            </Link>
            <FiChevronRight className="w-3 h-3 text-gray-500" />
            <Link to="/blog" className="hover:text-cyan-400 transition-all duration-300 flex items-center gap-1">
              <FiBook className="w-3 h-3" /> Blog
            </Link>
            <FiChevronRight className="w-3 h-3 text-gray-500" />
            <span className="text-cyan-400 truncate flex items-center gap-1">
              <FiBook className="w-3 h-3" /> {post.title}
            </span>
          </nav>

          {/* Status & Category */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StatusBadge status={post.status} />
            {post.category && (
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-500/30 flex items-center gap-1">
                <FiTag className="w-3 h-3" />
                {post.category}
              </span>
            )}
            {post.featured && (
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-500/30 flex items-center gap-1">
                <FiStar className="w-3 h-3" />
                Featured
              </span>
            )}
            {/* Labels */}
            {post.labels?.map((label, idx) => (
              <span key={idx} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getLabelColor(label)}`}>
                {label}
              </span>
            ))}
          </div>

          {/* Judul Utama */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-8">
            {post.author && (
              <button
                onClick={(e) => handleAuthorClick(e, post.author)}
                className="flex items-center gap-2 group bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {post.author.charAt(0)}
                </div>
                <span className="group-hover:text-cyan-400 transition-colors">{post.author}</span>
                <FiCheckCircle className="w-4 h-4 text-green-400" />
              </button>
            )}
            {post.date && (
              <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                <FiCalendar className="w-4 h-4 text-green-400" />
                {formatRelativeTime(post.date)}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700/50">
                <FiClock className="w-4 h-4 text-yellow-400" />
                {formatReadTime(post.readTime)}
              </span>
            )}
          </div>

          {/* Stats Bar Dinamis */}
          <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b border-gray-700/50 mb-8">
            <div className="flex items-center gap-2">
              <FiEye className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-medium">{formatNumber(views)} views</span>
            </div>
            <div className="flex items-center gap-2">
              <FiHeart className="w-5 h-5 text-red-400" />
              <span className="text-sm font-medium">{formatNumber(likes)} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <FiStar className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">{Number(rating || 5.0).toFixed(1)}/5 rating ({totalRatings} ulasan)</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShare2 className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium">{formatNumber(shares)} shares</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMessageSquare className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">{comments.length} komentar</span>
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-8 text-gray-200">
        {/* Cover Media dengan Progressive Shimmer & Priority Loading */}
        <BlogDetailCover post={post} />

        {/* Action Buttons Dinamis */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${isLiked
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 hover:text-white'
              }`}
          >
            <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current text-red-400' : ''}`} />
            {isLiked ? 'Disukai' : 'Suka'} ({likes})
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${isBookmarked
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 hover:text-white'
              }`}
          >
            <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current text-amber-400' : ''}`} />
            {isBookmarked ? 'Disimpan' : 'Simpan'}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 hover:text-white transition-all duration-300 font-medium"
          >
            <FiShare2 className="w-5 h-5 text-purple-400" />
            Bagikan ({formatNumber(shares)})
          </button>
        </div>

        {/* ⭐ Widget Rating Bintang Interaktif Dinamis */}
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-800/60 via-gray-800/40 to-gray-800/60 rounded-2xl border border-yellow-500/20 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FiStar className="w-5 h-5 text-yellow-400 fill-current" />
                <span>Beri Nilai Artikel Ini</span>
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {userRating > 0
                  ? `Rating Anda saat ini: ${userRating} dari 5 bintang. Klik bintang lain untuk mengubah nilai.`
                  : 'Klik bintang di bawah untuk memberikan apresiasi dan feedback langsung pada artikel ini.'}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end">
              <div className="flex items-center gap-1.5 bg-gray-900/60 px-4 py-2 rounded-xl border border-gray-700/60">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || userRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRatingSubmit(star)}
                      title={`Beri ${star} Bintang`}
                      className="p-1 hover:scale-125 transition-transform duration-150 focus:outline-none"
                    >
                      <FiStar
                        className={`w-6 h-6 transition-colors duration-150 ${isFilled
                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                            : 'text-gray-600 hover:text-yellow-200'
                          }`}
                      />
                    </button>
                  );
                })}
                <span className="text-sm font-bold text-yellow-300 ml-2 min-w-[36px] text-right">
                  {(hoverRating || userRating || rating).toFixed(1)}
                </span>
              </div>

              {ratingSuccess && (
                <span className="text-xs text-green-400 font-medium mt-1.5 animate-fadeIn flex items-center gap-1">
                  <FiCheckCircle className="w-3.5 h-3.5" /> Rating Anda berhasil disimpan!
                </span>
              )}
              {hoverRating > 0 && !ratingSuccess && (
                <span className="text-[11px] text-gray-400 mt-1.5">
                  {hoverRating === 1 && '1/5 - Kurang Bermanfaat'}
                  {hoverRating === 2 && '2/5 - Cukup Informatif'}
                  {hoverRating === 3 && '3/5 - Baik & Membantu'}
                  {hoverRating === 4 && '4/5 - Sangat Bagus & Lengkap'}
                  {hoverRating === 5 && '5/5 - Luar Biasa & Sangat Bermanfaat!'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-400"></div>
            <div className="flex items-start gap-4">
              <div className="text-cyan-400 text-xl mt-1">💡</div>
              <p className="text-cyan-100 text-lg leading-relaxed font-medium flex-1">
                {post.excerpt}
              </p>
            </div>
          </div>
        )}

        {/* 📚 Daftar Isi Otomatis (Table of Contents) */}
        {tableOfContents.length > 1 && (
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 mb-8 border border-gray-700/50 backdrop-blur-sm shadow-xl">
            <button
              type="button"
              onClick={() => setShowTOC(!showTOC)}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base sm:text-lg">
                <FiList className="w-5 h-5 text-cyan-400" />
                <span>Daftar Isi Artikel</span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-700/60 group-hover:text-cyan-300 transition-colors">
                {showTOC ? 'Sembunyikan' : 'Tampilkan'} ({tableOfContents.length})
              </span>
            </button>
            {showTOC && (
              <nav className="mt-4 pt-4 border-t border-gray-700/50 space-y-2 text-sm">
                {tableOfContents.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className={`block transition-all hover:translate-x-1 ${item.level === 3
                        ? 'pl-6 text-xs text-gray-400 hover:text-cyan-300'
                        : 'font-medium text-gray-300 hover:text-cyan-400'
                      }`}
                  >
                    <span className="text-cyan-500 mr-2 font-mono text-xs">{idx + 1}.</span>
                    {item.title}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* Konten Artikel */}
        <div className="prose prose-invert prose-lg max-w-none leading-relaxed mb-12">
          {post.content ? (
            <div className="bg-gray-800/30 rounded-2xl p-6 sm:p-8 border border-gray-700/50 backdrop-blur-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {cleanContent(post.content)}
              </ReactMarkdown>
              {/* anchor untuk scroll ke akhir ketika diminta dari popup */}
              <div ref={endRef} id="scroll-anchor-end" className="w-full h-1" />
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl text-gray-400">Konten artikel belum tersedia.</p>
            </div>
          )}
        </div>

        {/* Galeri Gambar */}
        {Array.isArray(post.gallery) && post.gallery.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FiThumbsUp className="w-4 h-4 text-white" />
              </div>
              Galeri Foto (Klik untuk Memperbesar)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.gallery.map((img, i) => (
                <BlogGalleryItem
                  key={i}
                  img={img}
                  index={i}
                  title={post.title}
                  onOpenLightbox={setLightboxImage}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <FiTag className="w-4 h-4 text-white" />
              </div>
              Tag Artikel
            </h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => navigate(`/blog?search=${encodeURIComponent(tag)}`)}
                  className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 text-cyan-300 px-4 py-2.5 rounded-xl text-sm border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer hover:scale-105 font-medium"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profil Penulis */}
        {(post.author || post.authorAvatar || post.authorBio) && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              Tentang Penulis
            </h3>
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-400/20 transition-all duration-300 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={post.authorAvatar || `/api/placeholder/80/80?text=${post.author?.charAt(0) || 'A'}`}
                    alt={post.author || "Author"}
                    loading="lazy"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-cyan-500/30 shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  {post.author && (
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-bold text-white">
                        {post.author}
                      </h4>
                      <FiCheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                  {post.authorBio && (
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {post.authorBio}
                    </p>
                  )}
                  <button
                    onClick={(e) => handleAuthorClick(e, post.author)}
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-all group bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-500/20"
                  >
                    Lihat Profil Lengkap
                    <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Komentar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FiMessageSquare className="w-4 h-4 text-white" />
              </div>
              Komentar ({comments.length})
            </h3>
            <button
              onClick={() => setShowCommentForm(prev => !prev)}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-all bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-500/20"
            >
              <FiMessageSquare className="w-4 h-4" />
              {showCommentForm ? 'Tutup Form Komentar' : 'Tulis Komentar'}
            </button>
          </div>

          {/* Form Tambah Komentar */}
          {showCommentForm && (
            <form onSubmit={handleCommentSubmit} className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/60 mb-8 backdrop-blur-md shadow-xl animate-fadeIn">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>💬</span> Berikan Tanggapan atau Pertanyaan
              </h4>

              {commentSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300 text-sm flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
                  Komentar Anda berhasil terkirim dan tersimpan!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Nama Anda <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Contoh: Alex Pratama"
                    className="w-full bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Komentar <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={commentMessage}
                  onChange={(e) => setCommentMessage(e.target.value)}
                  placeholder="Tuliskan apresiasi, saran, atau pertanyaan Anda seputar artikel ini..."
                  className="w-full bg-gray-900/60 border border-gray-700/60 rounded-xl px-4 py-2.5 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCommentForm(false)}
                  className="px-4 py-2 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmittingComment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Komentar</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((c, i) => (
                <div
                  key={c.id || i}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {(c.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{c.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {c.date ? formatRelativeTime(c.date) : "Baru saja"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed pl-12 whitespace-pre-wrap">
                    {c.message || ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-400 mb-4">Belum ada komentar untuk artikel ini.</p>
              <button
                onClick={() => setShowCommentForm(true)}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-all group flex items-center gap-2 justify-center mx-auto"
              >
                Jadilah yang pertama berkomentar
                <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Artikel Terkait */}
        {related.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <FiBook className="w-4 h-4 text-white" />
              </div>
              Artikel Terkait
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map((item) => {
                const r = item.post;
                const reason = item.reason;
                return (
                  <Link
                    key={r.slug}
                    to={`/blog/${r.slug}`}
                    className="group bg-gradient-to-br from-gray-800/80 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-500 overflow-hidden backdrop-blur-sm"
                  >
                    <div className="flex gap-4">
                      {r.thumbnail && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800 relative">
                          <img
                            src={r.thumbnail}
                            alt={r.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                            {r.title}
                          </h4>
                          <span className="text-xs text-gray-300 bg-gray-800/40 px-2 py-1 rounded-full ml-2">{reason}</span>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                          {r.excerpt || "Baca artikel selengkapnya..."}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {r.readTime && <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {formatReadTime(r.readTime)}</span>}
                          {r.views && <span className="flex items-center gap-1"><FiEye className="w-3 h-3" /> {formatNumber(r.views)}</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link
              to="/blog"
              className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 font-medium transition-all group bg-cyan-500/10 hover:bg-cyan-500/20 px-6 py-3 rounded-xl border border-cyan-500/20"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Daftar Blog
            </Link>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Terakhir diperbarui: {post.updatedAt ? formatRelativeTime(post.updatedAt) : '-'}</span>
              <span>•</span>
              <span>Tingkat bacaan: {post.readingLevel || 'Umum'}</span>
            </div>
          </div>
        </div>
      </article>

      {/* 🖼️ Fullscreen Lightbox Modal untuk Galeri Foto */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 w-11 h-11 bg-gray-800/80 hover:bg-gray-700 rounded-full flex items-center justify-center text-white border border-gray-600/50 shadow-2xl transition-all hover:scale-110"
            title="Tutup Pratinjau (ESC)"
          >
            <FiX className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen View"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}