import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cleanContent } from "../utils/blogUtils";
import { useState, useEffect, useRef, useMemo } from "react";
import blogs from "../../../data/blog/data.json";
import blogService from "../helpers/BlogService";
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
  FiThumbsUp
} from "react-icons/fi";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogs.find((b) => b.slug === slug);
  const location = useLocation();
  const endRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [relatedLimit, _setRelatedLimit] = useState(6);

  const related = useMemo(() => {
    if (!post) return [];
    const posts = blogService.getRelatedPosts(post.slug, relatedLimit || 6) || [];
    return posts.map(p => ({ post: p, reason: p.relatedPosts && p.relatedPosts.includes(p.slug) ? 'Direkomendasikan' : 'Terkait' }));
  }, [post, relatedLimit]);

  // Scroll ke atas saat artikel berubah
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

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

  // === 📱 Share Artikel ===
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
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
    h2: (props) => <h2 className="text-2xl font-bold mt-8 mb-4 text-purple-400" {...props} />,
    h3: (props) => <h3 className="text-xl font-bold mt-6 mb-3 text-green-400" {...props} />,
    p: (props) => <p className="mb-6 leading-8 text-gray-300 text-justify" {...props} />,
    strong: (props) => <strong className="font-bold text-cyan-300" {...props} />,
    a: (props) => <a className="text-cyan-400 hover:text-cyan-300 underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
    ul: (props) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300" {...props} />,
    ol: (props) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-300" {...props} />,
    blockquote: (props) => (
      <blockquote className="border-l-4 border-cyan-500 pl-6 italic bg-gray-800/50 py-4 rounded-r-lg my-6 text-cyan-100" {...props} />
    ),
    code: ({inline, children, ...props}) =>
      inline ? (
        <code className="bg-gray-800 px-2 py-1 rounded-lg text-cyan-300 text-sm font-mono" {...props}>{children}</code>
      ) : (
        <pre className="bg-gray-900 p-4 rounded-lg overflow-auto"><code className="text-sm font-mono text-gray-200" {...props}>{children}</code></pre>
      ),
  };

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

  // Format number for stats
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-6 py-4 border-t border-b border-gray-700/50 mb-8">
            {post.views && (
              <div className="flex items-center gap-2">
                <FiEye className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-medium">{formatNumber(post.views)} views</span>
              </div>
            )}
            {post.likes && (
              <div className="flex items-center gap-2">
                <FiHeart className="w-5 h-5 text-red-400" />
                <span className="text-sm font-medium">{formatNumber(post.likes)} likes</span>
              </div>
            )}
            {post.rating && (
              <div className="flex items-center gap-2">
                <FiStar className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">{post.rating}/5 rating</span>
              </div>
            )}
            {(post.commentCount > 0) && (
              <div className="flex items-center gap-2">
                <FiMessageSquare className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">{post.commentCount} komentar</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-8 text-gray-200">
        {/* Cover Media */}
        <div className="mb-8 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
          {post.coverVideo ? (
            <video
              src={post.coverVideo}
              controls
              className="w-full h-96 object-cover"
              poster={post.thumbnail}
            />
          ) : post.imageFull || post.thumbnail ? (
            <img
              src={post.imageFull || post.thumbnail}
              alt={post.title}
              loading="eager"
              className="w-full h-80 md:h-96 object-cover hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📷</div>
                <p>Tidak ada gambar</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-8 p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
              isLiked 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 hover:text-white'
            }`}
          >
            <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Disukai' : 'Suka'}
          </button>
          
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
              isBookmarked 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 hover:text-white'
            }`}
          >
            <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Disimpan' : 'Simpan'}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50 hover:text-white transition-all duration-300 font-medium"
          >
            <FiShare2 className="w-5 h-5" />
            Bagikan
          </button>
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
              Galeri Foto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.gallery.map((img, i) => (
                <div key={i} className="group relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-500">
                  <img
                    src={img}
                    alt={`${post.title} - Gallery ${i + 1}`}
                    loading="lazy"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
                    <span className="text-white font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Gambar {i + 1}
                    </span>
                  </div>
                </div>
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
                <span
                  key={i}
                  className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 text-cyan-300 px-4 py-2.5 rounded-xl text-sm border border-cyan-500/30 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer hover:scale-105 font-medium"
                >
                  #{tag}
                </span>
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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FiMessageSquare className="w-4 h-4 text-white" />
              </div>
              Komentar ({post.commentCount || post.comments?.length || 0})
            </h3>
            {(post.commentCount > 0) && (
              <button className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-all bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-500/20">
                <FiMessageSquare className="w-4 h-4" />
                Tambah Komentar
              </button>
            )}
          </div>

          {Array.isArray(post.comments) && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{c.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {c.date ? formatRelativeTime(c.date) : "Tanggal tidak diketahui"}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed pl-13">
                    {c.message || ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-800/30 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-400 mb-4">Belum ada komentar untuk artikel ini.</p>
              <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-all group flex items-center gap-2 justify-center mx-auto">
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
                      <img
                        src={r.thumbnail}
                        alt={r.title}
                        loading="lazy"
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                      />
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
    </div>
  );
}