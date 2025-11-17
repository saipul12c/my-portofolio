import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import blogs from "../../../data/blog/data.json";
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
  FiBriefcase
} from "react-icons/fi";

export default function DetailProfile() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState(null);
  const [authorPosts, setAuthorPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("articles");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Extract author name from URL slug or navigation state
  const authorNameFromSlug = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : null;
  const authorName = location.state?.authorName || authorNameFromSlug;

  // Generate social links based on author name
  const generateSocialLinks = (name) => {
    const username = name.toLowerCase().replace(/\s+/g, '');
    return {
      twitter: `https://twitter.com/${username}`,
      instagram: `https://instagram.com/${username}`,
      linkedin: `https://linkedin.com/in/${username}`,
      github: `https://github.com/${username}`,
      website: `https://${username}.com`
    };
  };

  // Copy profile URL to clipboard
  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Contact author function
  const handleContactAuthor = () => {
    const socialLinks = generateSocialLinks(authorName);
    window.open(socialLinks.linkedin, '_blank');
  };

  useEffect(() => {
    if (authorName) {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Find author data from blogs
        const authorBlogs = blogs.filter(blog => 
          blog.author.toLowerCase() === authorName.toLowerCase()
        );
        
        if (authorBlogs.length > 0) {
          const firstBlog = authorBlogs[0];
          const socialLinks = generateSocialLinks(authorName);
          
          setAuthorData({
            name: firstBlog.author,
            avatar: firstBlog.authorAvatar || `/api/placeholder/128/128?text=${firstBlog.author.charAt(0)}`,
            bio: firstBlog.authorBio || `Penulis berpengalaman di bidang ${firstBlog.category} dengan passion untuk berbagi pengetahuan dan pengalaman melalui tulisan.`,
            joinDate: firstBlog.date,
            expertise: firstBlog.category,
            location: "Indonesia",
            company: "Freelance Writer",
            verified: true,
            socialLinks: socialLinks
          });

          setAuthorPosts(authorBlogs);
        }
        setIsLoading(false);
      }, 800);
    }
  }, [authorName]);

  // Calculate author stats
  const authorStats = authorPosts.reduce((stats, post) => {
    return {
      totalViews: stats.totalViews + (post.views || 0),
      totalLikes: stats.totalLikes + (post.likes || 0),
      totalPosts: stats.totalPosts + 1,
      totalComments: stats.totalComments + (post.commentCount || 0),
      avgRating: stats.avgRating + (post.rating || 0)
    };
  }, { 
    totalViews: 0, 
    totalLikes: 0, 
    totalPosts: 0, 
    totalComments: 0,
    avgRating: 0 
  });

  authorStats.avgRating = authorStats.totalPosts > 0 
    ? (authorStats.avgRating / authorStats.totalPosts).toFixed(1) 
    : 0;

  // Format number
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  };

  // Get popular posts (sorted by views)
  const popularPosts = [...authorPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

  // Get label color for posts
  const getLabelColor = (label) => {
    switch (label) {
      case "Baru": return "bg-green-500/20 border-green-500/30 text-green-300";
      case "Rekomendasi": return "bg-cyan-500/20 border-cyan-500/30 text-cyan-300";
      case "Hot": return "bg-orange-500/20 border-orange-500/30 text-orange-300";
      case "Premium": return "bg-purple-500/20 border-purple-500/30 text-purple-300";
      default: return "bg-gray-500/20 border-gray-500/30 text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat profil author...</p>
        </div>
      </div>
    );
  }

  if (!authorName || !authorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">Author tidak ditemukan</h1>
          <p className="text-gray-400 mb-6">
            Profil author dengan nama "{authorName}" tidak dapat ditemukan dalam database kami.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              <FiArrowLeft className="inline w-4 h-4 mr-2" />
              Kembali
            </button>
            <Link
              to="/blog"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition-all duration-300 text-center"
            >
              📚 Ke Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header Navigation */}
      <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300 group bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-xl border border-gray-700/50"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali</span>
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm hidden sm:block">
                Profil Author
              </span>
              <Link
                to="/blog"
                className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-xl border border-cyan-500/20 text-sm font-medium"
              >
                📚 Blog Utama
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-gray-700/50 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Avatar Section */}
            <div className="relative flex-shrink-0">
              <div className="relative">
                <img
                  src={authorData.avatar}
                  alt={authorData.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-cyan-500/30 shadow-2xl"
                  onError={(e) => {
                    e.target.src = `/api/placeholder/128/128?text=${authorData.name.charAt(0)}`;
                  }}
                />
                {authorData.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-1.5 border-2 border-gray-900 shadow-lg">
                    <FiCheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="flex justify-center gap-4 mt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{authorStats.totalPosts}</div>
                  <div className="text-xs text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{formatNumber(authorStats.totalViews)}</div>
                  <div className="text-xs text-gray-400">Views</div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 justify-center lg:justify-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {authorData.name}
                </h1>
                {authorData.verified && (
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                    <FiCheckCircle className="w-4 h-4" />
                    Terverifikasi
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="flex items-center gap-2 text-cyan-400 font-medium">
                  <FiBriefcase className="w-4 h-4" />
                  {authorData.expertise} Specialist
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  <FiMapPin className="w-4 h-4" />
                  {authorData.location}
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  <FiBookOpen className="w-4 h-4" />
                  {authorData.company}
                </span>
              </div>

              <p className="text-gray-300 mb-6 max-w-2xl leading-relaxed text-center lg:text-left">
                {authorData.bio}
              </p>

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 max-w-2xl">
                {[
                  { label: "Total Artikel", value: authorStats.totalPosts, icon: FiBook, color: "cyan" },
                  { label: "Total Views", value: formatNumber(authorStats.totalViews), icon: FiEye, color: "green" },
                  { label: "Total Likes", value: formatNumber(authorStats.totalLikes), icon: FiHeart, color: "red" },
                  { label: "Rating", value: authorStats.avgRating, icon: FiStar, color: "amber" }
                ].map((stat, index) => (
                  <div key={index} className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-3 border border-gray-700/50 text-center hover:border-gray-600/50 transition-all duration-300">
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400 mx-auto mb-2`} />
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Social Links & Meta */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-800/40 px-3 py-2 rounded-lg border border-gray-700/50">
                  <FiCalendar className="w-4 h-4" />
                  <span>Bergabung {new Date(authorData.joinDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                </div>
                
                {/* Social Media Icons */}
                <div className="flex gap-2">
                  {authorData.socialLinks && Object.entries(authorData.socialLinks).map(([platform, url]) => {
                    const icons = {
                      twitter: { icon: FiTwitter, color: "hover:text-blue-400" },
                      instagram: { icon: FiInstagram, color: "hover:text-pink-400" },
                      linkedin: { icon: FiLinkedin, color: "hover:text-blue-300" },
                      github: { icon: FiGithub, color: "hover:text-gray-300" },
                      website: { icon: FiGlobe, color: "hover:text-green-400" }
                    };
                    const { icon: Icon, color } = icons[platform] || {};
                    
                    return Icon ? (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-400 ${color} transition-all duration-300 bg-gray-800/40 p-2 rounded-lg border border-gray-700/50 hover:scale-110`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              <button 
                onClick={handleContactAuthor}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium"
              >
                <FiMail className="w-4 h-4" />
                Hubungi Author
              </button>
              <button 
                onClick={handleShareProfile}
                className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700/70 border border-gray-600 text-gray-300 hover:text-white px-6 py-3 rounded-xl transition-all duration-300 font-medium"
              >
                <FiShare2 className="w-4 h-4" />
                {copied ? "Tersalin!" : "Bagikan Profil"}
              </button>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl">
          {/* Tab Headers */}
          <div className="border-b border-gray-700/50">
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: "articles", label: "Artikel", icon: FiBook, count: authorPosts.length },
                { id: "popular", label: "Populer", icon: FiAward },
                { id: "stats", label: "Statistik", icon: FiTrendingUp },
                { id: "about", label: "Tentang", icon: FiUser }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-cyan-500 text-cyan-400 bg-cyan-500/10"
                      : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-700/30"
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "articles" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Semua Artikel oleh {authorData.name}</h3>
                  <span className="text-gray-400 text-sm">
                    {authorPosts.length} artikel ditemukan
                  </span>
                </div>
                {authorPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer hover:shadow-lg"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="relative w-full lg:w-48 h-40 flex-shrink-0">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Labels */}
                        {post.labels?.length > 0 && (
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {post.labels.slice(0, 2).map((label, idx) => (
                              <span
                                key={idx}
                                className={`text-[10px] px-2 py-1 rounded-full backdrop-blur-sm border ${getLabelColor(label)}`}
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            {post.readTime}
                          </span>
                          <span className="text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg text-xs">
                            {post.category}
                          </span>
                        </div>
                        
                        <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        
                        <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1 bg-gray-800/40 px-2 py-1 rounded-lg">
                            <FiEye className="w-4 h-4" />
                            {formatNumber(post.views || 0)}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-800/40 px-2 py-1 rounded-lg">
                            <FiHeart className="w-4 h-4" />
                            {formatNumber(post.likes || 0)}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-800/40 px-2 py-1 rounded-lg">
                            <FiStar className="w-4 h-4" />
                            {post.rating || "N/A"}
                          </span>
                          {(post.commentCount > 0) && (
                            <span className="flex items-center gap-1 bg-gray-800/40 px-2 py-1 rounded-lg">
                              <FiMessageSquare className="w-4 h-4" />
                              {post.commentCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeTab === "popular" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-6">Artikel Terpopuler</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {popularPosts.map((post, index) => (
                    <div
                      key={post.slug}
                      className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300 group cursor-pointer hover:shadow-lg"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <div className="relative mb-4">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          #{index + 1}
                        </div>
                        <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                          ⭐ {post.rating}
                        </div>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiEye className="w-4 h-4" />
                          {formatNumber(post.views || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiHeart className="w-4 h-4" />
                          {formatNumber(post.likes || 0)}
                        </span>
                        <span className="text-cyan-400 text-xs bg-cyan-500/10 px-2 py-1 rounded-lg">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "stats" && (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-8 text-center">📊 Statistik Penulis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Total Artikel", value: authorStats.totalPosts, icon: FiBook, color: "cyan", description: "Jumlah artikel yang diterbitkan" },
                    { label: "Total Views", value: formatNumber(authorStats.totalViews), icon: FiEye, color: "green", description: "Total pembaca artikel" },
                    { label: "Total Likes", value: formatNumber(authorStats.totalLikes), icon: FiHeart, color: "red", description: "Total likes yang diterima" },
                    { label: "Total Komentar", value: formatNumber(authorStats.totalComments), icon: FiMessageSquare, color: "blue", description: "Total komentar pembaca" },
                    { label: "Rating Rata-rata", value: authorStats.avgRating, icon: FiStar, color: "amber", description: "Rating rata-rata artikel" },
                    { label: "Tahun Aktif", value: new Date().getFullYear() - new Date(authorData.joinDate).getFullYear(), icon: FiCalendar, color: "purple", description: "Tahun menulis aktif" }
                  ].map((stat, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50 text-center hover:border-gray-600/50 transition-all duration-300 group">
                      <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-gray-300 font-medium mb-2">{stat.label}</div>
                      <div className="text-gray-400 text-sm">{stat.description}</div>
                    </div>
                  ))}
                </div>

                {/* Engagement Rate */}
                <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-6 text-center">
                  <FiTrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-white mb-2">Tingkat Engagement</h4>
                  <p className="text-gray-300 mb-4">
                    Author ini memiliki tingkat engagement yang {
                      authorStats.avgRating >= 4.5 ? "sangat tinggi" :
                      authorStats.avgRating >= 4.0 ? "tinggi" :
                      authorStats.avgRating >= 3.5 ? "cukup baik" : "baik"
                    } dengan rata-rata rating {authorStats.avgRating}/5
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(authorStats.avgRating / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about" && (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-bold text-white mb-8 text-center">👨‍💻 Tentang {authorData.name}</h3>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiUser className="w-5 h-5 text-cyan-400" />
                      Biografi Profesional
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {authorData.bio}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiBriefcase className="w-5 h-5 text-purple-400" />
                      Spesialisasi & Keahlian
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <span className="bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-lg border border-cyan-500/30 font-medium">
                        {authorData.expertise}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-lg border border-purple-500/30 font-medium">
                        Content Writing
                      </span>
                      <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg border border-green-500/30 font-medium">
                        Digital Strategy
                      </span>
                      <span className="bg-orange-500/20 text-orange-300 px-4 py-2 rounded-lg border border-orange-500/30 font-medium">
                        Technical Writing
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiGlobe className="w-5 h-5 text-green-400" />
                      Media Sosial & Kontak
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {authorData.socialLinks && Object.entries(authorData.socialLinks).map(([platform, url]) => {
                        const platformNames = {
                          twitter: "Twitter",
                          instagram: "Instagram", 
                          linkedin: "LinkedIn",
                          github: "GitHub",
                          website: "Website"
                        };
                        const colors = {
                          twitter: "bg-blue-500/20 text-blue-300 border-blue-500/30",
                          instagram: "bg-pink-500/20 text-pink-300 border-pink-500/30",
                          linkedin: "bg-blue-400/20 text-blue-300 border-blue-400/30",
                          github: "bg-gray-500/20 text-gray-300 border-gray-500/30",
                          website: "bg-green-500/20 text-green-300 border-green-500/30"
                        };
                        
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg ${colors[platform]}`}
                          >
                            {platform === 'twitter' && <FiTwitter className="w-5 h-5" />}
                            {platform === 'instagram' && <FiInstagram className="w-5 h-5" />}
                            {platform === 'linkedin' && <FiLinkedin className="w-5 h-5" />}
                            {platform === 'github' && <FiGithub className="w-5 h-5" />}
                            {platform === 'website' && <FiGlobe className="w-5 h-5" />}
                            <span className="font-medium">{platformNames[platform]}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-6 py-4 rounded-2xl border border-green-500/30 shadow-lg">
            <FiCheckCircle className="w-6 h-6" />
            <div className="text-left">
              <span className="font-bold text-lg">Author Terverifikasi</span>
              <p className="text-green-300 text-sm mt-1">
                Profil telah diverifikasi dan memenuhi standar kualitas konten
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4 max-w-2xl mx-auto leading-relaxed">
            Semua konten dari {authorData.name} telah melalui proses kurasi dan validasi untuk memastikan 
            kualitas, akurasi, dan nilai edukasi yang tinggi bagi pembaca kami.
          </p>
        </div>
      </div>
    </div>
  );
}