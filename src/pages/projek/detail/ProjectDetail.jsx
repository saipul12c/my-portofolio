import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import data from "../../../data/projects.json";
import Maintenance from "../../errors/Maintenance";
import Forbidden from "../../errors/Forbidden"; // 🚫 Tambahkan ini

export default function ProjectDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🚧 Mode maintenance
  const isMaintenance = false; // ubah ke true kalau lagi perbaikan
  if (isMaintenance) {
    return <Maintenance />;
  }

  // 🛡 Proteksi akses langsung
  const fromProjects = location.state?.fromProjects || false;
  if (!fromProjects) {
    // Jika user akses langsung lewat URL tanpa state dari halaman Projects
    return <Forbidden />;
  }

  const { id } = useParams();
  const project = data.projects.find((p) => p.id === Number(id));

  // ❌ Jika ID tidak ditemukan
  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] text-white">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-4"
        >
          404
        </motion.h1>
        <p className="text-gray-300 text-lg mb-8">Proyek tidak ditemukan 😢</p>
        <Link
          to="/projects"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg"
        >
          Kembali ke Daftar Proyek
        </Link>
      </main>
    );
  }

  // ⭐ Render Rating Bintang
  const renderStars = (rating) => {
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1a1b2e] to-[#0f172a] text-white px-6 sm:px-10 md:px-20 py-20 relative overflow-hidden">
      {/* 🌈 Background Gradient Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-pink-500/30 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[36rem] h-[36rem] bg-cyan-500/30 blur-[150px] rounded-full animate-pulse" />
      </div>

      {/* 🔙 Tombol Kembali */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition mb-10 font-medium group"
      >
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        Kembali
      </Link>

      {/* 💎 Container utama */}
      <motion.div
        className="max-w-6xl mx-auto bg-white/10 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-2xl shadow-2xl transition hover:border-cyan-400/30 hover:bg-white/20"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 📸 Header Gambar */}
        <div className="relative">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-[420px] object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-8 left-8 space-y-2">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="inline-block px-4 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm backdrop-blur-sm"
            >
              {project.label}
            </motion.span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md">
              {project.title}
            </h1>
            <h2 className="text-cyan-300 text-lg">{project.subtitle}</h2>
          </div>
        </div>

        {/* 📄 Detail Konten */}
        <div className="p-8 sm:p-10 space-y-10">
          {/* ⭐ Rating */}
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-semibold">
              {project.rating.toFixed(1)}
            </span>
            <div className="flex items-center">{renderStars(project.rating)}</div>
          </div>

          {/* 📘 Deskripsi */}
          <Section icon={BookOpen} title="Gambaran Umum">
            <p className="text-gray-300 leading-relaxed text-lg">{project.overview}</p>
          </Section>

          <Section icon={Sparkles} title="Deskripsi Lengkap">
            <p className="text-gray-300 leading-relaxed text-lg">{project.description}</p>
          </Section>

          {/* ⚙️ Info */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Info label="Kategori" icon={<Folder />} value={project.category} />
            <Info label="Tanggal" icon={<Calendar />} value={project.date} />
            <Info label="Durasi" icon={<Clock />} value={project.duration} />
            <Info label="Status" icon={<Layers />} value={project.status} />
            <Info label="Kolaborator" icon={<Users />} value={project.collaborators.join(", ")} />
            <Info label="Peran" icon={<Hammer />} value={project.role} />
          </motion.div>

          {/* 🔗 Link */}
          <div className="pt-8 flex flex-wrap gap-4">
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold shadow-lg transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Lihat Proyek
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold shadow-lg transition-all"
              >
                <Github className="w-5 h-5" />
                Repository
              </a>
            )}
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
      whileHover={{ scale: 1.03, y: -3 }}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
    >
      <div className="flex items-center gap-3 mb-1 text-cyan-400">{icon}</div>
      <h3 className="text-sm text-gray-400">{label}</h3>
      <p className="text-white font-medium">{value}</p>
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
    >
      <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-cyan-300">
        <Icon className="w-5 h-5 text-cyan-400" />
        {title}
      </h3>
      {children}
    </motion.section>
  );
}
