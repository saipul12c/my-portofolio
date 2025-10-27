import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import maintenanceData from "../../data/maintenance/maintenanceData.json";

export default function Maintenance() {
  // 🕒 Ubah waktu target sesuai kebutuhan
  const targetTime = new Date("2025-10-08T18:30:00+07:00");

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // 🔄 Ambil data pesan dari file JSON
  const messages = maintenanceData.messages;

  function calculateTimeLeft() {
    const now = new Date();
    const diff = Math.max(0, targetTime - now);
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds, totalSeconds };
  }

  useEffect(() => {
    const totalDuration = targetTime - new Date();

    const countdown = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);

      const elapsed = totalDuration - (targetTime - new Date());
      const percent = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(percent);

      if (updated.totalSeconds <= 0) {
        clearInterval(countdown);
        setProgress(100);
      }
    }, 1000);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 6000);

    return () => {
      clearInterval(countdown);
      clearInterval(messageInterval);
    };
  }, []);

  const { hours, minutes, seconds, totalSeconds } = timeLeft;

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] text-center space-y-8 bg-gradient-to-br from-slate-950 via-slate-900 to-gray-900 text-white px-6 relative overflow-hidden">

      {/* Efek latar */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.1),transparent_70%)] animate-pulse" />

      {/* Ikon & status */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center z-10"
      >
        <div className="relative">
          <Wrench className="w-20 h-20 text-teal-400 drop-shadow-[0_0_15px_#14b8a6]" />
          <div className="absolute inset-0 blur-3xl bg-teal-400/20 rounded-full animate-pulse" />
        </div>
        <p className="mt-3 text-gray-400 text-sm flex items-center gap-2 max-w-xs text-center">
          <Loader2 className="w-4 h-4 animate-spin" />
          {messages[messageIndex]}
        </p>
      </motion.div>

      {/* Judul */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent z-10"
      >
        Situs Sedang Dalam Perawatan
      </motion.h1>

      {/* Deskripsi */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="text-gray-300 text-lg max-w-xl leading-relaxed z-10"
      >
        Kami sedang memperbarui sistem agar lebih cepat, aman, dan nyaman untuk semua pengunjung 🌍  
        Terima kasih sudah menunggu dengan sabar 🙏
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="w-full max-w-md bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner z-10"
      >
        <motion.div
          className="h-3 bg-gradient-to-r from-teal-400 to-cyan-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex flex-col items-center bg-gray-800/50 px-6 py-4 rounded-xl shadow-md backdrop-blur-sm z-10"
      >
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-teal-400" />
          {totalSeconds > 0 ? (
            <span className="text-sm text-gray-300">
              Estimasi selesai:{" "}
              <strong>
                {hours.toString().padStart(2, "0")}:
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </strong>
            </span>
          ) : (
            <span className="text-sm text-teal-400 font-semibold">
              ✅ Semua sistem siap! Sedang dihidupkan kembali...
            </span>
          )}
        </div>
      </motion.div>

      {/* Tombol kembali */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="z-10"
      >
        <Link
          to="/"
          className="px-8 py-3 bg-teal-500 hover:bg-teal-600 transition-all rounded-xl font-semibold text-white shadow-lg hover:shadow-teal-500/30"
        >
          Kembali ke Beranda
        </Link>
      </motion.div>

      {/* Catatan bawah */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="text-sm text-gray-500 mt-8 italic z-10"
      >
        Kami berusaha agar semuanya siap sebelum kamu sempat refill kopi ☕
      </motion.p>
    </div>
  );
}
