import { motion } from "framer-motion";
import {
  Heart,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Folder,
  FileText,
  Image,
  Award,
  Eye,
  Info,
  Users,
  BookOpen,
  MessageSquare,
  Globe,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { FaTiktok, FaThreads, FaDiscord } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const portfolioLinks = [
    { to: "/projects", label: "Projects", icon: <Folder className="w-4 h-4 text-cyan-300" /> },
    { to: "/blog", label: "Blog & Berita", icon: <FileText className="w-4 h-4 text-cyan-300" /> },
    { to: "/gallery", label: "Gallery", icon: <Image className="w-4 h-4 text-cyan-300" /> },
    { to: "/certificates", label: "Certificates", icon: <Award className="w-4 h-4 text-cyan-300" /> },
    { to: "/visi", label: "Visi & Misi", icon: <Eye className="w-4 h-4 text-cyan-300" /> },
  ];

  const personalLinks = [
    { to: "/about", label: "About Me", icon: <Info className="w-4 h-4 text-cyan-300" /> },
    { to: "/SoftSkills", label: "Soft Skills", icon: <Users className="w-4 h-4 text-cyan-300" /> },
    { to: "/education", label: "Pendidikan", icon: <BookOpen className="w-4 h-4 text-cyan-300" /> },
    { to: "/testimoni", label: "Testimonials", icon: <MessageSquare className="w-4 h-4 text-cyan-300" /> },
    { to: "/bahasa", label: "Kemampuan Bahasa", icon: <Globe className="w-4 h-4 text-cyan-300" /> },
  ];

  return (
    <footer className="relative w-full bg-[#0f172a]/80 backdrop-blur-md border-t border-blue-900/40 text-gray-300 pt-16 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* === BAGIAN ATAS: BRAND, LINKS, CONTACT === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* BRAND + SOCIALS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:items-start"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Syaiful Mukmin
            </h3>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed max-w-xs">
              Desainer & Developer yang berfokus pada pengalaman digital yang halus, estetik, dan bermakna.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex flex-wrap gap-4 mt-5 items-center justify-center md:justify-start">
              <a
                href="https://github.com/saipul12c"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className="hover:text-cyan-400 transition-transform hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/username"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="hover:text-blue-400 transition-transform hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/saipul12c"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="hover:text-pink-400 transition-transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@saipul12c"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                className="hover:text-cyan-400 transition-transform hover:scale-110"
              >
                <FaTiktok className="w-5 h-5" />
              </a>
              <a
                href="https://www.threads.net/@saipul12c"
                target="_blank"
                rel="noopener noreferrer"
                title="Threads"
                className="hover:text-purple-400 transition-transform hover:scale-110"
              >
                <FaThreads className="w-5 h-5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Discord"
                className="hover:text-indigo-400 transition-transform hover:scale-110"
              >
                <FaDiscord className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* QUICK LINKS (2 SUBGROUPS) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-8 justify-center md:justify-start"
          >
            {/* Portfolio Links */}
            <div>
              <h4 className="text-lg font-semibold text-cyan-300 mb-4 tracking-wide">
                Portfolio
              </h4>
              <ul className="space-y-3 text-sm">
                {portfolioLinks.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Personal Links */}
            <div>
              <h4 className="text-lg font-semibold text-cyan-300 mb-4 tracking-wide">
                Personal
              </h4>
              <ul className="space-y-3 text-sm">
                {personalLinks.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="flex items-center gap-2 hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* GET IN TOUCH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center md:items-start"
          >
            <h4 className="text-lg font-semibold text-cyan-300 mb-4 tracking-wide">
              Get in Touch
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Tertarik berkolaborasi atau punya proyek menarik?
              Jangan ragu untuk menghubungi saya 👇
            </p>

            <a
              href="mailto:uju355@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-400 transition-all hover:translate-x-1"
            >
              <Mail className="w-4 h-4" /> uju355@gmail.com
            </a>

            <button
              onClick={() => (window.location.href = "/contact")}
              className="mt-5 px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full text-sm font-semibold text-white shadow-md hover:shadow-cyan-500/30 transition-transform hover:scale-105"
            >
              Hubungi Saya
            </button>
          </motion.div>
        </div>

        {/* === GARIS PEMISAH === */}
        <div className="w-full h-[1px] bg-gradient-to-r from-cyan-400/0 via-cyan-400/40 to-blue-400/0 my-10" />

        {/* === COPYRIGHT === */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="flex items-center gap-2">
            Dibuat dengan <Heart className="w-4 h-4 text-red-500 animate-pulse" /> oleh{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
              Syaiful Mukmin
            </span>
          </p>

          {/* Privacy & Security Links */}
          <div className="flex items-center gap-4 text-xs">
            <Link
              to="/live-cs/privacy"
              className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Privasi</span>
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              to="/live-cs/security"
              className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Keamanan</span>
            </Link>
          </div>

          <p>© {currentYear} — Semua hak dilindungi 🚀</p>
        </motion.div>
      </div>

      {/* === BACKGROUND GLOW === */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30rem] h-48 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full -z-10" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/10 via-blue-400/10 to-transparent blur-2xl -z-10" />
    </footer>
  );
}
