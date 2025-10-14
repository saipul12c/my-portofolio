// LaunchingPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function LaunchingPage() {
  const navigate = useNavigate();
  const LAUNCH_DATE = useMemo(() => new Date(import.meta.env.VITE_LAUNCH_DATE), []);
  const [timeLeft, setTimeLeft] = useState({});
  const [ready, setReady] = useState(false);

  // 🕒 Hitung mundur hanya sekali setiap detik
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = LAUNCH_DATE - now;

      if (diff <= 0) {
        setReady(true);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({ d, h, m, s });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [LAUNCH_DATE]);

  // 🚀 Kalau sudah siap, langsung arahkan ke homepage
  useEffect(() => {
    if (ready) {
      const timeout = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [ready, navigate]);

  // ✨ Animasi masuk smooth
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white text-center">
      {/* 🌌 Background interaktif */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,255,0.05),_transparent_70%)]"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <div className="absolute w-[900px] h-[900px] bg-cyan-500/10 blur-3xl rounded-full animate-pulse -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* 🌟 Konten utama */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-6 flex flex-col items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {!ready ? (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-400 to-blue-500 drop-shadow-[0_0_15px_#00ffff] mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🚀 Persiapan Peluncuran Website
              </motion.h1>

              <p className="text-gray-400 text-lg italic mb-8">
                “Sabar bro, roketnya lagi dipanasin dulu 😎🔥”
              </p>

              {/* Timer */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
                {["Hari", "Jam", "Menit", "Detik"].map((label, i) => {
                  const keys = ["d", "h", "m", "s"];
                  const value = timeLeft[keys[i]] ?? 0;
                  return (
                    <motion.div
                      key={label}
                      whileHover={{ scale: 1.1 }}
                      className="flex flex-col items-center bg-white/5 backdrop-blur-lg p-5 md:p-7 rounded-2xl shadow-lg border border-cyan-400/30 min-w-[90px] hover:border-cyan-300/70 transition-all"
                    >
                      <span className="text-4xl md:text-6xl font-mono text-cyan-300">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-gray-400 mt-2 uppercase tracking-widest">
                        {label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Sosial media */}
              <div className="flex gap-6 mb-10">
                {[
                  { icon: <FaInstagram />, href: "https://instagram.com/username", color: "from-pink-500 to-orange-400" },
                  { icon: <FaGithub />, href: "https://github.com/username", color: "from-gray-500 to-gray-700" },
                  { icon: <FaLinkedin />, href: "https://linkedin.com/in/username", color: "from-blue-400 to-blue-700" },
                  { icon: <FaYoutube />, href: "https://youtube.com/@username", color: "from-red-500 to-red-700" },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 3 }}
                    className={`p-4 rounded-full bg-gradient-to-br ${item.color} text-white text-2xl shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/50 transition-all`}
                  >
                    {item.icon}
                  </motion.a>
                ))}
              </div>

              <p className="text-sm text-gray-500 italic">
                — Launching sebentar lagi, jangan ke mana-mana 💫 —
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="launched"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center justify-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_20px_#00ffff]">
                🎉 Website Sudah Siap!
              </h1>
              <p className="text-gray-300 text-lg mb-6">
                Tunggu sebentar... sedang membuka halaman utama 🌍
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
