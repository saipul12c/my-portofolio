import { motion } from "framer-motion";
import {
  Camera, Code2, Sparkles, ArrowRight,
  BookOpen, Award, Lightbulb, Heart,
  Github, ExternalLink, ChevronRight,
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
import { useState, useEffect } from "react";
import Maintenance from "./errors/Maintenance"; // 🧩 impor halaman Maintenance

// 📊 Import data files
import projectsData from "../data/projects.json";
import { fetchAllPosts } from "./blog/services/blogSupabase";
import galleryData from "../data/galleryData.json";
import comingSoonData from "../data/comingsoon/data.json";
import certificatesData from "../data/sertif/certificates.json";
import softskillsData from "../data/skills/softskills.json";
import specializationsData from "../data/skills/specializations.json";
import experiencesData from "../data/pengalaman/experiences.json";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
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
          setBlogs(liveBlogs.slice(0, 3));
        }
      }).catch(() => { });
      setGallery(galleryData?.slice(0, 6) || []);
      // Pastikan comingSoon adalah array
      setComingSoon(Array.isArray(comingSoonData) ? comingSoonData : []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  // 🕒 Countdown timer untuk coming soon
  useEffect(() => {
    if (!comingSoon || comingSoon.length === 0 || !comingSoon[0]?.launchDate) return;

    const launchDate = new Date(comingSoon[0].launchDate).getTime();

    const interval = setInterval(() => {
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
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [comingSoon]);

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
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-300">
          Juga Tersedia 🌐
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link to="/zodiak">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-500/30 backdrop-blur-xl rounded-xl p-6 hover:shadow-lg transition-all group"
            >
              <h4 className="font-bold text-lg mb-2">♈ Zodiak Calculator</h4>
              <p className="text-gray-400 text-sm">Tool interaktif untuk mengetahui zodiak Anda</p>
            </motion.div>
          </Link>
          <Link to="/qodam">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 backdrop-blur-xl rounded-xl p-6 hover:shadow-lg transition-all group"
            >
              <h4 className="font-bold text-lg mb-2">🚀 Qodam</h4>
              <p className="text-gray-400 text-sm">Aplikasi tambahan dengan fitur menarik</p>
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

          {comingSoon.map((project) => {
            // Safe access dengan optional chaining
            const brandLogo = project?.brand?.logo || "FaRocket";
            const communityIcon = project?.pages?.community?.icon || "FaUsers";
            const livestreamIcon = project?.pages?.livestream?.icon || "FaVideo";

            const IconComponent = getIconComponent(brandLogo);
            const CommunityIcon = getIconComponent(communityIcon);
            const LivestreamIcon = getIconComponent(livestreamIcon);

            return (
              <div key={project?.id || 'default'} className="bg-gradient-to-br from-orange-500/20 via-purple-500/10 to-red-500/20 border border-orange-500/30 backdrop-blur-xl rounded-2xl p-8 hover:shadow-2xl transition-all group relative overflow-hidden mb-8">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform scale-150 opacity-10"></div>

                <div className="grid lg:grid-cols-2 gap-8 items-center relative">
                  {/* Left Content */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <IconComponent className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{project?.brand?.name || "Project Name"}</h3>
                          <p className="text-orange-300 text-sm">{project?.brand?.slogan || "Exciting project coming soon"}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full border border-orange-500/30">
                        Coming Soon
                      </span>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-semibold text-orange-300">
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
                            <div key={index} className="bg-black/20 rounded-lg p-3 border border-orange-500/20">
                              <div className="flex items-center gap-2">
                                <FeatureIcon className="w-4 h-4 text-orange-400" />
                                <span className="text-sm text-white font-medium">{feature?.title || "Feature"}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Countdown Timer */}
                    <div className="bg-black/30 rounded-xl p-6 border border-orange-500/20">
                      <div className="flex items-center gap-2 justify-center mb-4">
                        <IconComponent className="w-4 h-4 text-orange-300" />
                        <p className="text-sm text-orange-300 font-semibold text-center">
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
                            <div key={index} className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20 hover:bg-orange-500/20 transition-colors">
                              <div className="text-2xl font-bold text-white">{item.value}</div>
                              <div className="text-xs text-orange-300 mt-1">{item.label}</div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex gap-3 pt-4">
                      <Link
                        to="/coming-soon"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2"
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
              </div>
            );
          })}
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

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <Link key={blog.id} to={blog.url || `/blog/${blog.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-blue-500/50 backdrop-blur-xl rounded-2xl overflow-hidden transition-all group h-full flex flex-col"
                >
                  {/* Blog Thumbnail */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <img
                      src={blog.thumbnail || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80"}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                    {blog.featured && (
                      <div className="absolute top-3 left-3 bg-blue-500/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Blog Info */}
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-400 font-semibold">{blog.category}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                      {blog.excerpt || blog.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/10">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views || "0"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
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
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
              📸 Galeri Fotografi
            </h2>
            <Link
              to="/photography"
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-2 transition-colors"
            >
              Lihat Galeri <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((item, i) => (
              <Link key={item.id} to="/photography">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.08 }}
                  className="relative h-56 rounded-xl overflow-hidden group cursor-pointer"
                >
                  {/* Image */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300 flex flex-col justify-end p-4">
                    <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {item.category}
                        </span>
                        {item.type === "video" && (
                          <span className="bg-cyan-500/80 text-white px-2 py-0.5 rounded text-xs font-semibold">
                            {item.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
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