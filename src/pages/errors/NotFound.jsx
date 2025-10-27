import { Link, useNavigate } from "react-router-dom";
import { Search, Compass, Home, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

export default function NotFound() {
  const navigate = useNavigate();
  const messages = useMemo(
    () => [
      "Halaman ini seperti ninja, cepat dan lenyap tanpa jejak! 🥷",
      "Sepertinya kamu menelusuri dunia maya terlalu jauh... 🌌",
      "Ups! Mungkin halaman ini lagi liburan digital 🏖️",
      "404 bukan akhir — ini cuma rute memutar ke beranda 🚗",
      "Mungkin URL-nya sedikit typo? Nggak apa, manusiawi kok 😅",
      "Server kita lagi mikir keras... tapi nggak nemu juga 😵‍💫",
      "Kucing dev kami menekan tombol ‘hapus’ lagi 🐱",
      "Halaman ini sedang dalam misi rahasia 🕵️‍♂️",
      "Kadang yang hilang itu bukan halaman, tapi semangat 💪",
      "Internet luas banget, tapi kita temukan arahmu 🧭",
      "Nggak semua yang tersesat harus panik, kan? 😌",
      "Sepertinya kamu menemukan area misterius 🔮",
      "Jangan khawatir, halaman lain masih setia 💖",
      "404 — artinya kita masih punya ruang untuk berkembang 💡",
      "Halaman ini ngilang seperti sinyal di pegunungan 📡",
      "Kodingan kami mungkin punya plot twist hari ini 🎭",
      "Mungkin ini cara semesta bilang ‘take a break’ ☕",
      "Peta digital kita belum di-update, sabar ya 🗺️",
      "Kadang tersesat itu bagian dari petualangan 🧳",
      "Halaman ini terjebak di antara dua semesta 😵‍🌍",
      "Jangan panik... bahkan developer juga sering nyasar 🤭",
      "Mungkin ini bug? Atau fitur tersembunyi? 👀",
      "Kita cari jalan pulang bareng yuk! 🪄",
      "Hmm... halaman ini belum lahir di dunia web 👶",
      "Jalan ini buntu, tapi semangatmu jangan ikut buntu! 🚧",
      "404: Halaman sedang introspeksi diri 🧘‍♀️",
      "Mungkin kamu nyasar karena takdir digital ✨",
      "Tenang... tiap klik salah adalah langkah menuju benar 🙏",
      "Kita ubah momen tersesat jadi momen lucu 😄",
      "Masih loading... oh ternyata nggak ada 😅",
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [buttonState, setButtonState] = useState({
    home: false,
    reload: false,
    explore: false,
  });

  // Ganti pesan otomatis
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Posisi bintang tetap
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 3,
      })),
    []
  );

  // Tombol aman dengan feedback
  const handleAction = async (type, action) => {
    if (buttonState[type]) return; // cegah spam klik
    setButtonState((prev) => ({ ...prev, [type]: true }));

    try {
      await action();
    } catch (err) {
      console.error(`Gagal menjalankan aksi ${type}:`, err);
      alert("Aksi gagal dijalankan. Coba lagi nanti.");
    } finally {
      setTimeout(() => {
        setButtonState((prev) => ({ ...prev, [type]: false }));
      }, 1000); // cooldown ringan biar smooth
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-center text-white bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900">
      {/* 🌌 Efek Bintang */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            animate={{ opacity: [0, 1, 0], y: ["0%", "100%", "0%"] }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
            style={{ left: star.left, top: star.top }}
          />
        ))}
      </div>

      {/* ✨ Ikon utama */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative flex flex-col items-center space-y-4 z-10"
      >
        <Sparkles className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_20px_#22d3ee]" />
        <Search className="w-20 h-20 text-cyan-400 animate-pulse drop-shadow-[0_0_20px_#22d3ee]" />
      </motion.div>

      {/* 🧭 Judul */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-6xl md:text-7xl font-extrabold mt-6 bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent"
      >
        404 - Halaman Tidak Ditemukan
      </motion.h1>

      {/* 💬 Pesan berubah otomatis */}
      <div className="relative h-12 mt-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-gray-300 text-lg px-4 max-w-xl leading-relaxed"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 🧩 Tips dan Petunjuk */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-5 mt-6 shadow-lg border border-slate-700/50 text-left text-gray-300 max-w-md text-sm space-y-1"
      >
        <p>🔹 Pastikan alamat web yang kamu masukkan sudah benar.</p>
        <p>🔹 Gunakan tombol di bawah untuk kembali ke jalur aman.</p>
        <p>🔹 Kadang, kesalahan klik bisa jadi petualangan baru 😄</p>
      </motion.div>

      {/* 🎯 Tombol aksi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap gap-4 justify-center mt-8"
      >
        {/* Home */}
        <button
          onClick={() => handleAction("home", () => navigate("/"))}
          disabled={buttonState.home}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
            buttonState.home
              ? "bg-cyan-700 text-gray-300 cursor-not-allowed animate-pulse"
              : "bg-cyan-500 hover:bg-cyan-600 text-white hover:shadow-cyan-400/40"
          }`}
        >
          <Home size={18} />
          {buttonState.home ? "Menuju..." : "Kembali ke Beranda"}
        </button>

        {/* Reload */}
        <button
          onClick={() =>
            handleAction("reload", () => Promise.resolve(window.location.reload()))
          }
          disabled={buttonState.reload}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
            buttonState.reload
              ? "bg-slate-600 text-gray-300 cursor-not-allowed animate-pulse"
              : "bg-slate-700 hover:bg-slate-600 text-gray-200"
          }`}
        >
          <RefreshCw size={18} />
          {buttonState.reload ? "Memuat..." : "Coba Muat Ulang"}
        </button>

        {/* Explore */}
        <button
          onClick={() => handleAction("explore", () => navigate("/explore"))}
          disabled={buttonState.explore}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all ${
            buttonState.explore
              ? "bg-teal-700 text-gray-300 cursor-not-allowed animate-pulse"
              : "bg-teal-600 hover:bg-teal-700 text-gray-200"
          }`}
        >
          <Compass size={18} />
          {buttonState.explore ? "Membuka..." : "Jelajahi Halaman Lain"}
        </button>
      </motion.div>

      {/* 📜 Catatan bawah */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="text-sm text-gray-500 mt-10 italic"
      >
        “Jangan takut tersesat — setiap klik adalah cerita.” 🌠
      </motion.p>

      {/* 🎞️ Keyframes tambahan */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  );
}
