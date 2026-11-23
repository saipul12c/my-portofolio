import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Code2, Sparkles, ArrowRight,
  BookOpen, Award, Lightbulb, Heart,
  Github, ExternalLink, ChevronRight, ChevronLeft,
  BarChart3, Users, Zap, Star, TrendingUp,
  Briefcase, MapPin, Calendar, Rocket, CheckCircle,
  Eye, MessageCircle, Share2, Clock, Tag,
  Clock3, Users2, Video, Upload, MessageSquare
} from "lucide-react";
import {
  FaRocket, FaUsers, FaVideo, FaUpload, FaCode,
  FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaYoutube,
  FaFacebook, FaDiscord
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import Maintenance from "./errors/Maintenance"; // 🧩 impor halaman Maintenance

// 📊 Import data files
import projectsData from "../data/projects.json";
import { fetchAllPosts } from "./blog/services/blogSupabase";
import galleryImages from "../data/gallery/images.json";
import comingSoonData from "../data/comingsoon/data.json";
import certificatesData from "../data/sertif/certificates.json";
import softskillsData from "../data/skills/softskills.json";
import specializationsData from "../data/skills/specializations.json";
import experiencesData from "../data/pengalaman/experiences.json";

// 📸 Komponen Card Galeri dengan Optimasi Pemuatan Gambar & Multi-Layer Error Fallback
function OptimizedGalleryCard({ item, isActive }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const rawSrc = useMemo(() => {
    if (!item) return "";
    if (item.thumbnail && typeof item.thumbnail === "string") return item.thumbnail;
    if (item.img && typeof item.img === "string") return item.img;
    if (Array.isArray(item.src) && item.src.length > 0) return item.src[0];
    if (typeof item.src === "string") return item.src;
    return "";
  }, [item]);

  const fallbackUrl =
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80";
  const displaySrc = useFallback ? fallbackUrl : rawSrc;

  const isVideo = useMemo(() => {
    if (useFallback) return false;
    return (
      item?.type === "video" ||
      item?.type === "short" ||
      (typeof rawSrc === "string" && (rawSrc.endsWith(".mp4") || rawSrc.endsWith(".webm")))
    );
  }, [item, rawSrc, useFallback]);

  // Reset status pemuatan saat item foto berganti
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setUseFallback(false);
  }, [item?.id, rawSrc]);

  const handleMediaError = () => {
    if (!useFallback && rawSrc && rawSrc !== fallbackUrl) {
      setUseFallback(true);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <Link to="/photography" className="block h-full group">
      <div
        className={`relative h-56 rounded-xl overflow-hidden cursor-pointer bg-slate-900/90 border transition-all duration-500 shadow-lg ${
          isActive
            ? "border-cyan-400/60 ring-1 ring-cyan-400/30 shadow-cyan-500/20"
            : "border-white/10 hover:border-cyan-400/50"
        }`}
      >
        {/* Shimmer / Skeleton Loader saat media sedang dimuat */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            <Camera className="w-8 h-8 text-cyan-400/40 animate-pulse relative z-10" />
          </div>
        )}

        {/* Error Fallback jika pemuatan gagal */}
        {hasError ? (
          <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 text-center border border-white/10">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2 shadow-inner">
              <Camera className="w-6 h-6 text-cyan-400/80" />
            </div>
            <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {item?.category || "Fotografi"}
            </span>
            <h4 className="text-xs font-bold text-white line-clamp-1 max-w-[90%]">
              {item?.title || "Foto Galeri"}
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">
              Pratinjau Foto
            </p>
          </div>
        ) : isVideo ? (
          <video
            src={displaySrc}
            muted
            loop
            autoPlay
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            onError={handleMediaError}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <img
            src={displaySrc}
            alt={item?.title || "Foto Galeri"}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={handleMediaError}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Overlay Informasi Foto */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/35 to-transparent group-hover:from-black/95 group-hover:via-black/50 transition-all duration-300 flex flex-col justify-end p-4">
          <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm mb-1 line-clamp-1 group-hover:text-cyan-300 transition-colors">
              {item?.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-cyan-400" />
                {item?.category || "Foto"}
              </span>
              {item?.type === "video" && (
                <span className="bg-cyan-500/80 text-white px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  {item.duration || "Video"}
                </span>
              )}
              {item?.type === "album" && (
                <span className="bg-purple-500/80 text-white px-2 py-0.5 rounded text-[11px] font-semibold">
                  Album
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const [isHoveredBlog, setIsHoveredBlog] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [displayedGalleryIndices, setDisplayedGalleryIndices] = useState([0, 1, 2, 3, 4, 5]);
  const [activeGallerySlot, setActiveGallerySlot] = useState(0);
  const [isHoveredGallery, setIsHoveredGallery] = useState(false);
  const galleryCursorRef = useRef(6);
  const [comingSoon, setComingSoon] = useState([]);
  const [currentComingSoonIndex, setCurrentComingSoonIndex] = useState(0);
  const [isHoveredComingSoon, setIsHoveredComingSoon] = useState(false);
  const [days, setDays] = useState(0);
  const [years, setYears] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // 🔄 Load data dari JSON & Supabase
  useEffect(() => {
    try {
      setProjects(projectsData.projects?.slice(0, 3) || []);
      fetchAllPosts().then((liveBlogs) => {
        if (Array.isArray(liveBlogs) && liveBlogs.length > 0) {
          setBlogs(liveBlogs.slice(0, 6));
        }
      }).catch(() => { });
      if (Array.isArray(galleryImages) && galleryImages.length > 0) {
        setGallery(galleryImages);
        const count = Math.min(6, galleryImages.length);
        setDisplayedGalleryIndices(Array.from({ length: count }, (_, idx) => idx));
        galleryCursorRef.current = count % galleryImages.length;
      } else {
        setGallery([]);
      }
      // Pastikan comingSoon adalah array
      setComingSoon(Array.isArray(comingSoonData) ? comingSoonData : []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  // 🔄 Rotasi proyek coming soon setiap 6 detik secara otomatis (pause jika di-hover)
  useEffect(() => {
    if (!comingSoon || comingSoon.length <= 1 || isHoveredComingSoon) return;

    const rotateInterval = setInterval(() => {
      setCurrentComingSoonIndex((prev) => (prev + 1) % comingSoon.length);
    }, 6000);

    return () => clearInterval(rotateInterval);
  }, [comingSoon, isHoveredComingSoon]);

  // 🔄 Rotasi artikel blog setiap 3 detik secara otomatis satu persatu (pause jika di-hover)
  useEffect(() => {
    if (!blogs || blogs.length <= 1 || isHoveredBlog) return;

    const blogInterval = setInterval(() => {
      setCurrentBlogIndex((prev) => (prev + 1) % blogs.length);
    }, 3000);

    return () => clearInterval(blogInterval);
  }, [blogs, isHoveredBlog]);

  const nextBlog = () => {
    if (!blogs || blogs.length === 0) return;
    setCurrentBlogIndex((prev) => (prev + 1) % blogs.length);
  };

  const prevBlog = () => {
    if (!blogs || blogs.length === 0) return;
    setCurrentBlogIndex((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  // 🔄 Rotasi setiap card galeri satu per satu setiap 3 detik secara otomatis (pause jika di-hover)
  useEffect(() => {
    if (!gallery || gallery.length <= 1 || isHoveredGallery) return;
    const slotCount = Math.min(6, gallery.length);

    const galleryInterval = setInterval(() => {
      setActiveGallerySlot((currentSlot) => {
        const slotToUpdate = currentSlot % slotCount;
        const nextSlot = (slotToUpdate + 1) % slotCount;

        setDisplayedGalleryIndices((prevIndices) => {
          const nextIndices = [...prevIndices];
          const nextItemIdx = galleryCursorRef.current % gallery.length;
          galleryCursorRef.current = (galleryCursorRef.current + 1) % gallery.length;
          nextIndices[slotToUpdate] = nextItemIdx;

          // Optimasi: Preload image berikutnya ke browser cache
          const nextUpcomingItem = gallery[galleryCursorRef.current % gallery.length];
          if (nextUpcomingItem) {
            const raw =
              nextUpcomingItem.thumbnail ||
              nextUpcomingItem.img ||
              (Array.isArray(nextUpcomingItem.src)
                ? nextUpcomingItem.src[0]
                : nextUpcomingItem.src);
            if (
              raw &&
              typeof raw === "string" &&
              !raw.endsWith(".mp4") &&
              !raw.endsWith(".webm")
            ) {
              const preloadImg = new Image();
              preloadImg.src = raw;
            }
          }

          return nextIndices;
        });

        return nextSlot;
      });
    }, 3000);

    return () => clearInterval(galleryInterval);
  }, [gallery, isHoveredGallery]);

  const rotateNextGalleryCard = () => {
    if (!gallery || gallery.length <= 1) return;
    const slotCount = Math.min(6, gallery.length);
    setActiveGallerySlot((currentSlot) => {
      const slotToUpdate = currentSlot % slotCount;
      const nextSlot = (slotToUpdate + 1) % slotCount;

      setDisplayedGalleryIndices((prevIndices) => {
        const nextIndices = [...prevIndices];
        const nextItemIdx = galleryCursorRef.current % gallery.length;
        galleryCursorRef.current = (galleryCursorRef.current + 1) % gallery.length;
        nextIndices[slotToUpdate] = nextItemIdx;
        return nextIndices;
      });

      return nextSlot;
    });
  };

  // 🕒 Countdown timer untuk proyek coming soon yang sedang aktif
  useEffect(() => {
    const currentProject = comingSoon?.[currentComingSoonIndex] || comingSoon?.[0];
    if (!currentProject?.launchDate) return;

    const launchDate = new Date(currentProject.launchDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        const dayMs = 1000 * 60 * 60 * 24;
        const yearMs = dayMs * 365;

        const y = Math.floor(distance / yearMs);
        let remainder = distance % yearMs;

        const d = y > 0 ? Math.floor(remainder / dayMs) : Math.floor(distance / dayMs);
        if (y > 0) {
          remainder = remainder % dayMs;
        } else {
          remainder = distance % dayMs;
        }

        const h = Math.floor(remainder / (1000 * 60 * 60));
        const m = Math.floor((remainder % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((remainder % (1000 * 60)) / 1000);

        setYears(y);
        setDays(d);
        setHours(h);
        setMinutes(m);
        setSeconds(s);
      } else {
        setYears(0);
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [comingSoon, currentComingSoonIndex]);

  const isMaintenance = false; // ubah ke false jika sudah normal
  // const isMaintenance = true;

  if (isMaintenance) {
    return <Maintenance />; // 🚧 tampilkan halaman Maintenance
  }

  // Fungsi getIconComponent untuk mapping icon
  const getIconComponent = (iconName) => {
    const iconMap = {
      FaRocket, FaUsers, FaVideo, FaUpload, FaCode,
      FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaYoutube,
      FaFacebook, FaDiscord
    };
    return iconMap[iconName] || FaRocket;
  };

  // 📊 Statistik Portfolio (dinamis dari data)
  const stats = [
    { icon: Code2, label: "Proyek Selesai", value: `${projects.length || 15}+`, color: "cyan" },
    { icon: Camera, label: "Foto Dokumentasi", value: `${gallery.length * 30 || 200}+`, color: "purple" },
    { icon: BookOpen, label: "Artikel Blog", value: `${blogs.length * 5 || 20}+`, color: "blue" },
    { icon: Award, label: "Sertifikasi", value: `${certificatesData.certificates?.length || 19}+`, color: "emerald" },
  ];

  // 🌟 Keahlian & Spesialisasi (dinamis dari specializations.json)
  const getSpecializationIcon = (iconName) => {
    const iconMap = {
      Sparkles,
      Zap,
      Camera,
      Heart,
      Code2,
      BookOpen,
      Award,
      Rocket,
    };
    const IconComponent = iconMap[iconName] || Sparkles;
    return <IconComponent className="w-8 h-8" />;
  };

  const specializations = (specializationsData.specializations || []).map((spec) => ({
    ...spec,
    icon: getSpecializationIcon(spec.icon),
  }));

  // 📈 Pengalaman & Pencapaian (dinamis dari experiences.json & tersinkronisasi dengan metrik aktual)
  const totalProjectsCount = projectsData.projects?.length || 20;
  const totalBlogsCount = blogs.length > 0 ? `${blogs.length}+` : "20+";
  const totalPhotosCount = "100+";

  const experiences = (experiencesData.experiences || []).map((exp) => {
    // Generate tag pencapaian dinamis berdasarkan real data proyek, blog, dan foto
    const dynamicAchievements = (exp.tags || []).map((tag) => {
      if (exp.metricKey === "projects" && tag.includes("Project")) {
        return `${totalProjectsCount}+ Project`;
      }
      if (exp.metricKey === "blogs" && tag.includes("Article")) {
        return `${totalBlogsCount} Articles`;
      }
      if (exp.metricKey === "photos" && tag.includes("Photo")) {
        return `${totalPhotosCount} Photos`;
      }
      return tag;
    });

    return {
      ...exp,
      displayAchievements: dynamicAchievements.length > 0 ? dynamicAchievements : (exp.achievements || []).slice(0, 3)
    };
  });

  // 🏆 Soft Skills (dinamis dari softskills.json & terhubung ke /SoftSkills/:id)
  const softSkills = (softskillsData.skills || []).slice(0, 6).map((skill) => ({
    id: skill.id,
    name: skill.name,
    level: skill.experience || 85,
  }));

  // 📚 Sertifikasi Unggulan (dinamis dari certificates.json)
  const certifications = (certificatesData.certificates || []).slice(0, 4);

  // Container variant untuk staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <main className="min-h-screen bg-[var(--color-gray-900)] text-white flex flex-col px-6 sm:px-10 md:px-20 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* ━━━ HERO SECTION ━━━ */}
      <motion.section
        className="text-center max-w-4xl mx-auto space-y-8 py-20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent flex justify-center gap-2 items-center mb-4">
            <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" />
            Muhammad Syaiful Mukmin
          </h1>
          <p className="text-cyan-300 text-sm sm:text-base font-semibold">Pendidik • Pengembang • Fotografer</p>
        </motion.div>

        <p className="text-gray-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
          Saya adalah seorang <span className="text-cyan-400 font-semibold">calon pendidik</span> yang passionate dengan
          <span className="text-purple-400 font-semibold"> teknologi dan fotografi</span>.
          Mengintegrasikan seni visual, pengembangan software, dan pembelajaran digital untuk menciptakan karya yang bermakna. 🚀
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Link
            to="/projects"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
          >
            Lihat Proyek <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/about"
            className="bg-white/10 hover:bg-white/20 border border-cyan-400 text-cyan-300 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Pelajari Lebih Lanjut
          </Link>
        </div>
      </motion.section>

      {/* ━━━ STATISTIK SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full grid sm:grid-cols-2 lg:grid-cols-4 gap-4 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colorClasses = {
            cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
            purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
            blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
            emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
          };
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              className={`bg-gradient-to-br ${colorClasses[stat.color]} border backdrop-blur-xl rounded-2xl p-6 text-center hover:scale-105 transition-transform`}
            >
              <Icon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* ━━━ KEAHLIAN SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          {specializationsData.sectionTitle || "Keahlian & Spesialisasi"}
        </h2>
        {specializationsData.sectionSubtitle && (
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto text-sm sm:text-base">
            {specializationsData.sectionSubtitle}
          </p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specializations.map((spec, i) => (
            <motion.div
              key={spec.id || i}
              variants={itemVariants}
              className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-cyan-500/50 backdrop-blur-xl rounded-2xl p-6 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                  {spec.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{spec.title}</h3>
                {spec.description && (
                  <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                    {spec.description}
                  </p>
                )}
                <div className="space-y-2">
                  {(spec.skills || []).map((skill, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {spec.link && (
                <div className="mt-5 pt-3 border-t border-white/10">
                  <Link
                    to={spec.link}
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Lihat terkait &rarr;
                  </Link>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ━━━ PENGALAMAN & PENCAPAIAN SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          Pengalaman & Pencapaian
        </h2>
        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 backdrop-blur-xl rounded-2xl p-8 hover:border-cyan-500/60 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-cyan-400 text-xs font-bold mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {exp.period}
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-cyan-300 transition-colors">
                      {exp.title || exp.position}
                    </h3>
                    <p className="text-gray-400 text-sm">{exp.company}</p>
                  </div>
                  <Briefcase className="w-6 h-6 text-purple-400 flex-shrink-0" />
                </div>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {exp.description}
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(exp.displayAchievements || exp.achievements || []).map((achievement, j) => (
                    <span
                      key={j}
                      className="text-xs bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-md border border-cyan-500/30 font-medium"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
                {exp.link && (
                  <Link
                    to={exp.link}
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors mt-1"
                  >
                    Pelajari lebih lanjut &rarr;
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/cv"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
          >
            <Briefcase className="w-4 h-4" />
            Lihat CV & Pengalaman Lengkap
          </Link>
        </div>
      </motion.section>

      {/* ━━━ SOFT SKILLS SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          Soft Skills & Kompetensi
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Karakter personal, kemampuan interpersonal, dan pola pikir profesional yang menunjang kolaborasi efektif
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {softSkills.map((skill, i) => (
            <motion.div
              key={skill.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/SoftSkills/${skill.id}`}
                className="block p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/50 backdrop-blur-xl transition-all duration-300 group hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
                title={`Lihat detail ${skill.name}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-cyan-400 font-bold text-sm bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/20">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400 group-hover:text-cyan-300 transition-colors">
                  <span>Lihat Detail Skill</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/SoftSkills"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group"
          >
            Lihat Semua Soft Skills
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.section>

      {/* ━━━ SERTIFIKASI SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          Sertifikasi & Penghargaan
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Berbagai sertifikasi dari platform terkemuka menunjukkan komitmen saya terhadap pembelajaran berkelanjutan
        </p>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-yellow-500/50 backdrop-blur-xl rounded-xl p-6 transition-all flex items-center gap-4 group"
            >
              <div className="flex-shrink-0">
                <Award className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-white group-hover:text-yellow-300 transition-colors">
                  {cert.title || cert.name}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{cert.issuer || cert.provider}</span>
                  <span className="text-yellow-400">{cert.year}</span>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/certificates"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors group"
          >
            Lihat Semua Sertifikasi
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.section>

      {/* ━━━ JUGA TERSEDIA SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-200">
              Juga Tersedia 🌐
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Tools interaktif dan mini aplikasi seru yang bisa dicoba langsung
            </p>
          </div>
          <Link
            to="/daftar-aplikasi"
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors text-sm px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20"
          >
            <span>Buka Semua Aplikasi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link to="/zodiak">
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-500/30 backdrop-blur-xl rounded-2xl p-6 hover:shadow-lg transition-all group h-full flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-lg mb-2 text-white group-hover:text-cyan-300 transition-colors">♈ Zodiak Calculator</h4>
                <p className="text-gray-400 text-sm">Tool interaktif untuk membaca horoskop, tarot harian, dan kecocokan zodiak.</p>
              </div>
              <div className="mt-4 flex items-center text-xs text-cyan-400 font-semibold">
                <span>Coba Sekarang &rarr;</span>
              </div>
            </motion.div>
          </Link>
          <Link to="/qodam">
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 backdrop-blur-xl rounded-2xl p-6 hover:shadow-lg transition-all group h-full flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-lg mb-2 text-white group-hover:text-emerald-300 transition-colors">🚀 Cek Qodam Online</h4>
                <p className="text-gray-400 text-sm">Aplikasi hiburan spiritual persona dengan efek 4 elemen kosmik.</p>
              </div>
              <div className="mt-4 flex items-center text-xs text-emerald-400 font-semibold">
                <span>Coba Sekarang &rarr;</span>
              </div>
            </motion.div>
          </Link>
          <Link to="/daftar-aplikasi">
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-gradient-to-br from-cyan-500/20 to-blue-600/10 border border-cyan-400/30 backdrop-blur-xl rounded-2xl p-6 hover:shadow-lg transition-all group h-full flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-lg mb-2 text-white group-hover:text-cyan-300 transition-colors">✨ Direktori Aplikasi</h4>
                <p className="text-gray-400 text-sm">Lihat seluruh koleksi aplikasi, tools interaktif, dan proyek dalam satu tempat.</p>
              </div>
              <div className="mt-4 flex items-center text-xs text-cyan-300 font-semibold">
                <span>Lihat Selengkapnya &rarr;</span>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.section>

      {/* ━━━ FEATURED PROJECTS SECTION ━━━ */}
      {projects.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto w-full py-16"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
              🚀 Proyek Unggulan
            </h2>
            <Link
              to="/projects"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 transition-colors"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-cyan-500/50 backdrop-blur-xl rounded-2xl overflow-hidden transition-all group"
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                    <img
                      src={project.image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                    {project.label && (
                      <div className="absolute top-3 right-3 bg-cyan-500/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {project.label}
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {project.overview || project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech?.slice(0, 2).map((tech, j) => (
                        <span key={j} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                          {tech}
                        </span>
                      ))}
                      {project.tech?.length > 2 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{project.tech.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400" />
                        {project.rating || "N/A"}
                      </span>
                      <span>{project.category}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* ━━━ COMING SOON PROJECT SECTION ━━━ */}
      {comingSoon && comingSoon.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto w-full py-16"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              🚀 Proyek Mendatang
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Bersiaplah untuk pengalaman platform konten kreator terbaru yang revolusioner
            </p>
          </div>

          {(() => {
            const project = comingSoon[currentComingSoonIndex] || comingSoon[0];
            const projectSlug = project?.slug || (project?.id === 1 ? 'komunitas-id' : project?.id === 2 ? 'sinyal-live' : project?.id === 3 ? 'discond' : project?.id);
            const targetUrl = `/coming-soon/${projectSlug}`;

            // Safe access dengan optional chaining
            const brandLogo = project?.brand?.logo || "FaRocket";
            const communityIcon = project?.pages?.community?.icon || "FaUsers";
            const livestreamIcon = project?.pages?.livestream?.icon || "FaVideo";

            const IconComponent = getIconComponent(brandLogo);
            const CommunityIcon = getIconComponent(communityIcon);
            const LivestreamIcon = getIconComponent(livestreamIcon);

            const isCyan = project?.themeColor === 'cyan';
            const isPurple = project?.themeColor === 'purple';

            const themeClasses = isCyan
              ? {
                cardBg: 'from-cyan-500/20 via-blue-500/10 to-indigo-500/20',
                border: 'border-cyan-500/30',
                badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                accentText: 'text-cyan-300',
                button: 'from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-cyan-500/25',
                boxBorder: 'border-cyan-500/20',
                boxBg: 'bg-cyan-500/10 hover:bg-cyan-500/20',
                iconColor: 'text-cyan-400',
                glow: 'shadow-[0_0_30px_rgba(6,182,212,0.15)]',
              }
              : isPurple
                ? {
                  cardBg: 'from-purple-500/20 via-indigo-500/10 to-fuchsia-500/20',
                  border: 'border-purple-500/30',
                  badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
                  accentText: 'text-purple-300',
                  button: 'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-purple-500/25',
                  boxBorder: 'border-purple-500/20',
                  boxBg: 'bg-purple-500/10 hover:bg-purple-500/20',
                  iconColor: 'text-purple-400',
                  glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
                }
                : {
                  cardBg: 'from-orange-500/20 via-purple-500/10 to-red-500/20',
                  border: 'border-orange-500/30',
                  badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
                  accentText: 'text-orange-300',
                  button: 'from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/25',
                  boxBorder: 'border-orange-500/20',
                  boxBg: 'bg-orange-500/10 hover:bg-orange-500/20',
                  iconColor: 'text-orange-400',
                  glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
                };

            return (
              <div
                onMouseEnter={() => setIsHoveredComingSoon(true)}
                onMouseLeave={() => setIsHoveredComingSoon(false)}
                className="relative"
              >
                {/* Switcher & Progress Bar Header */}
                {comingSoon.length > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        Berganti setiap 6 detik
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {comingSoon.map((item, idx) => {
                        const isSelected = idx === currentComingSoonIndex;
                        return (
                          <button
                            key={item.id || idx}
                            onClick={() => setCurrentComingSoonIndex(idx)}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${isSelected
                                ? 'bg-white/20 text-white font-semibold border border-white/30 shadow-md scale-105'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                              }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-gray-500'}`} />
                            <span>{item.brand?.name || `Projek ${idx + 1}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Animated Card Container */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={project?.id || currentComingSoonIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className={`bg-gradient-to-br ${themeClasses.cardBg} border ${themeClasses.border} ${themeClasses.glow} backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl transition-all group relative overflow-hidden`}
                  >
                    {/* Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform scale-150 opacity-10 pointer-events-none"></div>

                    <div className="grid lg:grid-cols-2 gap-8 items-center relative">
                      {/* Left Content */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between mb-6">
                          <Link to={targetUrl} className="flex items-center gap-3 group/brand">
                            <div className="p-2.5 bg-white/10 rounded-xl group-hover/brand:scale-110 transition-transform">
                              <IconComponent className={`w-6 h-6 ${themeClasses.iconColor}`} />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white group-hover/brand:text-cyan-300 transition-colors">
                                {project?.brand?.name || "Project Name"}
                              </h3>
                              <p className="text-gray-300 text-sm">
                                {project?.brand?.slogan || "Exciting project coming soon"}
                              </p>
                            </div>
                          </Link>
                          <span className={`px-3 py-1 ${themeClasses.badge} text-sm rounded-full border`}>
                            Coming Soon
                          </span>
                        </div>

                        <div className="space-y-4">
                          <h4 className={`text-xl font-semibold ${themeClasses.accentText}`}>
                            {project?.content?.title || "Revolutionary Platform"}
                          </h4>
                          <p className="text-gray-300 leading-relaxed text-lg">
                            {project?.content?.description || "A new platform that will change the way creators share content"}
                          </p>
                        </div>

                        {/* Features Preview */}
                        {project?.content?.features && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {project.content.features.slice(0, 2).map((feature, index) => {
                              const featureIcon = feature?.icon || "FaRocket";
                              const FeatureIcon = getIconComponent(featureIcon);
                              return (
                                <div key={index} className={`bg-black/20 rounded-lg p-3 border ${themeClasses.boxBorder}`}>
                                  <div className="flex items-center gap-2">
                                    <FeatureIcon className={`w-4 h-4 ${themeClasses.iconColor}`} />
                                    <span className="text-sm text-white font-medium">{feature?.title || "Feature"}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Countdown Timer */}
                        <div className={`bg-black/30 rounded-xl p-6 border ${themeClasses.boxBorder}`}>
                          <div className="flex items-center gap-2 justify-center mb-4">
                            <IconComponent className={`w-4 h-4 ${themeClasses.accentText}`} />
                            <p className={`text-sm ${themeClasses.accentText} font-semibold text-center`}>
                              ⏰ Launch Countdown
                            </p>
                          </div>
                          <div className="grid grid-cols-4 gap-3 text-center">
                            {(() => {
                              const labelYears = project?.countdownLabels?.years || "Years";
                              const labelDays = project?.countdownLabels?.days || "Days";
                              const labelHours = project?.countdownLabels?.hours || "Hours";
                              const labelMinutes = project?.countdownLabels?.minutes || "Minutes";
                              const labelSeconds = project?.countdownLabels?.seconds || "Seconds";

                              const items = years > 0 ? [
                                { value: years, label: labelYears },
                                { value: days, label: labelDays },
                                { value: hours, label: labelHours },
                                { value: minutes, label: labelMinutes }
                              ] : [
                                { value: days, label: labelDays },
                                { value: hours, label: labelHours },
                                { value: minutes, label: labelMinutes },
                                { value: seconds, label: labelSeconds }
                              ];

                              return items.map((item, index) => (
                                <div key={index} className={`${themeClasses.boxBg} rounded-lg p-3 border ${themeClasses.boxBorder} transition-colors`}>
                                  <div className="text-2xl font-bold text-white">{item.value}</div>
                                  <div className={`text-xs ${themeClasses.accentText} mt-1`}>{item.label}</div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <div className="flex gap-3 pt-4">
                          <Link
                            to={targetUrl}
                            className={`flex-1 bg-gradient-to-r ${themeClasses.button} text-white text-center py-3.5 rounded-lg font-semibold transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2`}
                          >
                            <IconComponent className="w-4 h-4" />
                            🎯 Lihat Detail Lengkap
                          </Link>
                        </div>
                      </div>

                      {/* Right Content - Features Preview */}
                      <div className="space-y-6">
                        {/* Community Features */}
                        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-xl p-5 border border-green-500/20 hover:border-green-500/40 transition-all">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                              <CommunityIcon className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                              <span className="font-semibold text-green-400 text-lg">
                                {project?.pages?.community?.title || "Community"}
                              </span>
                              <p className="text-sm text-gray-400 mt-1">
                                {project?.pages?.community?.description || "Join our growing community"}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-black/20 rounded-lg p-2">
                              <div className="text-green-400 font-bold text-sm">
                                {(project?.pages?.community?.sections?.memberStats?.totalMembers || 1000)?.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-400">Members</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-2">
                              <div className="text-green-400 font-bold text-sm">
                                {project?.pages?.community?.sections?.forum?.categories?.length || 5}
                              </div>
                              <div className="text-xs text-gray-400">Forums</div>
                            </div>
                            <div className="bg-black/20 rounded-lg p-2">
                              <div className="text-green-400 font-bold text-sm">
                                {project?.pages?.community?.sections?.events?.upcomingEvents?.length || 3}
                              </div>
                              <div className="text-xs text-gray-400">Events</div>
                            </div>
                          </div>
                        </div>

                        {/* Livestream Features */}
                        <div className="bg-gradient-to-br from-red-500/10 to-pink-500/5 rounded-xl p-5 border border-red-500/20 hover:border-red-500/40 transition-all">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                              <LivestreamIcon className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                              <span className="font-semibold text-red-400 text-lg">
                                {project?.pages?.livestream?.title || "Livestream"}
                              </span>
                              <p className="text-sm text-gray-400 mt-1">
                                {project?.pages?.livestream?.description || "Live streaming features"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {(project?.pages?.livestream?.contentCategories?.slice(0, 3) || []).map((category, index) => {
                              const categoryIcon = category?.icon || "FaVideo";
                              const CategoryIcon = getIconComponent(categoryIcon);
                              return (
                                <span
                                  key={index}
                                  className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center gap-1"
                                >
                                  <CategoryIcon className="w-3 h-3" />
                                  {category?.name || "Category"}
                                </span>
                              );
                            })}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <LivestreamIcon className="w-3 h-3" />
                              {project?.pages?.livestream?.features?.livestream?.qualityOptions?.length || 4} Qualities
                            </span>
                            <span className="flex items-center gap-1">
                              <FaUpload className="w-3 h-3" />
                              {project?.pages?.livestream?.features?.videoUpload?.maxSize || "2GB"}
                            </span>
                          </div>
                        </div>

                        {/* Technology Preview */}
                        {project?.technology && (
                          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-xl p-5 border border-blue-500/20 hover:border-blue-500/40 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                              <FaCode className="w-5 h-5 text-blue-400" />
                              <span className="font-semibold text-blue-400 text-lg">Tech Stack</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                                {project.technology.frontend?.framework || "React"}
                              </span>
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                                {project.technology.backend?.framework || "Node.js"}
                              </span>
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded border border-blue-500/30">
                                {project.technology.backend?.database || "MongoDB"}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Social Links */}
                        <div className="flex justify-center gap-3 pt-4">
                          {(project?.socialLinks?.slice(0, 5) || []).map((social, index) => {
                            const socialIcon = social?.icon || "FaTwitter";
                            const SocialIcon = getIconComponent(socialIcon);
                            return (
                              <a
                                key={index}
                                href={social?.url || "#"}
                                className="p-2 bg-black/30 hover:bg-orange-500/20 rounded-lg transition-all transform hover:scale-110 group"
                                title={`Follow ${project?.brand?.name || "Project"} on ${social?.name || "Social Media"}`}
                              >
                                <SocialIcon className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })()}
        </motion.section>
      )}

      {/* ━━━ FEATURED BLOG POSTS SECTION ━━━ */}
      {blogs.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto w-full py-16"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
              📝 Artikel Terbaru
            </h2>
            <Link
              to="/blog"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 transition-colors"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {(() => {
            const currentBlog = blogs[currentBlogIndex % blogs.length] || blogs[0];
            if (!currentBlog) return null;

            return (
              <div
                className="relative max-w-4xl mx-auto"
                onMouseEnter={() => setIsHoveredBlog(true)}
                onMouseLeave={() => setIsHoveredBlog(false)}
              >
                {/* Header Controls: Timer indicator & Indicators */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-cyan-400/90 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 flex items-center gap-1.5 shadow-sm">
                      <Clock className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                      <span>Berganti setiap 3 detik</span>
                    </span>
                    {isHoveredBlog && (
                      <span className="text-xs text-amber-400/90 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                        Jeda (di-hover)
                      </span>
                    )}
                  </div>

                  {/* Dot/Pill Indicators */}
                  <div className="flex items-center gap-2">
                    {blogs.map((item, idx) => {
                      const isSelected = idx === (currentBlogIndex % blogs.length);
                      return (
                        <button
                          key={item.id || idx}
                          onClick={() => setCurrentBlogIndex(idx)}
                          aria-label={`Artikel ${idx + 1}`}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            isSelected
                              ? "w-8 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md"
                              : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Left & Right navigation buttons */}
                {blogs.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        prevBlog();
                      }}
                      aria-label="Artikel Sebelumnya"
                      className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        nextBlog();
                      }}
                      aria-label="Artikel Selanjutnya"
                      className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Animated Single Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentBlog.id || currentBlog.slug || currentBlogIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <Link
                      to={currentBlog.url || `/blog/${currentBlog.slug}`}
                      className="block group"
                    >
                      <div className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-blue-500/50 backdrop-blur-xl rounded-2xl overflow-hidden transition-all group-hover:shadow-2xl flex flex-col md:flex-row">
                        {/* Blog Thumbnail */}
                        <div className="relative md:w-5/12 h-56 md:h-auto min-h-[220px] overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                          <img
                            src={
                              currentBlog.thumbnail ||
                              "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80"
                            }
                            alt={currentBlog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                          {currentBlog.featured && (
                            <div className="absolute top-3 left-3 bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                              Featured
                            </div>
                          )}
                        </div>

                        {/* Blog Info */}
                        <div className="p-6 md:p-8 md:w-7/12 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Tag className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                                {currentBlog.category}
                              </span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors line-clamp-2 text-white">
                              {currentBlog.title}
                            </h3>
                            <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-3 leading-relaxed">
                              {currentBlog.excerpt || currentBlog.description}
                            </p>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                {currentBlog.readTime}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                                {currentBlog.views || "0"}
                              </span>
                            </div>
                            <span className="text-cyan-400 group-hover:text-cyan-300 font-semibold flex items-center gap-1 transition-transform group-hover:translate-x-1">
                              Baca Artikel <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })()}
        </motion.section>
      )}

      {/* ━━━ GALLERY PREVIEW SECTION ━━━ */}
      {gallery.length > 0 && (
        <motion.section
          className="max-w-6xl mx-auto w-full py-16"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          onMouseEnter={() => setIsHoveredGallery(true)}
          onMouseLeave={() => setIsHoveredGallery(false)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
                  📸 Galeri Fotografi
                </h2>
                <span className="text-xs text-cyan-400/90 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  <span>Berganti setiap 3 detik</span>
                </span>
                {isHoveredGallery && (
                  <span className="text-xs text-amber-400/90 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                    Jeda (di-hover)
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                Koleksi momen terbaik, potret, dan karya visual pilihan yang berganti secara dinamis
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  rotateNextGalleryCard();
                }}
                aria-label="Ganti Card Berikutnya"
                title="Ganti Card Berikutnya"
                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ganti Foto</span>
              </button>
              <Link
                to="/photography"
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 transition-colors text-sm"
              >
                Lihat Galeri <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedGalleryIndices.map((galleryIdx, slotIndex) => {
              const item = gallery[galleryIdx];
              if (!item) return null;
              const isActive =
                slotIndex ===
                (activeGallerySlot - 1 + displayedGalleryIndices.length) %
                  displayedGalleryIndices.length;

              return (
                <div key={slotIndex} className="relative h-56 rounded-xl overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={item.id || item.src || galleryIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className="w-full h-full"
                    >
                      <OptimizedGalleryCard
                        item={item}
                        isActive={isActive}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ━━━ CALL TO ACTION FINAL SECTION ━━━ */}
      <motion.section
        className="max-w-4xl mx-auto w-full py-16 pb-20 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-cyan-500/30 backdrop-blur-xl rounded-3xl p-12 space-y-6">
          <Rocket className="w-12 h-12 mx-auto text-cyan-400 animate-bounce" />
          <h3 className="text-3xl sm:text-4xl font-bold">
            Mari Ciptakan Sesuatu yang Luar Biasa! 🚀
          </h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Saya siap untuk berkolaborasi dalam proyek yang menantang, berbagi pengetahuan, atau berdiskusi tentang ide-ide kreatif. Hubungi saya hari ini!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
            >
              📧 Hubungi Saya Sekarang
            </Link>
            <Link
              to="/blog"
              className="bg-white/10 hover:bg-white/20 border border-cyan-400 text-cyan-300 px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              📖 Baca Blog Saya
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}