import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { fetchAllPosts } from "../services/blogSupabase";
import { getAuthorProfile } from "../services/authorProfileService";
import { Sparkles } from "lucide-react";
import {
  FiArrowLeft,
  FiCalendar,
  FiBook,
  FiEye,
  FiHeart,
  FiStar,
  FiMessageSquare,
  FiShare2,
  FiMail,
  FiGlobe,
  FiAward,
  FiCheckCircle,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiGithub,
  FiUser,
  FiClock,
  FiTrendingUp,
  FiBookOpen,
  FiMapPin,
  FiBriefcase,
  FiSearch,
  FiExternalLink,
  FiCamera,
  FiImage,
  FiLayers,
  FiFileText,
  FiCheck,
  FiX,
  FiCompass,
  FiTag
} from "react-icons/fi";

// Komponen Gambar Khusus dengan Shimmer Wave & Zero Layout Shift
function ShimmerImage({ src, alt, className = "", containerClassName = "", priority = false, fallbackText = "IMG" }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-800 ${containerClassName}`}>
      {/* Shimmer wave placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-800 animate-shimmer" />
      )}

      {error ? (
        <div className="w-full h-full min-h-[140px] flex items-center justify-center bg-slate-800/80 text-gray-500 text-xs">
          {fallbackText}
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchpriority: "high" } : {})}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`w-full h-full object-cover transition-all duration-500 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } ${className}`}
        />
      )}
    </div>
  );
}

export default function DetailProfile() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [authorData, setAuthorData] = useState(null);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("articles");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract author name from URL slug or navigation state
  const authorNameFromSlug = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : null;
  const authorName = location.state?.authorName || authorNameFromSlug;

  // Generate fallback social links
  const generateSocialLinks = (name) => {
    const username = (name || "creator").toLowerCase().replace(/\s+/g, '');
    return {
      twitter: `https://twitter.com/${username}`,
      instagram: `https://instagram.com/${username}`,
      linkedin: `https://linkedin.com/in/${username}`,
      github: `https://github.com/${username}`,
      website: `https://${username}.com`
    };
  };

  // Copy profile URL to clipboard with user feedback
  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (authorName) {
      setIsLoading(true);
      fetchAllPosts()
        .then((allPosts) => {
          const authorBlogs = (Array.isArray(allPosts) ? allPosts : []).filter(blog =>
            blog.author && blog.author.toLowerCase() === authorName.toLowerCase()
          );

          const customProfile = getAuthorProfile(slug || authorName);
          const firstBlog = authorBlogs[0] || {};
          const fallbackSocials = generateSocialLinks(authorName);

          const finalSocials = customProfile?.socialLinks ? {
            twitter: customProfile.socialLinks.twitter || fallbackSocials.twitter,
            instagram: customProfile.socialLinks.instagram || fallbackSocials.instagram,
            linkedin: customProfile.socialLinks.linkedin || fallbackSocials.linkedin,
            github: customProfile.socialLinks.github || fallbackSocials.github,
            website: customProfile.socialLinks.website || fallbackSocials.website,
          } : fallbackSocials;

          setAuthorData({
            name: customProfile?.name || firstBlog.author || authorName,
            avatar: customProfile?.avatar || firstBlog.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0284c7&color=fff&size=256&bold=true`,
            bio: customProfile?.bio || firstBlog.authorBio || `Penulis berdedikasi di bidang ${firstBlog.category || 'Teknologi & Kreatif'}, aktif membagikan panduan, opini mendalam, serta karya visual dan inovasi digital.`,
            joinDate: firstBlog.date || "2024-01-01",
            expertise: customProfile?.expertise || firstBlog.category || "Teknologi & Kreatif",
            location: customProfile?.location || "Indonesia",
            company: customProfile?.company || "Creator & Tech Enthusiast",
            email: customProfile?.email || "kontak@portofolio.id",
            verified: customProfile ? (customProfile.verified !== false) : true,
            socialLinks: finalSocials
          });

          setAuthorPosts(authorBlogs);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }

    // Listener realtime update jika diedit dari dashboard admin
    const handleProfileUpdated = (e) => {
      const updated = e.detail;
      if (updated && (updated.slug === slug || updated.name?.toLowerCase() === authorName?.toLowerCase())) {
        setAuthorData(prev => prev ? ({
          ...prev,
          name: updated.name,
          avatar: updated.avatar || prev.avatar,
          bio: updated.bio || prev.bio,
          expertise: updated.expertise || prev.expertise,
          location: updated.location || prev.location,
          company: updated.company || prev.company,
          email: updated.email || prev.email,
          verified: updated.verified !== false,
          socialLinks: { ...prev.socialLinks, ...(updated.socialLinks || {}) }
        }) : prev);
      }
    };

    window.addEventListener('author_profile_updated', handleProfileUpdated);
    return () => window.removeEventListener('author_profile_updated', handleProfileUpdated);
  }, [authorName, slug]);

  // Calculate author stats
  const authorStats = useMemo(() => {
    const stats = authorPosts.reduce((acc, post) => {
      return {
        totalViews: acc.totalViews + (post.views || 0),
        totalLikes: acc.totalLikes + (post.likes || 0),
        totalPosts: acc.totalPosts + 1,
        totalComments: acc.totalComments + (post.commentCount || 0),
        sumRating: acc.sumRating + (post.rating || 0)
      };
    }, {
      totalViews: 0,
      totalLikes: 0,
      totalPosts: 0,
      totalComments: 0,
      sumRating: 0
    });

    const avgRating = stats.totalPosts > 0 ? (stats.sumRating / stats.totalPosts).toFixed(1) : "5.0";
    return { ...stats, avgRating };
  }, [authorPosts]);

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num || 0;
  };

  // Categories list from author's posts
  const categories = useMemo(() => {
    const set = new Set();
    authorPosts.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [authorPosts]);

  // Filtered posts based on search query and category
  const filteredPosts = useMemo(() => {
    return authorPosts.filter(post => {
      const matchQuery = !searchQuery ||
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCat = selectedCategory === "all" || post.category === selectedCategory;
      return matchQuery && matchCat;
    });
  }, [authorPosts, searchQuery, selectedCategory]);

  // Popular posts sorted by views
  const popularPosts = useMemo(() => {
    return [...authorPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 6);
  }, [authorPosts]);

  // Label badge color
  const getLabelColor = (label) => {
    switch (label) {
      case "Baru": return "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
      case "Rekomendasi": return "bg-cyan-500/20 border-cyan-500/40 text-cyan-300";
      case "Hot": return "bg-amber-500/20 border-amber-500/40 text-amber-300";
      case "Premium": return "bg-purple-500/20 border-purple-500/40 text-purple-300";
      default: return "bg-slate-700/50 border-slate-600/50 text-slate-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-900/60 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-slate-300 font-medium">Memuat profil penulis...</p>
          <span className="text-xs text-slate-500 mt-1 block">Menyiapkan karya & integrasi portofolio</span>
        </div>
      </div>
    );
  }

  if (!authorName || !authorData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md mx-auto p-8 bg-slate-900/80 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <FiUser className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Penulis Tidak Ditemukan</h1>
          <p className="text-slate-400 text-sm mb-6">
            Profil penulis "{authorName || slug}" belum terdaftar atau belum mempublikasikan artikel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium border border-white/10 flex items-center justify-center gap-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              Kembali
            </button>
            <Link
              to="/blog"
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <FiBookOpen className="w-4 h-4" />
              Katalog Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Ambient Glow Lights */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Sticky Navigation */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 bg-slate-900/60 hover:bg-slate-800/80 px-4 py-2 rounded-xl border border-white/5 text-sm font-medium group"
            >
              <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali</span>
            </button>

            <div className="flex items-center gap-3">
              <Link
                to="/photography"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 bg-slate-900/40 hover:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5 transition-all"
              >
                <FiCamera className="w-3.5 h-3.5" />
                Fotografi
              </Link>
              <Link
                to="/gallery"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-purple-400 bg-slate-900/40 hover:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5 transition-all"
              >
                <FiImage className="w-3.5 h-3.5" />
                Galeri
              </Link>
              <Link
                to="/projek"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-emerald-400 bg-slate-900/40 hover:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/5 transition-all"
              >
                <FiLayers className="w-3.5 h-3.5" />
                Proyek
              </Link>
              <Link
                to="/blog"
                className="flex items-center gap-1.5 text-xs font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3.5 py-1.5 rounded-lg border border-cyan-500/30 transition-all shadow-sm"
              >
                <FiBookOpen className="w-3.5 h-3.5" />
                Semua Blog
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">

        {/* HERO PROFILE CARD */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-2xl shadow-2xl">

          {/* Aesthetic Cover Art Banner with Gradient & Grid */}
          <div className="relative h-44 sm:h-56 w-full bg-gradient-to-r from-cyan-900/40 via-purple-900/30 to-indigo-950/60 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Top Right Mini Creator Status */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-slate-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Penulis Aktif & Kreator</span>
            </div>
          </div>

          {/* Profile Header Core Info */}
          <div className="relative px-6 sm:px-8 pb-8 -mt-20 sm:-mt-24">
            <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">

              {/* Avatar + Main Identity */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                {/* Avatar with Glow Ring & Shimmer Wave */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-slate-950 bg-slate-900 shadow-2xl">
                    <ShimmerImage
                      src={authorData.avatar}
                      alt={authorData.name}
                      priority={true}
                      containerClassName="w-full h-full"
                      fallbackText={authorData.name?.charAt(0) || "A"}
                    />
                  </div>
                  {authorData.verified && (
                    <div
                      className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl p-1.5 border-2 border-slate-950 shadow-lg text-white"
                      title="Penulis Terverifikasi"
                    >
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Identity Details */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                      {authorData.name}
                    </h1>
                    {authorData.verified && (
                      <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
                        <FiCheck className="w-3.5 h-3.5" />
                        Terverifikasi
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-cyan-400 font-medium flex items-center justify-center sm:justify-start gap-2">
                    <FiBriefcase className="w-3.5 h-3.5" />
                    {authorData.expertise} Specialist
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{authorData.company}</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="w-3.5 h-3.5 text-slate-500" />
                      {authorData.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="w-3.5 h-3.5 text-slate-500" />
                      Bergabung {new Date(authorData.joinDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 w-full lg:w-auto pt-2 lg:pt-0">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:scale-[1.02]"
                >
                  <FiMail className="w-4 h-4" />
                  <span>Hubungi Penulis</span>
                </button>

                <button
                  onClick={handleShareProfile}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/10 text-sm font-medium transition-all"
                  title="Bagikan Tautan Profil"
                >
                  {copied ? (
                    <>
                      <FiCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <FiShare2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Bagikan</span>
                    </>
                  )}
                </button>

                {/* Social media pills */}
                <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-white/5">
                  {authorData.socialLinks?.github && (
                    <a
                      href={authorData.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                      title="GitHub"
                    >
                      <FiGithub className="w-4 h-4" />
                    </a>
                  )}
                  {authorData.socialLinks?.linkedin && (
                    <a
                      href={authorData.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-white/5 transition-all"
                      title="LinkedIn"
                    >
                      <FiLinkedin className="w-4 h-4" />
                    </a>
                  )}
                  {authorData.socialLinks?.instagram && (
                    <a
                      href={authorData.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-white/5 transition-all"
                      title="Instagram"
                    >
                      <FiInstagram className="w-4 h-4" />
                    </a>
                  )}
                  {authorData.socialLinks?.website && (
                    <a
                      href={authorData.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-all"
                      title="Website Pribadi"
                    >
                      <FiGlobe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Author Short Bio */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl">
                {authorData.bio}
              </p>
            </div>

            {/* Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center sm:text-left hover:border-cyan-500/20 transition-all">
                <div className="flex items-center justify-center sm:justify-between mb-1">
                  <span className="text-xs text-slate-400 font-medium">Total Artikel</span>
                  <FiBook className="w-4 h-4 text-cyan-400 hidden sm:block" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{authorStats.totalPosts}</div>
                <span className="text-[11px] text-cyan-400/80">Karya terpublikasi</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center sm:text-left hover:border-emerald-500/20 transition-all">
                <div className="flex items-center justify-center sm:justify-between mb-1">
                  <span className="text-xs text-slate-400 font-medium">Total Pembaca</span>
                  <FiEye className="w-4 h-4 text-emerald-400 hidden sm:block" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{formatNumber(authorStats.totalViews)}</div>
                <span className="text-[11px] text-emerald-400/80">Penayangan blog</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center sm:text-left hover:border-pink-500/20 transition-all">
                <div className="flex items-center justify-center sm:justify-between mb-1">
                  <span className="text-xs text-slate-400 font-medium">Apresiasi & Likes</span>
                  <FiHeart className="w-4 h-4 text-pink-400 hidden sm:block" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">{formatNumber(authorStats.totalLikes)}</div>
                <span className="text-[11px] text-pink-400/80">Dukungan pembaca</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-center sm:text-left hover:border-amber-500/20 transition-all">
                <div className="flex items-center justify-center sm:justify-between mb-1">
                  <span className="text-xs text-slate-400 font-medium">Rating Konten</span>
                  <FiStar className="w-4 h-4 text-amber-400 hidden sm:block" />
                </div>
                <div className="text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-1">
                  <span>{authorStats.avgRating}</span>
                  <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
                </div>
                <span className="text-[11px] text-amber-400/80">Skor kualitas</span>
              </div>
            </div>

          </div>
        </div>

        {/* CROSS-PAGE INTEGRATION HIGHLIGHT (BANNER KARYA & PORTOFOLIO LAINNYA) */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-slate-900/90 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <FiCompass className="w-3.5 h-3.5" />
                <span>Integrasi Multi-Halaman Portofolio</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Jelajahi Karya Kreatif & Dokumentasi {authorData.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Karya penulis ini terhubung langsung ke galeri visual, rekam jejak projek, dan dokumentasi visual.
              </p>
            </div>
            <Link
              to="/projek"
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-all"
            >
              <span>Semua Portofolio</span>
              <FiExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Fotografi Shortcut */}
            <Link
              to="/photography"
              className="group p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiCamera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    Koleksi Fotografi
                  </h4>
                  <p className="text-[11px] text-slate-400">Karya visual, lanskap & portrait</p>
                </div>
              </div>
            </Link>

            {/* Galeri Kenangan Shortcut */}
            <Link
              to="/gallery"
              className="group p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiImage className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Galeri & Momen
                  </h4>
                  <p className="text-[11px] text-slate-400">Dokumentasi arsip & video reels</p>
                </div>
              </div>
            </Link>

            {/* Showcase Projek Shortcut */}
            <Link
              to="/projek"
              className="group p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiLayers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    Portofolio Proyek
                  </h4>
                  <p className="text-[11px] text-slate-400">Aplikasi web, UI/UX & software</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* TABS NAVIGATION & CONTENT WRAPPER */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* Tab Navigation Strip */}
          <div className="border-b border-white/5 bg-slate-950/40 px-4 sm:px-6">
            <div className="flex overflow-x-auto scrollbar-none gap-2 py-3">
              {[
                { id: "articles", label: "Daftar Artikel", icon: FiBook, count: authorPosts.length },
                { id: "integrated", label: "Karya Terkait", icon: FiLayers, count: "Eksplor" },
                { id: "popular", label: "Artikel Populer", icon: FiAward, count: popularPosts.length },
                { id: "stats", label: "Statistik & Metrik", icon: FiTrendingUp },
                { id: "about", label: "Profil Lengkap", icon: FiUser }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all duration-200 ${isActive
                        ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${isActive ? "bg-cyan-500/20 text-cyan-200" : "bg-slate-800 text-slate-400"
                        }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB CONTENTS */}
          <div className="p-5 sm:p-8">

            {/* TAB 1: ARTIKEL */}
            {activeTab === "articles" && (
              <div className="space-y-6">

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/40 border border-white/5">
                  <div className="relative flex-1">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Cari artikel dari judul atau topik..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                            : "bg-slate-900/60 text-slate-400 hover:text-slate-300 border border-white/5"
                          }`}
                      >
                        {cat === "all" ? "Semua Kategori" : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Articles List / Grid */}
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/30 border border-dashed border-white/10">
                    <FiBookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-300 font-medium">Tidak ada artikel yang cocok</p>
                    <p className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredPosts.map((post, idx) => (
                      <article
                        key={post.slug || idx}
                        onClick={() => navigate(`/blog/${post.slug}`)}
                        className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-slate-950/40 hover:bg-slate-900/60 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-cyan-500/5"
                      >
                        {/* Thumbnail with Shimmer Wave Loader */}
                        <div className="relative aspect-video w-full overflow-hidden">
                          <ShimmerImage
                            src={post.thumbnail}
                            alt={post.title}
                            priority={idx < 4}
                            containerClassName="w-full h-full"
                            className="group-hover:scale-105 transition-transform duration-500"
                            fallbackText={post.title}
                          />

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md bg-slate-950/80 text-cyan-300 border border-cyan-500/30 shadow-md">
                              {post.category || "Artikel"}
                            </span>
                          </div>

                          {/* Labels */}
                          {post.labels && post.labels.length > 0 && (
                            <div className="absolute top-3 right-3 flex flex-wrap gap-1 z-10">
                              {post.labels.slice(0, 2).map((label, lIdx) => (
                                <span
                                  key={lIdx}
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-md ${getLabelColor(label)}`}
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Article Info */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <FiCalendar className="w-3.5 h-3.5 text-slate-500" />
                                {new Date(post.date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3.5 h-3.5 text-slate-500" />
                                {post.readTime || "5 min read"}
                              </span>
                            </div>

                            <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                              {post.title}
                            </h4>

                            <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                              {post.excerpt || post.content?.replace(/<[^>]+>/g, '') || "Baca selengkapnya pembahasan menarik dalam artikel ini..."}
                            </p>
                          </div>

                          {/* Article Footer Stats */}
                          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 hover:text-slate-200">
                                <FiEye className="w-3.5 h-3.5 text-emerald-400" />
                                {formatNumber(post.views || 0)}
                              </span>
                              <span className="flex items-center gap-1 hover:text-slate-200">
                                <FiHeart className="w-3.5 h-3.5 text-pink-400" />
                                {formatNumber(post.likes || 0)}
                              </span>
                              {post.rating && (
                                <span className="flex items-center gap-1 text-amber-300">
                                  <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                  {post.rating}
                                </span>
                              )}
                            </div>

                            <span className="text-cyan-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Baca
                              <FiArrowLeft className="w-3.5 h-3.5 rotate-180" />
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: KARYA TERKAIT & INTEGRASI PORTOFOLIO */}
            {activeTab === "integrated" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Integrasi Lintas Halaman & Portofolio</h3>
                  <p className="text-sm text-slate-400">
                    Eksplorasi seluruh domain kreatif dari {authorData.name}, dari jepretan lensa, arsip kenangan, hingga proyek rekayasa perangkat lunak.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Card Photography */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-950/80 border border-cyan-500/20 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                        <FiCamera className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1.5">Fotografi & Karya Visual</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Galeri visual beresolusi tinggi dengan komposisi estetik, filter warna sinematik, serta metadata kamera yang rinci.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-cyan-400 font-medium">Bidikan Lensa & Nuansa</span>
                      <Link
                        to="/photography"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-md"
                      >
                        Buka Fotografi
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Card Gallery Kenangan */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-950/80 border border-purple-500/20 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                        <FiImage className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1.5">Galeri Kenangan & Video Shorts</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Dokumentasi arsip perjalanan, kegiatan berkesan, kompilasi video singkat, dan album kegiatan terstruktur.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-purple-400 font-medium">Arsip Momen Penting</span>
                      <Link
                        to="/gallery"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs transition-all shadow-md"
                      >
                        Buka Galeri
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Card Projects */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-950/80 border border-emerald-500/20 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                        <FiLayers className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1.5">Showcase Portofolio Proyek</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Kompilasi aplikasi web interaktif, sistem otomasi, perancangan antarmuka, dan arsitektur kode mutakhir.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-emerald-400 font-medium">Rekayasa & Desain</span>
                      <Link
                        to="/projek"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-md"
                      >
                        Buka Proyek
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Card Tentang & CV */}
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/30 to-slate-950/80 border border-blue-500/20 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                        <FiFileText className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1.5">Tentang Saya & Curriculum Vitae</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        Pelajari riwayat karir, latar belakang pendidikan, keahlian mendalam, serta sertifikasi resmi profesional.
                      </p>
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-blue-400 font-medium">Profil & Kredensial</span>
                      <Link
                        to="/about"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
                      >
                        Tentang Saya
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: POPULER */}
            {activeTab === "popular" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Artikel Terpopuler</h3>
                  <p className="text-sm text-slate-400">
                    Tulisan dengan pembaca dan keterlibatan tertinggi dari {authorData.name}.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {popularPosts.map((post, idx) => (
                    <article
                      key={post.slug || idx}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-slate-950/50 hover:bg-slate-900/70 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg"
                    >
                      <div className="relative aspect-video w-full overflow-hidden">
                        <ShimmerImage
                          src={post.thumbnail}
                          alt={post.title}
                          containerClassName="w-full h-full"
                          className="group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Ranking badge */}
                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-xl text-xs font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-1 ${idx === 0
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400/40"
                            : idx === 1
                              ? "bg-gradient-to-r from-slate-400 to-slate-500 border border-slate-300/40"
                              : idx === 2
                                ? "bg-gradient-to-r from-amber-700 to-yellow-800 border border-amber-600/40"
                                : "bg-slate-900/80 border border-white/10"
                          }`}>
                          <FiAward className="w-3.5 h-3.5" />
                          <span>#{idx + 1}</span>
                        </div>

                        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-xs font-semibold text-amber-300 flex items-center gap-1">
                          <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span>{post.rating || "5.0"}</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                            {post.category}
                          </span>
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <FiEye className="w-3.5 h-3.5 text-emerald-400" />
                            {formatNumber(post.views || 0)} views
                          </span>
                          <span className="flex items-center gap-1">
                            <FiHeart className="w-3.5 h-3.5 text-pink-400" />
                            {formatNumber(post.likes || 0)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: STATISTIK & METRIK */}
            {activeTab === "stats" && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-white">Analitik & Performa Tulisan</h3>
                  <p className="text-sm text-slate-400">
                    Statistik kumulatif performa konten artikel yang ditulis oleh {authorData.name}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: "Total Artikel", value: authorStats.totalPosts, icon: FiBook, desc: "Jumlah postingan aktif", color: "text-cyan-400", bg: "bg-cyan-500/10" },
                    { label: "Total Pembaca", value: formatNumber(authorStats.totalViews), icon: FiEye, desc: "Jangkauan pembaca tulisan", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Total Apresiasi", value: formatNumber(authorStats.totalLikes), icon: FiHeart, desc: "Jumlah tanda suka dari pengunjung", color: "text-pink-400", bg: "bg-pink-500/10" },
                    { label: "Komentar Diskusi", value: formatNumber(authorStats.totalComments), icon: FiMessageSquare, desc: "Interaksi percakapan pembaca", color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Rata-rata Rating", value: `${authorStats.avgRating} / 5.0`, icon: FiStar, desc: "Penilaian kualitas keseluruhan", color: "text-amber-400", bg: "bg-amber-500/10" },
                    { label: "Status Verifikasi", value: authorData.verified ? "Terverifikasi" : "Reguler", icon: FiCheckCircle, desc: "Validasi kredibilitas profil", color: "text-purple-400", bg: "bg-purple-500/10" }
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-white/10 transition-all">
                        <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-0.5">{item.value}</div>
                        <div className="text-xs font-semibold text-slate-300">{item.label}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{item.desc}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Engagement Bar */}
                <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <FiTrendingUp className="w-4 h-4 text-cyan-400" />
                        Tingkat Kepuasan & Retensi Pembaca
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Dihitung berdasarkan proporsi views, likes, dan skor ulasan pembaca.
                      </p>
                    </div>
                    <span className="text-lg font-bold text-cyan-400">98.4%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full w-[98.4%]" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: TENTANG & PROFIL */}
            {activeTab === "about" && (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/5 space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-cyan-400" />
                    Biografi & Rekam Jejak
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {authorData.bio}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/5 space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-purple-400" />
                    Keahlian & Bidang Fokus
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      authorData.expertise,
                      "Content Strategy",
                      "Visual Storytelling",
                      "Web Development",
                      "UI/UX Design",
                      "Research & Writing"
                    ].map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-white/10 text-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/60 border border-white/5 space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <FiGlobe className="w-4 h-4 text-emerald-400" />
                    Koneksi & Tautan Resmi
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {authorData.email && (
                      <a
                        href={`mailto:${authorData.email}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-xs text-slate-300 hover:text-white transition-all"
                      >
                        <FiMail className="w-4 h-4 text-cyan-400" />
                        <span className="truncate">{authorData.email}</span>
                      </a>
                    )}
                    {authorData.socialLinks?.linkedin && (
                      <a
                        href={authorData.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-xs text-slate-300 hover:text-white transition-all"
                      >
                        <FiLinkedin className="w-4 h-4 text-blue-400" />
                        <span>Profil LinkedIn</span>
                      </a>
                    )}
                    {authorData.socialLinks?.github && (
                      <a
                        href={authorData.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-xs text-slate-300 hover:text-white transition-all"
                      >
                        <FiGithub className="w-4 h-4 text-slate-300" />
                        <span>Katalog GitHub</span>
                      </a>
                    )}
                    {authorData.socialLinks?.instagram && (
                      <a
                        href={authorData.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/5 text-xs text-slate-300 hover:text-white transition-all"
                      >
                        <FiInstagram className="w-4 h-4 text-pink-400" />
                        <span>Akun Instagram</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM CROSS-NAVIGATION PROMOTION BANNER */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-purple-950/30 p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Tertarik Berkolaborasi dengan {authorData.name}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Diskusikan proyek penulisan, fotografi, pengembangan aplikasi, atau peluang kolaborasi lainnya melalui jalur komunikasi langsung.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowContactModal(true)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-cyan-500/25"
            >
              Kirim Pesan Langsung
            </button>
            <Link
              to="/blog"
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 text-sm font-medium transition-all"
            >
              Kembali ke Blog
            </Link>
          </div>
        </div>

      </div>

      {/* MODAL KONTAK PENULIS */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <FiMail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Hubungi {authorData.name}</h3>
                <p className="text-xs text-slate-400">Pilih media komunikasi yang Anda inginkan</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {authorData.email && (
                <a
                  href={`mailto:${authorData.email}?subject=Halo%20${encodeURIComponent(authorData.name)},%20Saya%20tertarik%20dengan%20karya%20Anda`}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-cyan-500/40 text-slate-200 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FiMail className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Email Langsung</div>
                      <div className="text-[11px] text-slate-400">{authorData.email}</div>
                    </div>
                  </div>
                  <FiExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </a>
              )}

              {authorData.socialLinks?.linkedin && (
                <a
                  href={authorData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-blue-500/40 text-slate-200 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FiLinkedin className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">LinkedIn</div>
                      <div className="text-[11px] text-slate-400">Hubungkan jaringan profesional</div>
                    </div>
                  </div>
                  <FiExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                </a>
              )}

              {authorData.socialLinks?.instagram && (
                <a
                  href={authorData.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 hover:border-pink-500/40 text-slate-200 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FiInstagram className="w-4 h-4 text-pink-400" />
                    <div>
                      <div className="text-xs font-semibold text-white">Instagram Direct Message</div>
                      <div className="text-[11px] text-slate-400">Pesan personal & kolaborasi kreatif</div>
                    </div>
                  </div>
                  <FiExternalLink className="w-4 h-4 text-slate-500 group-hover:text-pink-400 transition-colors" />
                </a>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
