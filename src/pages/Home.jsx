import { motion } from "framer-motion";
import { 
  Camera, Code2, Sparkles, ArrowRight, 
  BookOpen, Award, Lightbulb, Heart, 
  Github, ExternalLink, ChevronRight,
  BarChart3, Users, Zap, Star, TrendingUp,
  Briefcase, MapPin, Calendar, Rocket, CheckCircle,
  Eye, MessageCircle, Share2, Clock, Tag
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Maintenance from "./errors/Maintenance"; // 🧩 impor halaman Maintenance

// 📊 Import data files
import projectsData from "../data/projects.json";
import blogData from "../data/blog/data.json";
import galleryData from "../data/galleryData.json";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [gallery, setGallery] = useState([]);

  // 🔄 Load data dari JSON
  useEffect(() => {
    try {
      setProjects(projectsData.projects?.slice(0, 3) || []);
      setBlogs(blogData?.slice(0, 3) || []);
      setGallery(galleryData?.slice(0, 6) || []);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  const isMaintenance = false; // ubah ke false jika sudah normal
  // const isMaintenance = true;

  if (isMaintenance) {
    return <Maintenance />; // 🚧 tampilkan halaman Maintenance
  }

  // 📊 Statistik Portfolio (dinamis dari data)
  const stats = [
    { icon: Code2, label: "Proyek Selesai", value: `${projects.length || 15}+`, color: "cyan" },
    { icon: Camera, label: "Foto Dokumentasi", value: `${gallery.length * 30 || 200}+`, color: "purple" },
    { icon: BookOpen, label: "Artikel Blog", value: `${blogs.length * 5 || 20}+`, color: "blue" },
    { icon: Award, label: "Sertifikasi", value: "5+", color: "emerald" },
  ];

  // 🎯 Fitur Utama Website
  const mainFeatures = [
    {
      icon: <Camera className="w-10 h-10 text-cyan-400" />,
      title: "Galeri Fotografi",
      description: "Koleksi foto artistik dan dokumentasi dengan kategori terstruktur",
      link: "/photography",
      color: "from-cyan-500/20 to-cyan-600/10",
      border: "border-cyan-500/50"
    },
    {
      icon: <Code2 className="w-10 h-10 text-purple-400" />,
      title: "Portfolio Proyek",
      description: "Showcase proyek terbaik dengan teknologi dan demo interaktif",
      link: "/projects",
      color: "from-purple-500/20 to-purple-600/10",
      border: "border-purple-500/50"
    },
    {
      icon: <BookOpen className="w-10 h-10 text-blue-400" />,
      title: "Blog & Tulisan",
      description: "Artikel teknis dan insights tentang teknologi & pendidikan",
      link: "/blog",
      color: "from-blue-500/20 to-blue-600/10",
      border: "border-blue-500/50"
    },
  ];

  // 🌟 Keahlian & Spesialisasi
  const specializations = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Frontend Development",
      skills: ["React", "Tailwind CSS", "Framer Motion", "Vite"]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Backend Development",
      skills: ["Node.js", "Express", "Database", "APIs"]
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Photography & Visual",
      skills: ["Photography", "Video Editing", "Visual Design", "UI/UX"]
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Education & Teaching",
      skills: ["Curriculum Design", "Digital Learning", "Mentoring", "Content Creation"]
    },
  ];

  // 📈 Pengalaman & Pencapaian
  const experiences = [
    {
      period: "2023 - Sekarang",
      title: "Full-Stack Developer",
      company: "Personal Projects & Freelance",
      description: "Mengembangkan aplikasi web modern menggunakan React, Node.js, dan teknologi terkini",
      achievements: ["15+ Project", "Clean Code", "Modern Stack"]
    },
    {
      period: "2023 - Sekarang",
      title: "Content Creator & Educator",
      company: "Digital Learning Platform",
      description: "Membuat konten edukatif dan tutorial untuk pembelajaran digital",
      achievements: ["20+ Articles", "Active Community", "Knowledge Sharing"]
    },
    {
      period: "2022 - Sekarang",
      title: "Fotografer Dokumentasi",
      company: "Freelance",
      description: "Menangkap momen berharga melalui fotografi artistik dan dokumentasi",
      achievements: ["200+ Photos", "Event Coverage", "Portfolio Gallery"]
    },
  ];

  // 🏆 Soft Skills dengan progress
  const softSkills = [
    { name: "Komunikasi", level: 90 },
    { name: "Kolaborasi Tim", level: 85 },
    { name: "Problem Solving", level: 88 },
    { name: "Leadership", level: 80 },
    { name: "Kreativitas", level: 92 },
    { name: "Time Management", level: 87 },
  ];

  // 📚 Sertifikasi Unggulan
  const certifications = [
    { name: "JavaScript ES6+", issuer: "Verified Platform", year: "2023" },
    { name: "React Advanced", issuer: "Online Academy", year: "2023" },
    { name: "Web Development", issuer: "Tech Institute", year: "2023" },
    { name: "Photography Basics", issuer: "Creative School", year: "2022" },
    { name: "Digital Marketing", issuer: "Business Academy", year: "2023" },
  ];

  // 🔗 Quick Links
  const quickLinks = [
    { icon: Users, label: "Tentang Saya", path: "/about", color: "cyan" },
    { icon: Award, label: "Sertifikasi", path: "/certificates", color: "purple" },
    { icon: Lightbulb, label: "Skills", path: "/SoftSkills", color: "blue" },
    { icon: Heart, label: "Kenangan", path: "/gallery", color: "emerald" },
  ];

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
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col px-6 sm:px-10 md:px-20 relative overflow-hidden">
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

      {/* ━━━ FITUR UTAMA SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          Jelajahi Konten Utama
        </h2>

        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6">
          {mainFeatures.map((feature, i) => (
            <Link key={i} to={feature.link}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${feature.color} ${feature.border} border backdrop-blur-xl rounded-2xl p-8 h-full hover:shadow-2xl transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
                    {feature.icon}
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ━━━ KEAHLIAN SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          Keahlian & Spesialisasi
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specializations.map((spec, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-cyan-500/50 backdrop-blur-xl rounded-2xl p-6 transition-all group"
            >
              <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                {spec.icon}
              </div>
              <h3 className="text-lg font-bold mb-4">{spec.title}</h3>
              <div className="space-y-2">
                {spec.skills.map((skill, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-cyan-400" />
                    <span className="text-gray-300 text-sm">{skill}</span>
                  </div>
                ))}
              </div>
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
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 backdrop-blur-xl rounded-2xl p-8 hover:border-cyan-500/60 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-cyan-400 text-xs font-bold mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {exp.period}
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-cyan-300 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{exp.company}</p>
                </div>
                <Briefcase className="w-6 h-6 text-purple-400 flex-shrink-0" />
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {exp.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.achievements.map((achievement, j) => (
                  <span
                    key={j}
                    className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
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
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          Soft Skills & Kompetensi
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {softSkills.map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-white">{skill.name}</span>
                <span className="text-cyan-400 font-bold">{skill.level}%</span>
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
            </motion.div>
          ))}
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
                  {cert.name}
                </h4>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{cert.issuer}</span>
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

      {/* ━━━ QUICK LINKS SECTION ━━━ */}
      <motion.section
        className="max-w-6xl mx-auto w-full py-16"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
          Akses Cepat
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            const colorMap = {
              cyan: "hover:border-cyan-500/50 hover:shadow-cyan-500/20",
              purple: "hover:border-purple-500/50 hover:shadow-purple-500/20",
              blue: "hover:border-blue-500/50 hover:shadow-blue-500/20",
              emerald: "hover:border-emerald-500/50 hover:shadow-emerald-500/20",
            };
            return (
              <Link key={i} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`bg-white/5 border border-white/20 ${colorMap[link.color]} backdrop-blur-xl rounded-xl p-6 text-center hover:shadow-lg transition-all group cursor-pointer`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-gray-400 group-hover:scale-125 transition-transform" />
                  <span className="font-semibold text-white">{link.label}</span>
                </motion.div>
              </Link>
            );
          })}
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
