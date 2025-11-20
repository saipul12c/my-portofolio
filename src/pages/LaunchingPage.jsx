// LaunchingPage.jsx
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaGithub, FaLinkedin, FaYoutube, FaRocket, FaEye, FaTimes } from "react-icons/fa";

// Multi-step loader states untuk launching sequence
const launchingLoaderStates = [
  {
    text: "Memulai sistem...",
  },
  {
    text: "Menyiapkan database...",
  },
  {
    text: "Mengatur konten...",
  },
  {
    text: "Mengoptimasi performa...",
  },
  {
    text: "Melakukan pengecekan keamanan...",
  },
  {
    text: "Menghubungkan ke server...",
  },
  {
    text: "Membuka akses...",
  },
  {
    text: "Website siap!",
  },
];

// Komponen MultiStepLoader sederhana
const MultiStepLoader = ({ loadingStates, loading, duration = 2000 }) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setCurrentState((prev) => {
        if (prev >= loadingStates.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, duration / loadingStates.length);

    return () => clearInterval(interval);
  }, [loading, loadingStates.length, duration]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900/90 border border-cyan-500/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Animated Rocket */}
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="text-4xl"
          >
            🚀
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ 
                duration: duration / 1000, 
                ease: "easeInOut" 
              }}
            />
          </div>

          {/* Current Step Text */}
          <div className="text-center space-y-2">
            <motion.p
              key={currentState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-white font-semibold text-lg"
            >
              {loadingStates[currentState]?.text}
            </motion.p>
            <p className="text-cyan-300 text-sm">
              Langkah {currentState + 1} dari {loadingStates.length}
            </p>
          </div>

          {/* Loading Dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: dot * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LaunchingPage() {
  const navigate = useNavigate();
  const LAUNCH_DATE = useMemo(() => new Date(import.meta.env.VITE_LAUNCH_DATE), []);
  const [timeLeft, setTimeLeft] = useState({});
  const [ready, setReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const timerRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Cek preferensi pengguna untuk mengurangi animasi
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Smooth entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 🕒 Optimized countdown dengan requestAnimationFrame
  const updateCountdown = useCallback(() => {
    if (ready) return; // Stop jika sudah ready

    animationFrameRef.current = requestAnimationFrame(() => {
      const now = new Date();
      const diff = LAUNCH_DATE - now;

      if (diff <= 0) {
        setReady(true);
        // Tampilkan loader ketika waktu habis
        setShowLoader(true);
        cancelAnimationFrame(animationFrameRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      // Hitung waktu hanya jika berubah (mengurangi re-render)
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(prev => {
        if (prev.d === d && prev.h === h && prev.m === m && prev.s === s) {
          return prev; // Tidak update state jika tidak berubah
        }
        return { d, h, m, s };
      });
    });
  }, [LAUNCH_DATE, ready]);

  // Setup timer dengan interval yang disesuaikan
  useEffect(() => {
    if (ready) return;

    updateCountdown();
    
    // Gunakan interval yang lebih panjang jika waktu masih lama
    const daysLeft = timeLeft.d || 0;
    const interval = daysLeft > 1 ? 5000 : 1000; // 5 detik untuk >1 hari, 1 detik untuk mendekati
    
    timerRef.current = setInterval(updateCountdown, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [updateCountdown, ready, timeLeft.d]);

  // 🚀 Redirect ketika ready - cleanup semua resources
  useEffect(() => {
    if (ready) {
      // Cleanup semua timer dan animation frame
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      // Set timeout untuk redirect setelah loader selesai
      const timeout = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [ready, navigate]);

  // ✨ Simplified animations dengan preferensi reduce motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: reduceMotion ? { duration: 0.1 } : { 
        duration: 0.8,
        ease: "easeOut"
      } 
    },
  };

  const countdownVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0.1 } : {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const socialVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion ? { duration: 0.1 } : {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const previewVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: reduceMotion ? { duration: 0.1 } : {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: reduceMotion ? 1 : 0.8,
      transition: reduceMotion ? { duration: 0.1 } : {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // 📱 Data untuk preview halaman yang akan datang
  const pagePreviews = useMemo(() => [
    {
      title: "Portfolio Gallery",
      description: "Koleksi project terbaik dengan detail lengkap dan teknologi yang digunakan",
      features: ["Project Showcase", "Tech Stack", "Live Demo Links", "Client Testimonials"],
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-400/30"
    },
    {
      title: "Blog Section", 
      description: "Artikel tentang development, tips coding, dan pengalaman programming",
      features: ["Tech Articles", "Tutorials", "Code Snippets", "Industry Insights"],
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-400/30"
    },
    {
      title: "Contact Hub",
      description: "Tempat untuk berkolaborasi dan menghubungi saya langsung",
      features: ["Contact Form", "Social Links", "Project Inquiry", "Quick Response"],
      color: "from-green-500/20 to-emerald-500/20", 
      borderColor: "border-green-400/30"
    }
  ], []);

  // Render multi-step loader ketika waktu habis
  if (showLoader) {
    return (
      <MultiStepLoader 
        loadingStates={launchingLoaderStates}
        loading={showLoader}
        duration={2500}
      />
    );
  }

  // Jika sudah ready, render hanya halaman success
  if (ready) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white text-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 blur-3xl rounded-full -top-48 -left-48" />
          <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full -bottom-32 -right-32" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 px-6 flex flex-col items-center justify-center"
        >
          <motion.div
            animate={reduceMotion ? {} : { 
              scale: [1, 1.1, 1],
            }}
            transition={reduceMotion ? {} : { 
              duration: 2,
              ease: "easeInOut"
            }}
            className="mb-6"
          >
            <div className="text-6xl">🎉</div>
          </motion.div>
          
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Website Sudah Siap!
          </motion.h1>
          
          <motion.p
            className="text-gray-300 text-base md:text-lg mb-6 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Tunggu sebentar... sedang membuka halaman utama 🌍
          </motion.p>
          
          <motion.div
            className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    );
  }

  // Render countdown page
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white text-center">
      {/* 🌌 Simplified Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 blur-3xl rounded-full -top-48 -left-48" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full -bottom-32 -right-32" />
      </div>

      {/* 🌟 Main Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="relative z-10 px-6 flex flex-col items-center justify-center w-full max-w-4xl mx-auto"
      >
        {/* Rocket Icon dengan Conditional Animation */}
        <motion.div
          className="mb-6"
          animate={reduceMotion ? {} : { 
            y: [0, -10, 0],
          }}
          transition={reduceMotion ? {} : { 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaRocket className="text-5xl md:text-6xl text-cyan-400" />
        </motion.div>

        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-400 to-blue-500 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Persiapan Peluncuran Website
        </motion.h1>

        <motion.p
          className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          "Sabar bro, roketnya lagi dipanasin dulu 😎🔥"
        </motion.p>

        {/* Clean Timer */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-5 mb-8">
          {["Hari", "Jam", "Menit", "Detik"].map((label, i) => {
            const keys = ["d", "h", "m", "s"];
            const value = timeLeft[keys[i]] ?? 0;
            return (
              <motion.div
                key={label}
                variants={countdownVariants}
                initial="hidden"
                animate="visible"
                whileHover={reduceMotion ? {} : { 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                className="flex flex-col items-center bg-white/5 backdrop-blur-sm p-4 md:p-5 rounded-xl border border-cyan-400/20 min-w-[80px] md:min-w-[90px]"
              >
                <span className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold text-cyan-300">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="text-xs md:text-sm text-gray-300 mt-2 uppercase tracking-wider">
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* 🎯 Bocoran Halaman Button */}
        <motion.button
          onClick={() => setShowPreview(true)}
          whileHover={reduceMotion ? {} : { scale: 1.05 }}
          whileTap={reduceMotion ? {} : { scale: 0.95 }}
          className="mb-8 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-xl text-cyan-300 hover:text-cyan-200 transition-all duration-200 group"
        >
          <FaEye className="text-lg group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Lihat Bocoran Halaman</span>
        </motion.button>

        {/* Simplified Social Media */}
        <motion.div 
          className="flex gap-4 mb-8"
          variants={socialVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: <FaInstagram />, href: "https://instagram.com/username" },
            { icon: <FaGithub />, href: "https://github.com/username" },
            { icon: <FaLinkedin />, href: "https://linkedin.com/in/username" },
            { icon: <FaYoutube />, href: "https://youtube.com/@username" },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={socialVariants}
              whileHover={reduceMotion ? {} : { 
                scale: 1.1,
                y: -2 
              }}
              whileTap={reduceMotion ? {} : { scale: 0.95 }}
              className="p-3 rounded-lg bg-white/5 text-white text-xl hover:bg-white/10 transition-all duration-200"
            >
              {item.icon}
            </motion.a>
          ))}
        </motion.div>

        <motion.p
          className="text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          — Launching sebentar lagi, jangan ke mana-mana 💫 —
        </motion.p>
      </motion.div>

      {/* 🎪 Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            />
            
            {/* Modal Content */}
            <motion.div
              variants={previewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-cyan-500/20 rounded-2xl p-6 md:p-8 mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                    🚧 Bocoran Halaman yang Akan Datang
                  </h2>
                  <motion.button
                    onClick={() => setShowPreview(false)}
                    whileHover={reduceMotion ? {} : { scale: 1.1, rotate: 90 }}
                    whileTap={reduceMotion ? {} : { scale: 0.9 }}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </motion.button>
                </div>

                {/* Preview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                  {pagePreviews.map((page, index) => (
                    <motion.div
                      key={page.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      whileHover={reduceMotion ? {} : { y: -5, transition: { duration: 0.2 } }}
                      className={`bg-gradient-to-br ${page.color} border ${page.borderColor} rounded-xl p-5 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300`}
                    >
                      <h3 className="text-lg font-bold text-white mb-3">{page.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {page.description}
                      </p>
                      <div className="space-y-2">
                        {page.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-cyan-200">
                            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <p className="text-gray-300 text-sm">
                    <span className="text-cyan-300 font-semibold">Note:</span>{" "}
                    Semua halaman sedang dalam tahap final development dan akan segera diluncurkan!
                  </p>
                </motion.div>

                {/* Close Button */}
                <motion.button
                  onClick={() => setShowPreview(false)}
                  whileHover={reduceMotion ? {} : { scale: 1.05 }}
                  whileTap={reduceMotion ? {} : { scale: 0.95 }}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  Tutup Preview
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}