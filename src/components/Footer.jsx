import { motion } from "framer-motion";
import { Heart, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const portfolioLinks = [
    { to: "/projects", label: "Projects" },
    { to: "/photography", label: "Photography" },
    { to: "/gallery", label: "Gallery" },
    { to: "/certificates", label: "Certificates" },
    { to: "/visi", label: "Visi & Misi" },
  ];

  const personalLinks = [
    { to: "/about", label: "About Me" },
    { to: "/SoftSkills", label: "Soft Skills" },
    { to: "/education", label: "Pendidikan" },
    { to: "/testimoni", label: "Testimonials" },
    { to: "/contact", label: "Contact" },
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
            <div className="flex gap-5 mt-5">
              <a
                href="https://github.com/username"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-transform hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/username"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-transform hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/username"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-400 transition-transform hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
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
                      className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {item.label}
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
                      className="hover:text-cyan-400 hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {item.label}
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
              href="mailto:syaiful.mukmin@example.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-400 transition-all hover:translate-x-1"
            >
              <Mail className="w-4 h-4" /> syaiful.mukmin@example.com
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
          className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-500"
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
          <p>© {currentYear} — Semua hak dilindungi 🚀</p>
        </motion.div>
      </div>

      {/* === BACKGROUND GLOW === */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30rem] h-48 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full -z-10" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/10 via-blue-400/10 to-transparent blur-2xl -z-10" />
    </footer>
  );
}
