import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Calendar,
  Clock,
  Users,
  Folder,
  Layers,
  Target,
  Hammer,
  Award,
  Image as ImageIcon,
  Github,
  MessageSquare,
  ListChecks,
  BookOpen,
  Sparkles,
  Code,
  Rocket,
  Zap,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Lock,
  Wrench,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import data from "../../../data/projects.json";
import Maintenance from "../../errors/Maintenance";
import Forbidden from "../../errors/Forbidden";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isPlayingGallery, setIsPlayingGallery] = useState(false);

  // 🚧 Mode maintenance
  const isMaintenance = false; // ubah ke true kalau lagi perbaikan

  const project = data.projects.find((p) => p.id === Number(id));

  // 🛡️ Proteksi akses langsung - periksa apakah akses valid
  const isValidAccess = 
    location.state?.fromProjects || 
    location.state?.fromCertificates ||
    document.referrer.includes(window.location.origin) ||
    sessionStorage.getItem(`project_${id}_accessed`) === 'true';

  // Set session storage untuk akses yang valid
  useEffect(() => {
    if (isValidAccess && project) {
      sessionStorage.setItem(`project_${id}_accessed`, 'true');
    }
  }, [isValidAccess, id, project]);

  // Auto-play gallery images
  useEffect(() => {
    let interval;
    if (isPlayingGallery && project?.gallery && project.gallery.length > 1) {
      interval = setInterval(() => {
        setActiveImageIndex((prev) => 
          prev === project.gallery.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlayingGallery, project?.gallery]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!project?.gallery) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setActiveImageIndex(prev => 
            prev === 0 ? project.gallery.length - 1 : prev - 1
          );
          break;
        case 'ArrowRight':
          e.preventDefault();
          setActiveImageIndex(prev => 
            prev === project.gallery.length - 1 ? 0 : prev + 1
          );
          break;
        case 'Escape':
          navigate('/projects');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project?.gallery, navigate]);

  // Handle gallery navigation
  const nextImage = useCallback(() => {
    if (!project?.gallery) return;
    setActiveImageIndex(prev => 
      prev === project.gallery.length - 1 ? 0 : prev + 1
    );
  }, [project?.gallery]);

  const prevImage = useCallback(() => {
    if (!project?.gallery) return;
    setActiveImageIndex(prev => 
      prev === 0 ? project.gallery.length - 1 : prev - 1
    );
  }, [project?.gallery]);

  // Handle navigation dengan validasi
  const handleBackToProjects = useCallback(() => {
    navigate('/projects', { 
      state: { fromProjectDetail: true }
    });
  }, [navigate]);

  // 🚧 Early returns - HARUS SETELAH SEMUA HOOKS
  if (isMaintenance) {
    return <Maintenance />;
  }

  // ❌ Jika akses tidak valid
  if (!isValidAccess) {
    return <Forbidden />;
  }

  // ❌ Jika project tidak ditemukan
  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>
        <p className="text-gray-300 text-lg mb-8 text-center">
          Proyek tidak ditemukan 😢
        </p>
        <Link
          to="/projects"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg font-semibold"
        >
          Kembali ke Daftar Proyek
        </Link>
      </main>
    );
  }

  // ⭐ Render Rating Bintang
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      );
    }
    if (half)
      stars.push(<Star key="half" className="w-5 h-5 text-yellow-400/60" />);
    return stars;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'selesai': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'berjalan': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'online': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'publik': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      default: return 'text-cyan-400 bg-cyan-400/20 border-cyan-400/30';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1a1b2e] to-[#0f172a] text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* 🌈 Background Gradient Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-pink-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[36rem] h-[36rem] bg-cyan-500/20 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>

      {/* 🛡️ Access Indicator */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex items-center gap-2 text-sm text-cyan-400/70">
          <ShieldCheck className="w-4 h-4" />
          <span>Akses Terverifikasi</span>
        </div>
      </div>

      {/* 🔙 Tombol Kembali */}
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={handleBackToProjects}
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition font-medium group"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Kembali ke Proyek
        </button>
      </div>

      {/* 💎 Container utama */}
      <motion.div
        className="max-w-7xl mx-auto bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 📸 Header Gambar dengan Gallery Support */}
        <div className="relative">
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                src={project.gallery?.[activeImageIndex] || project.image}
                alt={project.title}
                className="w-full h-full object-cover brightness-90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            
            {/* Gallery Controls */}
            {project.gallery && project.gallery.length > 1 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                <button
                  onClick={prevImage}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setIsPlayingGallery(!isPlayingGallery)}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  {isPlayingGallery ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={nextImage}
                  className="p-1 hover:text-cyan-400 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                
                <span className="text-xs text-gray-300 px-2">
                  {activeImageIndex + 1} / {project.gallery.length}
                </span>
              </div>
            )}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${getStatusColor(project.status)}`}
              >
                {project.status}
              </motion.span>
              
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm backdrop-blur-sm"
              >
                {project.category}
              </motion.span>

              {project.rating && (
                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-yellow-400 text-sm font-semibold">
                    {project.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center">
                    {renderStars(project.rating)}
                  </div>
                </div>
              )}

              {/* Access Badge */}
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-block px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-green-300 text-sm backdrop-blur-sm flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                Verified Access
              </motion.span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
              {project.title}
            </h1>
            <h2 className="text-cyan-300 text-lg sm:text-xl">{project.subtitle}</h2>
          </div>
        </div>

        {/* 📄 Detail Konten */}
        <div className="p-6 sm:p-8 lg:p-10 space-y-8 lg:space-y-10">
          {/* 📘 Deskripsi */}
          <Section icon={BookOpen} title="Gambaran Umum">
            <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
              {project.overview || project.description}
            </p>
          </Section>

          {/* ✨ Deskripsi Lengkap */}
          {project.description && project.description !== project.overview && (
            <Section icon={Sparkles} title="Deskripsi Lengkap">
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                {project.description}
              </p>
            </Section>
          )}

          {/* 🎯 Goals & Objectives */}
          {project.goals && (
            <Section icon={Target} title="Tujuan Proyek">
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                {project.goals}
              </p>
            </Section>
          )}

          {/* ⚙️ Project Information Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Info label="Kategori" icon={<Folder className="w-4 h-4" />} value={project.category} />
            <Info label="Tanggal" icon={<Calendar className="w-4 h-4" />} value={project.date} />
            <Info label="Durasi" icon={<Clock className="w-4 h-4" />} value={project.duration} />
            <Info label="Status" icon={<Layers className="w-4 h-4" />} value={project.status} />
            {project.collaborators && project.collaborators.length > 0 && (
              <Info label="Kolaborator" icon={<Users className="w-4 h-4" />} value={project.collaborators.join(", ")} />
            )}
            {project.role && (
              <Info label="Peran" icon={<Hammer className="w-4 h-4" />} value={project.role} />
            )}
            {project.tech && project.tech.length > 0 && (
              <Info label="Teknologi" icon={<Code className="w-4 h-4" />} value={`${project.tech.length} technologies`} />
            )}
            {project.tags && project.tags.length > 0 && (
              <Info label="Tags" icon={<ListChecks className="w-4 h-4" />} value={`${project.tags.length} tags`} />
            )}
          </motion.div>

          {/* 🛠️ Tech Stack */}
          {project.tech && project.tech.length > 0 && (
            <Section icon={Code} title="Teknologi yang Digunakan">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 text-sm backdrop-blur-sm"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </Section>
          )}

          {/* 🚀 Features */}
          {project.features && project.features.length > 0 && (
            <Section icon={Zap} title="Fitur Utama">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {project.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </Section>
          )}

          {/* 🎯 Results & Impact */}
          {(project.results || project.impact) && (
            <Section icon={Award} title="Hasil & Dampak">
              <div className="space-y-4">
                {project.results && (
                  <div className="p-4 bg-green-500/10 border border-green-400/30 rounded-xl">
                    <h4 className="text-green-400 font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Hasil yang Dicapai
                    </h4>
                    <p className="text-gray-300">{project.results}</p>
                  </div>
                )}
                {project.impact && (
                  <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                    <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Dampak
                    </h4>
                    <p className="text-gray-300">{project.impact}</p>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* ⚠️ Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <Section icon={AlertTriangle} title="Tantangan & Solusi">
              <div className="space-y-3">
                {project.challenges.map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-orange-500/10 border border-orange-400/30 rounded-xl"
                  >
                    <p className="text-gray-300">{challenge}</p>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* 👥 Testimonials */}
          {project.testimonials && project.testimonials.length > 0 && (
            <Section icon={MessageSquare} title="Testimoni">
              <div className="space-y-4">
                {project.testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-purple-500/10 border border-purple-400/30 rounded-xl"
                  >
                    <p className="text-gray-300 italic mb-3">"{testimonial.comment}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {testimonial.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{testimonial.author}</p>
                        {testimonial.role && (
                          <p className="text-cyan-400 text-sm">{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* 🔗 Action Links */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
            {(project.link && project.link !== "#") && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold shadow-lg transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Lihat Live Demo
              </motion.a>
            )}
            
            {(project.repo && project.repo !== "#") && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold shadow-lg transition-all"
              >
                <Github className="w-5 h-5" />
                Source Code
              </motion.a>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToProjects}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold shadow-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Lihat Proyek Lain
            </motion.button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

/* 🔧 Komponen Info */
function Info({ label, icon, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
    >
      <div className="flex items-center gap-2 mb-2 text-cyan-400">
        {icon}
        <h3 className="text-sm font-medium text-gray-400">{label}</h3>
      </div>
      <p className="text-white font-semibold text-sm sm:text-base">{value}</p>
    </motion.div>
  );
}

/* 📦 Komponen Section */
function Section({ icon: Icon, title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-b border-white/10 pb-8 last:border-b-0"
    >
      <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-cyan-300">
        <Icon className="w-5 h-5 text-cyan-400" />
        {title}
      </h3>
      {children}
    </motion.section>
  );
}