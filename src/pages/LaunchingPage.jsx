import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";

export default function LaunchingPage() {
  const envDate = import.meta.env.VITE_LAUNCH_DATE;
  const launchDate = new Date(envDate);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [launched, setLaunched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = launchDate - now;

      // 🧮 Hitung selisih hari sejak launching
      const diffSinceLaunch = now - launchDate;
      const daysSinceLaunch = diffSinceLaunch / (1000 * 60 * 60 * 24);

      // ✅ Jika sudah lewat 30 hari sejak launching, langsung skip
      if (daysSinceLaunch > 30) {
        navigate("/", { replace: true });
        return;
      }

      // 🚀 Kalau waktu sudah lewat
      if (diff <= 0) {
        setLaunched(true);
        return;
      }

      // ⏳ Hitung countdown
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ d: days, h: hours, m: minutes, s: seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [launchDate, navigate]);

  // 🎉 Kalau waktu sudah habis
  if (launched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white text-center p-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold text-cyan-400 mb-4 drop-shadow-[0_0_20px_#00ffff]"
        >
          🎉 Website Sudah Dibuka!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-gray-300 mb-6"
        >
          Ayo jelajahi dunia baruku 🚀✨
        </motion.p>

        <motion.button
          onClick={() => navigate("/", { replace: true })}
          whileHover={{ scale: 1.1 }}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-full shadow-lg hover:shadow-cyan-400/40 transition-all"
        >
          Masuk ke Website →
        </motion.button>
      </div>
    );
  }

  // ⏳ Countdown sebelum waktu launching
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white text-center px-4">
      {/* 🌌 Background animasi bintang */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        <div className="absolute w-[900px] h-[900px] bg-cyan-500/10 blur-3xl rounded-full animate-pulse -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* 🌠 Judul */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-teal-400 to-blue-500 drop-shadow-[0_0_15px_#00ffff]"
      >
        🚀 Website Akan Segera Diluncurkan
      </motion.h1>

      {/* 🧠 Subjudul */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg md:text-xl text-gray-300 mb-10 italic"
      >
        “Tim kami lagi nyiapin roketnya... sabar bentar lagi terbang 😎🔥”
      </motion.p>

      {/* ⏳ Timer */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10"
      >
        {[{ label: "Hari", value: timeLeft.d },
          { label: "Jam", value: timeLeft.h },
          { label: "Menit", value: timeLeft.m },
          { label: "Detik", value: timeLeft.s }]
          .map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            className="flex flex-col items-center bg-white/5 backdrop-blur-lg p-5 md:p-7 rounded-2xl shadow-lg border border-cyan-400/30 min-w-[80px] md:min-w-[110px] hover:border-cyan-300/70 transition-all duration-300"
          >
            <span className="text-4xl md:text-6xl font-mono text-cyan-300 drop-shadow-[0_0_15px_#00ffff]">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="text-sm text-gray-400 mt-2 uppercase tracking-widest">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* 🌐 Sosial Media */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="flex gap-6 mb-10"
      >
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
            whileHover={{ scale: 1.2, rotate: 5 }}
            className={`p-4 rounded-full bg-gradient-to-br ${item.color} text-white text-2xl shadow-md shadow-cyan-500/20 hover:shadow-cyan-400/50 transition-all duration-300`}
          >
            {item.icon}
          </motion.a>
        ))}
      </motion.div>

      {/* ✨ Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-sm text-gray-500 italic"
      >
        — Stay tuned, sesuatu yang luar biasa sedang disiapkan 💫 —
      </motion.p>

      {/* 🌟 CSS animasi bintang */}
      <style>{`
        .stars, .stars2, .stars3 {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          box-shadow:
            100px 200px white, 200px 300px white, 300px 100px white,
            400px 400px white, 500px 150px white, 600px 350px white;
          animation: animStar 60s linear infinite;
        }
        .stars2 {
          width: 3px;
          height: 3px;
          background: #0ff;
          box-shadow:
            150px 250px #0ff, 350px 400px #0ff, 500px 200px #0ff,
            700px 350px #0ff, 900px 500px #0ff;
          animation: animStar 120s linear infinite;
        }
        .stars3 {
          width: 1px;
          height: 1px;
          background: #80ffff;
          box-shadow:
            200px 100px #80ffff, 400px 300px #80ffff, 600px 400px #80ffff,
            800px 200px #80ffff, 1000px 600px #80ffff;
          animation: animStar 180s linear infinite;
        }
        @keyframes animStar {
          from { transform: translateY(0); }
          to { transform: translateY(-1000px); }
        }
      `}</style>
    </div>
  );
}